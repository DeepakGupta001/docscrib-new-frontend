"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, FileText, AlertCircle } from "lucide-react"

interface PdfTemplateEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onSave: (templateData: {
    name: string
    visibility: "only-me" | "team" | "public"
  }) => void
  pdfFile: File
}

export function PdfTemplateEditorModal({ 
  isOpen, 
  onClose, 
  onBack,
  onSave,
  pdfFile 
}: PdfTemplateEditorModalProps) {
  const [templateName, setTemplateName] = useState(pdfFile.name.replace('.pdf', ''))
  const [visibility, setVisibility] = useState<"only-me" | "team" | "public">("only-me")
  const [pdfError, setPdfError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [useObjectTag, setUseObjectTag] = useState(false)

  // Memoize the PDF URL to prevent re-creation on every render
  const pdfUrl = useMemo(() => {
    try {
      const url = URL.createObjectURL(pdfFile)
      console.log('PDF URL created:', url) // Debug log
      console.log('PDF File:', pdfFile) // Debug log
      return url
    } catch (error) {
      console.error('Error creating PDF URL:', error)
      return null
    }
  }, [pdfFile])

  // Clean up the URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  // Reset error state when PDF URL changes
  useEffect(() => {
    if (pdfUrl) {
      setPdfError(false)
      setIsLoading(false)
      setUseObjectTag(false)
      
      // Set a timeout to try object tag if iframe doesn't load
      const timeout = setTimeout(() => {
        if (isLoading) {
          console.log('PDF iframe timeout, trying object tag')
          setUseObjectTag(true)
          setIsLoading(false)
        }
      }, 3000)
      
      return () => clearTimeout(timeout)
    }
  }, [pdfUrl, isLoading])

  const handleSave = () => {
    onSave({
      name: templateName,
      visibility
    })
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  const handleBack = () => {
    onBack()
  }

  const handlePdfError = () => {
    console.log('PDF failed to load')
    setPdfError(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-8 py-6 border-b bg-white/80 backdrop-blur-sm shadow-sm flex-shrink-0">
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
            <DialogTitle className="sr-only">Edit template details</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Left Panel - PDF Preview */}
          <div className="flex-1 bg-gray-50 p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
              {/* PDF Preview Container */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-gray-200">
                {/* PDF Viewer */}
                <div className="w-full h-[600px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-gray-600">Loading PDF preview...</p>
                      </div>
                    </div>
                  ) : pdfError || !pdfUrl ? (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                          </svg>
                        </div>
                        <p className="text-gray-600 mb-2">It may have been moved, edited or deleted.</p>
                        <p className="text-sm text-gray-500 mb-4">Unable to preview PDF file</p>
                        {pdfUrl && (
                          <a 
                            href={pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Open PDF in new tab
                          </a>
                        )}
                      </div>
                    </div>
                  ) : useObjectTag ? (
                    <object
                      data={pdfUrl}
                      type="application/pdf"
                      className="w-full h-full"
                      title="PDF Preview"
                    >
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14,2 14,8 20,8"/>
                              <line x1="16" y1="13" x2="8" y2="13"/>
                              <line x1="16" y1="17" x2="8" y2="17"/>
                              <polyline points="10,9 9,9 8,9"/>
                            </svg>
                          </div>
                          <p className="text-gray-600 mb-2">It may have been moved, edited or deleted.</p>
                          <p className="text-sm text-gray-500 mb-4">Unable to preview PDF file</p>
                          <a 
                            href={pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Open PDF in new tab
                          </a>
                        </div>
                      </div>
                    </object>
                  ) : (
                    <iframe
                      src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                      className="w-full h-full border-0"
                      title="PDF Preview"
                      onError={() => {
                        console.log('PDF iframe failed to load, trying object tag')
                        setUseObjectTag(true)
                      }}
                      onLoad={() => {
                        console.log('PDF iframe loaded successfully')
                        setPdfError(false)
                        setIsLoading(false)
                      }}
                    />
                  )}
                </div>
              </div>
              
              {/* PDF Filename */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 font-medium">{pdfFile.name}</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Template Details */}
          <div className="w-80 bg-white border-l p-8 flex flex-col">
            <div className="flex-1 space-y-6">
              <h2 className="text-xl font-semibold">Edit template details</h2>
              
              {/* Template Name */}
              <div className="space-y-2">
                <Label htmlFor="template-name" className="text-sm font-medium">
                  Template name
                </Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visibility
                </Label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setVisibility("only-me")}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      visibility === "only-me"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Only me
                  </button>
                  <button
                    onClick={() => setVisibility("team")}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      visibility === "team"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Team
                  </button>
                  <button
                    onClick={() => setVisibility("public")}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      visibility === "public"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Public
                  </button>
                </div>
              </div>

              {/* PDF Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>PDF form detected</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Form fields will be automatically filled based on your session data
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button variant="outline" onClick={handleClose}>
                Discard
              </Button>
              <Button onClick={handleSave}>
                Save template
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
