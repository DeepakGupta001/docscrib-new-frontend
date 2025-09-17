import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Mic } from 'lucide-react';

export default function NoteTab() {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
        <Mic className="h-8 w-8 text-slate-600" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-800">Ready to start your session</h3>
        <p className="text-slate-600">
          Your note will appear here once your session is complete
        </p>
      </div>

      <Card className="p-4 bg-white border border-slate-200 shadow-sm">
        <div className="space-y-3">
          <Button variant="default" className="w-full h-11">
            <Play className="h-4 w-4 mr-2" />
            Start transcribing
          </Button>
          <p className="text-xs text-slate-500 text-center">
            Select your visit mode in the dropdown above
          </p>
        </div>
      </Card>
    </div>
  );
}
