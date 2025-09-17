"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye} from "lucide-react"

interface PdfEditModalProps {
  isOpen: boolean
  onClose: () => void
  pdfFile?: File | null
  templateName?: string
  onSave?: (data: {
    templateName: string
    visibility: "only-me" | "team" | "public"
  }) => void
}

export function PdfEditModal({
  isOpen,
  onClose,
  pdfFile,
  templateName = "EDIT OoPdfFormExample.pdf",
  onSave
}: PdfEditModalProps) {
  const [currentTemplateName, setCurrentTemplateName] = useState(templateName)
  const [visibility, setVisibility] = useState<"only-me" | "team" | "public">("only-me")
  const [isLoading, setIsLoading] = useState(true)
  const [useObjectTag, setUseObjectTag] = useState(false)

  // Create PDF URL for preview
  const pdfUrl = useMemo(() => {
    if (!pdfFile) return null
    return URL.createObjectURL(pdfFile)
  }, [pdfFile])

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  // Handle PDF load error - fallback to object tag
  const handlePdfError = () => {
    console.log("PDF iframe failed to load, switching to object tag")
    setUseObjectTag(true)
    setIsLoading(false)
  }

  // Handle PDF load success
  const handlePdfLoad = () => {
    console.log("PDF loaded successfully")
    setIsLoading(false)
  }

  // Timeout fallback to object tag
  useEffect(() => {
    if (pdfUrl && !useObjectTag) {
      const timer = setTimeout(() => {
        console.log("PDF load timeout, switching to object tag")
        setUseObjectTag(true)
        setIsLoading(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [pdfUrl, useObjectTag])

  const handleSave = () => {
    onSave?.({
      templateName: currentTemplateName,
      visibility
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
            <DialogTitle className="text-xl font-semibold">Edit template details</DialogTitle>
          
          </div>
        </DialogHeader>

        <div className="flex-1 flex min-h-0">
          {/* Left Section - PDF Preview */}
          <div className="flex-1 bg-gray-100 p-6 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading PDF preview...</div>
                </div>
              )}
              
              {pdfUrl && !useObjectTag && (
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-0"
                  onLoad={handlePdfLoad}
                  onError={handlePdfError}
                  style={{ display: isLoading ? 'none' : 'block' }}
                />
              )}
              
              {pdfUrl && useObjectTag && (
                <object
                  data={pdfUrl}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <div className="flex items-center justify-center h-full text-gray-500">
                    PDF preview not available. Please download the file to view.
                  </div>
                </object>
              )}
              
              {!pdfUrl && (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No PDF file available for preview
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Edit Template Details */}
          <div className="w-96 bg-white border-l flex flex-col flex-shrink-0">
            <div className="p-6 flex-1">
              <div className="space-y-6">
                {/* Template Name */}
                <div className="space-y-2">
                  <Label htmlFor="template-name" className="text-sm font-medium text-gray-700">
                    Template name
                  </Label>
                  <Input
                    id="template-name"
                    value={currentTemplateName}
                    onChange={(e) => setCurrentTemplateName(e.target.value)}
                    className="w-full"
                    placeholder="Enter template name"
                  />
                </div>

                {/* Visibility */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <Label className="text-sm font-medium text-gray-700">
                      Visibility
                    </Label>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => setVisibility("only-me")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        visibility === "only-me"
                          ? "bg-gray-100 text-gray-900 border border-gray-300"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Only me
                    </button>
                    <button
                      onClick={() => setVisibility("team")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        visibility === "team"
                          ? "bg-gray-100 text-gray-900 border border-gray-300"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Team
                    </button>
                    <button
                      onClick={() => setVisibility("public")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        visibility === "public"
                          ? "bg-gray-100 text-gray-900 border border-gray-300"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Public
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t bg-gray-50 flex-shrink-0">
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="px-6"
                >
                  Dismiss
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-6"
                >
                  Save template
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
