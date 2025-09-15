import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, ChevronDown } from 'lucide-react';

export default function Footer() {
  return (
    <div className="border-t bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Ask DocScrib to do anything..."
          className="flex-1 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
        />
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-600">
          <Mic className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-600">
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
