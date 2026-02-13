import { RawMention } from '@/types';

interface GrokSearchResult {
  id: string;
  text: string;
  author?: { username: string };
  created_at?: string;
}

export async function fetchTwitterMentions(keyword: string, limit = 25): Promise<RawMention[]> {
  const mentions: RawMention[] = [];

  if (!process.env.XAI_API_KEY) {
    console.warn('XAI_API_KEY not set — skipping Twitter fetch');
    return mentions;
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: `You are a Twitter/X search assistant. Search for recent tweets about the given keyword. Return a JSON array of tweets with fields: text, author, url, posted_at (ISO string). Return up to ${limit} results. Only return the JSON array, nothing else.`,
          },
          {
            role: 'user',
            content: `Find recent tweets (last 7 days) mentioning "${keyword}". Return JSON array.`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
      }),
    });

    if (!response.ok) {
      console.error(`xAI API error: ${response.status} ${response.statusText}`);
      return mentions;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      const parsed = JSON.parse(content);
      const tweets = Array.isArray(parsed) ? parsed : parsed.tweets || parsed.results || [];

      for (const tweet of tweets.slice(0, limit)) {
        mentions.push({
          text: (tweet.text || '').slice(0, 2000),
          url: tweet.url || `https://x.com/search?q=${encodeURIComponent(keyword)}`,
          author: tweet.author ? `@${tweet.author}` : 'unknown',
          posted_at: tweet.posted_at || new Date().toISOString(),
          source: 'twitter',
        });
      }
    }
  } catch (error) {
    console.error(`Twitter fetch error for "${keyword}":`, error);
  }

  return mentions;
}
