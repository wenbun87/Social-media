'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import {
  BarChart3,
  Eye,
  Heart,
  MousePointerClick,
  Share2,
  Bookmark,
  MessageCircle,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useAnalytics, useContentPieces } from '@/lib/store';
import type { AnalyticsEntry, ContentPiece, Platform, PLATFORM_LABELS } from '@/lib/types';
import { PLATFORM_LABELS as platformLabels } from '@/lib/types';

interface MetricFormData {
  contentPieceId: string;
  impressions: number;
  engagement: number;
  clicks: number;
  shares: number;
  saves: number;
  comments: number;
}

const INITIAL_FORM: MetricFormData = {
  contentPieceId: '',
  impressions: 0,
  engagement: 0,
  clicks: 0,
  shares: 0,
  saves: 0,
  comments: 0,
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics, refetchAnalytics] = useAnalytics();
  const [contentPieces] = useContentPieces();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<MetricFormData>(INITIAL_FORM);

  // --- Aggregate stats ---
  const aggregates = useMemo(() => {
    return analytics.reduce(
      (acc, entry) => ({
        impressions: acc.impressions + entry.impressions,
        engagement: acc.engagement + entry.engagement,
        clicks: acc.clicks + entry.clicks,
        shares: acc.shares + entry.shares,
        saves: acc.saves + entry.saves,
        comments: acc.comments + entry.comments,
      }),
      { impressions: 0, engagement: 0, clicks: 0, shares: 0, saves: 0, comments: 0 }
    );
  }, [analytics]);

  // --- Platform breakdown ---
  const platformBreakdown = useMemo(() => {
    const pieceMap = new Map<string, ContentPiece>();
    contentPieces.forEach((cp) => pieceMap.set(cp.id, cp));

    const platformTotals = new Map<Platform, number>();

    analytics.forEach((entry) => {
      const piece = pieceMap.get(entry.contentPieceId);
      if (!piece) return;
      const current = platformTotals.get(piece.platform) || 0;
      platformTotals.set(piece.platform, current + entry.impressions);
    });

    const entries = Array.from(platformTotals.entries()).sort((a, b) => b[1] - a[1]);
    const maxValue = entries.length > 0 ? entries[0][1] : 0;

    return { entries, maxValue };
  }, [analytics, contentPieces]);

  // --- Recent entries (last 10, sorted by recordedAt desc) ---
  const recentEntries = useMemo(() => {
    return [...analytics]
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
      .slice(0, 10);
  }, [analytics]);

  // --- Content piece lookup ---
  const pieceMap = useMemo(() => {
    const map = new Map<string, ContentPiece>();
    contentPieces.forEach((cp) => map.set(cp.id, cp));
    return map;
  }, [contentPieces]);

  // --- Handlers ---
  function handleSave() {
    if (!form.contentPieceId) return;

    const newEntry: AnalyticsEntry = {
      id: uuidv4(),
      contentPieceId: form.contentPieceId,
      impressions: form.impressions,
      engagement: form.engagement,
      clicks: form.clicks,
      shares: form.shares,
      saves: form.saves,
      comments: form.comments,
      recordedAt: new Date().toISOString(),
    };

    setAnalytics((prev) => [...prev, newEntry]);
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    }).then(() => refetchAnalytics()).catch(() => {});
    setForm(INITIAL_FORM);
    setShowForm(false);
  }

  function handleCancel() {
    setForm(INITIAL_FORM);
    setShowForm(false);
  }

  function handleDelete(id: string) {
    setAnalytics((prev) => prev.filter((entry) => entry.id !== id));
    fetch(`/api/analytics/${id}`, { method: 'DELETE' }).then(() => refetchAnalytics()).catch(() => {});
  }

  function handleNumberChange(field: keyof Omit<MetricFormData, 'contentPieceId'>, value: string) {
    const num = parseInt(value, 10);
    setForm((prev) => ({ ...prev, [field]: isNaN(num) ? 0 : Math.max(0, num) }));
  }

  // --- Stats card config ---
  const statCards = [
    { label: 'Total Impressions', value: aggregates.impressions, icon: Eye, colorClass: 'text-primary-light', bgClass: 'bg-primary/15' },
    { label: 'Total Engagement', value: aggregates.engagement, icon: Heart, colorClass: 'text-accent', bgClass: 'bg-accent/15' },
    { label: 'Total Clicks', value: aggregates.clicks, icon: MousePointerClick, colorClass: 'text-warning', bgClass: 'bg-warning/15' },
    { label: 'Total Shares', value: aggregates.shares, icon: Share2, colorClass: 'text-success', bgClass: 'bg-success/15' },
    { label: 'Total Saves', value: aggregates.saves, icon: Bookmark, colorClass: 'text-primary-light', bgClass: 'bg-primary/15' },
    { label: 'Total Comments', value: aggregates.comments, icon: MessageCircle, colorClass: 'text-accent', bgClass: 'bg-accent/15' },
  ];

  function formatNumber(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toLocaleString();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Analytics</h1>
          <p className="mt-1 text-text-secondary">
            Track performance metrics across your content
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/85 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Metrics
        </button>
      </div>

      {/* Log Metrics Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card-dark border border-border rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary">Log Metrics</h2>
              <button
                onClick={handleCancel}
                className="p-1 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-card-hover"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Content piece select */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Content Piece
                </label>
                <select
                  value={form.contentPieceId}
                  onChange={(e) => setForm((prev) => ({ ...prev, contentPieceId: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select a content piece...</option>
                  {contentPieces.map((cp) => (
                    <option key={cp.id} value={cp.id}>
                      {cp.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Metric inputs in a 2-col grid */}
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    { field: 'impressions', label: 'Impressions' },
                    { field: 'engagement', label: 'Engagement' },
                    { field: 'clicks', label: 'Clicks' },
                    { field: 'shares', label: 'Shares' },
                    { field: 'saves', label: 'Saves' },
                    { field: 'comments', label: 'Comments' },
                  ] as { field: keyof Omit<MetricFormData, 'contentPieceId'>; label: string }[]
                ).map(({ field, label }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      {label}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form[field]}
                      onChange={(e) => handleNumberChange(field, e.target.value)}
                      className="w-full px-3 py-2 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-card-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.contentPieceId}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card-dark rounded-xl p-5 border border-border"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-11 h-11 rounded-lg ${stat.bgClass}`}
                >
                  <Icon className={`w-5 h-5 ${stat.colorClass}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatNumber(stat.value)}
                  </p>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform Breakdown */}
      <div className="bg-card-dark rounded-xl border border-border">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-light" />
            <h2 className="text-lg font-semibold text-text-primary">
              Platform Breakdown
            </h2>
          </div>
          <p className="mt-1 text-sm text-text-muted">
            Impressions by platform
          </p>
        </div>

        {platformBreakdown.entries.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No platform data yet. Log some metrics to see the breakdown.</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {platformBreakdown.entries.map(([platform, total], index) => {
              const percentage =
                platformBreakdown.maxValue > 0
                  ? (total / platformBreakdown.maxValue) * 100
                  : 0;
              const isEven = index % 2 === 0;
              return (
                <div key={platform} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">
                      {platformLabels[platform]}
                    </span>
                    <span className="text-sm font-medium text-text-secondary">
                      {formatNumber(total)}
                    </span>
                  </div>
                  <div className="h-3 bg-bg-dark rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isEven ? 'bg-primary' : 'bg-accent'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Entries */}
      <div className="bg-card-dark rounded-xl border border-border">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Recent Entries</h2>
          <p className="mt-1 text-sm text-text-muted">
            Last 10 logged metrics
          </p>
        </div>

        {recentEntries.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No analytics entries yet. Click &quot;Log Metrics&quot; to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 pl-5 text-text-muted font-medium">Content</th>
                  <th className="text-right p-3 text-text-muted font-medium">Impr.</th>
                  <th className="text-right p-3 text-text-muted font-medium">Eng.</th>
                  <th className="text-right p-3 text-text-muted font-medium">Clicks</th>
                  <th className="text-right p-3 text-text-muted font-medium">Shares</th>
                  <th className="text-right p-3 text-text-muted font-medium">Saves</th>
                  <th className="text-right p-3 text-text-muted font-medium">Comments</th>
                  <th className="text-right p-3 text-text-muted font-medium">Date</th>
                  <th className="p-3 pr-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentEntries.map((entry) => {
                  const piece = pieceMap.get(entry.contentPieceId);
                  return (
                    <tr key={entry.id} className="hover:bg-card-hover transition-colors">
                      <td className="p-3 pl-5 text-text-primary font-medium max-w-[200px] truncate">
                        {piece ? piece.title : 'Unknown'}
                      </td>
                      <td className="p-3 text-right text-text-secondary">
                        {entry.impressions.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-text-secondary">
                        {entry.engagement.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-text-secondary">
                        {entry.clicks.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-text-secondary">
                        {entry.shares.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-text-secondary">
                        {entry.saves.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-text-secondary">
                        {entry.comments.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-text-muted whitespace-nowrap">
                        {format(new Date(entry.recordedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="p-3 pr-5 text-right">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1.5 text-text-muted hover:text-danger rounded-lg hover:bg-danger/10 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
