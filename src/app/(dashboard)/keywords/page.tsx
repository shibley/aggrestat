'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { mockKeywords, mockKeywordStats } from '@/lib/mock-data';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState(mockKeywords);
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    setKeywords([...keywords, {
      id: `kw-${Date.now()}`,
      user_id: 'mock-user-1',
      keyword: newKeyword.trim().toLowerCase(),
      enabled: true,
      created_at: new Date().toISOString(),
    }]);
    setNewKeyword('');
  };

  const toggleKeyword = (id: string) => {
    setKeywords(keywords.map(k => k.id === id ? { ...k, enabled: !k.enabled } : k));
  };

  const deleteKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Keywords</h1>
        <p className="text-slate-500 mt-1">Manage the keywords you&apos;re tracking across all platforms</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Keyword</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter a keyword or phrase to track..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
              className="flex-1"
            />
            <Button onClick={addKeyword} className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" /> Add Keyword
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Using 4 of 10 keywords (Starter plan)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="w-[120px]">Mentions (7d)</TableHead>
                <TableHead className="w-[120px]">Avg Sentiment</TableHead>
                <TableHead className="w-[100px]">Trend</TableHead>
                <TableHead className="w-[80px]">Active</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((keyword) => {
                const stats = mockKeywordStats.find(s => s.keyword === keyword.keyword);
                const trendUp = stats?.trend?.startsWith('+');
                return (
                  <TableRow key={keyword.id}>
                    <TableCell>
                      <span className="font-medium text-slate-900">{keyword.keyword}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{stats?.mentions || 0}</span>
                    </TableCell>
                    <TableCell>
                      {stats && (
                        <Badge variant="secondary" className={
                          stats.sentiment > 0.3 ? 'bg-green-100 text-green-700' :
                          stats.sentiment < -0.1 ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }>
                          {stats.sentiment > 0 ? '+' : ''}{stats.sentiment.toFixed(2)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {stats && (
                        <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
                          {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {stats.trend}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch checked={keyword.enabled} onCheckedChange={() => toggleKeyword(keyword.id)} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => deleteKeyword(keyword.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
