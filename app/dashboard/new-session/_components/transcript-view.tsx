"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'

interface TranscriptViewProps {
  transcript: string
  isRecording: boolean
  isPaused: boolean
  currentTime: string
  error?: string | null
  onStartNewRecording?: () => void
}

export function TranscriptView({ 
  transcript, 
  isRecording, 
  isPaused, 
  currentTime,
  error,
  onStartNewRecording
}: TranscriptViewProps) {
  console.log('TranscriptView rendered with:', { transcript, isRecording, isPaused, currentTime });
  
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Transcript Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {/* Current Time */}
          <div className="text-sm text-gray-500 font-mono">
            {currentTime}
          </div>
          
          {/* Recording Status */}
          {isRecording ? (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">
                {isPaused ? 'Paused' : 'Recording...'}
              </span>
            </div>
          ) : transcript && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">
                Recording completed
              </span>
            </div>
          )}
          
          {/* Transcript Text */}
          <div className="prose max-w-none">
            {transcript ? (
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                {transcript}
              </p>
            ) : (
              <div className="text-gray-400 italic">
                {isRecording 
                  ? (isPaused ? 'Recording paused...' : 'Listening for speech...')
                  : 'No transcript available yet'
                }
              </div>
            )}
          </div>
          
                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-800">Recording Error</h3>
                        <p className="mt-1 text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Provide feedback</span>
          </div>
          {!isRecording && transcript && onStartNewRecording && (
            <Button
              onClick={onStartNewRecording}
              size="sm"
              className="gap-2"
            >
              <Mic className="h-4 w-4" />
              Start New Recording
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
