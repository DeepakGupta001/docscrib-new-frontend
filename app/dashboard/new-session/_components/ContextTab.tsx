import React from 'react';
import { Settings } from 'lucide-react';

export default function ContextTab() {
  return (
     <div className="h-full w-full m-0">
      <textarea
       rows={15} 
        className="h-full w-full rounded-md border border-slate-300 p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Add any additional context about the patient past conversations, medical history, or specific details you want to highlight."
      />
    </div>
  );
}
