"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Eye,
  List,
  ChevronRight,
  ExternalLink,
  Leaf,
  AlertCircle,
  HelpCircle,
  Settings,
  BookOpen,
  MessageSquare,

  Save,
  Clock,
  Sparkles
} from "lucide-react"

interface TemplateEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (templateData: {
    name: string
    content: string
    visibility: "only-me" | "team" | "public"
    type: "note" | "document"
    isDefault: boolean
  }) => void
  onSaveForLater: (templateData: {
    name: string
    content: string
    visibility: "only-me" | "team" | "public"
    type: "note" | "document"
    isDefault: boolean
  }) => void
  generatedTemplate?: {
    name: string
    content: string
    type: string
    description?: string
  }
}

export function TemplateEditorModal({
  isOpen,
  onClose,
  onSave,
  onSaveForLater,
  generatedTemplate
}: TemplateEditorModalProps) {
  // Initialize state with generated template if provided, otherwise use defaults
  const [templateName, setTemplateName] = useState(generatedTemplate?.name || "Untitled template")
  const [templateContent, setTemplateContent] = useState(generatedTemplate?.content || "")

  const [visibility, setVisibility] = useState<"only-me" | "team" | "public">("only-me")
  const [type, setType] = useState<"note" | "document">(generatedTemplate?.type === "note" ? "note" : "document")
  const [isDefault, setIsDefault] = useState(false)
  const [isHelperOpen, setIsHelperOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("content")

  // Update state when generatedTemplate prop changes
  useEffect(() => {
    if (generatedTemplate) {
      setTemplateName(generatedTemplate.name)
      setTemplateContent(generatedTemplate.content)
      setType(generatedTemplate.type === "note" ? "note" : "document")
    }
  }, [generatedTemplate])

  const handleSave = () => {
    onSave({
      name: templateName,
      content: templateContent,
      visibility,
      type,
      isDefault
    })
    onClose()
  }

  const handleSaveForLater = () => {
    onSaveForLater({
      name: templateName,
      content: templateContent,
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
      <DialogContent className="max-w-7xl h-[95vh] flex flex-col p-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-8 py-6 border-b bg-white/80 backdrop-blur-sm shadow-sm flex-shrink-0">
            <DialogTitle className="sr-only">Template Editor</DialogTitle>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center text-sm text-slate-500 mb-3 font-medium">
                  <span className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Create template
                  </span>
                  <div className="h-px w-4 bg-slate-300 mx-2"></div>
                  <span className="flex items-center bg-violet-50 px-3 py-1.5 rounded-full">
                    <Sparkles className="h-3 w-3 mr-1" />
                    With AI
                  </span>
                  <div className="h-px w-4 bg-slate-300 mx-2"></div>
                  <span className="text-slate-900 font-semibold">Edit template</span>
                </div>

                <div className="flex items-center gap-4">
                  <Input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="text-3xl font-bold h-12 border-none p-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900"
                  />
                  <Badge variant="outline" className="gap-1.5 py-1.5 px-3 bg-amber-50 border-amber-200 text-amber-700">
                    <AlertCircle className="h-3 w-3" />
                    No rules
                  </Badge>
                </div>
              </div>


            </div>
          </DialogHeader>

          <div className="flex flex-1 min-h-0">
            {/* Main Content Area - Left Side */}
            <div className={`flex flex-col transition-all duration-300 ${isHelperOpen ? 'flex-[70]' : 'flex-1'}`}>
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="px-8 pt-6 bg-white/50 backdrop-blur-sm border-b flex-shrink-0">
                  <TabsList className="bg-slate-100/80 p-1">
                    <TabsTrigger value="content" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <MessageSquare className="h-4 w-4" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Settings className="h-4 w-4" />
                      Settings
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Eye className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 bg-white/30 overflow-hidden">
                  {/* Content Tab */}
                  <TabsContent value="content" className="h-full p-0 m-0 data-[state=active]:flex flex-col">
                    <div className="px-8 py-6 flex-1 min-h-0">
                      <Textarea
                        value={templateContent}
                        onChange={(e) => setTemplateContent(e.target.value)}
                        className="h-full w-full resize-none font-mono text-sm bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm focus:shadow-md transition-all duration-200 focus:border-blue-300"
                        placeholder="Enter your template content here..."
                      />
                    </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="h-full p-0 m-0 data-[state=active]:flex flex-col overflow-hidden">
                    <div className="px-8 py-8 space-y-8 flex-1 overflow-y-auto">
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="visibility" className="text-base font-semibold text-slate-900">Visibility</Label>
                          <Select value={visibility} onValueChange={(v: any) => setVisibility(v)}>
                            <SelectTrigger className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="only-me">Only me</SelectItem>
                              <SelectItem value="team">Team</SelectItem>
                              <SelectItem value="public">Public</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="type" className="text-base font-semibold text-slate-900">Template Type</Label>
                          <Select value={type} onValueChange={(v: any) => setType(v)}>
                            <SelectTrigger className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="note">Note</SelectItem>
                              <SelectItem value="document">Document</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between p-6 border rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
                          <div className="space-y-1">
                            <Label htmlFor="default-template" className="text-base font-semibold text-slate-900">
                              Make default template
                            </Label>
                            <p className="text-sm text-slate-600">
                              Set this as your default template for new notes
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-green-100 px-3 py-1 rounded-full">
                              <Leaf className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-semibold text-green-700">+8</span>
                            </div>
                            <Switch
                              id="default-template"
                              checked={isDefault}
                              onCheckedChange={setIsDefault}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Preview Tab */}
                  <TabsContent
                    value="preview"
                    className="h-full p-0 m-0 data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:overflow-hidden"
                  >
                    <div className="flex-1 overflow-y-auto px-8 py-6">
                      <div className="border rounded-xl p-8 bg-white shadow-lg">
                        <h2 className="text-3xl font-bold mb-6 text-slate-900">{templateName}</h2>
                        <div className="max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed break-words">
                            {templateContent}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 p-8 border-t bg-white/80 backdrop-blur-sm flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={handleSaveForLater} className="gap-2 hover:bg-slate-50">
                    <Clock className="h-4 w-4" />
                    Save for Later
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="hover:bg-slate-50">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get help with templates</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleClose} className="hover:bg-slate-50">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg">
                    <Save className="h-4 w-4" />
                    Save Template
                  </Button>
                </div>
              </div>
            </div>

            {/* Template Guide Panel - Right Side */}
            {isHelperOpen && (
              <div className="flex-[30] bg-gradient-to-b from-slate-50 to-slate-100 border-l flex flex-col">
                <div className="flex items-center justify-between p-6 border-b bg-white/50">
                  <h3 className="text-lg font-semibold text-slate-900">Template Guide</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsHelperOpen(false)}
                    className="h-8 w-8 p-0 hover:bg-slate-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Section Headings */}
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <h4 className="font-medium flex items-center gap-2 text-sm text-slate-900 mb-3">
                      <div className="p-1.5 bg-blue-100 rounded">
                        <Settings className="h-3 w-3 text-blue-600" />
                      </div>
                      Section headings
                    </h4>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Write headings in plain text for your writing style.
                    </p>
                    <div className="p-2 bg-slate-50 rounded text-xs font-mono border">
                      e.g. Subjective
                    </div>
                  </div>

                  {/* Placeholders */}
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <h4 className="font-medium flex items-center gap-2 text-sm text-slate-900 mb-3">
                      <div className="p-1.5 bg-violet-100 rounded">
                        <HelpCircle className="h-3 w-3 text-violet-600" />
                      </div>
                      Placeholders
                    </h4>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Use [ ] for areas Docscrib will fill in.
                    </p>
                    <div className="p-2 bg-slate-50 rounded text-xs font-mono border">
                      e.g. [Patient's medical history]
                    </div>
                  </div>

                  {/* Verbatim */}
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <h4 className="font-medium flex items-center gap-2 text-sm text-slate-900 mb-3">
                      <div className="p-1.5 bg-green-100 rounded">
                        <BookOpen className="h-3 w-3 text-green-600" />
                      </div>
                      Verbatim text
                    </h4>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Use " " for exact text every time.
                    </p>
                    <div className="p-2 bg-slate-50 rounded text-xs font-mono border">
                      e.g. "Dr. Smith, MD"
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <h4 className="font-medium flex items-center gap-2 text-sm text-slate-900 mb-3">
                      <div className="p-1.5 bg-amber-100 rounded">
                        <List className="h-3 w-3 text-amber-600" />
                      </div>
                      Instructions
                    </h4>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Use ( ) for AI instructions.
                    </p>
                    <div className="p-2 bg-slate-50 rounded text-xs font-mono border">
                      e.g. (only if mentioned)
                    </div>
                  </div>

                  {/* Help Note */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Add AI instructions at the end if template doesn't work as expected.
                    </p>
                  </div>

                  {/* Help Link */}
                  <div className="pt-4 border-t border-slate-200">
                    <Button variant="link" className="p-0 h-auto text-xs font-medium text-blue-600 hover:text-blue-700">
                      Help center
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Minimize button when panel is closed - Right Side */}
            {!isHelperOpen && (
              <div className="flex flex-col items-center justify-start pt-6 bg-slate-100 border-l w-12">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsHelperOpen(true)}
                  className="h-8 w-8 p-0 hover:bg-slate-200"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}