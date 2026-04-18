'use client';

import { useState } from 'react';
import { ListTodo, Plus, Trash2, Circle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useTodos } from '@/lib/store';

export default function TodosPage() {
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

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <ListTodo className="w-5 h-5 text-primary-light" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">To-Do List</h1>
          <p className="text-sm text-text-muted">
            {pendingTodos.length} task{pendingTodos.length !== 1 ? 's' : ''} remaining
          </p>
        </div>
      </div>

      {/* Add task */}
      <div className="bg-card-dark rounded-2xl shadow-card p-5 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 text-sm"
          />
          <button
            onClick={handleAdd}
            disabled={!newText.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Pending tasks */}
      {pendingTodos.length > 0 && (
        <div className="bg-card-dark rounded-2xl shadow-card mb-4">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-sm font-medium text-text-secondary">To do</p>
          </div>
          <ul className="divide-y divide-border">
            {pendingTodos.map((todo) => (
              <li key={todo.id} className="group flex items-center gap-3 px-5 py-3.5 hover:bg-card-hover transition-colors">
                <button onClick={() => handleToggle(todo.id)} className="flex-shrink-0">
                  <Circle className="w-5 h-5 text-text-muted hover:text-primary transition-colors" />
                </button>
                <span className="flex-1 text-sm text-text-primary">{todo.text}</span>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-text-muted hover:text-danger transition-colors" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Completed tasks */}
      {completedTodos.length > 0 && (
        <div className="bg-card-dark rounded-2xl shadow-card">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-sm font-medium text-text-secondary">Completed ({completedTodos.length})</p>
          </div>
          <ul className="divide-y divide-border">
            {completedTodos.map((todo) => (
              <li key={todo.id} className="group flex items-center gap-3 px-5 py-3.5 hover:bg-card-hover transition-colors">
                <button onClick={() => handleToggle(todo.id)} className="flex-shrink-0">
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </button>
                <span className="flex-1 text-sm text-text-muted line-through">{todo.text}</span>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-text-muted hover:text-danger transition-colors" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {todos.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          <ListTodo className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg">No tasks yet</p>
          <p className="text-sm mt-1">Add your first task above!</p>
        </div>
      )}
    </div>
  );
}
