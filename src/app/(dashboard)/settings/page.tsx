'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, User, Shield, Zap } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and subscription</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-500" />
            <div>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input value="founder@example.com" disabled className="mt-1 bg-slate-50" />
            </div>
            <div>
              <Label>Plan</Label>
              <div className="mt-1 flex items-center gap-2">
                <Badge className="bg-violet-100 text-violet-700">Starter — $29/mo</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">Update Email</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-slate-500" />
            <div>
              <CardTitle className="text-base">Subscription & Billing</CardTitle>
              <CardDescription>Manage your plan and payment method</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-600" /> Starter Plan
                </h4>
                <p className="text-sm text-slate-500 mt-1">10 keywords • 10,000 mentions/mo • Slack + email alerts</p>
              </div>
              <span className="text-2xl font-bold text-slate-900">$29<span className="text-sm font-normal text-slate-500">/mo</span></span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-violet-600 hover:bg-violet-700">Upgrade to Growth ($59/mo)</Button>
            <Button variant="outline" className="text-red-500 hover:text-red-600">Cancel Subscription</Button>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-slate-700 mb-2">Usage This Month</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-slate-500">Keywords</p>
                <p className="text-lg font-semibold text-slate-900">4 / 10</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-slate-500">Mentions Processed</p>
                <p className="text-lg font-semibold text-slate-900">847 / 10,000</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-500" />
            <div>
              <CardTitle className="text-base">Security</CardTitle>
              <CardDescription>Password and account security</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
