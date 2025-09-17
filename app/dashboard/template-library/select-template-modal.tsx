"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, FileText, FileCheck, Calendar, Edit } from "lucide-react"

interface Template {
  id: string
  name: string
  type: "pdf" | "document" | "note"
  category: string
}

interface SelectTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onTemplateSelect: (template: Template) => void
}

const mockTemplates: Template[] = [
  // PDF Templates
  { id: "pdf-1", name: "EDIT OoPdfFormExample.pdf", type: "pdf", category: "PDF templates" },
  
  // Document Templates
  { id: "doc-1", name: "ED admission note", type: "document", category: "Document templates" },
  { id: "doc-2", name: "ED discharge summary", type: "document", category: "Document templates" },
  { id: "doc-3", name: "Patient explainer letter", type: "document", category: "Document templates" },
  { id: "doc-4", name: "Referral letter", type: "document", category: "Document templates" },
  { id: "doc-5", name: "SMART goals", type: "document", category: "Document templates" },
  
  // Note Templates
  { id: "note-1", name: "aufad", type: "note", category: "Note templates" },
  { id: "note-2", name: "Meeting notes", type: "note", category: "Note templates" },
  { id: "note-3", name: "Daily standup", type: "note", category: "Note templates" },
]

export function SelectTemplateModal({ 
  isOpen, 
  onClose, 
  onTemplateSelect 
}: SelectTemplateModalProps) {
  console.log("SelectTemplateModal rendered, isOpen:", isOpen) // Debug log
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const filteredTemplates = mockTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, Template[]>)

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template.id)
  }

  const handleEdit = (template: Template, e: React.MouseEvent) => {
    e.stopPropagation()
    // Handle edit action
    console.log("Edit template:", template)
  }

  const handleSelect = () => {
    if (selectedTemplate) {
      const template = mockTemplates.find(t => t.id === selectedTemplate)
      if (template) {
        onTemplateSelect(template)
        onClose()
      }
    }
  }

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "document":
        return <FileCheck className="h-5 w-5 text-blue-500" />
      case "note":
        return <Calendar className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Select template</DialogTitle>
          
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Search Bar */}
          <div className="px-6 py-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for a template"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Template List */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(groupedTemplates).map(([category, templates]) => (
              <div key={category} className="border-b last:border-b-0">
                <div className="px-6 py-3 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700">{category}</h3>
                </div>
                <div className="divide-y">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateClick(template)}
                      className={`px-6 py-4 flex items-center justify-between hover:bg-blue-50 cursor-pointer transition-colors ${
                        selectedTemplate === template.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getTemplateIcon(template.type)}
                        <span className="text-sm font-medium text-gray-900">
                          {template.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleEdit(template, e)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSelect}
                disabled={!selectedTemplate}
              >
                Select Template
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
