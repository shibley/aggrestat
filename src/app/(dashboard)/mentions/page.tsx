'use client';

import { useState } from 'react';
import { MentionsTable } from '@/components/dashboard/mentions-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockMentions } from '@/lib/mock-data';
import { Source, Sentiment } from '@/types';

const sourceFilters: (Source | 'all')[] = ['all', 'reddit', 'twitter', 'youtube'];
const sentimentFilters: (Sentiment | 'all')[] = ['all', 'positive', 'neutral', 'negative'];

export default function MentionsPage() {
  const [sourceFilter, setSourceFilter] = useState<Source | 'all'>('all');
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | 'all'>('all');
  const [intentOnly, setIntentOnly] = useState(false);

  const filtered = mockMentions.filter((m) => {
    if (sourceFilter !== 'all' && m.source !== sourceFilter) return false;
    if (sentimentFilter !== 'all' && m.sentiment !== sentimentFilter) return false;
    if (intentOnly && !m.buying_intent) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Mentions</h1>
        <p className="text-slate-500 mt-1">{filtered.length} mentions found</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {sourceFilters.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={sourceFilter === s ? 'default' : 'ghost'}
              className={sourceFilter === s ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}
              onClick={() => setSourceFilter(s)}
            >
              {s === 'all' ? 'All Sources' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {sentimentFilters.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={sentimentFilter === s ? 'default' : 'ghost'}
              className={sentimentFilter === s ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}
              onClick={() => setSentimentFilter(s)}
            >
              {s === 'all' ? 'All Sentiment' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>

        <Button
          size="sm"
          variant={intentOnly ? 'default' : 'outline'}
          className={intentOnly ? 'bg-violet-600 hover:bg-violet-700' : ''}
          onClick={() => setIntentOnly(!intentOnly)}
        >
          🎯 Buying Intent Only
        </Button>
      </div>

      <MentionsTable mentions={filtered} />
    </div>
  );
}
