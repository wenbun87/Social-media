'use client';

import { useState, useMemo } from 'react';
import {
  PenTool,
  Plus,
  X,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Copy,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useContentPieces } from '@/lib/store';
import type {
  ContentPiece,
  ContentStatus,
  Platform,
  ContentFormat,
} from '@/lib/types';
import { PLATFORM_FORMATS, PLATFORM_LABELS } from '@/lib/types';

const ALL_PLATFORMS = Object.keys(PLATFORM_LABELS) as Platform[];
const ALL_STATUSES: ContentStatus[] = ['draft', 'scheduled', 'posted'];

const STATUS_CONFIG: Record<ContentStatus, { label: string; colorClass: string; bgClass: string }> = {
  draft: { label: 'Draft', colorClass: 'text-text-muted', bgClass: 'bg-card-hover' },
  scheduled: { label: 'Scheduled', colorClass: 'text-accent', bgClass: 'bg-accent/15' },
  posted: { label: 'Posted', colorClass: 'text-success', bgClass: 'bg-success/15' },
};

interface FormData {
  title: string;
  platform: Platform;
  format: ContentFormat;
  content: string;
  status: ContentStatus;
  scheduledDate: string;
  notes: string;
}

const emptyForm: FormData = {
  title: '',
  platform: 'instagram',
  format: 'post',
  content: '',
  status: 'draft',
  scheduledDate: '',
  notes: '',
};

