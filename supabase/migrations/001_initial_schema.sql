-- Aggrestat Database Schema
-- Run this in Supabase SQL Editor

-- Profiles table (extends Supabase Auth)
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

-- Keywords to track
create table public.keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  keyword text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- Mentions found across platforms
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

-- Alert configurations
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
create index idx_mentions_source on public.mentions(source);
create index idx_keywords_user_id on public.keywords(user_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.keywords enable row level security;
alter table public.mentions enable row level security;
alter table public.alert_configs enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Keywords policies
create policy "Users can view own keywords" on public.keywords
  for select using (auth.uid() = user_id);
create policy "Users can insert own keywords" on public.keywords
  for insert with check (auth.uid() = user_id);
create policy "Users can update own keywords" on public.keywords
  for update using (auth.uid() = user_id);
create policy "Users can delete own keywords" on public.keywords
  for delete using (auth.uid() = user_id);

-- Mentions policies
create policy "Users can view own mentions" on public.mentions
  for select using (auth.uid() = user_id);

-- Alert configs policies
create policy "Users can view own alerts" on public.alert_configs
  for select using (auth.uid() = user_id);
create policy "Users can insert own alerts" on public.alert_configs
  for insert with check (auth.uid() = user_id);
create policy "Users can update own alerts" on public.alert_configs
  for update using (auth.uid() = user_id);
create policy "Users can delete own alerts" on public.alert_configs
  for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Monthly mention counter reset (run via pg_cron or Vercel cron)
create or replace function public.reset_monthly_mentions()
returns void as $$
begin
  update public.profiles
  set mentions_this_month = 0,
      mentions_reset_at = now()
  where mentions_reset_at < now() - interval '30 days';
end;
$$ language plpgsql security definer;
