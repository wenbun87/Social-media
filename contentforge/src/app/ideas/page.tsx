'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useIdeas } from '@/lib/store';
import type { Idea, IdeaStatus, Platform } from '@/lib/types';
import { PLATFORM_LABELS } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import {
  Lightbulb,
  Plus,
  Search,
  Star,
  Pencil,
  Trash2,
  X,
  ChevronDown,
} from 'lucide-react';

const TAG_SUGGESTIONS = [
  'marketing',
  'personal',
  'tutorial',
  'tips',
  'story',
  'behind-the-scenes',
  'educational',
  'trending',
  'collaboration',
  'product',
];

const ALL_PLATFORMS = Object.keys(PLATFORM_LABELS) as Platform[];

const STATUS_OPTIONS: { value: IdeaStatus; label: string }[] = [
  { value: 'raw', label: 'Raw' },
  { value: 'developing', label: 'Developing' },
  { value: 'ready', label: 'Ready' },
  { value: 'transformed', label: 'Transformed' },
];

const STATUS_COLORS: Record<IdeaStatus, string> = {
  raw: 'bg-gray-600/20 text-gray-400',
  developing: 'bg-warning/20 text-warning',
  ready: 'bg-accent/20 text-accent',
  transformed: 'bg-success/20 text-success',
};

type SortOption = 'newest' | 'oldest' | 'highest-rated';

interface IdeaFormData {
  title: string;
  content: string;
  tags: string[];
  rating: number;
  platforms: Platform[];
  status: IdeaStatus;
}

const EMPTY_FORM: IdeaFormData = {
  title: '',
  content: '',
  tags: [],
  rating: 3,
  platforms: [],
  status: 'raw',
};

