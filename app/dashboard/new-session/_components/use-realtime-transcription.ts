"use client";

import { useEffect, useRef, useState } from "react";

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

export function useRealtimeTranscription(isRecording: boolean) {
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!isRecording) {
      // Stop recognition when not recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      return;
    }

    // Check if Web Speech API is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error("Web Speech API not supported in this browser");
      return;
    }

    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Configure recognition settings
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // You can make this configurable

    // Handle recognition results
    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update transcript with both final and interim results
      setTranscript((prev) => {
        // Remove interim results and add final results
        const currentFinal = prev.replace(/\s*\[.*?\]\s*$/, ''); // Remove any previous interim text in brackets
        const newTranscript = currentFinal + finalTranscript;

        // Add interim results in brackets if any
        if (interimTranscript.trim()) {
          return newTranscript + ' [' + interimTranscript + ']';
        }

        return newTranscript;
      });
    };

    // Handle recognition start
    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    // Handle recognition end
    recognition.onend = () => {
      console.log("Speech recognition ended");
      // If still recording, restart recognition (continuous mode might stop)
      if (isRecording) {
        try {
          recognition.start();
        } catch (error) {
          console.error("Error restarting speech recognition:", error);
        }
      }
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'not-allowed') {
        console.error("Microphone permission denied");
      }
    };

    // Start recognition
    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [isRecording]);

  return {
    transcript: transcript.replace(/\s*\[.*?\]\s*$/, ''), // Remove interim text in brackets for final output
    clearTranscript: () => setTranscript("")
  };
}
