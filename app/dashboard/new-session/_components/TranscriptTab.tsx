import React from 'react';
import { AudioLines, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TranscriptTabProps {
  onStartRecording?: () => void;
}

export default function TranscriptTab({ onStartRecording }: TranscriptTabProps = {}) {
  return (
     <div className="w-full max-w-md mx-auto space-y-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
        <AudioLines className="h-8 w-8 text-slate-600" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-800">Transcription not started  </h3>
        <p className="text-slate-600">
        Your transcription will appear here in increments during your session
        </p>
      </div>

      <Card className="p-4 bg-white border border-slate-200 shadow-sm">
        <div className="space-y-3">
          <Button 
            variant="default" 
            className="w-full h-11"
            onClick={() => {
              if (onStartRecording) {
                onStartRecording();
              } else {
                console.log('Start transcribing clicked - use the Start button in the header above');
              }
            }}
          >
            <Mic className="h-4 w-4 mr-2" />
            Start transcribing
          </Button>
          <p className="text-xs text-slate-500 text-center">
            Use the "Start" button in the header above to begin recording
          </p>
        </div>
      </Card>
    </div>
  );
}
