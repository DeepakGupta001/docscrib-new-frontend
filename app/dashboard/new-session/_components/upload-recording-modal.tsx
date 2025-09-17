"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Upload } from "lucide-react"

interface UploadRecordingModalProps {
    isOpen: boolean
    onClose: () => void
    onUpload?: (file: File, mode: "transcribe" | "dictate") => void
}

export function UploadRecordingModal({
    isOpen,
    onClose,
    onUpload
}: UploadRecordingModalProps) {
    const [selectedMode, setSelectedMode] = useState<"transcribe" | "dictate">("transcribe")
    const [isDragOver, setIsDragOver] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            const file = files[0]
            if (isValidFileType(file)) {
                setSelectedFile(file)
            }
        }
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0]
            if (isValidFileType(file)) {
                setSelectedFile(file)
            }
        }
    }

    const isValidFileType = (file: File) => {
        const validTypes = ['audio/mp3', 'audio/wav', 'video/mp4']
        return validTypes.includes(file.type)
    }

    const handleUpload = () => {
        if (selectedFile && onUpload) {
            onUpload(selectedFile, selectedMode)
            onClose()
        }
    }

    const handleClose = () => {
        setSelectedFile(null)
        setIsDragOver(false)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Upload a recording</DialogTitle>
                       
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Mode Selection Tabs */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setSelectedMode("transcribe")}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedMode === "transcribe"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Transcribe
                        </button>
                        <button
                            onClick={() => setSelectedMode("dictate")}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedMode === "dictate"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Dictate
                        </button>
                    </div>

                    {/* File Upload Area */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                                ? "border-blue-400 bg-blue-50"
                                : selectedFile
                                    ? "border-green-400 bg-green-50"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium mb-2">
                            {selectedFile ? selectedFile.name : "Click or drag file to this area to upload"}
                        </p>
                        <p className="text-gray-500 text-sm">
                            Supported formats: mp3, wav, mp4
                        </p>
                        <input
                            type="file"
                            accept=".mp3,.wav,.mp4,audio/mp3,audio/wav,video/mp4"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="inline-block mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 cursor-pointer transition-colors"
                        >
                            Choose File
                        </label>

                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile}
                            variant="default"
                        >
                            Upload
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
