"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LanguageSettingsModal } from "./language-settings-modal"

interface LanguageSelectionButtonProps {
  currentLanguage?: string
  onLanguageSelect?: (language: string) => void
}

export function LanguageSelectionButton({
  currentLanguage = "English",
  onLanguageSelect
}: LanguageSelectionButtonProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

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

  const handleLanguageSettingsChange = (inputLang: string, outputLang: string) => {
    // Update the displayed language to input language
    setSelectedLanguage(inputLang)
    onLanguageSelect?.(inputLang)
    console.log("Language settings changed:", { inputLang, outputLang })
  }

  const currentLanguageData = languages.find(lang => lang.name === selectedLanguage)

  return (
    <>
      <Button 
        variant="ghost" 
        onClick={() => setIsSettingsModalOpen(true)}
        className="h-auto p-0 text-slate-600 hover:text-slate-800 hover:bg-transparent"
      >
        <div className="flex items-center gap-1">
          <span className="text-sm">{currentLanguageData?.flag}</span>
          <span className="text-sm">{selectedLanguage}</span>
        </div>
      </Button>

      {/* Language Settings Modal */}
      <LanguageSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        inputLanguage={selectedLanguage}
        outputLanguage={selectedLanguage}
        onLanguageChange={handleLanguageSettingsChange}
      />
    </>
  )
}
