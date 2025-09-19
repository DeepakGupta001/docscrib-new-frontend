import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WarningBar() {
  return (
    <div className="flex gap-x-2 w-full bg-white p-3 shadow-sm">
      <p className="font-semibold text-slate-800">Important:</p>
      <p className="text-slate-600">
        Review your note before use to ensure it accurately represents the visit.
      </p>
    </div>
  );
}
