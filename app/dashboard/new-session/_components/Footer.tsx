import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, SendHorizontal, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <div className="border-t bg-white px-4 md:px-6 py-4 shadow-sm">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex-1 relative">
          {/* Sparkles Icon inside input (left aligned) */}
          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Ask DocScrib to do anything..."
            className="w-full border-slate-200 focus:border-slate-500 focus:ring-slate-500 pr-12 pl-9 text-sm md:text-base"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="text-slate-500 hover:text-slate-600 hover:bg-slate-50 border-slate-200 h-10 w-10 md:h-11 md:w-11 shrink-0"
        >
          <Mic className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        <Button
          variant="default"
          size="icon"
          className="bg-slate-900 hover:bg-slate-800 text-white h-10 w-10 md:h-11 md:w-11 shrink-0"
        >
          <SendHorizontal className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </div>
  );
}
