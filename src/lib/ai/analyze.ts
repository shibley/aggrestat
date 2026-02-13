import OpenAI from 'openai';
import { AnalysisResult, RawMention } from '@/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeMention(
  mention: RawMention,
  keyword: string,
  productContext?: string
): Promise<AnalysisResult> {
  try {
    const prompt = `Analyze this social media mention for a product/brand monitoring tool.

Keyword being tracked: "${keyword}"
${productContext ? `Product context: ${productContext}` : ''}
Source: ${mention.source}
Author: ${mention.author}

Mention text:
"${mention.text.slice(0, 1500)}"

Respond with JSON only:
{
  "relevance_score": <0-100, how relevant is this to the tracked keyword/brand? 0=completely unrelated, 100=directly about it>,
  "sentiment": "<positive|negative|neutral>",
  "buying_intent": <true if the person is looking to buy/use/switch to a product like this, false otherwise>,
  "summary": "<1 sentence summary of what this mention is about>"
}

Key rules:
- relevance_score should be LOW if the keyword appears but in a different context (e.g., "apple" the fruit vs Apple the company)
- buying_intent is TRUE when someone says things like "looking for", "need a tool", "anyone recommend", "thinking of switching to"
- Be accurate with sentiment - complaints are negative, praise is positive, questions/neutral statements are neutral`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You analyze social media mentions for relevance, sentiment, and buying intent. Respond only with valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response from OpenAI');

    const result = JSON.parse(content);

    return {
      relevance_score: Math.min(100, Math.max(0, result.relevance_score || 0)),
      sentiment: result.sentiment || 'neutral',
      buying_intent: result.buying_intent || false,
      summary: result.summary || '',
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      relevance_score: 50,
      sentiment: 'neutral',
      buying_intent: false,
      summary: 'Analysis failed — manual review needed',
    };
  }
}

export async function analyzeBatch(
  mentions: RawMention[],
  keyword: string,
  productContext?: string
): Promise<AnalysisResult[]> {
  // Process in parallel with concurrency limit
  const BATCH_SIZE = 5;
  const results: AnalysisResult[] = [];

  for (let i = 0; i < mentions.length; i += BATCH_SIZE) {
    const batch = mentions.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map((mention) => analyzeMention(mention, keyword, productContext))
    );
    results.push(...batchResults);
  }

  return results;
}
