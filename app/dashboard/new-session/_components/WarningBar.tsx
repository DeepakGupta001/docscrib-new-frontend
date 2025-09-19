import React from 'react';

export default function WarningBar() {
  return (
    <div className="w-full flex justify-end">
      <div className="flex gap-x-2 text-yellow-800 px-4 py-2 rounded">
        <p className="font-semibold">Important:</p>
        <p>
          Review your note before use to ensure it accurately represents the visit.
        </p>
      </div>
    </div>
  );
}