export default function ContentStudioPage() {
<<<<<<< Updated upstream
  const [pieces, setPieces] = useContentPieces();
  const [ideas] = useIdeas();
=======
  const [pieces, setPieces, refetchPieces] = useContentPieces();
>>>>>>> Stashed changes

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');

  const availableFormats = PLATFORM_FORMATS[form.platform];

  const filteredPieces = useMemo(() => {
    return pieces.filter((piece) => {
      if (statusFilter !== 'all' && piece.status !== statusFilter) return false;
      if (platformFilter !== 'all' && piece.platform !== platformFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !piece.title.toLowerCase().includes(q) &&
          !piece.content.toLowerCase().includes(q) &&
          !piece.notes.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [pieces, statusFilter, platformFilter, searchQuery]);

  function openNewForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(piece: ContentPiece) {
    setForm({
      title: piece.title,
      platform: piece.platform,
      format: piece.format,
      content: piece.content,
      status: piece.status,
      scheduledDate: piece.scheduledDate ?? '',
      notes: piece.notes,
    });
    setEditingId(piece.id);
    setShowForm(true);
    setExpandedId(null);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handlePlatformChange(platform: Platform) {
    const formats = PLATFORM_FORMATS[platform];
    setForm((prev) => ({
      ...prev,
      platform,
      format: formats.includes(prev.format) ? prev.format : formats[0],
    }));
  }

  function handleSave() {
    if (!form.title.trim()) return;
    const now = new Date().toISOString();

    if (editingId) {
<<<<<<< Updated upstream
      setPieces((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ideaId: form.ideaId,
                title: form.title.trim(),
                platform: form.platform,
                format: form.format,
                content: form.content,
                status: form.status,
                scheduledDate: form.status === 'scheduled' ? form.scheduledDate || null : null,
                notes: form.notes,
                updatedAt: now,
              }
            : p,
        ),
=======
      const updated = {
        title: form.title.trim(),
        platform: form.platform,
        format: form.format,
        content: form.content,
        status: form.status,
        scheduledDate: form.status === 'scheduled' ? form.scheduledDate || null : null,
        notes: form.notes,
      };
      setPieces((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, ...updated, updatedAt: now } : p
        )
>>>>>>> Stashed changes
      );
    } else {
      const newPiece: ContentPiece = {
        id: uuidv4(),
        title: form.title.trim(),
        platform: form.platform,
        format: form.format,
        content: form.content,
        status: form.status,
        scheduledDate: form.status === 'scheduled' ? form.scheduledDate || null : null,
        notes: form.notes,
        createdAt: now,
        updatedAt: now,
      };
      setPieces((prev) => [newPiece, ...prev]);
    }

    closeForm();
  }

  function handleDelete(id: string) {
    setPieces((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
    if (expandedId === id) setExpandedId(null);
  }

  function handleStatusChange(id: string, status: ContentStatus) {
    const now = new Date().toISOString();
<<<<<<< Updated upstream
=======
    const piece = pieces.find((p) => p.id === id);
    if (!piece) return;
    fetch(`/api/content/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...piece, status, scheduledDate: status === 'scheduled' ? piece.scheduledDate : null }),
    }).then(() => refetchPieces()).catch(() => {});
>>>>>>> Stashed changes
    setPieces((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status, scheduledDate: status === 'scheduled' ? p.scheduledDate : null, updatedAt: now }
          : p
      )
    );
  }

  async function handleCopy(id: string, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard not available
    }
  }

  const charCount = form.content.length;
  const isTwitter = form.platform === 'twitter';
  const twitterOverLimit = isTwitter && charCount > 280;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <PenTool className="w-5 h-5 text-primary-light" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Content Studio</h1>
            <p className="text-sm text-text-muted">
              {pieces.length} piece{pieces.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Content
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="mb-8 bg-card-dark border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">
              {editingId ? 'Edit Content' : 'New Content Piece'}
            </h2>
            <button
              onClick={closeForm}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Content title..."
                className="w-full"
              />
            </div>

            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Platform
              </label>
              <select
                value={form.platform}
                onChange={(e) => handlePlatformChange(e.target.value as Platform)}
                className="w-full"
              >
                {ALL_PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Format
              </label>
              <select
                value={form.format}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, format: e.target.value as ContentFormat }))
                }
                className="w-full"
              >
                {availableFormats.map((f) => (
                  <option key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value as ContentStatus }))
                }
                className="w-full"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheduled Date */}
            {form.status === 'scheduled' && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Scheduled Date <span className="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduledDate}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, scheduledDate: e.target.value }))
                  }
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Content textarea */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-text-secondary">Content</label>
              <span
                className={`text-xs font-mono ${
                  twitterOverLimit
                    ? 'text-danger'
                    : isTwitter && charCount > 250
                      ? 'text-warning'
                      : 'text-text-muted'
                }`}
              >
                {charCount}
                {isTwitter ? ' / 280' : ''} characters
              </span>
            </div>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write your content here..."
              rows={6}
              className="w-full resize-y"
            />
            {twitterOverLimit && (
              <p className="mt-1 text-xs text-danger flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Content exceeds the 280 character limit for Twitter/X
              </p>
            )}
          </div>

          {/* Notes textarea */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Internal notes, hashtags, mentions..."
              rows={3}
              className="w-full resize-y"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!form.title.trim() || (form.status === 'scheduled' && !form.scheduledDate)}
              className="px-5 py-2.5 bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
            >
              {editingId ? 'Update' : 'Create'} Content
            </button>
            <button
              onClick={closeForm}
              className="px-5 py-2.5 bg-card-hover hover:bg-border text-text-secondary rounded-lg font-medium text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'all')}
            className="text-sm"
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as Platform | 'all')}
            className="text-sm"
          >
            <option value="all">All Platforms</option>
            {ALL_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content List */}
      {filteredPieces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="w-12 h-12 text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-1">No content found</h3>
          <p className="text-sm text-text-muted max-w-md">
            {pieces.length === 0
              ? 'Create your first content piece or send an idea from the Idea Bank.'
              : 'No content matches your current filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPieces.map((piece) => {
            const isExpanded = expandedId === piece.id;
            const statusCfg = STATUS_CONFIG[piece.status];

            return (
              <div
                key={piece.id}
                className="bg-card-dark border border-border rounded-xl overflow-hidden transition-colors hover:border-primary/30"
              >
                {/* Collapsed header row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : piece.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary truncate">
                      {piece.title}
                    </h3>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-md bg-primary/15 text-primary-light text-xs font-medium">
                    {PLATFORM_LABELS[piece.platform]}
                  </span>
                  <span className="shrink-0 px-2.5 py-1 rounded-md bg-card-hover text-text-secondary text-xs font-medium capitalize">
                    {piece.format.replace('-', ' ')}
                  </span>
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium ${statusCfg.bgClass} ${statusCfg.colorClass}`}
                  >
                    {statusCfg.label}
                  </span>
                  {piece.scheduledDate && (
                    <span className="shrink-0 flex items-center gap-1 text-xs text-text-muted">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(piece.scheduledDate), 'MMM d, yyyy h:mm a')}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-text-muted shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                  )}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-border">
                    {/* Content */}
                    <div className="mt-4 mb-4">
                      {piece.content ? (
                        <pre className="whitespace-pre-wrap text-sm text-text-secondary font-sans leading-relaxed bg-bg-dark rounded-lg p-4">
                          {piece.content}
                        </pre>
                      ) : (
                        <p className="text-sm text-text-muted italic">No content body yet.</p>
                      )}
                    </div>

                    {/* Notes */}
                    {piece.notes && (
                      <div className="mb-4 p-3 bg-bg-dark rounded-lg border border-border">
                        <p className="text-xs font-medium text-text-muted mb-1">Notes</p>
                        <p className="text-sm text-text-secondary whitespace-pre-wrap">
                          {piece.notes}
                        </p>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Created {format(new Date(piece.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Updated {format(new Date(piece.updatedAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>

                    {/* Quick Status Change */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-xs text-text-muted mr-1">Set status:</span>
                      {ALL_STATUSES.map((s) => {
                        const cfg = STATUS_CONFIG[s];
                        const isActive = piece.status === s;
                        return (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(piece.id, s)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                              isActive
                                ? `${cfg.bgClass} ${cfg.colorClass} ring-1 ring-current`
                                : 'bg-card-hover text-text-muted hover:text-text-secondary'
                            }`}
                          >
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(piece.id, piece.content)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-card-hover hover:bg-border text-text-secondary rounded-lg text-xs font-medium transition-colors"
                      >
                        {copiedId === piece.id ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-success" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => openEditForm(piece)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-card-hover hover:bg-border text-text-secondary rounded-lg text-xs font-medium transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      {deleteConfirmId === piece.id ? (
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-xs text-danger">Delete this piece?</span>
                          <button
                            onClick={() => handleDelete(piece.id)}
                            className="px-3 py-2 bg-danger/15 hover:bg-danger/25 text-danger rounded-lg text-xs font-medium transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-2 bg-card-hover hover:bg-border text-text-muted rounded-lg text-xs font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(piece.id)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-card-hover hover:bg-danger/15 text-text-secondary hover:text-danger rounded-lg text-xs font-medium transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
