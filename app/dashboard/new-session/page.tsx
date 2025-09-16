"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator";
import Header from '../default/_components/Header';
import NoteTab from '../default/_components/NoteTab';
import TranscriptTab from '../default/_components/TranscriptTab';
import ContextTab from '../default/_components/ContextTab';
import Footer from '../default/_components/Footer';
import WarningBar from '../default/_components/WarningBar';

export default function NewSessionPage() {

  return (
    <div className="h-full bg-slate-50">
      {/* Header */}
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold">New Session</h1>
        <p>Start a new session for note-taking and transcription.</p>


      </div>

      <Separator />

      <Header />

      {/* Main Content */}
      <div className="bg-slate-50">
        <Tabs defaultValue="note">
          <div className="bg-white border-b">
            <TabsList className="w-full justify-start bg-transparent px-6 py-0 h-10">
              <TabsTrigger
                value="transcript"
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-slate-500 rounded-none text-sm"
              >
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="context"
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-slate-500 rounded-none text-sm"
              >
                Context
              </TabsTrigger>
              <TabsTrigger
                value="note"
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-slate-500 rounded-none text-sm"
              >
                Note
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="note" className="py-8 px-4 m-0">
            <NoteTab />
          </TabsContent>

          <TabsContent value="transcript" className="py-8 px-4 m-0">
            <TranscriptTab />
          </TabsContent>

          <TabsContent value="context" className="py-8 px-4 m-0">
            <ContextTab />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <WarningBar />
    </div>
  );
}
