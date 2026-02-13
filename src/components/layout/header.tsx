'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-500" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-violet-600">3</Badge>
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-violet-100 text-violet-700 text-sm font-medium">SB</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
