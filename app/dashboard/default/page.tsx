import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateMeta } from "@/lib/utils";
import Header from './_components/Header';
import NoteTab from './_components/NoteTab';
import TranscriptTab from './_components/TranscriptTab';
import ContextTab from './_components/ContextTab';
import Footer from './_components/Footer';
import WarningBar from './_components/WarningBar';
export async function generateMetadata() {
  return generateMeta({
    title: "Dashboard - DocScrib",
    description: "Session note-taking and transcription page.",
    canonical: "/dashboard",
  })
}
export default function DocScribSession() {
  return (
    <div className="h-full bg-slate-50">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to your dashboard.</p>
      </div>
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
