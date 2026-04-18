'use client';

import { useState, useMemo } from 'react';
import { useIdeas, useContentPieces } from '@/lib/store';
import type { Idea, IdeaFormat, Platform, ContentPiece } from '@/lib/types';
import { PLATFORM_LABELS, IDEA_FORMAT_OPTIONS } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import {
  Lightbulb,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

const ALL_PLATFORMS = Object.keys(PLATFORM_LABELS) as Platform[];

type SortOption = 'newest' | 'oldest';

interface IdeaFormData {
  title: string;
  content: string;
  format: IdeaFormat[];
  platforms: Platform[];
}

const EMPTY_FORM: IdeaFormData = {
  title: '',
  content: '',
  format: [],
  platforms: [],
};

export default function IdeasPage() {
  const [ideas, setIdeas, refetchIdeas] = useIdeas();
  const [, setPieces, refetchPieces] = useContentPieces();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IdeaFormData>(EMPTY_FORM);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [sentToStudioId, setSentToStudioId] = useState<string | null>(null);

  const filteredIdeas = useMemo(() => {
    let result = [...ideas];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.content.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) =>
      sortBy === 'newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return result;
  }, [ideas, searchQuery, sortBy]);

  function openNewIdea() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEditIdea(idea: Idea) {
    setEditingId(idea.id);
    setForm({
      title: idea.title,
      content: idea.content,
      format: [...idea.format],
      platforms: [...idea.platforms],
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    const now = new Date().toISOString();

    if (editingId) {
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === editingId ? { ...idea, ...form, updatedAt: now } : idea
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

  function toggleFormat(fmt: IdeaFormat) {
    setForm((prev) => ({
      ...prev,
      format: prev.format.includes(fmt)
        ? prev.format.filter((f) => f !== fmt)
        : [...prev.format, fmt],
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

  function handleSendToStudio(idea: Idea) {
    const now = new Date().toISOString();
    const newPiece: ContentPiece = {
      id: uuidv4(),
      title: idea.title,
      platform: idea.platforms[0] ?? 'instagram',
      format: 'post',
      content: idea.content,
      status: 'draft',
      scheduledDate: null,
      notes: '',
      createdAt: now,
      updatedAt: now,
    };
    setPieces((prev) => [newPiece, ...prev]);
    fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPiece),
    }).then(() => refetchPieces()).catch(() => {});
    setSentToStudioId(idea.id);
    setTimeout(() => {
      setIdeas((prev) => prev.filter((i) => i.id !== idea.id));
      fetch(`/api/ideas/${idea.id}`, { method: 'DELETE' }).then(() => refetchIdeas()).catch(() => {});
      setSentToStudioId(null);
    }, 1500);
  }

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

      {/* Search and Sort */}
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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none pr-9 py-2.5 text-sm min-w-[150px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
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
              : 'Try adjusting your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="bg-card-dark border border-border rounded-xl p-5 hover:bg-card-hover transition-colors"
            >
              {/* Card Header */}
              <div className="mb-3">
                <h3 className="font-semibold text-text-primary text-base leading-snug">
                  {idea.title}
                </h3>
              </div>

              {/* Content Preview */}
              {idea.content && (
                <p className="text-text-secondary text-sm leading-relaxed mb-3 line-clamp-2">
                  {idea.content}
                </p>
              )}

              {/* Formats */}
              {idea.format.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {idea.format.map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2 py-0.5 bg-primary/15 text-primary-light rounded-full text-xs font-medium capitalize"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              )}

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
                  {sentToStudioId === idea.id ? (
                    <span className="px-2.5 py-1 text-xs font-medium text-success bg-success/15 rounded-md">
                      Sent to Studio!
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendToStudio(idea)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-primary-light hover:bg-primary/15 transition-colors"
                      title="Send to Content Studio"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Send to Studio
                    </button>
                  )}
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
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCancel}
          />
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
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your idea a title..."
                  className="w-full"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Describe your idea in detail..."
                  rows={4}
                  className="w-full resize-y"
                />
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {IDEA_FORMAT_OPTIONS.map((fmt) => {
                    const checked = form.format.includes(fmt);
                    return (
                      <label
                        key={fmt}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm capitalize ${
                          checked
                            ? 'border-primary bg-primary/10 text-primary-light'
                            : 'border-border text-text-secondary hover:bg-card-hover'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFormat(fmt)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                            checked ? 'border-primary bg-primary' : 'border-border'
                          }`}
                        >
                          {checked && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {fmt}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Target Platforms */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                            : 'border-border text-text-secondary hover:bg-card-hover'
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
                            checked ? 'border-accent bg-accent' : 'border-border'
                          }`}
                        >
                          {checked && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {PLATFORM_LABELS[platform]}
                      </label>
                    );
                  })}
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
