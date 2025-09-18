"use client"

import { useState, useEffect } from "react"
import { templateApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, FileText, FileCheck, Calendar, Edit, Star } from "lucide-react"

interface Template {
  id: number
  name: string
  type: "note" | "document" | "pdf"
  content?: string
  visibility: "only-me" | "team" | "community"
  isFavorite: boolean
  isDefault: boolean
  uses: number
  lastUsed?: string
  creator: string
  userId: number
  highlightContribution: boolean
  metadata?: any
  createdAt: string
  updatedAt: string
}

interface SelectTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onTemplateSelect: (template: Template) => void
  onFavoriteToggle?: () => void
}

export function SelectTemplateModal({ 
  isOpen, 
  onClose, 
  onTemplateSelect,
  onFavoriteToggle
}: SelectTemplateModalProps) {
  console.log("SelectTemplateModal rendered, isOpen:", isOpen) // Debug log
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Use debounce hook for search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Load templates when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTemplates()
    }
  }, [isOpen])

  // Reload templates when debounced search query changes
  useEffect(() => {
    if (isOpen) {
      loadTemplates()
    }
  }, [debouncedSearchQuery, isOpen])

  const loadTemplates = async () => {
    try {
      setIsLoading(true)
      const params: any = {}
      
      if (debouncedSearchQuery.trim()) {
        params.query = debouncedSearchQuery.trim()
      }
      
      const response = await templateApi.getTemplates(params)
      
      if (response.success) {
        setTemplates(response.data)
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

  // Group templates by type since we're getting them from API
  const groupedTemplates = templates.reduce((acc, template) => {
    const category = `${template.type.charAt(0).toUpperCase() + template.type.slice(1)} templates`
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(template)
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

  const handleToggleFavorite = async (template: Template, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await templateApi.toggleFavorite(template.id, !template.isFavorite)

      if (response.success) {
        toast.success(template.isFavorite ? "Removed from favorites" : "Added to favorites")
        // Update the template in the local state
        setTemplates(prevTemplates => 
          prevTemplates.map(t => 
            t.id === template.id 
              ? { ...t, isFavorite: !t.isFavorite }
              : t
          )
        )
        // Notify parent component to refresh templates
        if (onFavoriteToggle) {
          onFavoriteToggle()
        }
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

  const handleSelect = async () => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate)
      if (template) {
        try {
          // Add to favorites if not already favorite
          if (!template.isFavorite) {
            const response = await templateApi.toggleFavorite(template.id, true)

            if (response.success) {
              toast.success("Added to favorites!")
              
              // Update local state
              setTemplates(prevTemplates => 
                prevTemplates.map(t => 
                  t.id === template.id 
                    ? { ...t, isFavorite: true }
                    : t
                )
              )
              
              // Notify parent component to refresh
              if (onFavoriteToggle) {
                onFavoriteToggle()
              }
            } else {
              toast.error("Failed to add to favorites", {
                description: response.error || "Please try again"
              })
            }
          }

          // Call the template selection callback
          onTemplateSelect(template)
          onClose()
        } catch (error) {
          console.error("Error adding to favorites:", error)
          toast.error("Failed to add to favorites", {
            description: "Please try again later"
          })
          
          // Still proceed with template selection even if favorite toggle fails
          onTemplateSelect(template)
          onClose()
        }
      }
    }
  }

  const handleClose = () => {
    setSearchQuery("")
    setSelectedTemplate(null)
    setTemplates([])
    onClose()
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading templates...</div>
              </div>
            ) : Object.keys(groupedTemplates).length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-muted-foreground mb-2">No templates found</div>
                  <div className="text-sm text-muted-foreground">
                    {searchQuery ? "Try adjusting your search terms" : "Create your first template to get started"}
                  </div>
                </div>
              </div>
            ) : (
              Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                <div key={category} className="border-b last:border-b-0">
                  <div className="px-6 py-3 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700">{category}</h3>
                  </div>
                  <div className="divide-y">
                    {categoryTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateClick(template)}
                        className={`px-6 py-4 flex items-center justify-between hover:bg-blue-50 cursor-pointer transition-colors ${
                          selectedTemplate === template.id ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {getTemplateIcon(template.type)}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {template.name}
                              </span>
                              {template.isFavorite && (
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              by {template.creator} • {template.uses} uses
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleToggleFavorite(template, e)}
                            className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                              template.isFavorite ? "text-yellow-500" : "text-gray-400"
                            }`}
                            title={template.isFavorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Star className={`h-4 w-4 ${template.isFavorite ? "fill-current" : ""}`} />
                          </button>
                          <button
                            onClick={(e) => handleEdit(template, e)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSelect}
                disabled={!selectedTemplate}
              >
                {selectedTemplate && templates.find(t => t.id === selectedTemplate)?.isFavorite 
                  ? "Select Template" 
                  : "Select & Add to Favorites"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
