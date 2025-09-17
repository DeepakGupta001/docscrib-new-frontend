import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Mic,
  MoreVertical,
  ChevronDown,
  Trash2,
  Upload,
  Sparkles,
} from 'lucide-react';
import { LanguageSelectionButton } from './language-selection-modal';
import { DeleteSessionModal } from './delete-session-modal';
import { DateTimeSelectionModal } from './datetime-selection-modal';
import { UploadRecordingModal } from './upload-recording-modal';
import { MicrophoneErrorModal } from './microphone-error-modal';
import { MicrophoneSelector } from './microphone-selector';
import { TranscriptView } from './transcript-view';
import { useAudioRecording } from './use-audio-recording';
import { format, isToday } from 'date-fns';

interface HeaderProps {
  onTranscriptUpdate?: (data: {
    transcript: string;
    isRecording: boolean;
    isPaused: boolean;
    currentTime: string;
    error?: string | null;
  }) => void;
}

export default function Header({ onTranscriptUpdate }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({
    date: new Date(),
    time: "07:16 PM"
  });
  const [selectedMode, setSelectedMode] = useState("Dictating");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMicrophoneErrorOpen, setIsMicrophoneErrorOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Audio recording hook
  const { transcript, error, clearTranscript } = useAudioRecording({
    isRecording,
    isPaused,
    selectedMicrophone
  });

  // Store the callback in a ref to avoid dependency issues
  const onTranscriptUpdateRef = useRef(onTranscriptUpdate);
  onTranscriptUpdateRef.current = onTranscriptUpdate;

  
  const [newPatient, setNewPatient] = useState({
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    emailAddress: ""
  });

  // Sample patient data
  const patients = [
    { id: "1", name: "John Doe", dob: "1985-03-15", phone: "+1 (555) 123-4567", email: "john.doe@email.com" },
    { id: "2", name: "Jane Smith", dob: "1990-07-22", phone: "+1 (555) 234-5678", email: "jane.smith@email.com" },
    { id: "3", name: "Mike Johnson", dob: "1978-11-08", phone: "+1 (555) 345-6789", email: "mike.johnson@email.com" },
    { id: "4", name: "Sarah Wilson", dob: "1992-01-30", phone: "+1 (555) 456-7890", email: "sarah.wilson@email.com" },
    { id: "5", name: "David Brown", dob: "1980-05-12", phone: "+1 (555) 567-8901", email: "david.brown@email.com" },
  ];

  const handleCreatePatient = () => {
    // Here you would typically save to backend
    console.log("Creating patient:", newPatient);
    setIsModalOpen(false);
    setNewPatient({ fullName: "", dateOfBirth: "", phoneNumber: "", emailAddress: "" });
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    console.log("Language selected:", language);
  };

  const handleDeleteSession = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Session deleted");
    // Add actual delete logic here
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDateTimeClick = () => {
    setIsDateTimeModalOpen(true);
  };

  const handleDateTimeSave = (date: Date, time: string) => {
    setCurrentDateTime({ date, time });
    console.log("DateTime updated:", { date, time });
  };

  const formatDateTimeDisplay = () => {
    if (isToday(currentDateTime.date)) {
      return `Today ${currentDateTime.time}`;
    } else {
      const dateStr = format(currentDateTime.date, 'MMM d');
      return `${dateStr} ${currentDateTime.time}`;
    }
  };

  const handleModeSelect = (mode: string) => {
    if (mode === "Upload session audio") {
      setIsUploadModalOpen(true);
    } else {
      setSelectedMode(mode);
      console.log("Mode selected:", mode);
    }
  };

  const handleFileUpload = (file: File, mode: "transcribe" | "dictate") => {
    console.log("File uploaded:", { fileName: file.name, mode });
    // Add actual upload logic here
  };

  const handleMicrophoneChange = (deviceId: string) => {
    setSelectedMicrophone(deviceId);
    console.log("Microphone changed to:", deviceId);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setIsStopped(true);
    // Don't reset recordingTime here - keep it for resume
    console.log("Recording stopped");
  };

  const handleCreate = () => {
    console.log("Create clicked");
    // Add create functionality here
  };

  const handleResumeFromStop = () => {
    setIsStopped(false);
    setIsRecording(true);
    setShowTranscript(true);
    console.log("Resuming from stop");
  };

  const handleStartNewRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      
      console.log("Microphone permission granted, starting new recording...");
      console.log("Selected mode:", selectedMode);
      
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      // Reset timer and transcript for new recording
      setRecordingTime(0);
      clearTranscript();
      setIsStopped(false);
      setIsRecording(true);
      setShowTranscript(true);
      
      // Test: Log current transcript state
      console.log('Current transcript from hook:', transcript);
      
      // Add actual recording logic here based on selectedMode
      if (selectedMode === "Transcribing") {
        console.log("Starting transcription...");
      } else if (selectedMode === "Dictating") {
        console.log("Starting dictation...");
      }
      
    } catch (error) {
      console.error("Microphone permission denied or error:", error);
      
      // Only show error modal if it's actually a permission error
      const errorObj = error as Error;
      const isPermissionError = errorObj.name === 'NotAllowedError' || errorObj.name === 'PermissionDeniedError';
      
      if (isPermissionError) {
        console.log("Opening microphone error modal...");
        setIsMicrophoneErrorOpen(true);
      } else {
        console.error("Other error occurred:", error);
        // Handle other types of errors differently if needed
      }
    }
  };

  const handlePauseRecording = () => {
    setIsPaused(true);
    console.log("Recording paused");
  };

  const handleResumeRecording = () => {
    setIsPaused(false);
    console.log("Recording resumed");
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording, isPaused]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update transcript data when it changes
  useEffect(() => {
    console.log('Header transcript data changed:', { transcript, isRecording, isPaused, recordingTime, error });
    if (onTranscriptUpdateRef.current) {
      const data = {
        transcript,
        isRecording,
        isPaused,
        currentTime: formatTime(recordingTime),
        error
      };
      console.log('Sending transcript update:', data);
      onTranscriptUpdateRef.current(data);
    }
  }, [transcript, isRecording, isPaused, recordingTime, error]);

  const handleStartRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      
      console.log("Microphone permission granted, starting recording...");
      console.log("Selected mode:", selectedMode);
      
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      // Set recording state (don't reset timer here)
      setIsRecording(true);
      
      // Add actual recording logic here based on selectedMode
      if (selectedMode === "Transcribing") {
        console.log("Starting transcription...");
      } else if (selectedMode === "Dictating") {
        console.log("Starting dictation...");
      }
      
    } catch (error) {
      console.error("Microphone permission denied or error:", error);
      
      // Only show error modal if it's actually a permission error
      const errorObj = error as Error;
      const isPermissionError = errorObj.name === 'NotAllowedError' || errorObj.name === 'PermissionDeniedError';
      
      if (isPermissionError) {
        console.log("Opening microphone error modal...");
        setIsMicrophoneErrorOpen(true);
      } else {
        console.error("Other error occurred:", error);
        // Handle other types of errors differently if needed
      }
    }
  };

  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <span className="text-xl font-semibold text-blue-600 hover:text-blue-800 cursor-pointer underline">
                {selectedPatient ? patients.find(p => p.id === selectedPatient)?.name : "Add patient details"}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <Command>
                <CommandInput placeholder="Search patients..." />
                <CommandList>
                  <CommandEmpty>No patients found.</CommandEmpty>
                  <CommandGroup>
                    {patients.map((patient) => (
                      <CommandItem
                        key={patient.id}
                        value={patient.name}
                        onSelect={() => {
                          setSelectedPatient(patient.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPatient === patient.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-xs text-muted-foreground">{patient.email}</div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <CommandItem onSelect={() => setIsModalOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create new patient
                        </CommandItem>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New Patient</DialogTitle>
                          <DialogDescription>
                            Enter the patient's details below. Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullName" className="text-right">
                              Full Name
                            </Label>
                            <Input
                              id="fullName"
                              value={newPatient.fullName}
                              onChange={(e) => setNewPatient({...newPatient, fullName: e.target.value})}
                              className="col-span-3"
                              placeholder="Enter full name"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dateOfBirth" className="text-right">
                              Date of Birth
                            </Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={newPatient.dateOfBirth}
                              onChange={(e) => setNewPatient({...newPatient, dateOfBirth: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">
                              Phone Number
                            </Label>
                            <Input
                              id="phoneNumber"
                              value={newPatient.phoneNumber}
                              onChange={(e) => setNewPatient({...newPatient, phoneNumber: e.target.value})}
                              className="col-span-3"
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="emailAddress" className="text-right">
                              Email Address
                            </Label>
                            <Input
                              id="emailAddress"
                              type="email"
                              value={newPatient.emailAddress}
                              onChange={(e) => setNewPatient({...newPatient, emailAddress: e.target.value})}
                              className="col-span-3"
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreatePatient}>
                            Save Patient
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleDeleteSession}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <button 
            onClick={handleDateTimeClick}
            className="font-medium hover:text-slate-800 transition-colors cursor-pointer"
          >
            {formatDateTimeDisplay()}
          </button>
          <LanguageSelectionButton
            currentLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageSelect}
          />
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            14 days
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex">
          {!isRecording && !isStopped ? (
            // Start button
            <>
              <Button 
                variant="default" 
                className="shadow-sm rounded-r-none"
                onClick={handleStartNewRecording}
              >
                <Mic className="h-4 w-4 mr-2" />
                Start {selectedMode.toLowerCase()}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="default" 
                    className="shadow-sm rounded-l-none border-l-0 px-2"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleModeSelect("Transcribing")}>
                    <span>Transcribing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleModeSelect("Dictating")}>
                    <div className="flex items-center justify-between w-full">
                      <span>Dictating</span>
                      {selectedMode === "Dictating" && <Check className="h-4 w-4 text-blue-600" />}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleModeSelect("Upload session audio")}>
                    <div className="flex items-center justify-between w-full">
                      <span>Upload session audio</span>
                      <Upload className="h-4 w-4 text-gray-500" />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : isRecording ? (
            // Recording controls
            <>
              <Button 
                variant="outline" 
                className="shadow-sm rounded-r-none"
                onClick={isPaused ? handleResumeRecording : handlePauseRecording}
              >
                {isPaused ? (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Resume {selectedMode.toLowerCase()}
                  </>
                ) : (
                  <>
                    <div className="h-4 w-4 mr-2 bg-black rounded-sm" />
                    Pause
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="shadow-sm rounded-l-none border-l-0"
                onClick={handleStopRecording}
              >
                <div className="h-4 w-4 mr-2 bg-red-500 rounded-sm" />
                Stop {selectedMode.toLowerCase()}
              </Button>
            </>
          ) : (
            // Stopped state - Create and Resume buttons
            <>
              <Button 
                variant="default" 
                className="shadow-sm rounded-r-none "
                onClick={handleCreate}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Create
              </Button>
              <Button 
                variant="outline" 
                className="shadow-sm rounded-l-none border-l-0"
                onClick={handleResumeFromStop}
              >
                <Mic className="h-4 w-4 mr-2" />
                Resume
              </Button>
            </>
          )}
        </div>
        <MicrophoneSelector
          isRecording={isRecording}
          isPaused={isPaused}
          isStopped={isStopped}
          recordingTime={recordingTime}
          onDeviceChange={handleMicrophoneChange}
        />
        {/* <Button variant="ghost" size="icon" className="text-slate-500">
          <MoreVertical className="h-5 w-5" />
        </Button> */}
      </div>

      {/* Delete Session Modal */}
      <DeleteSessionModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {/* DateTime Selection Modal */}
      <DateTimeSelectionModal
        isOpen={isDateTimeModalOpen}
        onClose={() => setIsDateTimeModalOpen(false)}
        onSave={handleDateTimeSave}
        currentDate={currentDateTime.date}
        currentTime={currentDateTime.time}
      />

      {/* Upload Recording Modal */}
      <UploadRecordingModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />

      {/* Microphone Error Modal */}
      <MicrophoneErrorModal
        isOpen={isMicrophoneErrorOpen}
        onClose={() => setIsMicrophoneErrorOpen(false)}
        onRetry={handleStartRecording}
      />
      
    
    </div>
  );
}
