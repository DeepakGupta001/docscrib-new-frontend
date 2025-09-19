"use client";

import React, { useEffect, useRef, useState } from "react";

interface RecordingPlayerProps {
  audioBlob?: Blob | null;
}

export default function RecordingPlayer({ audioBlob }: RecordingPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioBlob]);

  if (!audioBlob) {
    return <p className="text-sm text-gray-500">No recording available</p>;
  }

  return (
    <div className="mt-4">
      <audio ref={audioRef} controls src={audioUrl || undefined} className="w-full" />
    </div>
  );
}
