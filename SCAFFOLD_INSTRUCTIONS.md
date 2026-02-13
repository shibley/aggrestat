# Aggrestat — Project Scaffold Instructions

## What to Build
Scaffold a Next.js 14+ app with Supabase for "Aggrestat" — an affordable social listening tool.

## Tech Stack
- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Database/Auth:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Styling:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts
- **Payments:** Stripe
- **Email:** Resend
- **Deployment:** Vercel

## Project Structure
```
aggrestat/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx      # Login
│   │   │   └── signup/page.tsx     # Signup
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   │   ├── dashboard/page.tsx  # Main dashboard (mentions overview)
│   │   │   ├── keywords/page.tsx   # Manage keywords
│   │   │   ├── mentions/page.tsx   # Browse all mentions
│   │   │   ├── alerts/page.tsx     # Configure alerts (Slack/email)
│   │   │   └── settings/page.tsx   # Account & billing
│   │   └── api/
│   │       ├── cron/
│   │       │   └── fetch-mentions/route.ts  # Vercel cron endpoint
│   │       ├── webhooks/
│   │       │   └── stripe/route.ts          # Stripe webhook
│   │       ├── mentions/route.ts            # GET mentions
│   │       └── keywords/route.ts            # CRUD keywords
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client
│   │   │   └── middleware.ts       # Auth middleware
│   │   ├── fetchers/
│   │   │   ├── reddit.ts           # Reddit public JSON API
│   │   │   ├── twitter.ts          # xAI API for X/Twitter search
│   │   │   └── youtube.ts          # YouTube Data API v3
│   │   ├── ai/
│   │   │   └── analyze.ts          # OpenAI relevance + sentiment scoring
│   │   ├── alerts/
│   │   │   ├── slack.ts            # Slack webhook delivery
│   │   │   └── email.ts            # Resend email digest
│   │   ├── stripe.ts               # Stripe helpers
│   │   └── utils.ts                # Shared utilities
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── dashboard/
│   │   │   ├── mentions-chart.tsx   # Mentions over time
│   │   │   ├── sentiment-pie.tsx    # Sentiment breakdown
│   │   │   ├── mentions-table.tsx   # Recent mentions
│   │   │   └── keyword-card.tsx     # Keyword stats
│   │   ├── landing/
│   │   │   ├── hero.tsx
│   │   │   ├── pricing.tsx
│   │   │   └── features.tsx
│   │   └── layout/
│   │       ├── sidebar.tsx
│   │       └── header.tsx
│   └── types/
│       └── index.ts                # TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
├── vercel.json                      # Cron config
├── .env.example                     # Required env vars
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Database Schema (Supabase Migration)
```sql
-- Users are managed by Supabase Auth, but we need a profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  plan text not null default 'free' check (plan in ('free', 'starter', 'growth')),
  stripe_customer_id text,
  stripe_subscription_id text,
  mentions_this_month integer not null default 0,
  mentions_reset_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  keyword text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.mentions (
  id uuid primary key default gen_random_uuid(),
  keyword_id uuid references public.keywords(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  source text not null check (source in ('reddit', 'twitter', 'youtube', 'web')),
  text text not null,
  url text,
  author text,
  posted_at timestamptz,
  relevance_score integer default 0,
  sentiment text check (sentiment in ('positive', 'negative', 'neutral')),
  buying_intent boolean default false,
  alerted boolean default false,
  created_at timestamptz not null default now()
);

create table public.alert_configs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  channel text not null check (channel in ('slack', 'email')),
  slack_webhook_url text,
  email_frequency text default 'daily' check (email_frequency in ('realtime', 'daily', 'weekly')),
  min_relevance integer default 70,
  notify_negative boolean default true,
  notify_buying_intent boolean default true,
  enabled boolean default true,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_mentions_user_id on public.mentions(user_id);
create index idx_mentions_keyword_id on public.mentions(keyword_id);
create index idx_mentions_created_at on public.mentions(created_at desc);
create index idx_keywords_user_id on public.keywords(user_id);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.keywords enable row level security;
alter table public.mentions enable row level security;
alter table public.alert_configs enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own keywords" on public.keywords for select using (auth.uid() = user_id);
create policy "Users can insert own keywords" on public.keywords for insert with check (auth.uid() = user_id);
create policy "Users can update own keywords" on public.keywords for update using (auth.uid() = user_id);
create policy "Users can delete own keywords" on public.keywords for delete using (auth.uid() = user_id);
create policy "Users can view own mentions" on public.mentions for select using (auth.uid() = user_id);
create policy "Users can view own alert configs" on public.alert_configs for select using (auth.uid() = user_id);
create policy "Users can manage own alert configs" on public.alert_configs for all using (auth.uid() = user_id);
```

## Vercel Cron Config
```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-mentions",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

## .env.example
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
XAI_API_KEY=
YOUTUBE_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
CRON_SECRET=
```

## Key Implementation Notes
1. Landing page should be clean, modern, with hero + features + pricing sections
2. Dashboard uses Supabase realtime subscriptions for live mention updates
3. Cron endpoint is protected by CRON_SECRET header verification
4. Stripe webhook handles subscription created/updated/deleted
5. AI analysis uses gpt-4o-mini for cost efficiency (batch analyze mentions)
6. Reddit fetcher uses public JSON API (no auth needed): https://www.reddit.com/search.json?q=keyword&sort=new&t=week
7. Twitter/X fetcher uses xAI Grok API
8. Plan limits: free=3 keywords/500 mentions, starter=10/10K, growth=20/25K
