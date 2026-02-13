'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, TrendingUp, AlertTriangle, Target } from 'lucide-react';

const stats = [
  { label: 'Total Mentions', value: '847', change: '+23%', icon: MessageSquare, color: 'text-violet-600', bg: 'bg-violet-100' },
  { label: 'Buying Intent', value: '24', change: '+8', icon: Target, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Negative', value: '12', change: '-3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  { label: 'Avg Relevance', value: '82', change: '+5', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change} this week</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
