"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Mic, ChevronDown, Check, Clock } from "lucide-react"

interface MicrophoneDevice {
  deviceId: string
  label: string
  kind: string
}

interface MicrophoneSelectorProps {
  isRecording: boolean
  isPaused?: boolean
  isStopped?: boolean
  recordingTime?: number
  onDeviceChange?: (deviceId: string) => void
}

export function MicrophoneSelector({
  isRecording,
  isPaused = false,
  isStopped = false,
  recordingTime = 0,
  onDeviceChange
}: MicrophoneSelectorProps) {
  const [devices, setDevices] = useState<MicrophoneDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>("")
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  // Get available microphone devices
  const getMicrophoneDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const microphones = devices
        .filter(device => device.kind === 'audioinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`,
          kind: device.kind
        }))
      
      setDevices(microphones)
      
      // Set default device
      if (microphones.length > 0 && !selectedDevice) {
        setSelectedDevice(microphones[0].deviceId)
        onDeviceChange?.(microphones[0].deviceId)
      }
    } catch (error) {
      console.error('Error getting microphone devices:', error)
    }
  }

  // Start volume monitoring
  const startVolumeMonitoring = async (deviceId: string) => {
    try {
      // Stop previous monitoring
      stopVolumeMonitoring()

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } }
      })

      microphoneRef.current = stream

      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)

      // Better settings for volume detection
      analyser.fftSize = 512 // Higher resolution
      analyser.smoothingTimeConstant = 0.9 // More smoothing
      analyser.minDecibels = -90
      analyser.maxDecibels = -10
      source.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      // Start animation loop
      animateVolume()
    } catch (error) {
      console.error('Error starting volume monitoring:', error)
    }
  }

  // Stop volume monitoring
  const stopVolumeMonitoring = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (microphoneRef.current) {
      microphoneRef.current.getTracks().forEach(track => track.stop())
      microphoneRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    setVolumeLevel(0)
  }

  // Animate volume level
  const animateVolume = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Calculate RMS (Root Mean Square) for smoother volume detection
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i]
    }
    const rms = Math.sqrt(sum / dataArray.length)
    
    // Normalize to 0-1 with better scaling - less sensitive to prevent whispering activation
    const normalizedVolume = Math.min(rms / 40, 1) // Higher threshold to reduce sensitivity
    
    // Apply higher minimum threshold to prevent whispering from activating bars 2-3
    const minThreshold = 0.15 // Increased from 0.05 to 0.15
    const adjustedVolume = normalizedVolume < minThreshold ? 0 : normalizedVolume
    
    // Smooth the volume changes to reduce flickering
    setVolumeLevel(prevVolume => {
      const smoothingFactor = 0.4 // Higher smoothing to reduce flickering
      const newVolume = prevVolume * (1 - smoothingFactor) + adjustedVolume * smoothingFactor
      
      // Debug logging (remove in production)
    //   if (newVolume > 0.6) {
    //     console.log('Volume levels:', { 
    //       rms: rms.toFixed(2), 
    //       normalizedVolume: normalizedVolume.toFixed(2), 
    //       adjustedVolume: adjustedVolume.toFixed(2), 
    //       newVolume: newVolume.toFixed(2),
    //       bars: {
    //         bar1: newVolume > 0 ? 'ON' : 'OFF',
    //         bar2: newVolume > 0.4 ? 'ON' : 'OFF',
    //         bar3: newVolume > 0.6 ? 'ON' : 'OFF',
    //         bar4: newVolume > 0.8 ? 'ON' : 'OFF',
    //         bar5: newVolume > 0.95 ? 'ON' : 'OFF'
    //       }
    //     });
    //   }
      
      return newVolume
    })

    if (isRecording) {
      animationRef.current = requestAnimationFrame(animateVolume)
    }
  }

  // Handle device selection
  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId)
    onDeviceChange?.(deviceId)
    setIsOpen(false)

    if (isRecording) {
      startVolumeMonitoring(deviceId)
    }
  }

  // Get device label
  const getDeviceLabel = (deviceId: string) => {
    const device = devices.find(d => d.deviceId === deviceId)
    if (!device) return "Select Microphone"
    
    // Truncate long labels
    const maxLength = 25
    return device.label.length > maxLength 
      ? device.label.substring(0, maxLength) + "..."
      : device.label
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Initialize devices on mount
  useEffect(() => {
    getMicrophoneDevices()
  }, [])

  // Start/stop monitoring based on recording state, pause state, and stopped state
  useEffect(() => {
    if (isRecording && !isPaused && !isStopped && selectedDevice) {
      startVolumeMonitoring(selectedDevice)
    } else {
      stopVolumeMonitoring()
    }

    return () => {
      stopVolumeMonitoring()
    }
  }, [isRecording, isPaused, isStopped, selectedDevice])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVolumeMonitoring()
    }
  }, [])

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border">
      <Clock className="h-4 w-4 text-slate-500" />
      <span className="text-sm font-mono text-slate-700">
        {formatTime(recordingTime)}
      </span>
      
      {/* Microphone Icon */}
      <Mic className="h-4 w-4 text-slate-500" />
      
      {/* Volume Level Indicator */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => {
          // Fixed thresholds for each bar - 5 bars with better sensitivity
          const barThresholds = [0, 0.4, 0.6, 0.8, 0.95]; // 0%, 40%, 60%, 80%, 95%
          const barThreshold = barThresholds[i - 1];
          const isActive = volumeLevel > barThreshold;
          
          return (
            <div
              key={i}
              className={`w-1 h-3 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-green-500'
                  : 'bg-slate-500'
              } ${isRecording && isActive ? 'animate-pulse' : ''}`}
            />
          );
        })}
      </div>

      {/* Microphone Selector Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto p-0 text-slate-700 hover:text-slate-900 hover:bg-transparent"
          >
            <div className="flex items-center gap-1">
              <span className="text-sm">{getDeviceLabel(selectedDevice)}</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {devices.map((device) => (
            <DropdownMenuItem
              key={device.deviceId}
              onClick={() => handleDeviceSelect(device.deviceId)}
              className="flex items-center justify-between"
            >
              <span className="text-sm truncate">{device.label}</span>
              {selectedDevice === device.deviceId && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
