'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slack, Mail, Bell, CheckCircle2 } from 'lucide-react';

export default function AlertsPage() {
  const [slackEnabled, setSlackEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00.../B00.../XXX');
  const [minRelevance, setMinRelevance] = useState('70');
  const [emailFreq, setEmailFreq] = useState('daily');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Alert Configuration</h1>
        <p className="text-slate-500 mt-1">Choose how and when you get notified about mentions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Slack className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <CardTitle className="text-base">Slack Alerts</CardTitle>
                  <CardDescription>Real-time alerts in your Slack workspace</CardDescription>
                </div>
              </div>
              <Switch checked={slackEnabled} onCheckedChange={setSlackEnabled} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="webhook">Webhook URL</Label>
              <Input
                id="webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Minimum Relevance Score</Label>
              <div className="flex items-center gap-3 mt-1">
                <Input
                  type="number"
                  value={minRelevance}
                  onChange={(e) => setMinRelevance(e.target.value)}
                  className="w-24"
                  min={0}
                  max={100}
                />
                <span className="text-sm text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-normal">Alert on negative sentiment</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal">Alert on buying intent</Label>
                <Switch defaultChecked />
              </div>
            </div>
            {slackEnabled && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Connected and active
              </div>
            )}
            <Button className="w-full bg-violet-600 hover:bg-violet-700">Test Slack Alert</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <CardTitle className="text-base">Email Digest</CardTitle>
                  <CardDescription>Periodic summary of your mentions</CardDescription>
                </div>
              </div>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Digest Frequency</Label>
              <Select value={emailFreq} onValueChange={setEmailFreq}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time (every mention)</SelectItem>
                  <SelectItem value="daily">Daily digest</SelectItem>
                  <SelectItem value="weekly">Weekly digest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Send to</Label>
              <Input value="founder@example.com" disabled className="mt-1 bg-slate-50" />
              <p className="text-xs text-slate-400 mt-1">Uses your account email</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-normal">Include negative mentions</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal">Include buying intent</Label>
                <Switch defaultChecked />
              </div>
            </div>
            {emailEnabled && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Next digest: Tomorrow 9:00 AM
              </div>
            )}
            <Button variant="outline" className="w-full">Send Test Digest</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Alert History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'slack', keyword: 'aggrestat', time: '2 min ago', reason: 'High relevance (95)' },
              { type: 'slack', keyword: 'brand24 alternative', time: '15 min ago', reason: 'Buying intent detected' },
              { type: 'email', keyword: 'All keywords', time: '8 hours ago', reason: 'Daily digest (23 mentions)' },
              { type: 'slack', keyword: 'social listening tool', time: '12 hours ago', reason: 'Negative sentiment' },
            ].map((alert, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                {alert.type === 'slack' ? <Slack className="w-4 h-4 text-purple-600" /> : <Mail className="w-4 h-4 text-blue-600" />}
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-700">{alert.keyword}</span>
                  <span className="text-sm text-slate-400 ml-2">— {alert.reason}</span>
                </div>
                <span className="text-xs text-slate-400">{alert.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