export default function IdeasPage() {
  const [ideas, setIdeas, refetchIdeas] = useIdeas();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | IdeaStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IdeaFormData>(EMPTY_FORM);

  // Tag input state
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Close tag suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(e.target as Node) &&
        tagInputRef.current &&
        !tagInputRef.current.contains(e.target as Node)
      ) {
        setShowTagSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered and sorted ideas
  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.content.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((idea) => idea.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'highest-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [ideas, searchQuery, statusFilter, sortBy]);

  // CRUD operations
  function openNewIdea() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTagInput('');
    setShowModal(true);
  }

  function openEditIdea(idea: Idea) {
    setEditingId(idea.id);
    setForm({
      title: idea.title,
      content: idea.content,
      tags: [...idea.tags],
      rating: idea.rating,
      platforms: [...idea.platforms],
      status: idea.status,
    });
    setTagInput('');
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;

    const now = new Date().toISOString();

    if (editingId) {
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === editingId
            ? { ...idea, ...form, updatedAt: now }
            : idea
        )
      );
      fetch(`/api/ideas/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).then(() => refetchIdeas()).catch(() => {});
    } else {
      const newIdea: Idea = {
        id: uuidv4(),
        ...form,
        createdAt: now,
        updatedAt: now,
      };
      setIdeas((prev) => [...prev, newIdea]);
      fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIdea),
      }).then(() => refetchIdeas()).catch(() => {});
    }

    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleDelete(id: string) {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
    fetch(`/api/ideas/${id}`, { method: 'DELETE' }).then(() => refetchIdeas()).catch(() => {});
    setDeleteConfirmId(null);
  }

  function handleCancel() {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  // Tag helpers
  function addTag(tag: string) {
    const cleaned = tag.trim().toLowerCase();
    if (cleaned && !form.tags.includes(cleaned)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, cleaned] }));
    }
    setTagInput('');
    setShowTagSuggestions(false);
  }

  function removeTag(tag: string) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }

  function togglePlatform(platform: Platform) {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  }

  const filteredTagSuggestions = TAG_SUGGESTIONS.filter(
    (t) =>
      !form.tags.includes(t) &&
      t.toLowerCase().includes(tagInput.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary-light" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Idea Bank</h1>
            <p className="text-sm text-text-muted">
              {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'} total
            </p>
          </div>
        </div>
        <button
          onClick={openNewIdea}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Idea
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | IdeaStatus)
            }
            className="appearance-none pr-9 py-2.5 text-sm min-w-[150px]"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none pr-9 py-2.5 text-sm min-w-[150px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest-rated">Highest Rated</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-20">
          <Lightbulb className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary text-lg mb-1">No ideas found</p>
          <p className="text-text-muted text-sm">
            {ideas.length === 0
              ? 'Click "New Idea" to capture your first idea.'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="bg-card-dark border border-border rounded-xl p-5 hover:bg-card-hover transition-colors group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-text-primary text-base leading-snug">
                  {idea.title}
                </h3>
                <span
                  className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[idea.status]}`}
                >
                  {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                </span>
              </div>

              {/* Content Preview */}
              {idea.content && (
                <p className="text-text-secondary text-sm leading-relaxed mb-3 line-clamp-2">
                  {idea.content}
                </p>
              )}

              {/* Tags */}
              {idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-primary/15 text-primary-light rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= idea.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Platforms */}
              {idea.platforms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {idea.platforms.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 bg-accent/15 text-accent-light rounded-full text-xs font-medium"
                    >
                      {PLATFORM_LABELS[p]}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-text-muted">
                  {format(new Date(idea.createdAt), 'MMM d, yyyy')}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditIdea(idea)}
                    className="p-1.5 rounded-md text-text-muted hover:text-primary-light hover:bg-primary/15 transition-colors"
                    title="Edit idea"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {deleteConfirmId === idea.id ? (
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        onClick={() => handleDelete(idea.id)}
                        className="px-2 py-1 text-xs bg-danger text-white rounded-md font-medium hover:bg-danger/80 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 text-xs text-text-muted hover:text-text-primary transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(idea.id)}
                      className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/15 transition-colors"
                      title="Delete idea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* Modal Content */}
          <div className="relative bg-card-dark border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card-dark rounded-t-2xl z-10">
              <h2 className="text-lg font-semibold text-text-primary">
                {editingId ? 'Edit Idea' : 'New Idea'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Give your idea a title..."
                  className="w-full"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Content
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Describe your idea in detail..."
                  rows={4}
                  className="w-full resize-y"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Tags
                </label>
                {/* Selected Tags */}
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2.5 py-1 bg-primary/15 text-primary-light rounded-full text-xs font-medium"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {/* Tag Input */}
                <div className="relative">
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setShowTagSuggestions(true);
                    }}
                    onFocus={() => setShowTagSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (tagInput.trim()) addTag(tagInput);
                      }
                    }}
                    placeholder="Type to add tags..."
                    className="w-full"
                  />
                  {showTagSuggestions && filteredTagSuggestions.length > 0 && (
                    <div
                      ref={tagDropdownRef}
                      className="absolute z-20 top-full left-0 right-0 mt-1 bg-card-dark border border-border rounded-lg shadow-xl max-h-40 overflow-y-auto"
                    >
                      {filteredTagSuggestions.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => addTag(tag)}
                          className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-card-hover hover:text-text-primary transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, rating: s }))
                      }
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= form.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600 hover:text-gray-400'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-text-muted">
                    {form.rating}/5
                  </span>
                </div>
              </div>

              {/* Target Platforms */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Target Platforms
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ALL_PLATFORMS.map((platform) => {
                    const checked = form.platforms.includes(platform);
                    return (
                      <label
                        key={platform}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                          checked
                            ? 'border-accent bg-accent/10 text-accent-light'
                            : 'border-border text-text-secondary hover:border-border hover:bg-card-hover'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePlatform(platform)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                            checked
                              ? 'border-accent bg-accent'
                              : 'border-gray-600'
                          }`}
                        >
                          {checked && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        {PLATFORM_LABELS[platform]}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as IdeaStatus,
                      }))
                    }
                    className="w-full appearance-none pr-9"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-card-dark rounded-b-2xl">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-card-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="px-5 py-2 text-sm font-medium bg-primary hover:bg-primary-light text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editingId ? 'Save Changes' : 'Create Idea'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
