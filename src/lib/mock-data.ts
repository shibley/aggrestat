import { Mention, Keyword, AlertConfig, UserProfile } from '@/types';

export const mockUser: UserProfile = {
  id: 'mock-user-1',
  email: 'founder@example.com',
  plan: 'starter',
  stripe_customer_id: null,
  stripe_subscription_id: null,
  mentions_this_month: 847,
  mentions_reset_at: new Date().toISOString(),
  created_at: '2026-01-15T00:00:00Z',
  updated_at: new Date().toISOString(),
};

export const mockKeywords: Keyword[] = [
  { id: 'kw-1', user_id: 'mock-user-1', keyword: 'aggrestat', enabled: true, created_at: '2026-02-01T00:00:00Z' },
  { id: 'kw-2', user_id: 'mock-user-1', keyword: 'brand24 alternative', enabled: true, created_at: '2026-02-02T00:00:00Z' },
  { id: 'kw-3', user_id: 'mock-user-1', keyword: 'social listening tool', enabled: true, created_at: '2026-02-03T00:00:00Z' },
  { id: 'kw-4', user_id: 'mock-user-1', keyword: 'mention monitoring', enabled: false, created_at: '2026-02-04T00:00:00Z' },
];

export const mockMentions: Mention[] = [
  {
    id: 'm-1', keyword_id: 'kw-1', user_id: 'mock-user-1', source: 'reddit',
    text: 'Just discovered Aggrestat — finally a social listening tool that doesn\'t cost $150/mo. Been using it for a week and the AI filtering actually works. Way less noise than Google Alerts.',
    url: 'https://reddit.com/r/SaaS/comments/example1', author: 'u/indie_builder',
    posted_at: '2026-02-13T08:30:00Z', relevance_score: 95, sentiment: 'positive', buying_intent: false, alerted: true, created_at: '2026-02-13T08:35:00Z',
  },
  {
    id: 'm-2', keyword_id: 'kw-2', user_id: 'mock-user-1', source: 'twitter',
    text: 'Anyone know a good Brand24 alternative? $149/mo is insane for a solo founder. I just need basic Reddit + Twitter monitoring.',
    url: 'https://x.com/saasfounder/status/123', author: '@saasfounder',
    posted_at: '2026-02-13T07:15:00Z', relevance_score: 92, sentiment: 'negative', buying_intent: true, alerted: true, created_at: '2026-02-13T07:20:00Z',
  },
  {
    id: 'm-3', keyword_id: 'kw-3', user_id: 'mock-user-1', source: 'reddit',
    text: 'Looking for a social listening tool that works with Reddit. Most tools only do Twitter and Instagram. Need something for tracking competitor mentions in niche subreddits.',
    url: 'https://reddit.com/r/Entrepreneur/comments/example2', author: 'u/startup_grind',
    posted_at: '2026-02-13T06:45:00Z', relevance_score: 88, sentiment: 'neutral', buying_intent: true, alerted: true, created_at: '2026-02-13T06:50:00Z',
  },
  {
    id: 'm-4', keyword_id: 'kw-2', user_id: 'mock-user-1', source: 'youtube',
    text: 'In this video I compare Brand24 vs Mention vs some newer alternatives. Brand24 has gotten really expensive lately...',
    url: 'https://youtube.com/watch?v=example1', author: 'SaaS Reviews',
    posted_at: '2026-02-12T14:00:00Z', relevance_score: 78, sentiment: 'neutral', buying_intent: false, alerted: false, created_at: '2026-02-12T14:05:00Z',
  },
  {
    id: 'm-5', keyword_id: 'kw-1', user_id: 'mock-user-1', source: 'twitter',
    text: 'Shipped my first week using @aggrestat for monitoring. Caught 3 buying-intent mentions on Reddit I would have completely missed. Already paid for itself.',
    url: 'https://x.com/happycustomer/status/456', author: '@happycustomer',
    posted_at: '2026-02-12T11:00:00Z', relevance_score: 97, sentiment: 'positive', buying_intent: false, alerted: true, created_at: '2026-02-12T11:05:00Z',
  },
  {
    id: 'm-6', keyword_id: 'kw-3', user_id: 'mock-user-1', source: 'reddit',
    text: 'The social listening space is getting interesting. Brand24, Mention, Awario all going enterprise. Who\'s building for indie hackers?',
    url: 'https://reddit.com/r/indiehackers/comments/example3', author: 'u/buildinpublic',
    posted_at: '2026-02-12T09:30:00Z', relevance_score: 82, sentiment: 'neutral', buying_intent: false, alerted: false, created_at: '2026-02-12T09:35:00Z',
  },
  {
    id: 'm-7', keyword_id: 'kw-2', user_id: 'mock-user-1', source: 'reddit',
    text: 'Switched from Brand24 to a cheaper alternative last month. Saving $120/mo and honestly getting better results for my use case.',
    url: 'https://reddit.com/r/SaaS/comments/example4', author: 'u/frugal_founder',
    posted_at: '2026-02-11T16:00:00Z', relevance_score: 85, sentiment: 'positive', buying_intent: false, alerted: false, created_at: '2026-02-11T16:05:00Z',
  },
  {
    id: 'm-8', keyword_id: 'kw-3', user_id: 'mock-user-1', source: 'twitter',
    text: 'Hot take: most social listening tools are overpriced dashboards wrapped around basic keyword search. The AI scoring is where the real value is.',
    url: 'https://x.com/techcritic/status/789', author: '@techcritic',
    posted_at: '2026-02-11T13:00:00Z', relevance_score: 71, sentiment: 'negative', buying_intent: false, alerted: false, created_at: '2026-02-11T13:05:00Z',
  },
  {
    id: 'm-9', keyword_id: 'kw-1', user_id: 'mock-user-1', source: 'reddit',
    text: 'Has anyone tried Aggrestat? Saw it mentioned on r/SaaS. Looks promising but want to hear from actual users before signing up.',
    url: 'https://reddit.com/r/Entrepreneur/comments/example5', author: 'u/cautious_buyer',
    posted_at: '2026-02-11T10:00:00Z', relevance_score: 90, sentiment: 'neutral', buying_intent: true, alerted: true, created_at: '2026-02-11T10:05:00Z',
  },
  {
    id: 'm-10', keyword_id: 'kw-2', user_id: 'mock-user-1', source: 'youtube',
    text: 'Brand24 pricing update: they just raised prices AGAIN. Time to look for alternatives seriously.',
    url: 'https://youtube.com/watch?v=example2', author: 'Marketing Breakdown',
    posted_at: '2026-02-10T15:00:00Z', relevance_score: 80, sentiment: 'negative', buying_intent: true, alerted: true, created_at: '2026-02-10T15:05:00Z',
  },
];

