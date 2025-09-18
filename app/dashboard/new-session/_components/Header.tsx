import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import { Check, Plus, User, CalendarIcon } from 'lucide-react';
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
    dateOfBirth: undefined as Date | undefined,
    phoneNumber: "",
    emailAddress: ""
  });

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState<string | null>(null);
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    dateOfBirth: ""
  });

  // Memoized validation functions for better performance
  const validateFullName = useCallback((name: string) => {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Full name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return "Please Enter Valid Name";
    return "";
  }, []);

  const validateEmail = useCallback((email: string) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return "Please enter a valid email address";
    return "";
  }, []);

  const validatePhoneNumber = useCallback((phone: string) => {
    if (!phone.trim()) return "Phone number is required";
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return "Phone number must be at least 10 digits";
    if (cleanPhone.length > 15) return "Phone number must be less than 15 digits";
    if (!/^\d+$/.test(cleanPhone)) return "Phone number can only contain numbers";
    return "";
  }, []);

  const validateDateOfBirth = useCallback((date: Date | undefined) => {
    if (!date) return "Date of birth is required";
    const today = new Date();
    const minAge = 1; // Minimum age of 1 year
    const maxAge = 150; // Maximum age of 150 years

    const age = today.getFullYear() - date.getFullYear();
    if (age < minAge) return "Patient must be at least 1 year old";
    if (age > maxAge) return "Please enter a valid date of birth";
    return "";
  }, []);

  // Debounced validation to improve performance
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedValidation = useCallback((field: string, value: string | Date | undefined) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      let error = "";
      switch (field) {
        case 'fullName':
          error = validateFullName(value as string);
          break;
        case 'emailAddress':
          error = validateEmail(value as string);
          break;
        case 'phoneNumber':
          error = validatePhoneNumber(value as string);
          break;
        case 'dateOfBirth':
          error = validateDateOfBirth(value as Date | undefined);
          break;
      }
      setFormErrors(prev => ({...prev, [field]: error}));
    }, 300); // 300ms debounce

    setDebounceTimer(timer);
  }, [validateFullName, validateEmail, validatePhoneNumber, validateDateOfBirth]);

  // Memoized event handlers for better performance
  const handleFullNameChange = useCallback((value: string) => {
    setNewPatient(prev => ({...prev, fullName: value}));
    debouncedValidation('fullName', value);
  }, [debouncedValidation]);

  const handleEmailChange = useCallback((value: string) => {
    setNewPatient(prev => ({...prev, emailAddress: value}));
    debouncedValidation('emailAddress', value);
  }, [debouncedValidation]);

  const handlePhoneChange = useCallback((value: string) => {
    setNewPatient(prev => ({...prev, phoneNumber: value}));
    debouncedValidation('phoneNumber', value);
  }, [debouncedValidation]);

  const handleDateOfBirthChange = useCallback((date: Date | undefined) => {
    setNewPatient(prev => ({...prev, dateOfBirth: date}));
    debouncedValidation('dateOfBirth', date);
  }, [debouncedValidation]);

  // Fetch patients from API
  const fetchPatients = async () => {
    setPatientsLoading(true);
    setPatientsError(null);

    try {
      const response = await fetch('http://localhost:5000/api/patients', {
        method: 'GET',
        credentials: 'include', // Include cookies for session authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatientsError(error instanceof Error ? error.message : 'Failed to fetch patients');
      // Fallback to sample data if API fails
      setPatients([
        { id: "1", name: "John Doe", email: "john.doe@email.com", phone: "+1 (555) 123-4567" },
        { id: "2", name: "Jane Smith", email: "jane.smith@email.com", phone: "+1 (555) 234-5678" },
        { id: "3", name: "Mike Johnson", email: "mike.johnson@email.com", phone: "+1 (555) 345-6789" },
      ]);
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleCreatePatient = async () => {
    // Validate all fields
    const fullNameError = validateFullName(newPatient.fullName);
    const emailError = validateEmail(newPatient.emailAddress);
    const phoneError = validatePhoneNumber(newPatient.phoneNumber);
    const dateError = validateDateOfBirth(newPatient.dateOfBirth);

    setFormErrors({
      fullName: fullNameError,
      emailAddress: emailError,
      phoneNumber: phoneError,
      dateOfBirth: dateError
    });

    // Check if there are any validation errors
    if (fullNameError || emailError || phoneError || dateError) {
      console.error("Validation errors found");
      return;
    }

    setIsCreatingPatient(true);

    try {
      const patientData = {
        name: newPatient.fullName,
        email: newPatient.emailAddress,
        phone: newPatient.phoneNumber,
        dateOfBirth: newPatient.dateOfBirth!.toISOString().split('T')[0], // Format as YYYY-MM-DD
        address: "" // Optional field, can be empty
      };

      const response = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        credentials: 'include', // Include cookies for session authentication
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdPatient = await response.json();
      console.log("Patient created successfully:", createdPatient);

      // Close modal and reset form immediately
      setIsModalOpen(false);
      setNewPatient({ fullName: "", dateOfBirth: undefined, phoneNumber: "", emailAddress: "" });
      setFormErrors({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        dateOfBirth: ""
      });

      // Clear loading state immediately after successful creation
      setIsCreatingPatient(false);

      // Refresh the patient list from API (don't await this to avoid blocking UI)
      fetchPatients();

    } catch (error) {
      console.error('Error creating patient:', error);
      // Clear loading state on error
      setIsCreatingPatient(false);
      // You could show an error toast/notification here
    }
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
                {selectedPatient ? patients.find(p => p.id.toString() === selectedPatient)?.name : "Add patient details"}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0">
              <Command>
                <CommandInput placeholder="Search patients..." />
                <CommandList>
                  <CommandEmpty>No patients found.</CommandEmpty>

                  {/* Create new patient button at the top */}
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
                        <div className="space-y-6 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm font-medium">
                              Full Name *
                            </Label>
                            <Input
                              id="fullName"
                              value={newPatient.fullName}
                              onChange={(e) => handleFullNameChange(e.target.value)}
                              placeholder="Enter full name"
                              className={cn("w-full", formErrors.fullName && "border-red-500")}
                            />
                            {formErrors.fullName && (
                              <p className="text-sm text-red-500">{formErrors.fullName}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                              Date of Birth *
                            </Label>
                            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !newPatient.dateOfBirth && "text-muted-foreground",
                                    formErrors.dateOfBirth && "border-red-500"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {newPatient.dateOfBirth ? (
                                    format(newPatient.dateOfBirth, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={newPatient.dateOfBirth}
                                  onSelect={(date) => {
                                    handleDateOfBirthChange(date);
                                    setDatePickerOpen(false);
                                  }}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                  captionLayout="dropdown"
                                  fromYear={1900}
                                  toYear={new Date().getFullYear()}
                                  className="rounded-md border shadow-lg"
                                />
                              </PopoverContent>
                            </Popover>
                            {formErrors.dateOfBirth && (
                              <p className="text-sm text-red-500">{formErrors.dateOfBirth}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium">
                              Phone Number *
                            </Label>
                            <Input
                              id="phoneNumber"
                              value={newPatient.phoneNumber}
                              onChange={(e) => handlePhoneChange(e.target.value)}
                              placeholder="Enter phone number (e.g., +1 555-123-4567)"
                              className={cn("w-full", formErrors.phoneNumber && "border-red-500")}
                            />
                            {formErrors.phoneNumber && (
                              <p className="text-sm text-red-500">{formErrors.phoneNumber}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emailAddress" className="text-sm font-medium">
                              Email Address *
                            </Label>
                            <Input
                              id="emailAddress"
                              type="email"
                              value={newPatient.emailAddress}
                              onChange={(e) => handleEmailChange(e.target.value)}
                              placeholder="Enter email address"
                              className={cn("w-full", formErrors.emailAddress && "border-red-500")}
                            />
                            {formErrors.emailAddress && (
                              <p className="text-sm text-red-500">{formErrors.emailAddress}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isCreatingPatient}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreatePatient} disabled={isCreatingPatient}>
                            {isCreatingPatient ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                                Creating...
                              </>
                            ) : (
                              "Save Patient"
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CommandGroup>

                  {/* Patient list */}
                  <CommandGroup>
                    {patientsLoading ? (
                      <CommandItem disabled>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                          <span>Loading patients...</span>
                        </div>
                      </CommandItem>
                    ) : patientsError ? (
                      <CommandItem disabled>
                        <div className="flex items-center gap-2 text-red-500">
                          <span>Error loading patients</span>
                        </div>
                      </CommandItem>
                    ) : (
                      patients.map((patient) => (
                        <CommandItem
                          key={`patient-${patient.id}`}
                          value={`${patient.name}-${patient.id}`}
                          onSelect={() => {
                            setSelectedPatient(patient.id.toString());
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedPatient === patient.id.toString() ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {patient.email} • ID: {patient.id}
                              </div>
                            </div>
                          </div>
                        </CommandItem>
                      ))
                    )}
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
