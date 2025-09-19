"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Eye, Users, Globe, Lock } from "lucide-react"

interface VisibilityChangeModalProps {
  isOpen: boolean
  onClose: () => void
  templateName?: string
  currentVisibility?: "only-me" | "team" | "community"
  onSave?: (visibility: "only-me" | "team" | "community", highlightContribution?: boolean) => void
}

export function VisibilityChangeModal({
  isOpen,
  onClose,
  templateName = "Template Name",
  currentVisibility = "only-me",
  onSave
}: VisibilityChangeModalProps) {
  console.log("VisibilityChangeModal props:", { isOpen, templateName, currentVisibility })
  const [selectedVisibility, setSelectedVisibility] = useState<"only-me" | "team" | "community">(currentVisibility)
  const [highlightContribution, setHighlightContribution] = useState(false)

  const handleSave = () => {
    onSave?.(selectedVisibility, highlightContribution)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  const visibilityOptions = [
    {
      value: "team",
      label: "Team",
      description: "Allow other users within your team to use this template. Team members will not be able to edit the template.",
      icon: Users
    },
    {
      value: "community",
      label: "Community",
      description: "Allow other Docscrib users to use your template. Personal information like phone numbers, addresses, and names will be removed.",
      icon: Globe
    },
    {
      value: "only-me",
      label: "Only me",
      description: "Don't allow anyone else to use this template",
      icon: Lock
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Change visibility</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm text-gray-600">
            Choose who can see the template <span className="font-medium">"{templateName}"</span>
          </div>

          <div className="space-y-3">
            {visibilityOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedVisibility === option.value
              return (
                <Card
                  key={option.value}
                  className={`p-4 cursor-pointer transition-all hover:shadow-sm ${
                    isSelected
                      ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedVisibility(option.value as "only-me" | "team" | "community")}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      isSelected ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isSelected ? "text-blue-600" : "text-gray-600"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-sm ${
                        isSelected ? "text-blue-900" : "text-gray-900"
                      }`}>
                        {option.label}
                      </h3>
                      <p className={`text-xs mt-1 ${
                        isSelected ? "text-blue-700" : "text-gray-500"
                      }`}>
                        {option.description}
                      </p>
                      
                      {/* Highlight contribution toggle for Community option */}
                      {option.value === "community" && (
                        <div className="mt-3 flex items-center justify-between">
                          <Label htmlFor="highlight-contribution" className="text-xs text-gray-700">
                            Display your name, profile picture, and clinic as the template creator.
                          </Label>
                          <Switch
                            id="highlight-contribution"
                            checked={highlightContribution}
                            onCheckedChange={setHighlightContribution}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6"
          >
            Save visibility settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
