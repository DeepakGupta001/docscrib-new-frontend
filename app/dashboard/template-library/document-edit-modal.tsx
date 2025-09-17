"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, List, HelpCircle } from "lucide-react"

interface DocumentEditModalProps {
  isOpen: boolean
  onClose: () => void
  templateName?: string
  templateContent?: string
  onSave?: (data: {
    content: string
    visibility: "only-me" | "team" | "public"
    type: "document" | "note"
    isDefault: boolean
  }) => void
}

export function DocumentEditModal({
  isOpen,
  onClose,
  templateName = "ED discharge summary",
  templateContent,
  onSave
}: DocumentEditModalProps) {
  const [visibility, setVisibility] = useState<"only-me" | "team" | "public">("only-me")
  const [type, setType] = useState<"document" | "note">("document")
  const [isDefault, setIsDefault] = useState(false)
  const [content, setContent] = useState(templateContent || `**Admission Details:**
• Chief Complaint: [Brief description of the presenting issue]
• Diagnosis: [Final diagnosis or impression]

**Treatment Provided:**
• Interventions: [List of treatments and interventions provided in the ED]
• Medications Administered: [Details of any medications given, including dosages]

**Results of Investigations:**
• Pathology: [Key results from blood tests, urine tests, etc. (if applicable)]
• Imaging: [Findings from X-rays, CT scans, MRIs, etc. (if applicable)]

**Patient's Condition at Discharge:**
• [General condition at the time of discharge]
• Vital Signs: [Latest recorded vital signs]

**Discharge Instructions:**
• Medications: [Prescriptions given at discharge, with dosages and instructions]
• Activity Level: [Recommended level of activity (if applicable)]
• [Any advised dietary changes or restrictions (if applicable)]
• [Instructions for wound care, if applicable]
• [Signs & symptoms to watch for that would necessitate a return to the hospital or further medical attention (if applicable)]
• Follow-Up: [Details of any scheduled follow-up appointments, (if applicable)]`)

  const handleSave = () => {
    onSave?.({
      content,
      visibility,
      type,
      isDefault
    })
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-white/80 backdrop-blur-sm shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-xl font-semibold">Edit template</DialogTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-0 h-auto">
                <HelpCircle className="h-4 w-4 mr-1" />
                I need help?
              </Button>
            </div>
          
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Template Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="prose max-w-none">
              <h1 className="text-2xl font-bold mb-6">{templateName}</h1>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {content}
              </div>
            </div>
          </div>

          {/* Template Settings */}
          <div className="border-t bg-gray-50 p-6 flex-shrink-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Side - Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Visibility Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={visibility === "only-me" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVisibility("only-me")}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visibility
                  </Button>
                  <div className="flex bg-gray-200 rounded-lg p-1">
                    <button
                      onClick={() => setVisibility("only-me")}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        visibility === "only-me"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Only me
                    </button>
                    <button
                      onClick={() => setVisibility("team")}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        visibility === "team"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Team
                    </button>
                    <button
                      onClick={() => setVisibility("public")}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        visibility === "public"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Public
                    </button>
                  </div>
                </div>

                {/* Type Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={type === "document" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setType("document")}
                    className="gap-2"
                  >
                    <List className="h-4 w-4" />
                    Type
                  </Button>
                  <div className="flex bg-gray-200 rounded-lg p-1">
                    <button
                      onClick={() => setType("document")}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        type === "document"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Document
                    </button>
                    <button
                      onClick={() => setType("note")}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        type === "note"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Note
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Toggle and Save */}
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="make-default"
                    checked={isDefault}
                    onCheckedChange={setIsDefault}
                  />
                  <Label htmlFor="make-default" className="text-sm font-medium">
                    Make default
                  </Label>
                </div>
                <Button
                  onClick={handleSave}
                  className="bg-gray-800 hover:bg-gray-900 text-white"
                >
                  Save for Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
