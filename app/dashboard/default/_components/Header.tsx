import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Mic,
  Clock,
  MoreVertical,
  ChevronDown,
  Trash2,
} from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  );
}