export const mockAlertConfigs: AlertConfig[] = [
  {
    id: 'ac-1', user_id: 'mock-user-1', channel: 'slack',
    slack_webhook_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXX',
    email_frequency: 'daily', min_relevance: 70, notify_negative: true, notify_buying_intent: true,
    enabled: true, created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'ac-2', user_id: 'mock-user-1', channel: 'email',
    slack_webhook_url: null,
    email_frequency: 'daily', min_relevance: 50, notify_negative: true, notify_buying_intent: true,
    enabled: true, created_at: '2026-02-01T00:00:00Z',
  },
];

// Chart data
export const mockMentionsOverTime = [
  { date: 'Feb 7', reddit: 12, twitter: 8, youtube: 3 },
  { date: 'Feb 8', reddit: 18, twitter: 12, youtube: 5 },
  { date: 'Feb 9', reddit: 15, twitter: 10, youtube: 2 },
  { date: 'Feb 10', reddit: 22, twitter: 15, youtube: 7 },
  { date: 'Feb 11', reddit: 28, twitter: 18, youtube: 4 },
  { date: 'Feb 12', reddit: 35, twitter: 22, youtube: 8 },
  { date: 'Feb 13', reddit: 42, twitter: 25, youtube: 6 },
];

export const mockSentimentData = [
  { name: 'Positive', value: 38, color: '#22c55e' },
  { name: 'Neutral', value: 45, color: '#eab308' },
  { name: 'Negative', value: 17, color: '#ef4444' },
];

export const mockKeywordStats = [
  { keyword: 'aggrestat', mentions: 156, sentiment: 0.72, trend: '+23%' },
  { keyword: 'brand24 alternative', mentions: 342, sentiment: -0.15, trend: '+45%' },
  { keyword: 'social listening tool', mentions: 289, sentiment: 0.31, trend: '+12%' },
  { keyword: 'mention monitoring', mentions: 60, sentiment: 0.08, trend: '-5%' },
];
