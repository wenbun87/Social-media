'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import {
  Lightbulb,
  PenTool,
  CalendarDays,
  CheckCircle,
  Plus,
  Sparkles,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { useIdeas, useContentPieces } from '@/lib/store';
import type { ContentStatus, Platform } from '@/lib/types';
import { GreetingHeader, ContentPipelineBar, MiniCalendar, TodoList } from '@/components/DashboardWidgets';

const CONTENT_STATUS_COLORS: Record<ContentStatus, string> = {
  draft: 'bg-text-muted/20 text-text-muted',
  scheduled: 'bg-accent/20 text-accent',
  posted: 'bg-success/20 text-success',
};

const PLATFORM_COLORS: Record<Platform, string> = {
  twitter: 'bg-blue-500/20 text-blue-400',
  instagram: 'bg-pink-500/20 text-pink-400',
  linkedin: 'bg-blue-600/20 text-blue-300',
  tiktok: 'bg-rose-500/20 text-rose-400',
  youtube: 'bg-red-500/20 text-red-400',
  facebook: 'bg-blue-700/20 text-blue-300',
  threads: 'bg-gray-500/20 text-gray-300',
  blog: 'bg-emerald-500/20 text-emerald-400',
};

const STAT_GRADIENTS = [
  'from-purple-100 to-purple-50',
  'from-pink-100 to-pink-50',
  'from-orange-100 to-orange-50',
  'from-emerald-100 to-emerald-50',
];

export default function DashboardPage() {
  const [ideas] = useIdeas();
  const [content] = useContentPieces();

  const draftsCount = content.filter((c) => c.status === 'draft').length;
  const scheduledCount = content.filter((c) => c.status === 'scheduled').length;
  const postedCount = content.filter((c) => c.status === 'posted').length;

  const recentIdeas = [...ideas]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const upcomingContent = [...content]
    .filter((c) => c.status === 'scheduled' && c.scheduledDate)
    .sort(
      (a, b) =>
        new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Ideas',
      value: ideas.length,
      icon: Lightbulb,
      colorClass: 'text-primary-light',
      bgClass: 'bg-primary/20',
    },
    {
      label: 'Content Pieces',
      value: content.length,
      icon: PenTool,
      colorClass: 'text-accent-light',
      bgClass: 'bg-accent/20',
    },
    {
      label: 'Scheduled',
      value: scheduledCount,
      icon: CalendarDays,
      colorClass: 'text-warning',
      bgClass: 'bg-warning/20',
    },
    {
      label: 'Posted',
      value: postedCount,
      icon: CheckCircle,
      colorClass: 'text-success',
      bgClass: 'bg-success/20',
    },
  ];

  const quickActions = [
    {
      title: 'New Idea',
      description: 'Capture a fresh content idea',
      href: '/ideas',
      icon: Plus,
    },
    {
      title: 'Create Content',
      description: 'Transform ideas into posts',
      href: '/transform',
      icon: Sparkles,
    },
    {
      title: 'View Calendar',
      description: 'See your content schedule',
      href: '/calendar',
      icon: Calendar,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <GreetingHeader />

      <ContentPipelineBar drafts={draftsCount} scheduled={scheduledCount} posted={postedCount} />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card-dark rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${STAT_GRADIENTS[i]}`}
                >
                  <Icon className={`w-5 h-5 ${stat.colorClass}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar + To-Do */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MiniCalendar contentPieces={content} />
        </div>
        <div className="lg:col-span-5">
          <TodoList />
        </div>
      </div>

      {/* Recent Ideas + Upcoming Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card-dark rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary to-accent" />
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Recent Ideas</h2>
            <Link
              href="/ideas"
              className="text-sm text-primary-light hover:text-primary transition-colors"
            >
              View all
            </Link>
          </div>
          {recentIdeas.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No ideas yet. Start capturing your thoughts!</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentIdeas.map((idea) => (
                <li key={idea.id} className="px-5 py-3 hover:bg-card-hover transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {idea.title}
                      </p>
                      {idea.format.length > 0 && (
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {idea.format.slice(0, 3).map((fmt) => (
                            <span
                              key={fmt}
                              className="inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize bg-primary/15 text-primary-light"
                            >
                              {fmt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {format(new Date(idea.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card-dark rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-accent to-success" />
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Upcoming Content</h2>
            <Link
              href="/calendar"
              className="text-sm text-primary-light hover:text-primary transition-colors"
            >
              View calendar
            </Link>
          </div>
          {upcomingContent.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No scheduled content. Plan your next post!</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {upcomingContent.map((piece) => (
                <li key={piece.id} className="px-5 py-3 hover:bg-card-hover transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {piece.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${PLATFORM_COLORS[piece.platform]}`}
                        >
                          {piece.platform}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${CONTENT_STATUS_COLORS[piece.status]}`}
                        >
                          {piece.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {piece.scheduledDate
                        ? format(new Date(piece.scheduledDate), 'MMM d, yyyy')
                        : ''}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group bg-card-dark rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-50">
                  <Icon className="w-5 h-5 text-primary-light" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary group-hover:text-primary-light transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-text-muted">{action.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
