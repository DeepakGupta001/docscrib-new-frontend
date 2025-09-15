import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { generateMeta } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Mic,
  Clock,
  MoreVertical,
  ChevronDown,
  Trash2,
  Play,
  Square,
  Settings,
  AlertTriangle
} from 'lucide-react';

export async function generateMetadata() {
  return generateMeta({
    title: "Dashboard - DocScrib",
    description: "Session note-taking and transcription page.",
    canonical: "/dashboard",
  })
}
export default function DocScribSession() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-800">Add patient details</h1>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="font-medium">Today 02:58pm</span>
            <span>English</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
              14 days
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="default" className="shadow-sm">
            <Mic className="h-4 w-4 mr-2" />
            Start transcribing
            <ChevronDown className="h-3 w-3 ml-2" />
          </Button>
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-mono text-slate-700">00:00</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-1 h-3 bg-slate-500 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-500">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

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

          {/* Note Tab */}
          <TabsContent value="note" className="py-8 px-4 m-0">
            <div className="w-full max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <Mic className="h-8 w-8 text-slate-600" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-slate-800">Ready to start your session</h3>
                <p className="text-slate-600">
                  Your note will appear here once your session is complete
                </p>
              </div>

              <Card className="p-4 bg-white border border-slate-200 shadow-sm">
                <div className="space-y-3">
                  <Button variant="default" className="w-full h-11">
                    <Play className="h-4 w-4 mr-2" />
                    Start transcribing
                  </Button>
                  <p className="text-xs text-slate-500 text-center">
                    Select your visit mode in the dropdown above
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Transcript Tab */}
          <TabsContent value="transcript" className="py-8 px-4 m-0">
            <div className="text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <Square className="h-6 w-6 text-slate-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-slate-700">No transcript yet</h3>
                <p className="text-slate-500">Start recording to see your transcript here</p>
              </div>
            </div>
          </TabsContent>

          {/* Context Tab */}
          <TabsContent value="context" className="py-8 px-4 m-0">
            <div className="text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <Settings className="h-6 w-6 text-slate-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-slate-700">Context information</h3>
                <p className="text-slate-500">Patient context and session details will appear here</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Ask Heidi to do anything..."
            className="flex-1 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
          />
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-600">
            <Mic className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-600">
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Warning Bar */}
      <Alert variant="info" className='mt-2'>
        <AlertTitle>Important:</AlertTitle>
        <AlertDescription>  Review your note before use to ensure it accurately represents the visit.</AlertDescription>
      </Alert>
    </div>
  );
}
