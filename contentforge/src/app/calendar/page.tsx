'use client';

import { useState, useMemo } from 'react';
import {
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns';
import { useContentPieces } from '@/lib/store';
import type { ContentPiece, ContentStatus } from '@/lib/types';
import { PLATFORM_LABELS } from '@/lib/types';

const STATUS_DOT_COLORS: Record<ContentStatus, string> = {
  draft: 'bg-gray-400',
  scheduled: 'bg-accent',
  posted: 'bg-success',
};

const STATUS_BADGE_CLASSES: Record<ContentStatus, string> = {
  draft: 'bg-gray-500/15 text-gray-400',
  scheduled: 'bg-accent/15 text-accent',
  posted: 'bg-success/15 text-success',
};

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type ViewMode = 'calendar' | 'list';

function getCalendarDays(currentMonth: Date): Date[] {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }
  return days;
}

function ContentPieceCard({ piece }: { piece: ContentPiece }) {
  return (
    <div className="bg-card-dark rounded-lg border border-border p-4 hover:bg-card-hover transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-text-primary truncate">
            {piece.title}
          </h4>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-accent/15 text-accent">
              {PLATFORM_LABELS[piece.platform]}
            </span>
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-primary/15 text-primary-light capitalize">
              {piece.format}
            </span>
            <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${STATUS_BADGE_CLASSES[piece.status]}`}
            >
              {piece.status}
            </span>
          </div>
        </div>
        {piece.scheduledDate && (
          <span className="text-xs text-text-muted whitespace-nowrap flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(parseISO(piece.scheduledDate), 'h:mm a')}
          </span>
        )}
      </div>
      {piece.content && (
        <p className="mt-2 text-xs text-text-secondary line-clamp-2">
          {piece.content}
        </p>
      )}
      {piece.notes && (
        <p className="mt-1 text-xs text-text-muted italic truncate">
          {piece.notes}
        </p>
      )}
    </div>
  );
}

export default function CalendarPage() {
  const [content] = useContentPieces();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  const today = new Date();

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth),
    [currentMonth]
  );

  // Map dates to content pieces for quick lookup
  const contentByDate = useMemo(() => {
    const map = new Map<string, ContentPiece[]>();
    for (const piece of content) {
      if (piece.scheduledDate) {
        const key = format(parseISO(piece.scheduledDate), 'yyyy-MM-dd');
        const existing = map.get(key) || [];
        existing.push(piece);
        map.set(key, existing);
      }
    }
    return map;
  }, [content]);

  // Content for the selected date
  const selectedDateContent = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, 'yyyy-MM-dd');
    return contentByDate.get(key) || [];
  }, [selectedDate, contentByDate]);

  // Content pieces for the current month, grouped by date (for list view)
  const monthContent = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const pieces = content
      .filter((piece) => {
        if (!piece.scheduledDate) return false;
        const d = parseISO(piece.scheduledDate);
        return d >= monthStart && d <= monthEnd;
      })
      .sort((a, b) => {
        const da = parseISO(a.scheduledDate!).getTime();
        const db = parseISO(b.scheduledDate!).getTime();
        return da - db;
      });

    const groups = new Map<string, ContentPiece[]>();
    for (const piece of pieces) {
      const key = format(parseISO(piece.scheduledDate!), 'yyyy-MM-dd');
      const existing = groups.get(key) || [];
      existing.push(piece);
      groups.set(key, existing);
    }

    return Array.from(groups.entries()).map(([dateKey, items]) => ({
      date: parseISO(dateKey),
      pieces: items,
    }));
  }, [content, currentMonth]);

  const handlePrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const handleNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));
  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate((prev) => (prev && isSameDay(prev, day) ? null : day));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Content Planner
          </h1>
          <p className="mt-1 text-text-secondary">
            Schedule and manage your content calendar
          </p>
        </div>
        <div className="flex items-center gap-1 bg-card-dark rounded-lg border border-border p-1">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-card-hover'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-card-hover'
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-card-dark rounded-xl border border-border px-5 py-3">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleToday}
            className="px-3 py-1 text-xs font-medium rounded-md border border-border text-text-secondary hover:text-primary-light hover:border-primary transition-colors"
          >
            Today
          </button>
        </div>
        <button
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-card-dark rounded-xl border border-border overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAY_HEADERS.map((day) => (
              <div
                key={day}
                className="px-2 py-2.5 text-center text-xs font-semibold text-text-muted uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayContent = contentByDate.get(dateKey) || [];
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, today);
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

              return (
                <button
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  className={`relative min-h-[5rem] p-2 text-left border-b border-r border-border transition-colors ${
                    isCurrentMonth
                      ? 'hover:bg-card-hover'
                      : 'opacity-40 hover:opacity-60'
                  } ${isSelected ? 'bg-primary/15' : ''} ${
                    idx % 7 === 0 ? 'border-l-0' : ''
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full ${
                      isToday
                        ? 'bg-primary text-white ring-2 ring-primary/50'
                        : isSelected
                          ? 'text-primary-light font-bold'
                          : isCurrentMonth
                            ? 'text-text-primary'
                            : 'text-text-muted'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>

                  {/* Content Dots */}
                  {dayContent.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayContent.slice(0, 4).map((piece) => (
                        <span
                          key={piece.id}
                          title={`${piece.title} (${piece.status})`}
                          className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[piece.status]}`}
                        />
                      ))}
                      {dayContent.length > 4 && (
                        <span className="text-[10px] text-text-muted font-medium leading-none flex items-center">
                          +{dayContent.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {monthContent.length === 0 ? (
            <div className="bg-card-dark rounded-xl border border-border p-12 text-center">
              <FileText className="w-10 h-10 mx-auto mb-3 text-text-muted opacity-50" />
              <p className="text-text-muted">
                No scheduled content for {format(currentMonth, 'MMMM yyyy')}.
              </p>
            </div>
          ) : (
            monthContent.map(({ date, pieces }) => (
              <div
                key={format(date, 'yyyy-MM-dd')}
                className="bg-card-dark rounded-xl border border-border overflow-hidden"
              >
                <div className="px-5 py-3 border-b border-border flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold ${
                      isSameDay(date, today)
                        ? 'bg-primary text-white'
                        : 'bg-card-hover text-text-primary'
                    }`}
                  >
                    {format(date, 'd')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {format(date, 'EEEE')}
                    </p>
                    <p className="text-xs text-text-muted">
                      {format(date, 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <span className="ml-auto text-xs font-medium text-text-muted bg-card-hover rounded-full px-2 py-0.5">
                    {pieces.length} item{pieces.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {pieces.map((piece) => (
                    <ContentPieceCard key={piece.id} piece={piece} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Selected Date Detail Panel */}
      {viewMode === 'calendar' && selectedDate && (
        <div className="bg-card-dark rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-primary-light" />
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              <p className="text-xs text-text-muted">
                {selectedDateContent.length} content piece
                {selectedDateContent.length !== 1 ? 's' : ''} scheduled
              </p>
            </div>
          </div>

          {selectedDateContent.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-text-muted opacity-50" />
              <p className="text-sm text-text-muted">
                No content scheduled for this date.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {selectedDateContent.map((piece) => (
                <ContentPieceCard key={piece.id} piece={piece} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
