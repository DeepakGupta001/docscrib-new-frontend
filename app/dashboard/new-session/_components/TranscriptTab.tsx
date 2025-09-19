import React from "react";
import { AudioLines } from "lucide-react";
import { useRealtimeTranscription } from "./use-realtime-transcription";
import RecordingPlayer from "./RecordingPlayer";
import { useAudioRecording } from "./use-audio-recording";

interface TranscriptTabProps {
  onStartRecording?: () => void;
}

export default function TranscriptTab({ onStartRecording }: TranscriptTabProps = {}) {
  const [isRecording, setIsRecording] = React.useState(false);
  const { transcript } = useRealtimeTranscription(isRecording);
  const { error, audioBlob } = useAudioRecording({ isRecording, isPaused: false });

  const handleToggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  return (
    <div className="m-0 h-full w-full">
      <textarea
        rows={18}
        className="h-full w-full rounded-md border border-slate-300 p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Your transcription will appear here..., it can be edited after the recording is complete."
        value={transcript}
        readOnly
      />
    </div>
  );
}
