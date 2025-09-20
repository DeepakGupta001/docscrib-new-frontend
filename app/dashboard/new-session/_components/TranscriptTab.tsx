import React from "react";
import { AudioLines } from "lucide-react";
import { useRealtimeTranscription } from "./use-realtime-transcription";
import RecordingPlayer from "./RecordingPlayer";
import { useAudioRecording } from "./use-audio-recording";

interface TranscriptTabProps {
  onStartRecording?: () => void;
  isRecording?: boolean;
  transcript?: string;
}

export default function TranscriptTab({ onStartRecording, isRecording = false, transcript = "" }: TranscriptTabProps = {}) {
  const [editableTranscript, setEditableTranscript] = React.useState("");

  // Update editable transcript when new transcription comes in
  React.useEffect(() => {
    if (transcript && transcript !== editableTranscript) {
      setEditableTranscript(transcript);
    }
  }, [transcript]);

  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableTranscript(e.target.value);
  };

  return (
    <div className="m-0 h-full w-full">
      <textarea
        rows={18}
        className="h-full w-full rounded-md border border-slate-300 p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Your transcription will appear here..., it can be edited after the recording is complete."
        value={editableTranscript}
        onChange={handleTranscriptChange}
        readOnly={isRecording} // Make it editable only when not recording
      />
    </div>
  );
}
