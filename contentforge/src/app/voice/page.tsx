'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mic, X, Plus, Save, Check } from 'lucide-react';
import { useVoiceProfile } from '@/lib/store';
import type { VoiceProfile } from '@/lib/types';

const TONE_SUGGESTIONS = [
  'professional', 'casual', 'humorous', 'inspirational', 'educational',
  'authoritative', 'conversational', 'empathetic', 'bold', 'witty',
];

const NICHE_SUGGESTIONS = [
  'tech', 'marketing', 'fitness', 'finance', 'lifestyle', 'education',
  'food', 'travel', 'fashion', 'health', 'business', 'creative',
];

function TagInput({
  label,
  description,
  tags,
  onAdd,
  onRemove,
  suggestions,
  placeholder,
}: {
  label: string;
  description?: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  suggestions?: string[];
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim().toLowerCase();
      if (trimmed && !tags.includes(trimmed)) {
        onAdd(trimmed);
        setInputValue('');
      }
    }
  };

  const availableSuggestions = suggestions?.filter((s) => !tags.includes(s)) ?? [];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">{label}</label>
        {description && <p className="text-xs text-text-muted mb-2">{description}</p>}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary-light text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="hover:text-danger transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? 'Type and press Enter to add...'}
        className="w-full"
      />

      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onAdd(suggestion)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border text-text-secondary text-xs font-medium hover:border-primary hover:text-primary-light transition-colors"
            >
              <Plus className="w-3 h-3" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VoiceProfilePage() {
  const [profile, setProfile] = useVoiceProfile();
  const [showSaved, setShowSaved] = useState(false);

  const updateField = useCallback(
    <K extends keyof VoiceProfile>(field: K, value: VoiceProfile[K]) => {
      setProfile((prev) => ({ ...prev, [field]: value }));
    },
    [setProfile],
  );

  const addTag = useCallback(
    (field: 'tone' | 'niche' | 'recurringThemes' | 'topicsToAvoid', tag: string) => {
      setProfile((prev) => ({
        ...prev,
        [field]: prev[field].includes(tag) ? prev[field] : [...prev[field], tag],
      }));
    },
    [setProfile],
  );

  const removeTag = useCallback(
    (field: 'tone' | 'niche' | 'recurringThemes' | 'topicsToAvoid', tag: string) => {
      setProfile((prev) => ({
        ...prev,
        [field]: prev[field].filter((t) => t !== tag),
      }));
    },
    [setProfile],
  );

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
          <Mic className="w-6 h-6 text-primary-light" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Brand Profile</h1>
          <p className="text-sm text-text-secondary">Define your content voice and brand identity</p>
        </div>
      </div>

      {/* Tone */}
      <section className="bg-card-dark rounded-xl p-6">
        <TagInput
          label="Tone"
          description="Select or type the tones that represent your brand voice."
          tags={profile.tone}
          onAdd={(tag) => addTag('tone', tag)}
          onRemove={(tag) => removeTag('tone', tag)}
          suggestions={TONE_SUGGESTIONS}
          placeholder="Type a tone and press Enter..."
        />
      </section>

      {/* Brand Statement */}
      <section className="bg-card-dark rounded-xl p-6">
        <label className="block text-sm font-medium text-text-primary mb-1">
          Personal Brand Statement
        </label>
        <p className="text-xs text-text-muted mb-3">
          A concise statement that captures your unique value and identity.
        </p>
        <textarea
          rows={3}
          value={profile.brandStatement}
          onChange={(e) => updateField('brandStatement', e.target.value)}
          placeholder="e.g. I help ambitious professionals build personal brands through authentic storytelling..."
          className="w-full resize-none"
        />
      </section>

      {/* Target Audience */}
      <section className="bg-card-dark rounded-xl p-6">
        <label className="block text-sm font-medium text-text-primary mb-1">
          Target Audience
        </label>
        <p className="text-xs text-text-muted mb-3">
          Describe who you are creating content for.
        </p>
        <input
          type="text"
          value={profile.targetAudience}
          onChange={(e) => updateField('targetAudience', e.target.value)}
          placeholder="e.g. Tech-savvy millennials interested in personal development and entrepreneurship"
          className="w-full"
        />
      </section>

      {/* Niche */}
      <section className="bg-card-dark rounded-xl p-6">
        <TagInput
          label="Niche"
          description="Select or type the niches your content focuses on."
          tags={profile.niche}
          onAdd={(tag) => addTag('niche', tag)}
          onRemove={(tag) => removeTag('niche', tag)}
          suggestions={NICHE_SUGGESTIONS}
          placeholder="Type a niche and press Enter..."
        />
      </section>

      {/* Recurring Themes */}
      <section className="bg-card-dark rounded-xl p-6">
        <TagInput
          label="Recurring Themes"
          description="Themes that regularly appear in your content."
          tags={profile.recurringThemes}
          onAdd={(tag) => addTag('recurringThemes', tag)}
          onRemove={(tag) => removeTag('recurringThemes', tag)}
          placeholder="Type a theme and press Enter..."
        />
      </section>

      {/* Topics to Avoid */}
      <section className="bg-card-dark rounded-xl p-6">
        <TagInput
          label="Topics to Avoid"
          description="Topics you want to steer clear of in your content."
          tags={profile.topicsToAvoid}
          onAdd={(tag) => addTag('topicsToAvoid', tag)}
          onRemove={(tag) => removeTag('topicsToAvoid', tag)}
          placeholder="Type a topic and press Enter..."
        />
      </section>

      {/* Sample Content */}
      <section className="bg-card-dark rounded-xl p-6">
        <label className="block text-sm font-medium text-text-primary mb-1">
          Sample Content
        </label>
        <p className="text-xs text-text-muted mb-3">
          Provide an example that represents your writing style.
        </p>
        <textarea
          rows={6}
          value={profile.sampleContent}
          onChange={(e) => updateField('sampleContent', e.target.value)}
          placeholder="Paste an example of your writing style..."
          className="w-full resize-none"
        />
      </section>

      {/* Save Button */}
      <div className="flex items-center gap-4 pb-8">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-light transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Profile
        </button>
        {showSaved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success animate-pulse">
            <Check className="w-4 h-4" />
            Profile saved!
          </span>
        )}
      </div>
    </div>
  );
}
