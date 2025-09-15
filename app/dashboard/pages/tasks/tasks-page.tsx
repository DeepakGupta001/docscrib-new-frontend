"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Calendar, Plus, MoreHorizontal, CheckCircle2 } from "lucide-react"
import { TaskModal } from "./task-modal"

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<{ title: string; category: string } | null>(null)

  const handleNewTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = () => {
    setEditingTask({ title: "need to send report to gupta ji", category: "document" })
    setIsModalOpen(true)
  }

  const handleSaveTask = (task: { title: string; category: string }) => {
    console.log("Saving task:", task)
    // Here you would typically save to backend or update state
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }
  return (
    <div className="flex flex-col bg-slate-50 px-3 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-0">
        {/* <h1 className="text-2xl font-semibold text-slate-800">Tasks</h1> */}
          <div className="p-4"> <h1 className="text-2xl font-bold">Tasks</h1>
        <p>Manage Your Task Here.</p></div>
        <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={handleNewTask}>
          <Plus className="h-4 w-4 mr-2" />
          New task
        </Button>
      </div>

      <Separator className="mb-4" />

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center relative">
          <Search className="absolute left-2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search for a task or patient"
            className="pl-8 w-72"
          />
        </div>

        {/* Status Filter */}
        <Button variant="outline" className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Status
          <Badge variant="secondary" className="ml-2">To Do</Badge>
        </Button>

        {/* Category Filter */}
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Category
          <Badge variant="secondary" className="ml-2">All</Badge>
        </Button>

        {/* Date Filter */}
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date
          <Badge variant="secondary" className="ml-2">All</Badge>
        </Button>

        {/* Reset filters */}
        <button className="text-sm text-slate-500 hover:underline">
          Reset filters
        </button>
      </div>

      {/* Tasks Table */}
      <Card className="overflow-hidden border">
        <div className="grid grid-cols-4 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 border-b">
          <div>Task title</div>
          <div>Patient</div>
          <div>Category</div>
          <div>Created</div>
        </div>

        {/* Row */}
        <div className="grid grid-cols-4 px-4 py-3 items-center text-sm border-b">
          <div className="flex items-center gap-2">
            <input type="radio" className="h-4 w-4" />
            <span className="text-slate-700">need to send report to gupta ji</span>
          </div>
          <div className="text-slate-500">-</div>
          <div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
              Document
            </Badge>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>less than a minute ago</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditTask} >Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <TaskModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        initialData={editingTask || undefined}
      />
    </div>
  )
}
