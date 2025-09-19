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

async function createVisit(patientId: number, templateId: number) {
  try {
    const res = await fetch("http://localhost:5000/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, templateId })
    });
    if (!res.ok) throw new Error("Failed to create visit");
    return await res.json();
  } catch (err) {
    console.error("Error creating visit:", err);
    return null;
  }
}

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

  const handleStartNewRecording = useCallback(async () => {
    // Call create visit API when starting new recording
    await createVisit(1, 1);

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
      <WarningBar />
      <Header onTranscriptUpdate={handleTranscriptUpdate} />

      {/* Main Content */}
      <div className="bg-slate-50">
        <Tabs defaultValue="transcript">
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

          <TabsContent value="transcript" className="m-0 px-0 py-4">
            <TranscriptTab onStartRecording={handleStartNewRecording} />
          </TabsContent>

          <TabsContent value="context" className="m-0 px-0 py-4">
            <ContextTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
