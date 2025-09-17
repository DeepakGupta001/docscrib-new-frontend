"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from "date-fns"

interface DateTimeSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (date: Date, time: string) => void
  currentDate?: Date
  currentTime?: string
}

export function DateTimeSelectionModal({
  isOpen,
  onClose,
  onSave,
  currentDate = new Date(),
  currentTime = "07:16 PM"
}: DateTimeSelectionModalProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [selectedTime, setSelectedTime] = useState(currentTime)
  const [currentMonth, setCurrentMonth] = useState(currentDate)

  const handleSave = () => {
    onSave(selectedDate, selectedTime)
    onClose()
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value)
  }

  const formatTimeForInput = (time: string) => {
    // Convert 12h format to 24h format for input
    const [timePart, ampm] = time.split(' ')
    const [hours, minutes] = timePart.split(':')
    let hour = parseInt(hours)
    if (ampm === 'PM' && hour !== 12) hour += 12
    if (ampm === 'AM' && hour === 12) hour = 0
    return `${hour.toString().padStart(2, '0')}:${minutes}`
  }

  const formatTimeForDisplay = (time: string) => {
    // Convert 24h format to 12h format for display
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    
    return eachDayOfInterval({ start: startDate, end: endDate })
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const isSelected = (day: Date) => {
    return isSameDay(day, selectedDate)
  }

  const isCurrentMonth = (day: Date) => {
    return isSameMonth(day, currentMonth)
  }

  const isTodayDate = (day: Date) => {
    return isToday(day)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Session Time & Date</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Session Start Time */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Session start time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="time"
                value={formatTimeForInput(selectedTime)}
                onChange={handleTimeChange}
                className="pl-10"
              />
            </div>
          </div>

          {/* Session Date */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Session date</Label>
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-sm">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Days of week header */}
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {getCalendarDays().map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    h-8 w-8 text-xs rounded-md transition-colors
                    ${isSelected(day) 
                      ? 'bg-black text-white' 
                      : isTodayDate(day)
                      ? 'bg-gray-100 text-black font-semibold'
                      : isCurrentMonth(day)
                      ? 'text-black hover:bg-gray-100'
                      : 'text-gray-400'
                    }
                  `}
                >
                  {format(day, 'd')}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
