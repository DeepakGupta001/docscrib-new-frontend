import React from 'react';
import { Settings } from 'lucide-react';

export default function ContextTab() {
  return (
    <div className="text-center space-y-4 max-w-md mx-auto">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
        <Settings className="h-6 w-6 text-slate-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-slate-700">Context information</h3>
        <p className="text-slate-500">Patient context and session details will appear here</p>
      </div>
    </div>
  );
}
