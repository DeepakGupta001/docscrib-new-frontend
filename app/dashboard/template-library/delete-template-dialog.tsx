"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  templateName: string
}

export function DeleteTemplateDialog({
  isOpen,
  onClose,
  onConfirm,
  templateName
}: DeleteTemplateDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this template?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div>Be careful, templates cannot be restored once deleted.</div>
            <div>Any existing notes created with this template will not be deleted.</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Keep template
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete template
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
