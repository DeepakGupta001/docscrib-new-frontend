"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseAudioRecordingProps {
  isRecording: boolean
  isPaused: boolean
  selectedMicrophone?: string
}

export function useAudioRecording({ 
  isRecording, 
  isPaused, 
  selectedMicrophone 
}: UseAudioRecordingProps) {
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)

  // Start audio recording
  const startRecording = useCallback(async () => {
    try {
      const constraints = {
        audio: {
          deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      mediaStreamRef.current = stream

      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      // Create audio source
      const source = audioContext.createMediaStreamSource(stream)
      
      // Create script processor for audio data
      const processor = audioContext.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor

      processor.onaudioprocess = (event) => {
        if (isRecording && !isPaused) {
          const audioData = event.inputBuffer.getChannelData(0)
          
          // Check if audio data has any non-zero values
          const hasAudio = audioData.some(sample => Math.abs(sample) > 0.01)
          if (hasAudio) {
            console.log('Audio detected, processing...')
            console.log('Audio sample range:', Math.min(...audioData), 'to', Math.max(...audioData))
          }
        }
      }

      source.connect(processor)
      processor.connect(audioContext.destination)

    } catch (err) {
      console.error('Failed to start audio recording:', err)
      setError('Failed to start audio recording')
    }
  }, [selectedMicrophone, isRecording, isPaused])

  // Stop audio recording
  const stopRecording = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }, [])

  // Start/stop recording based on state
  useEffect(() => {
    if (isRecording && !isPaused) {
      startRecording()
    } else {
      stopRecording()
    }

    return () => {
      stopRecording()
    }
  }, [isRecording, isPaused, startRecording, stopRecording])

  // Clear transcript when starting new recording
  const clearTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return {
    transcript,
    error,
    clearTranscript
  }
}