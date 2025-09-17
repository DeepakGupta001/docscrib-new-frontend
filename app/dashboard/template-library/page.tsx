"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Star, Plus, Globe, Heart } from "lucide-react"
import { CreateTemplateModal } from "./create-template-modal"
import { TemplateFormModal } from "./template-form-modal"
import { TemplateEditorModal } from "./template-editor-modal"
import { PdfFormModal } from "./pdf-form-modal"
import { PdfTemplateEditorModal } from "./pdf-template-editor-modal"
import { SelectTemplateModal } from "./select-template-modal"
import { DeleteTemplateDialog } from "./delete-template-dialog"
import { DocumentEditModal } from "./document-edit-modal"
import { PdfEditModal } from "./pdf-edit-modal"
import { DataTable } from "@/components/ui/data-table"
import { createColumns, type Template } from "./columns"

export default function TemplatesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [isPdfEditorModalOpen, setIsPdfEditorModalOpen] = useState(false)
  const [isSelectTemplateModalOpen, setIsSelectTemplateModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDocumentEditModalOpen, setIsDocumentEditModalOpen] = useState(false)
  const [isPdfEditModalOpen, setIsPdfEditModalOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)
  const [uploadedPdfFile, setUploadedPdfFile] = useState<File | null>(null)
  const [templates, setTemplates] = useState<Template[]>([
    { name: "Accident and Emergency Nurse's note", type: "Note", uses: 0, lastUsed: "-", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "ED admission note", type: "Document", uses: 0, lastUsed: "-", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "ED discharge summary", type: "Document", uses: 0, lastUsed: "-", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "H & P", type: "Note", uses: 12, lastUsed: "Sep 15, 2025", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "H & P (Issues)", type: "Note", uses: 5, lastUsed: "Sep 10, 2025", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "Issues List", type: "Note", uses: 8, lastUsed: "Sep 12, 2025", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "Patient explainer letter", type: "Document", uses: 3, lastUsed: "-", creator: "Heidi", visibility: "Just me", favorite: true },
    { name: "Referral letter", type: "Document", uses: 7, lastUsed: "-", creator: "Heidi", visibility: "Just me", favorite: true },
    { name: "EDIT OoPdfFormExample", type: "PDF", uses: 2, lastUsed: "17/09/2025", creator: "Heidi", visibility: "Just me", favorite: true },
    { name: "SMART goals", type: "Document", uses: 9, lastUsed: "Sep 14, 2025", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "SOAP", type: "Note", uses: 15, lastUsed: "Sep 16, 2025", creator: "Heidi", visibility: "Just me", favorite: false },
  ])
  
  const handleCreateTemplate = (type: "note" | "pdf") => {
    if (type === "note") {
      // Close the type selection modal and open the form modal
      setIsCreateModalOpen(false)
      setIsFormModalOpen(true)
    } else {
      // Close the type selection modal and open the PDF form modal
      setIsCreateModalOpen(false)
      setIsPdfModalOpen(true)
    }
  }

  const handleTemplateFormCreate = (templateData: { instructions: string; source: "existing" | "blank" }) => {
    console.log("Creating template with data:", templateData)
    // Close form modal and open editor modal
    setIsFormModalOpen(false)
    setIsEditorModalOpen(true)
  }

  const handleTemplateSave = (templateData: {
    name: string
    content: string
    visibility: "only-me" | "team" | "public"
    type: "note" | "document"
    isDefault: boolean
  }) => {
    console.log("Saving template:", templateData)
    // Add your template save logic here
  }

  const handleTemplateSaveForLater = (templateData: {
    name: string
    content: string
    visibility: "only-me" | "team" | "public"
    type: "note" | "document"
    isDefault: boolean
  }) => {
    console.log("Saving template for later:", templateData)
    // Add your template save for later logic here
  }

  const handleBackToTypeSelection = () => {
    setIsFormModalOpen(false)
    setIsCreateModalOpen(true)
  }

  const handlePdfUpload = (file: File) => {
    console.log("PDF uploaded:", file.name)
    // Store the uploaded file and open the PDF template editor
    setUploadedPdfFile(file)
    setIsPdfModalOpen(false)
    setIsPdfEditorModalOpen(true)
  }

  const handleBackToTypeSelectionFromPdf = () => {
    setIsPdfModalOpen(false)
    setIsCreateModalOpen(true)
  }

  const handlePdfTemplateSave = (templateData: {
    name: string
    visibility: "only-me" | "team" | "public"
  }) => {
    console.log("Saving PDF template:", templateData)
    // Add your PDF template save logic here
    setIsPdfEditorModalOpen(false)
    setUploadedPdfFile(null)
  }

  const handleBackToPdfUpload = () => {
    setIsPdfEditorModalOpen(false)
    setIsPdfModalOpen(true)
  }

  const handleAddToFavorites = () => {
    console.log("Add to favorites clicked") // Debug log
    setIsSelectTemplateModalOpen(true)
  }

  const handleTemplateSelect = (template: any) => {
    console.log("Selected template:", template)
    // Handle template selection logic here
    setIsSelectTemplateModalOpen(false)
  }

  const handleDeleteTemplate = (templateName: string) => {
    setTemplateToDelete(templateName)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      console.log("Deleting template:", templateToDelete)
      // Add your delete logic here
      setTemplateToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setTemplateToDelete(null)
    setIsDeleteDialogOpen(false)
  }

  const handleEditTemplate = (template: Template) => {
    console.log("Edit template:", template)
    if (template.type === "PDF") {
      setIsPdfEditModalOpen(true)
    } else {
      setIsDocumentEditModalOpen(true)
    }
  }

  const handleFavoriteTemplate = (template: Template) => {
    console.log("Toggle favorite:", template)
    // Toggle favorite status in the templates array
    setTemplates(prevTemplates => 
      prevTemplates.map(t => 
        t.name === template.name 
          ? { ...t, favorite: !t.favorite }
          : t
      )
    )
  }

  const handleDeleteTemplateFromTable = (template: Template) => {
    handleDeleteTemplate(template.name)
  }

  const handleDocumentEditSave = (data: {
    content: string
    visibility: "only-me" | "team" | "public"
    type: "document" | "note"
    isDefault: boolean
  }) => {
    console.log("Save document edit:", data)
    // Add save logic here
    setIsDocumentEditModalOpen(false)
  }

  const handlePdfEditSave = (data: {
    templateName: string
    visibility: "only-me" | "team" | "public"
  }) => {
    console.log("Save PDF edit:", data)
    // Add save logic here
    setIsPdfEditModalOpen(false)
  }

  const columns = createColumns({
    onEdit: handleEditTemplate,
    onFavorite: handleFavoriteTemplate,
    onDelete: handleDeleteTemplateFromTable,
  })


  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Templates</h1>
          <p className="text-muted-foreground">Manage your templates and create new ones</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            asChild
          >
            <a href="/dashboard/community">
              <Globe className="h-4 w-4" />
              Browse community
            </a>
          </Button>
          <Button 
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create template
          </Button>
        </div>
      </div>

      {/* Favourites */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Favourites</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {templates.filter(t => t.favorite).map((t, i) => (
            <Card key={i} className="group cursor-pointer hover:shadow-md transition-shadow bg-white border border-gray-200">
              <CardHeader className="pb-1 px-3 pt-3">
                <div className="flex items-center justify-between">
                  <Star className="h-3 w-3 text-gray-900 fill-current" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0 hover:bg-gray-100">
                        <MoreHorizontal className="h-3 w-3 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteTemplate(t.name)}
                      >
                        Delete template
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 text-xs line-clamp-2 leading-tight">{t.name}</h3>
                  <p className="text-xs text-gray-500">
                    {t.lastUsed === "-" ? "Never edited" : `Edited ${t.lastUsed}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card 
            className="flex items-center justify-center text-gray-600 cursor-pointer border-dashed border-gray-300 h-full min-h-[100px] hover:bg-gray-50 hover:border-gray-400 transition-colors"
            onClick={handleAddToFavorites}
          >
            <CardContent className="text-center p-3">
              <Plus className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-xs font-medium">Add to favourites</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Library */}
      <div>
        <DataTable 
          columns={columns} 
          data={templates} 
          searchKey="name"
          searchPlaceholder="Search for a template"
          creatorFilterKey="creator"
          dateFilterKey="lastUsed"
        />
      </div>

      {/* Create Template Modal */}
      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTemplateTypeSelect={handleCreateTemplate}
      />

      {/* Template Form Modal */}
      <TemplateFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onBack={handleBackToTypeSelection}
        onTemplateCreate={handleTemplateFormCreate}
      />

      {/* Template Editor Modal */}
      <TemplateEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        onSave={handleTemplateSave}
        onSaveForLater={handleTemplateSaveForLater}
      />

      {/* PDF Form Modal */}
      <PdfFormModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onBack={handleBackToTypeSelectionFromPdf}
        onPdfUpload={handlePdfUpload}
      />

      {/* PDF Template Editor Modal */}
      {uploadedPdfFile && (
        <PdfTemplateEditorModal
          isOpen={isPdfEditorModalOpen}
          onClose={() => setIsPdfEditorModalOpen(false)}
          onBack={handleBackToPdfUpload}
          onSave={handlePdfTemplateSave}
          pdfFile={uploadedPdfFile}
        />
      )}

      {/* Select Template Modal */}
      <SelectTemplateModal
        isOpen={isSelectTemplateModalOpen}
        onClose={() => setIsSelectTemplateModalOpen(false)}
        onTemplateSelect={handleTemplateSelect}
      />

      {/* Delete Template Dialog */}
      <DeleteTemplateDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        templateName={templateToDelete || ""}
      />

      {/* Document Edit Modal */}
      <DocumentEditModal
        isOpen={isDocumentEditModalOpen}
        onClose={() => setIsDocumentEditModalOpen(false)}
        onSave={handleDocumentEditSave}
        templateName="ED discharge summary"
      />

      {/* PDF Edit Modal */}
      <PdfEditModal
        isOpen={isPdfEditModalOpen}
        onClose={() => setIsPdfEditModalOpen(false)}
        onSave={handlePdfEditSave}
        pdfFile={uploadedPdfFile}
        templateName="EDIT OoPdfFormExample.pdf"
      />
    </div>
  )
}
