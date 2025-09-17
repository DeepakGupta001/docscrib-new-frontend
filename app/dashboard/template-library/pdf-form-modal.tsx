"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, ExternalLink } from "lucide-react"

interface PdfFormModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onPdfUpload: (file: File) => void
}

export function PdfFormModal({ 
  isOpen, 
  onClose, 
  onBack,
  onPdfUpload 
}: PdfFormModalProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const pdfFile = files.find(file => file.type === 'application/pdf')
    
    if (pdfFile) {
      setSelectedFile(pdfFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      onPdfUpload(selectedFile)
      setSelectedFile(null)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    onClose()
  }

  const handleBack = () => {
    setSelectedFile(null)
    onBack()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 text-muted-foreground hover:text-foreground w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to template type
            </Button>
            <DialogTitle className="sr-only">PDF Form Upload</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title and Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">What form would you like to use?</h2>
            <p className="text-muted-foreground">
              Upload a PDF and we'll automatically detect available fields.
            </p>
          </div>

          {/* PDF Upload Area */}
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`p-4 rounded-full ${
                  selectedFile ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Upload className={`h-8 w-8 ${
                    selectedFile ? 'text-green-600' : 'text-gray-600'
                  }`} />
                </div>
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-green-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      Ready to upload
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      Click to browse files, or drag and drop your file here.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: Fillable PDF forms only
                    </p>
                  </div>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Information Section */}
          <Alert variant="info">
            <AlertTitle>
              Ensure your form is correctly structured for autofill
            </AlertTitle>
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  For best results with form filling, include clear field names, conditionals, and descriptions in your PDF
                </p>
                <Button variant="link" className="p-0 h-auto text-sm font-medium text-blue-600 hover:text-blue-700">
                  View formatting guide
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Upload PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
