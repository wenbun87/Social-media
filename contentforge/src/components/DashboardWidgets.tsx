'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Trash2, Circle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useTodos } from '@/lib/store';
import type { ContentPiece, ContentStatus } from '@/lib/types';

export function GreetingHeader() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary">{greeting}!</h1>
      <p className="mt-1 text-text-secondary">{today}</p>
    </div>
  );
}

export function ContentPipelineBar({ drafts, scheduled, posted }: { drafts: number; scheduled: number; posted: number }) {
  const total = drafts + scheduled + posted;
  if (total === 0) return null;

  const draftPct = (drafts / total) * 100;
  const scheduledPct = (scheduled / total) * 100;
  const postedPct = (posted / total) * 100;

  return (
    <div className="bg-card-dark rounded-2xl shadow-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-text-secondary">Content Pipeline</p>
        <p className="text-sm text-text-muted">{total} total</p>
      </div>
      <div className="h-3 rounded-full bg-bg-dark flex overflow-hidden">
        {draftPct > 0 && <div className="bg-text-muted/40 transition-all duration-500" style={{ width: `${draftPct}%` }} />}
        {scheduledPct > 0 && <div className="bg-accent transition-all duration-500" style={{ width: `${scheduledPct}%` }} />}
        {postedPct > 0 && <div className="bg-success transition-all duration-500" style={{ width: `${postedPct}%` }} />}
      </div>
      <div className="flex items-center gap-5 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-text-muted/40" />
          <span className="text-xs text-text-muted">{drafts} Draft{drafts !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="text-xs text-text-muted">{scheduled} Scheduled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-success" />
          <span className="text-xs text-text-muted">{posted} Posted</span>
        </div>
      </div>
    </div>
  );
}

const STATUS_DOT_COLORS: Record<ContentStatus, string> = {
  draft: 'bg-text-muted/50',
  scheduled: 'bg-accent',
  posted: 'bg-success',
};

export function MiniCalendar({ contentPieces }: { contentPieces: ContentPiece[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const start = startOfWeek(monthStart);
    const end = endOfWeek(monthEnd);
    const days: Date[] = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const contentByDate = useMemo(() => {
    const map = new Map<string, ContentPiece[]>();
    contentPieces.forEach((piece) => {
      if (piece.scheduledDate) {
        const key = format(new Date(piece.scheduledDate), 'yyyy-MM-dd');
        const existing = map.get(key) || [];
        existing.push(piece);
        map.set(key, existing);
      }
    });
    return map;
  }, [contentPieces]);

  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-card-dark rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Calendar</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-card-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-text-primary min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-card-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayHeaders.map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-text-muted py-1">
            {d}
          </div>
        ))}
        {calendarDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const pieces = contentByDate.get(dateKey) || [];
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);

          return (
            <Link
              key={dateKey}
              href="/calendar"
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg text-xs transition-colors ${
                !inMonth
                  ? 'text-text-muted/40'
                  : today
                    ? 'bg-primary text-white font-bold'
                    : 'text-text-primary hover:bg-card-hover'
              }`}
            >
              <span>{format(day, 'd')}</span>
              {pieces.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {pieces.slice(0, 3).map((p, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full ${today ? 'bg-white/70' : STATUS_DOT_COLORS[p.status]}`}
                    />
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function TodoList() {
  const [todos, setTodos, refetchTodos] = useTodos();
  const [newText, setNewText] = useState('');

  const handleAdd = () => {
    const text = newText.trim();
    if (!text) return;
    const todo = {
      id: uuidv4(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [todo, ...prev]);
    setNewText('');
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    })
      .then(() => refetchTodos())
      .catch(() => {});
  };

  const handleToggle = (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;
    const updated = { ...target, completed: !target.completed };
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: updated.text, completed: updated.completed }),
    })
      .then(() => refetchTodos())
      .catch(() => {});
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    fetch(`/api/todos/${id}`, { method: 'DELETE' })
      .then(() => refetchTodos())
      .catch(() => {});
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingTodos = todos.filter((t) => !t.completed);

  return (
    <div className="bg-card-dark rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">To-Do</h2>
        {completedCount > 0 && (
          <span className="text-xs text-text-muted">{completedCount} completed</span>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a task..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 text-sm !py-2 !px-3"
        />
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="p-2 rounded-lg bg-primary text-white hover:bg-primary-light transition-colors disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[260px] space-y-1">
        {pendingTodos.map((todo) => (
          <div key={todo.id} className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-card-hover transition-colors">
            <button onClick={() => handleToggle(todo.id)} className="flex-shrink-0">
              <Circle className="w-4 h-4 text-text-muted hover:text-primary transition-colors" />
            </button>
            <span className="flex-1 text-sm text-text-primary truncate">{todo.text}</span>
            <button
              onClick={() => handleDelete(todo.id)}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5 text-text-muted hover:text-danger transition-colors" />
            </button>
          </div>
        ))}
        {pendingTodos.length === 0 && (
          <p className="text-sm text-text-muted text-center py-6">
            {todos.length === 0 ? 'No tasks yet. Add one above!' : 'All done! 🎉'}
          </p>
        )}
      </div>
    </div>
  );
}
