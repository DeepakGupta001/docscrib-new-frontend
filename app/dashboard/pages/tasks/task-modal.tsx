// components/task-modal.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TaskModalProps {
  open: boolean
  onClose: () => void
  onSave: (task: { title: string; category: string }) => void
  initialData?: { title: string; category: string }
}

export function TaskModal({
  open,
  onClose,
  onSave,
  initialData,
}: TaskModalProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [category, setCategory] = useState(initialData?.category || "")

  const handleSave = () => {
    if (!title) return
    onSave({ title, category })
    setTitle("")
    setCategory("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Task" : "New Task"}
          </DialogTitle>
        </DialogHeader>

        {/* Task Title */}
        <div className="grid gap-2">
          <Label htmlFor="title">Task title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
        </div>

        {/* Category Select */}
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="call">Call</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="w-full" variant="default">
            Save task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
