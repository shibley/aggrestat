'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink, Target } from 'lucide-react';
import { mockMentions, mockKeywords } from '@/lib/mock-data';
import { Mention } from '@/types';

function SourceBadge({ source }: { source: string }) {
  const styles: Record<string, string> = {
    reddit: 'bg-orange-100 text-orange-700 border-orange-200',
    twitter: 'bg-blue-100 text-blue-700 border-blue-200',
    youtube: 'bg-red-100 text-red-700 border-red-200',
    web: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return <Badge variant="outline" className={styles[source] || styles.web}>{source}</Badge>;
}

function SentimentBadge({ sentiment }: { sentiment: string | null }) {
  if (!sentiment) return null;
  const styles: Record<string, string> = {
    positive: 'bg-green-100 text-green-700',
    negative: 'bg-red-100 text-red-700',
    neutral: 'bg-yellow-100 text-yellow-700',
  };
  return <Badge className={styles[sentiment] || ''} variant="secondary">{sentiment}</Badge>;
}

export function MentionsTable({ mentions = mockMentions, limit }: { mentions?: Mention[]; limit?: number }) {
  const displayed = limit ? mentions.slice(0, limit) : mentions;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Recent Mentions</CardTitle>
        {limit && <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700">View all →</Button>}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Source</TableHead>
              <TableHead>Mention</TableHead>
              <TableHead className="w-[100px]">Keyword</TableHead>
              <TableHead className="w-[100px]">Relevance</TableHead>
              <TableHead className="w-[100px]">Sentiment</TableHead>
              <TableHead className="w-[80px]">Intent</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.map((mention) => {
              const keyword = mockKeywords.find((k) => k.id === mention.keyword_id);
              return (
                <TableRow key={mention.id}>
                  <TableCell><SourceBadge source={mention.source} /></TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-700 line-clamp-2">{mention.text}</p>
                    <p className="text-xs text-slate-400 mt-1">by {mention.author} • {new Date(mention.posted_at || '').toLocaleDateString()}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{keyword?.keyword}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-100 rounded-full h-2 max-w-[60px]">
                        <div
                          className={`h-2 rounded-full ${mention.relevance_score >= 80 ? 'bg-green-500' : mention.relevance_score >= 60 ? 'bg-yellow-500' : 'bg-slate-400'}`}
                          style={{ width: `${mention.relevance_score}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{mention.relevance_score}</span>
                    </div>
                  </TableCell>
                  <TableCell><SentimentBadge sentiment={mention.sentiment} /></TableCell>
                  <TableCell>
                    {mention.buying_intent && (
                      <Badge className="bg-violet-100 text-violet-700"><Target className="w-3 h-3 mr-1" />Buy</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {mention.url && (
                      <a href={mention.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                        </Button>
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
