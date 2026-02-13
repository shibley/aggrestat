import { RawMention } from '@/types';

interface RedditPost {
  data: {
    title: string;
    selftext: string;
    author: string;
    permalink: string;
    created_utc: number;
    subreddit: string;
  };
}

interface RedditComment {
  data: {
    body: string;
    author: string;
    permalink: string;
    created_utc: number;
    subreddit: string;
  };
}

export async function fetchRedditMentions(keyword: string, limit = 25): Promise<RawMention[]> {
  const mentions: RawMention[] = [];

  try {
    // Search posts
    const postsUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&t=week&limit=${limit}`;
    const postsRes = await fetch(postsUrl, {
      headers: { 'User-Agent': 'Aggrestat/1.0' },
    });

    if (postsRes.ok) {
      const postsData = await postsRes.json();
      const posts: RedditPost[] = postsData?.data?.children || [];

      for (const post of posts) {
        const text = post.data.selftext
          ? `${post.data.title}\n\n${post.data.selftext}`
          : post.data.title;

        mentions.push({
          text: text.slice(0, 2000),
          url: `https://reddit.com${post.data.permalink}`,
          author: `u/${post.data.author}`,
          posted_at: new Date(post.data.created_utc * 1000).toISOString(),
          source: 'reddit',
        });
      }
    }

    // Search comments
    const commentsUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&t=week&type=comment&limit=${limit}`;
    const commentsRes = await fetch(commentsUrl, {
      headers: { 'User-Agent': 'Aggrestat/1.0' },
    });

    if (commentsRes.ok) {
      const commentsData = await commentsRes.json();
      const comments: RedditComment[] = commentsData?.data?.children || [];

      for (const comment of comments) {
        mentions.push({
          text: comment.data.body.slice(0, 2000),
          url: `https://reddit.com${comment.data.permalink}`,
          author: `u/${comment.data.author}`,
          posted_at: new Date(comment.data.created_utc * 1000).toISOString(),
          source: 'reddit',
        });
      }
    }
  } catch (error) {
    console.error(`Reddit fetch error for "${keyword}":`, error);
  }

  return mentions;
}
