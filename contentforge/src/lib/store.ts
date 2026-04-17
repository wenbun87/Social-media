'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Idea, VoiceProfile, ContentPiece, TrendingTopic } from './types';

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

function useApiStorage<T>(
  cacheKey: string,
  apiPath: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => Promise<void>] {
  const [state, setState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const cached = getFromStorage(cacheKey, initialValue);
    setState(cached);
    setHydrated(true);

    fetch(apiPath)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data: T) => {
        setState(data);
        saveToStorage(cacheKey, data);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, apiPath]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        saveToStorage(cacheKey, next);
        return next;
      });
    },
    [cacheKey]
  );

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(apiPath);
      if (res.ok) {
        const data: T = await res.json();
        setState(data);
        saveToStorage(cacheKey, data);
      }
    } catch {
      // API unavailable
    }
  }, [apiPath, cacheKey]);

  return [hydrated ? state : initialValue, setValue, refetch];
}

function useApiVoiceProfile(
  cacheKey: string,
  apiPath: string,
  initialValue: VoiceProfile
): [VoiceProfile, (value: VoiceProfile | ((prev: VoiceProfile) => VoiceProfile)) => void] {
  const [state, setState] = useState<VoiceProfile>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const cached = getFromStorage(cacheKey, initialValue);
    setState(cached);
    setHydrated(true);

    fetch(apiPath)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data: VoiceProfile) => {
        setState(data);
        saveToStorage(cacheKey, data);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, apiPath]);

  const setValue = useCallback(
    (value: VoiceProfile | ((prev: VoiceProfile) => VoiceProfile)) => {
      setState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        saveToStorage(cacheKey, next);
        fetch(apiPath, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        }).catch(() => {});
        return next;
      });
    },
    [cacheKey, apiPath]
  );

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
  return useApiStorage<Idea[]>('contentforge_ideas', '/api/ideas', []);
}

export function useVoiceProfile() {
  return useApiVoiceProfile('contentforge_voice', '/api/voice', DEFAULT_VOICE);
}

export function useContentPieces() {
  return useApiStorage<ContentPiece[]>('contentforge_content', '/api/content', []);
}

export function useTrendingTopics() {
  return useApiStorage<TrendingTopic[]>('contentforge_trending', '/api/trending', []);
}
