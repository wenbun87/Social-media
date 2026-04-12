'use client';

import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  Flame,
} from 'lucide-react';
import { useTrendingTopics } from '@/lib/store';
import type { TrendingTopic, TrendVelocity, Platform } from '@/lib/types';
import { PLATFORM_LABELS } from '@/lib/types';

const PLATFORMS = Object.keys(PLATFORM_LABELS) as Platform[];

const VELOCITY_CONFIG: Record<
  TrendVelocity,
  { label: string; icon: typeof TrendingUp; colorClass: string; bgClass: string }
> = {
  rising: { label: 'Rising', icon: TrendingUp, colorClass: 'text-success', bgClass: 'bg-success/15' },
  peaking: { label: 'Peaking', icon: Minus, colorClass: 'text-warning', bgClass: 'bg-warning/15' },
  declining: { label: 'Declining', icon: TrendingDown, colorClass: 'text-danger', bgClass: 'bg-danger/15' },
};

const PLATFORM_BADGE_COLORS: Record<Platform, string> = {
  twitter: 'bg-blue-500/20 text-blue-400',
  instagram: 'bg-pink-500/20 text-pink-400',
  linkedin: 'bg-blue-600/20 text-blue-300',
  tiktok: 'bg-rose-500/20 text-rose-400',
  youtube: 'bg-red-500/20 text-red-400',
  facebook: 'bg-blue-700/20 text-blue-300',
  threads: 'bg-gray-500/20 text-gray-300',
  blog: 'bg-emerald-500/20 text-emerald-400',
};

interface FormState {
  title: string;
  platform: Platform;
  category: string;
  engagementScore: number;
  velocity: TrendVelocity;
  relatedKeywords: string[];
}

const EMPTY_FORM: FormState = {
  title: '',
  platform: 'twitter',
  category: '',
  engagementScore: 50,
  velocity: 'rising',
  relatedKeywords: [],
};

function getScoreColor(score: number): string {
  if (score <= 33) return 'bg-danger';
  if (score <= 66) return 'bg-warning';
  return 'bg-success';
}

function getScoreTextColor(score: number): string {
  if (score <= 33) return 'text-danger';
  if (score <= 66) return 'text-warning';
  return 'text-success';
}

