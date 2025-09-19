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
    <div className="h-full w-full m-0">
      <div className="mb-2 flex items-center gap-2">
        <button
          onClick={handleToggleRecording}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
      <textarea
        rows={10}
        className="h-48 w-full rounded-md border border-slate-300 p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Your transcription will appear here..., it can be edited after the recording is complete."
        value={transcript}
        readOnly
      />
      <RecordingPlayer audioBlob={audioBlob} />
    </div>
  );
}
