"use client";

import React, { useState, useCallback, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Header from "./_components/Header";
import NoteTab from "./_components/NoteTab";
import TranscriptTab from "./_components/TranscriptTab";
import ContextTab from "./_components/ContextTab";
import Footer from "./_components/Footer";
import WarningBar from "./_components/WarningBar";
import { TranscriptView } from "./_components/transcript-view";

export default function NewSessionPage() {
  const [transcriptData, setTranscriptData] = useState({
    transcript: "",
    isRecording: false,
    isPaused: false,
    currentTime: "0:00",
    error: null as string | null | undefined
  } as {
    transcript: string;
    isRecording: boolean;
    isPaused: boolean;
    currentTime: string;
    error?: string | null;
  });

  const [hasStartedRecording, setHasStartedRecording] = useState(false);

  const handleTranscriptUpdate = useCallback(
    (data: typeof transcriptData) => {
      setTranscriptData(data);
      // Track when recording has been started at least once
      if (data.isRecording && !hasStartedRecording) {
        setHasStartedRecording(true);
      }
    },
    [hasStartedRecording]
  );

  const handleStartNewRecording = useCallback(() => {
    setTranscriptData({
      transcript: "",
      isRecording: false,
      isPaused: false,
      currentTime: "0:00",
      error: null
    });
    setHasStartedRecording(false);
  }, []);

  return (
    <div className="h-full bg-slate-50">
      {/* Header */}

      <Header onTranscriptUpdate={handleTranscriptUpdate} />

      {/* Main Content */}
      <div className="bg-slate-50">
        <Tabs defaultValue="note">
          <div className="border-b bg-white">
            <TabsList className="h-10 w-full justify-start bg-transparent px-6 py-0">
              <TabsTrigger
                value="transcript"
                className="rounded-none text-sm data-[state=active]:border-b-2 data-[state=active]:border-slate-500 data-[state=active]:bg-slate-100">
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="context"
                className="rounded-none text-sm data-[state=active]:border-b-2 data-[state=active]:border-slate-500 data-[state=active]:bg-slate-100">
                Context
              </TabsTrigger>
              <TabsTrigger
                value="note"
                className="rounded-none text-sm data-[state=active]:border-b-2 data-[state=active]:border-slate-500 data-[state=active]:bg-slate-100">
                Note
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="note" className="m-0 px-4 py-8">
            <NoteTab />
          </TabsContent>

          <TabsContent value="transcript" className="m-0 px-4 py-8">
            {transcriptData.isRecording || transcriptData.transcript || hasStartedRecording ? (
              <TranscriptView
                transcript={transcriptData.transcript}
                isRecording={transcriptData.isRecording}
                isPaused={transcriptData.isPaused}
                currentTime={transcriptData.currentTime}
                error={transcriptData.error}
                onStartNewRecording={handleStartNewRecording}
              />
            ) : (
              <TranscriptTab />
            )}
          </TabsContent>

          <TabsContent value="context" className="m-0 px-4 py-8">
            <ContextTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* <Footer /> */}
      <WarningBar />
    </div>
  );
}
