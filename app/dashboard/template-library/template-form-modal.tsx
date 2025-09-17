"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface TemplateFormModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onTemplateCreate: (templateData: { instructions: string; source: "existing" | "blank" }) => void
}

export function TemplateFormModal({ 
  isOpen, 
  onClose, 
  onBack,
  onTemplateCreate 
}: TemplateFormModalProps) {
  const [instructions, setInstructions] = useState("")
  const [selectedSource, setSelectedSource] = useState<"existing" | "blank" | null>(null)

  const handleCreate = () => {
    if (selectedSource || instructions.trim()) {
      onTemplateCreate({
        instructions,
        source: selectedSource || "blank" // Default to blank if no source selected
      })
      // Reset form
      setInstructions("")
      setSelectedSource(null)
      onClose()
    }
  }

  const handleClose = () => {
    setInstructions("")
    setSelectedSource(null)
    onClose()
  }

  const handleBack = () => {
    setInstructions("")
    setSelectedSource(null)
    onBack()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2 text-muted-foreground hover:text-foreground w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to template type
          </Button>
          <DialogTitle className="sr-only">Create a template</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title and Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Create a template</h2>
            <p className="text-muted-foreground">
              Specify details about the content, structure, and rules you'd like applied to your notes and documents.
            </p>
          </div>

          {/* Instructions Textarea */}
          <div className="space-y-3">
            <label htmlFor="instructions" className="text-sm font-medium">
              Template Instructions
            </label>
            <Textarea
              id="instructions"
              placeholder="Enter your template instructions here..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          {/* Sample Instructions */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Sample Instructions</label>
            <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">Create an issues list with ICD-10 codes.</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">Express in paragraph form.</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm">Include a Past Medical History and Medications list taken from the Context tab (yesterday's note).</span>
                  <Button variant="outline" size="sm" className="ml-2">
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Template Source Options */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">or start from</p>
            <div className="flex gap-3">
              <Button
                variant={selectedSource === "existing" ? "default" : "outline"}
                onClick={() => setSelectedSource("existing")}
                className="flex-1"
              >
                Existing note
              </Button>
              <Button
                variant={selectedSource === "blank" ? "default" : "outline"}
                onClick={() => setSelectedSource("blank")}
                className="flex-1"
              >
                Blank template
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!selectedSource && !instructions.trim()}
          >
            Create Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
