export type Platform = 'twitter' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'facebook' | 'threads' | 'blog';

export type IdeaStatus = 'raw' | 'developing' | 'ready' | 'transformed';

export type ContentStatus = 'draft' | 'review' | 'scheduled' | 'posted' | 'repurposed';

export type ContentFormat =
  | 'tweet' | 'thread'
  | 'reel' | 'story' | 'carousel' | 'post'
  | 'article' | 'newsletter'
  | 'short' | 'long-form'
  | 'status';

export type TrendVelocity = 'rising' | 'peaking' | 'declining';

export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  rating: number;
  platforms: Platform[];
  status: IdeaStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VoiceProfile {
  tone: string[];
  brandStatement: string;
  targetAudience: string;
  niche: string[];
  recurringThemes: string[];
  topicsToAvoid: string[];
  sampleContent: string;
}

export interface ContentPiece {
  id: string;
  ideaId: string | null;
  title: string;
  platform: Platform;
  format: ContentFormat;
  content: string;
  status: ContentStatus;
  scheduledDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrendingTopic {
  id: string;
  title: string;
  platform: Platform;
  category: string;
  engagementScore: number;
  velocity: TrendVelocity;
  relatedKeywords: string[];
  createdAt: string;
}

export interface AnalyticsEntry {
  id: string;
  contentPieceId: string;
  impressions: number;
  engagement: number;
  clicks: number;
  shares: number;
  saves: number;
  comments: number;
  recordedAt: string;
}

export const PLATFORM_FORMATS: Record<Platform, ContentFormat[]> = {
  twitter: ['tweet', 'thread'],
  instagram: ['reel', 'story', 'carousel', 'post'],
  linkedin: ['post', 'article', 'newsletter'],
  tiktok: ['short', 'post'],
  youtube: ['short', 'long-form'],
  facebook: ['post', 'reel', 'story'],
  threads: ['post', 'thread'],
  blog: ['article', 'newsletter'],
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
  threads: 'Threads',
  blog: 'Blog',
};
