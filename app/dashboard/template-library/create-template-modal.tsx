"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, FileCheck } from "lucide-react"

interface CreateTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onTemplateTypeSelect: (type: "note" | "pdf") => void
}

export function CreateTemplateModal({ 
  isOpen, 
  onClose, 
  onTemplateTypeSelect 
}: CreateTemplateModalProps) {
  const [selectedType, setSelectedType] = useState<"note" | "pdf" | null>(null)

  const handleContinue = () => {
    if (selectedType) {
      onTemplateTypeSelect(selectedType)
      setSelectedType(null)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedType(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            What type of template would you like to create?
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Note or Document Option */}
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedType === "note" 
                ? "ring-2 ring-primary border-primary" 
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedType("note")}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    Note or document
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Create a freeform template using text instructions and formatting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fill PDF Form Option */}
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedType === "pdf" 
                ? "ring-2 ring-primary border-primary" 
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedType("pdf")}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    Fill a PDF form
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Create a template using a PDF form that auto-fills form fields
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleContinue}
            disabled={!selectedType}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
