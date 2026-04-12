'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Idea, VoiceProfile, ContentPiece, TrendingTopic, AnalyticsEntry } from './types';

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(getFromStorage(key, initialValue));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      saveToStorage(key, next);
      return next;
    });
  }, [key]);

  return [hydrated ? state : initialValue, setValue];
}

const DEFAULT_VOICE: VoiceProfile = {
  tone: [],
  brandStatement: '',
  targetAudience: '',
  niche: [],
  recurringThemes: [],
  topicsToAvoid: [],
  sampleContent: '',
};

export function useIdeas() {
  return useLocalStorage<Idea[]>('contentforge_ideas', []);
}

export function useVoiceProfile() {
  return useLocalStorage<VoiceProfile>('contentforge_voice', DEFAULT_VOICE);
}

export function useContentPieces() {
  return useLocalStorage<ContentPiece[]>('contentforge_content', []);
}

export function useTrendingTopics() {
  return useLocalStorage<TrendingTopic[]>('contentforge_trending', []);
}

export function useAnalytics() {
  return useLocalStorage<AnalyticsEntry[]>('contentforge_analytics', []);
}