export default function TrendingPage() {
  const [topics, setTopics] = useTrendingTopics();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [keywordInput, setKeywordInput] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');
  const [filterVelocity, setFilterVelocity] = useState<TrendVelocity | 'all'>('all');

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesSearch =
        !searchQuery ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.relatedKeywords.some((kw) =>
          kw.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesPlatform =
        filterPlatform === 'all' || topic.platform === filterPlatform;
      const matchesVelocity =
        filterVelocity === 'all' || topic.velocity === filterVelocity;
      return matchesSearch && matchesPlatform && matchesVelocity;
    });
  }, [topics, searchQuery, filterPlatform, filterVelocity]);

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setKeywordInput('');
    setShowForm(true);
  }

  function openEditForm(topic: TrendingTopic) {
    setForm({
      title: topic.title,
      platform: topic.platform,
      category: topic.category,
      engagementScore: topic.engagementScore,
      velocity: topic.velocity,
      relatedKeywords: [...topic.relatedKeywords],
    });
    setEditingId(topic.id);
    setKeywordInput('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setKeywordInput('');
  }

  function handleAddKeyword(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = keywordInput.trim();
      if (trimmed && !form.relatedKeywords.includes(trimmed)) {
        setForm((prev) => ({
          ...prev,
          relatedKeywords: [...prev.relatedKeywords, trimmed],
        }));
      }
      setKeywordInput('');
    }
  }

  function removeKeyword(keyword: string) {
    setForm((prev) => ({
      ...prev,
      relatedKeywords: prev.relatedKeywords.filter((kw) => kw !== keyword),
    }));
  }

  function handleSave() {
    if (!form.title.trim()) return;

    if (editingId) {
      setTopics((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                title: form.title.trim(),
                platform: form.platform,
                category: form.category.trim(),
                engagementScore: form.engagementScore,
                velocity: form.velocity,
                relatedKeywords: form.relatedKeywords,
              }
            : t
        )
      );
    } else {
      const newTopic: TrendingTopic = {
        id: uuidv4(),
        title: form.title.trim(),
        platform: form.platform,
        category: form.category.trim(),
        engagementScore: form.engagementScore,
        velocity: form.velocity,
        relatedKeywords: form.relatedKeywords,
        createdAt: new Date().toISOString(),
      };
      setTopics((prev) => [newTopic, ...prev]);
    }
    closeForm();
  }

  function handleDelete(id: string) {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
            <Flame className="w-8 h-8 text-primary-light" />
            Trending Topics
            <span className="ml-2 text-base font-normal text-text-muted">
              ({filteredTopics.length})
            </span>
          </h1>
          <p className="mt-1 text-text-secondary">
            Track and manage trending topics across platforms
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Topic
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search topics, categories, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm"
          />
        </div>
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value as Platform | 'all')}
          className="py-2 px-3 text-sm"
        >
          <option value="all">All Platforms</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_LABELS[p]}
            </option>
          ))}
        </select>
        <select
          value={filterVelocity}
          onChange={(e) => setFilterVelocity(e.target.value as TrendVelocity | 'all')}
          className="py-2 px-3 text-sm"
        >
          <option value="all">All Velocities</option>
          <option value="rising">Rising</option>
          <option value="peaking">Peaking</option>
          <option value="declining">Declining</option>
        </select>
      </div>

      {/* Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card-dark rounded-xl border border-border w-full max-w-lg mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">
                {editingId ? 'Edit Topic' : 'Add Topic'}
              </h2>
              <button
                onClick={closeForm}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. AI-generated content debate"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full"
              />
            </div>

            {/* Platform & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Platform
                </label>
                <select
                  value={form.platform}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, platform: e.target.value as Platform }))
                  }
                  className="w-full"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {PLATFORM_LABELS[p]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Technology"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Engagement Score */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Engagement Score
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.engagementScore}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      engagementScore: Number(e.target.value),
                    }))
                  }
                  className="flex-1 h-2 appearance-none rounded-full bg-border accent-primary cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-light"
                  style={{ border: 'none', padding: 0 }}
                />
                <span
                  className={`text-lg font-bold min-w-[3ch] text-right ${getScoreTextColor(form.engagementScore)}`}
                >
                  {form.engagementScore}
                </span>
              </div>
            </div>

            {/* Velocity */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Velocity
              </label>
              <select
                value={form.velocity}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    velocity: e.target.value as TrendVelocity,
                  }))
                }
                className="w-full"
              >
                <option value="rising">Rising</option>
                <option value="peaking">Peaking</option>
                <option value="declining">Declining</option>
              </select>
            </div>

            {/* Related Keywords */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Related Keywords
              </label>
              <input
                type="text"
                placeholder="Type a keyword and press Enter"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                className="w-full"
              />
              {form.relatedKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.relatedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-primary/15 text-primary-light"
                    >
                      {kw}
                      <button
                        onClick={() => removeKeyword(kw)}
                        className="hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={closeForm}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg border border-border hover:bg-card-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingId ? 'Save Changes' : 'Add Topic'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Topic Grid */}
      {filteredTopics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Flame className="w-12 h-12 text-text-muted mb-3 opacity-50" />
          <p className="text-text-muted text-lg">
            {topics.length === 0
              ? 'No trending topics yet. Add one to get started!'
              : 'No topics match your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => {
            const velConfig = VELOCITY_CONFIG[topic.velocity];
            const VelIcon = velConfig.icon;

            return (
              <div
                key={topic.id}
                className="bg-card-dark rounded-xl p-5 border border-border hover:border-primary/40 transition-colors group"
              >
                {/* Title */}
                <h3 className="text-lg font-bold text-text-primary mb-3 line-clamp-2">
                  {topic.title}
                </h3>

                {/* Badges: Platform + Category */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${PLATFORM_BADGE_COLORS[topic.platform]}`}
                  >
                    {PLATFORM_LABELS[topic.platform]}
                  </span>
                  {topic.category && (
                    <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-accent/15 text-accent">
                      {topic.category}
                    </span>
                  )}
                </div>

                {/* Engagement Score Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-text-secondary">
                      Engagement
                    </span>
                    <span
                      className={`text-sm font-bold ${getScoreTextColor(topic.engagementScore)}`}
                    >
                      {topic.engagementScore}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getScoreColor(topic.engagementScore)}`}
                      style={{ width: `${topic.engagementScore}%` }}
                    />
                  </div>
                </div>

                {/* Velocity */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${velConfig.bgClass} ${velConfig.colorClass}`}
                  >
                    <VelIcon className="w-3.5 h-3.5" />
                    {velConfig.label}
                  </span>
                </div>

                {/* Related Keywords */}
                {topic.relatedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {topic.relatedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-card-hover text-text-muted"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Date + Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-text-muted">
                    {format(new Date(topic.createdAt), 'MMM d, yyyy')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditForm(topic)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-primary-light hover:bg-primary/15 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(topic.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/15 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
