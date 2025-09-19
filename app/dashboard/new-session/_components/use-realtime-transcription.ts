"use client";

import { useEffect, useRef, useState } from "react";

export function useRealtimeTranscription(isRecording: boolean) {
  const [transcript, setTranscript] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (!isRecording) {
      // Clean up when stopping recording
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      return;
    }

    const DEEPGRAM_API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
    if (!DEEPGRAM_API_KEY) {
      console.error("Missing Deepgram API key in .env");
      return;
    }

    // Create WebSocket connection with proper query parameters
    const wsUrl = new URL("wss://api.deepgram.com/v1/listen");
    wsUrl.searchParams.set("encoding", "linear16");
    wsUrl.searchParams.set("sample_rate", "16000");
    wsUrl.searchParams.set("channels", "1");
    wsUrl.searchParams.set("interim_results", "true");
    wsUrl.searchParams.set("punctuate", "true");
    wsUrl.searchParams.set("smart_format", "true");

    // Deepgram Realtime API requires token as subprotocol
    const ws = new WebSocket(
      wsUrl.toString(),
      ["token", DEEPGRAM_API_KEY]
    );
    wsRef.current = ws;

    // Set authorization header properly
    ws.addEventListener("open", () => {
      console.log("Connected to Deepgram Realtime API");
      
      
      // Start capturing audio after connection is open
      startAudioCapture();
    });

    const startAudioCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            sampleSize: 16
          } 
        });

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            // Convert to proper format and send to Deepgram
            event.data.arrayBuffer().then(buffer => {
              ws.send(buffer);
            });
          }
        };

        mediaRecorder.start(250); // Send data every 250ms
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    ws.addEventListener("message", (message) => {
      try {
        const data = JSON.parse(message.data);
        
        // Handle transcription response
        if (data.type === "Results" && data.channel?.alternatives?.[0]?.transcript) {
          const transcriptText = data.channel.alternatives[0].transcript.trim();
          if (transcriptText.length > 0) {
            if (data.is_final) {
              setTranscript((prev) => (prev + " " + transcriptText).trim());
            } else {
              // Show interim results in UI as well
              setTranscript((prev) => (prev + " " + transcriptText).trim());
            }
          }
        }
        
        // Handle metadata
        if (data.type === "Metadata") {
          console.log("Metadata:", data);
        }
        
        // Handle finalize response
        if (data.type === "Finalize") {
          console.log("Finalization complete");
        }
        
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.addEventListener("error", (err) => {
      console.error("Deepgram WebSocket error:", err);
      
    });

    ws.addEventListener("close", (event) => {
      console.log("Deepgram connection closed:", event.code, event.reason);
      
    });

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (ws) {
        // Send close message before closing
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "CloseStream" }));
        }
        ws.close();
      }
    };
  }, [isRecording]);

  return { 
    transcript, 
    
    clearTranscript: () => setTranscript("")
  };
}
