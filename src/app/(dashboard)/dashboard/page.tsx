import { StatCards } from '@/components/dashboard/stat-cards';
import { MentionsChart } from '@/components/dashboard/mentions-chart';
import { SentimentPie } from '@/components/dashboard/sentiment-pie';
import { MentionsTable } from '@/components/dashboard/mentions-table';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-500 mt-1">Monitor your brand mentions across Reddit, Twitter, and YouTube</p>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MentionsChart />
        </div>
        <div>
          <SentimentPie />
        </div>
      </div>

      <MentionsTable limit={5} />
    </div>
  );
}
