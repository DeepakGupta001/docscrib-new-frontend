import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Mic,
  Clock,
  MoreVertical,
  ChevronDown,
  Trash2,
} from 'lucide-react';

export default function Header() {
  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-800">Add patient details</h1>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="font-medium">Today 02:58pm</span>
          <span>English</span>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            14 days
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="default" className="shadow-sm">
          <Mic className="h-4 w-4 mr-2" />
          Start transcribing
          <ChevronDown className="h-3 w-3 ml-2" />
        </Button>
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border">
          <Clock className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-mono text-slate-700">00:00</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1 h-3 bg-slate-500 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-500">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
