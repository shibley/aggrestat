import { RawMention } from '@/types';

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: { title: string; channelTitle: string; publishedAt: string };
}

interface YouTubeComment {
  id: string;
  snippet: {
    topLevelComment: {
      id: string;
      snippet: {
        textDisplay: string;
        authorDisplayName: string;
        publishedAt: string;
        videoId: string;
      };
    };
  };
}

export async function fetchYouTubeMentions(keyword: string, limit = 25): Promise<RawMention[]> {
  const mentions: RawMention[] = [];

  if (!process.env.YOUTUBE_API_KEY) {
    console.warn('YOUTUBE_API_KEY not set — skipping YouTube fetch');
    return mentions;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const baseUrl = 'https://www.googleapis.com/youtube/v3';

  try {
    // Search for recent videos mentioning the keyword
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const searchUrl = `${baseUrl}/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&order=date&maxResults=10&publishedAfter=${oneWeekAgo.toISOString()}&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);

    if (!searchRes.ok) {
      console.error(`YouTube search error: ${searchRes.status}`);
      return mentions;
    }

    const searchData = await searchRes.json();
    const videos: YouTubeSearchItem[] = searchData.items || [];

    // Fetch comments for each video
    for (const video of videos.slice(0, 5)) {
      try {
        const commentsUrl = `${baseUrl}/commentThreads?part=snippet&videoId=${video.id.videoId}&order=relevance&maxResults=${Math.min(limit, 20)}&key=${apiKey}`;
        const commentsRes = await fetch(commentsUrl);

        if (!commentsRes.ok) continue;

        const commentsData = await commentsRes.json();
        const comments: YouTubeComment[] = commentsData.items || [];

        for (const comment of comments) {
          const snippet = comment.snippet.topLevelComment.snippet;

          // Only include if the comment text contains the keyword
          if (!snippet.textDisplay.toLowerCase().includes(keyword.toLowerCase())) continue;

          mentions.push({
            text: snippet.textDisplay.slice(0, 2000),
            url: `https://youtube.com/watch?v=${snippet.videoId}&lc=${comment.id}`,
            author: snippet.authorDisplayName,
            posted_at: snippet.publishedAt,
            source: 'youtube',
          });
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    console.error(`YouTube fetch error for "${keyword}":`, error);
  }

  return mentions.slice(0, limit);
}
