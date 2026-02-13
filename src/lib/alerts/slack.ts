import { Mention, Keyword } from '@/types';

interface SlackBlock {
  type: string;
  text?: { type: string; text: string };
  fields?: { type: string; text: string }[];
  elements?: { type: string; text?: { type: string; text: string }; url?: string; style?: string }[];
}

export async function sendSlackAlert(
  webhookUrl: string,
  mention: Mention,
  keyword: Keyword
): Promise<boolean> {
  const sentimentEmoji =
    mention.sentiment === 'positive' ? '🟢' :
    mention.sentiment === 'negative' ? '🔴' : '🟡';

  const intentLabel = mention.buying_intent ? '🎯 Buying Intent Detected' : '';
  const sourceLabel = mention.source.charAt(0).toUpperCase() + mention.source.slice(1);

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${sentimentEmoji} New ${sourceLabel} mention: "${keyword.keyword}"`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${mention.text.slice(0, 500)}*${mention.text.length > 500 ? '...' : ''}`,
      },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Source:* ${sourceLabel}` },
        { type: 'mrkdwn', text: `*Author:* ${mention.author || 'Unknown'}` },
        { type: 'mrkdwn', text: `*Relevance:* ${mention.relevance_score}/100` },
        { type: 'mrkdwn', text: `*Sentiment:* ${sentimentEmoji} ${mention.sentiment}` },
        ...(intentLabel ? [{ type: 'mrkdwn' as const, text: intentLabel }] : []),
      ],
    },
  ];

  if (mention.url) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'View Mention' },
          url: mention.url,
          style: 'primary',
        },
      ],
    });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `New ${sourceLabel} mention for "${keyword.keyword}" (relevance: ${mention.relevance_score}/100)`,
        blocks,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Slack alert error:', error);
    return false;
  }
}
