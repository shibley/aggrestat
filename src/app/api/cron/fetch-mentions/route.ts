import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { fetchRedditMentions } from '@/lib/fetchers/reddit';
import { fetchTwitterMentions } from '@/lib/fetchers/twitter';
import { fetchYouTubeMentions } from '@/lib/fetchers/youtube';
import { analyzeBatch } from '@/lib/ai/analyze';
import { sendSlackAlert } from '@/lib/alerts/slack';
import { PLAN_LIMITS, RawMention, Keyword, AlertConfig } from '@/types';

export const maxDuration = 300; // 5 min max for Vercel Pro

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const stats = { users: 0, keywords: 0, mentions: 0, alerts: 0 };

  try {
    // Get all users with their keywords
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*');

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ message: 'No users to process', stats });
    }

    for (const profile of profiles) {
      // Check mention limits
      const limit = PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS];
      if (profile.mentions_this_month >= limit.mentions) continue;

      // Get user's enabled keywords
      const { data: keywords } = await supabase
        .from('keywords')
        .select('*')
        .eq('user_id', profile.id)
        .eq('enabled', true);

      if (!keywords || keywords.length === 0) continue;
      stats.users++;

      // Get user's alert configs
      const { data: alertConfigs } = await supabase
        .from('alert_configs')
        .select('*')
        .eq('user_id', profile.id)
        .eq('enabled', true);

      for (const keyword of keywords) {
        stats.keywords++;

        // Fetch from all sources
        const [redditMentions, twitterMentions, youtubeMentions] = await Promise.allSettled([
          fetchRedditMentions(keyword.keyword),
          fetchTwitterMentions(keyword.keyword),
          fetchYouTubeMentions(keyword.keyword),
        ]);

        const allRaw: RawMention[] = [
          ...(redditMentions.status === 'fulfilled' ? redditMentions.value : []),
          ...(twitterMentions.status === 'fulfilled' ? twitterMentions.value : []),
          ...(youtubeMentions.status === 'fulfilled' ? youtubeMentions.value : []),
        ];

        if (allRaw.length === 0) continue;

        // Deduplicate by URL
        const { data: existing } = await supabase
          .from('mentions')
          .select('url')
          .eq('keyword_id', keyword.id)
          .in('url', allRaw.map((m) => m.url).filter(Boolean));

        const existingUrls = new Set((existing || []).map((m: { url: string }) => m.url));
        const newMentions = allRaw.filter((m) => m.url && !existingUrls.has(m.url));

        if (newMentions.length === 0) continue;

        // AI analysis
        const analyses = await analyzeBatch(newMentions, keyword.keyword);

        // Insert mentions
        const mentionsToInsert = newMentions.map((mention, i) => ({
          keyword_id: keyword.id,
          user_id: profile.id,
          source: mention.source,
          text: mention.text,
          url: mention.url,
          author: mention.author,
          posted_at: mention.posted_at,
          relevance_score: analyses[i].relevance_score,
          sentiment: analyses[i].sentiment,
          buying_intent: analyses[i].buying_intent,
          alerted: false,
        }));

        const { data: inserted } = await supabase
          .from('mentions')
          .insert(mentionsToInsert)
          .select();

        if (inserted) {
          stats.mentions += inserted.length;

          // Update mention count
          await supabase
            .from('profiles')
            .update({
              mentions_this_month: profile.mentions_this_month + inserted.length,
            })
            .eq('id', profile.id);

          // Send alerts for high-priority mentions
          if (alertConfigs) {
            for (const mention of inserted) {
              for (const config of alertConfigs as AlertConfig[]) {
                if (mention.relevance_score < config.min_relevance) continue;
                if (config.notify_negative && mention.sentiment !== 'negative' && !mention.buying_intent) continue;
                if (config.notify_buying_intent && !mention.buying_intent && mention.sentiment !== 'negative') continue;

                if (config.channel === 'slack' && config.slack_webhook_url) {
                  const sent = await sendSlackAlert(config.slack_webhook_url, mention, keyword as Keyword);
                  if (sent) {
                    stats.alerts++;
                    await supabase
                      .from('mentions')
                      .update({ alerted: true })
                      .eq('id', mention.id);
                  }
                }
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ message: 'Cron complete', stats });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Cron failed', details: String(error) }, { status: 500 });
  }
}
