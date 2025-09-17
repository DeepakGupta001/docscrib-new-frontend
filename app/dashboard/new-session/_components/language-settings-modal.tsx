"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface LanguageSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  inputLanguage?: string
  outputLanguage?: string
  onLanguageChange?: (inputLang: string, outputLang: string) => void
}

export function LanguageSettingsModal({
  isOpen,
  onClose,
  inputLanguage = "English",
  outputLanguage = "English",
  onLanguageChange
}: LanguageSettingsModalProps) {
  const [selectedInputLanguage, setSelectedInputLanguage] = useState(inputLanguage)
  const [selectedOutputLanguage, setSelectedOutputLanguage] = useState(outputLanguage)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" }
  ]

  const handleSave = () => {
    onLanguageChange?.(selectedInputLanguage, selectedOutputLanguage)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Language settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Input Language Section */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-900">Input language</Label>
              <p className="text-xs text-gray-500 mt-1">
                Used for transcripts, dictations and uploaded recordings.
              </p>
            </div>
            <Select value={selectedInputLanguage} onValueChange={setSelectedInputLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select input language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={`input-${language.code}`} value={language.name}>
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{language.flag}</span>
                      <span className="text-sm">{language.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Output Language Section */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-900">Output language</Label>
              <p className="text-xs text-gray-500 mt-1">
                Used for notes and documents.
              </p>
            </div>
            <Select value={selectedOutputLanguage} onValueChange={setSelectedOutputLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select output language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={`output-${language.code}`} value={language.name}>
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{language.flag}</span>
                      <span className="text-sm">{language.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
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
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
