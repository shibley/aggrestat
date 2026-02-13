export type Plan = 'free' | 'starter' | 'growth';
export type Source = 'reddit' | 'twitter' | 'youtube' | 'web';
export type Sentiment = 'positive' | 'negative' | 'neutral';
export type AlertChannel = 'slack' | 'email';
export type EmailFrequency = 'realtime' | 'daily' | 'weekly';

export interface UserProfile {
  id: string;
  email: string;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  mentions_this_month: number;
  mentions_reset_at: string;
  created_at: string;
  updated_at: string;
}

export interface Keyword {
  id: string;
  user_id: string;
  keyword: string;
  enabled: boolean;
  created_at: string;
}

export interface Mention {
  id: string;
  keyword_id: string;
  user_id: string;
  source: Source;
  text: string;
  url: string | null;
  author: string | null;
  posted_at: string | null;
  relevance_score: number;
  sentiment: Sentiment | null;
  buying_intent: boolean;
  alerted: boolean;
  created_at: string;
}

export interface AlertConfig {
  id: string;
  user_id: string;
  channel: AlertChannel;
  slack_webhook_url: string | null;
  email_frequency: EmailFrequency;
  min_relevance: number;
  notify_negative: boolean;
  notify_buying_intent: boolean;
  enabled: boolean;
  created_at: string;
}

export interface MentionWithKeyword extends Mention {
  keyword?: Keyword;
}

export interface AnalysisResult {
  relevance_score: number;
  sentiment: Sentiment;
  buying_intent: boolean;
  summary: string;
}

export interface RawMention {
  text: string;
  url: string;
  author: string;
  posted_at: string;
  source: Source;
}

export const PLAN_LIMITS: Record<Plan, { keywords: number; mentions: number }> = {
  free: { keywords: 3, mentions: 500 },
  starter: { keywords: 10, mentions: 10000 },
  growth: { keywords: 20, mentions: 25000 },
};
