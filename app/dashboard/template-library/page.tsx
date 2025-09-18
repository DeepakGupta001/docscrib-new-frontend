"use client"

import { useState, useEffect, useCallback } from "react"
import { templateApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { useDebounce } from "@/lib/hooks/use-debounce"
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
import { VisibilityChangeModal } from "./visibility-change-modal"
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
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)
  const [templateToChangeVisibility, setTemplateToChangeVisibility] = useState<Template | null>(null)
  const [generatedTemplate, setGeneratedTemplate] = useState<{
    name: string
    content: string
    type: string
    description?: string
  } | undefined>(undefined)
  
  console.log("Modal states:", { isVisibilityModalOpen, templateToChangeVisibility })
  const [uploadedPdfFile, setUploadedPdfFile] = useState<File | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [favoriteTemplates, setFavoriteTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedVisibility, setSelectedVisibility] = useState<string>("all")

  // Use debounce hook for search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Load templates when filters change (only affects data table)
  useEffect(() => {
    loadTemplates()
  }, [debouncedSearchQuery, selectedType, selectedVisibility])

  // Load templates and favorites on component mount
  useEffect(() => {
    loadTemplates()
    loadFavoriteTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setIsLoading(true)
      const params: any = {}
      
      if (debouncedSearchQuery) params.query = debouncedSearchQuery
      if (selectedType !== "all") params.type = selectedType
      if (selectedVisibility !== "all") params.visibility = selectedVisibility
      
      const response = await templateApi.getTemplates(params)
      
      if (response.success) {
        // Transform API response to match Template interface
        const transformedTemplates = response.data.map((template: any) => ({
          id: template.id,
          name: template.name,
          type: template.type === 'note' ? 'Note' : template.type === 'document' ? 'Document' : 'PDF',
          uses: template.uses,
          lastUsed: template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : "-",
          creator: template.creator,
          visibility: template.visibility === 'only-me' ? 'Just me' : template.visibility === 'team' ? 'Team' : 'Public',
          favorite: template.isFavorite,
          content: template.content,
          pdfUrl: template.pdfUrl,
          isDefault: template.isDefault,
          highlightContribution: template.highlightContribution
        }))
        setTemplates(transformedTemplates)
      } else {
        toast.error("Failed to load templates", {
          description: response.error || "Please try again later"
        })
      }
    } catch (error) {
      console.error("Error loading templates:", error)
      toast.error("Failed to load templates", {
        description: "Please try again later"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadFavoriteTemplates = async () => {
    try {
      const response = await templateApi.getFavoriteTemplates()
      
      if (response.success) {
        // Transform API response to match Template interface
        const transformedFavorites = response.data.map((template: any) => ({
          id: template.id,
          name: template.name,
          type: template.type === 'note' ? 'Note' : template.type === 'document' ? 'Document' : 'PDF',
          uses: template.uses,
          lastUsed: template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : "-",
          creator: template.creator,
          visibility: template.visibility === 'only-me' ? 'Just me' : template.visibility === 'team' ? 'Team' : 'Public',
          favorite: template.isFavorite,
          content: template.content,
          pdfUrl: template.pdfUrl,
          isDefault: template.isDefault,
          highlightContribution: template.highlightContribution
        }))
        setFavoriteTemplates(transformedFavorites)
      } else {
        console.error("Failed to load favorite templates:", response.error)
      }
    } catch (error) {
      console.error("Error loading favorite templates:", error)
    }
  }
  
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

  const handleGeneratedTemplate = (generatedTemplate: {
    name: string
    content: string
    type: string
    description?: string
  }) => {
    console.log("Generated template received:", generatedTemplate)
    setGeneratedTemplate(generatedTemplate)
    // Close form modal and open editor modal
    setIsFormModalOpen(false)
    setIsEditorModalOpen(true)
  }

  const handleTemplateSave = async (templateData: {
    name: string
    content: string
    visibility: "only-me" | "team" | "public"
    type: "note" | "document"
    isDefault: boolean
  }) => {
    try {
      const response = await templateApi.createTemplate({
        name: templateData.name,
        type: templateData.type,
        content: templateData.content,
        visibility: templateData.visibility === 'public' ? 'community' : templateData.visibility,
        isDefault: templateData.isDefault
      })

      if (response.success) {
        toast.success("Template created successfully!")
        setIsEditorModalOpen(false)
        loadTemplates() // Reload templates
        loadFavoriteTemplates() // Reload favorites in case it's marked as favorite
      } else {
        toast.error("Failed to create template", {
          description: response.error || "Please try again"
        })
      }
    } catch (error) {
      console.error("Error creating template:", error)
      toast.error("Failed to create template", {
        description: "Please try again later"
      })
    }
  }

  const handleTemplateSaveForLater = async (templateData: {
    name: string
    content: string
    visibility: "only-me" | "team" | "public"
    type: "note" | "document"
    isDefault: boolean
  }) => {
    try {
      const response = await templateApi.createTemplate({
        name: templateData.name,
        type: templateData.type,
        content: templateData.content,
        visibility: templateData.visibility === 'public' ? 'community' : templateData.visibility,
        isDefault: templateData.isDefault
      })

      if (response.success) {
        toast.success("Template saved successfully!")
        setIsEditorModalOpen(false)
        loadTemplates() // Reload templates
        loadFavoriteTemplates() // Reload favorites in case favorite status changed
      } else {
        toast.error("Failed to save template", {
          description: response.error || "Please try again"
        })
      }
    } catch (error) {
      console.error("Error saving template:", error)
      toast.error("Failed to save template", {
        description: "Please try again later"
      })
    }
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

  const handlePdfTemplateSave = async (templateData: {
    name: string
    visibility: "only-me" | "team" | "public"
  }) => {
    try {
      if (!uploadedPdfFile) {
        toast.error("No PDF file to upload")
        return
      }

      const formData = new FormData()
      formData.append('pdf', uploadedPdfFile)
      formData.append('name', templateData.name)
      formData.append('visibility', templateData.visibility)

      const response = await templateApi.uploadPdfTemplate(formData)

      if (response.success) {
        toast.success("PDF template created successfully!")
    setIsPdfEditorModalOpen(false)
    setUploadedPdfFile(null)
        loadTemplates() // Reload templates
        loadFavoriteTemplates() // Reload favorites in case it's marked as favorite
      } else {
        toast.error("Failed to create PDF template", {
          description: response.error || "Please try again"
        })
      }
    } catch (error) {
      console.error("Error creating PDF template:", error)
      toast.error("Failed to create PDF template", {
        description: "Please try again later"
      })
    }
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

  const handleTemplateModalClose = () => {
    setIsSelectTemplateModalOpen(false)
  }

  const handleFavoriteToggle = () => {
    // This is called from select template modal when favorites are toggled
    // We need to refresh to get the updated favorite status
    loadTemplates()
    loadFavoriteTemplates()
  }

  const handleRemoveFromFavorites = async (template: Template) => {
    try {
      if (!template.id) {
        toast.error("Template ID not found")
        return
      }

      const response = await templateApi.toggleFavorite(template.id, false)

      if (response.success) {
        toast.success("Removed from favorites")
        
        // Update only the specific template in local state instead of reloading everything
        setTemplates(prevTemplates => 
          prevTemplates.map(t => 
            t.id === template.id 
              ? { ...t, favorite: false }
              : t
          )
        )
        
        // Remove from favorite templates state
        setFavoriteTemplates(prevFavorites => 
          prevFavorites.filter(t => t.id !== template.id)
        )
      } else {
        toast.error("Failed to remove from favorites", {
          description: response.error || "Please try again"
        })
      }
    } catch (error) {
      console.error("Error removing from favorites:", error)
      toast.error("Failed to remove from favorites", {
        description: "Please try again later"
      })
    }
  }

  const handleDeleteTemplate = (templateName: string) => {
    setTemplateToDelete(templateName)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (templateToDelete) {
      try {
        // Find the template ID from the template name
        const template = templates.find(t => t.name === templateToDelete)
        if (!template || !template.id) {
          toast.error("Template not found")
          return
        }

        const response = await templateApi.deleteTemplate(template.id)

        if (response.success) {
          toast.success("Template deleted successfully!")
          loadTemplates() // Reload templates
          loadFavoriteTemplates() // Reload favorites in case deleted template was in favorites
        } else {
          toast.error("Failed to delete template", {
            description: response.error || "Please try again"
          })
        }
      } catch (error) {
        console.error("Error deleting template:", error)
        toast.error("Failed to delete template", {
          description: "Please try again later"
        })
      } finally {
      setTemplateToDelete(null)
        setIsDeleteDialogOpen(false)
      }
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

  const handleFavoriteTemplate = async (template: Template) => {
    try {
      if (!template.id) {
        toast.error("Template ID not found")
        return
      }

      const response = await templateApi.toggleFavorite(template.id, !template.favorite)

      if (response.success) {
        toast.success(template.favorite ? "Removed from favorites" : "Added to favorites")
        
        // Update only the specific template in local state instead of reloading everything
        setTemplates(prevTemplates => 
          prevTemplates.map(t => 
            t.id === template.id 
              ? { ...t, favorite: !t.favorite }
              : t
          )
        )
      } else {
        toast.error("Failed to update favorite status", {
          description: response.error || "Please try again"
        })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast.error("Failed to update favorite status", {
        description: "Please try again later"
      })
    }
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

  const handleChangeVisibility = (template: Template) => {
    console.log("Change visibility clicked for template:", template)
    console.log("Template type:", template.type)
    // Only open visibility modal for Notes and Documents (not PDFs)
    if (template.type === "Note" || template.type === "Document") {
      console.log("Opening visibility modal for Note/Document template")
      setTemplateToChangeVisibility(template)
      setIsVisibilityModalOpen(true)
    } else {
      console.log("Not a Note or Document template, modal will not open")
    }
  }

  const handleVisibilitySave = async (visibility: "only-me" | "team" | "community", highlightContribution?: boolean) => {
    if (templateToChangeVisibility && templateToChangeVisibility.id) {
      try {
        const response = await templateApi.updateTemplateVisibility(templateToChangeVisibility.id, {
          visibility,
          highlightContribution
        })

        if (response.success) {
          toast.success("Visibility updated successfully!")
          loadTemplates() // Reload templates to get updated data
          loadFavoriteTemplates() // Reload favorites to get updated data
        } else {
          toast.error("Failed to update visibility", {
            description: response.error || "Please try again"
          })
        }
      } catch (error) {
        console.error("Error updating visibility:", error)
        toast.error("Failed to update visibility", {
          description: "Please try again later"
        })
      }
    }
    
    setIsVisibilityModalOpen(false)
    setTemplateToChangeVisibility(null)
  }

  const columns = createColumns({
    onEdit: handleEditTemplate,
    onFavorite: handleFavoriteTemplate,
    onDelete: handleDeleteTemplateFromTable,
    onChangeVisibility: handleChangeVisibility,
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
          {favoriteTemplates.map((t, i) => (
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
                        onClick={() => handleRemoveFromFavorites(t)}
                      >
                        Remove from favorites
                      </DropdownMenuItem>
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

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="note">Notes</option>
              <option value="document">Documents</option>
              <option value="pdf">PDFs</option>
            </select>
            <select
              value={selectedVisibility}
              onChange={(e) => setSelectedVisibility(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Visibility</option>
              <option value="only-me">Only Me</option>
              <option value="team">Team</option>
              <option value="community">Community</option>
            </select>
          </div>
        </div>
      </div>

      {/* Library */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading templates...</div>
          </div>
        ) : (
        <DataTable 
          columns={columns} 
          data={templates} 
          creatorFilterKey="creator"
          dateFilterKey="lastUsed"
        />
        )}
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
        onGeneratedTemplate={handleGeneratedTemplate}
      />

      {/* Template Editor Modal */}
      <TemplateEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => {
          setIsEditorModalOpen(false)
          setGeneratedTemplate(undefined) // Clear generated template when closing
        }}
        onSave={handleTemplateSave}
        onSaveForLater={handleTemplateSaveForLater}
        generatedTemplate={generatedTemplate}
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
        onClose={handleTemplateModalClose}
        onTemplateSelect={handleTemplateSelect}
        onFavoriteToggle={handleFavoriteToggle}
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

      {/* Visibility Change Modal */}
      <VisibilityChangeModal
        isOpen={isVisibilityModalOpen}
        onClose={() => {
          setIsVisibilityModalOpen(false)
          setTemplateToChangeVisibility(null)
        }}
        onSave={handleVisibilitySave}
        templateName={templateToChangeVisibility?.name}
        currentVisibility={
          templateToChangeVisibility?.visibility === "Team" ? "team" : 
          templateToChangeVisibility?.visibility === "Community" ? "community" : "only-me"
        }
      />
    </div>
  )
}
