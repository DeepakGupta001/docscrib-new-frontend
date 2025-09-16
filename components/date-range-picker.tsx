"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface CalendarDateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange | undefined;
  onDateChange?: (date: DateRange | undefined) => void;
}

export default function CalendarDateRangePicker({
  className,
  date: externalDate,
  onDateChange,
}: CalendarDateRangePickerProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(undefined);

  const date = externalDate !== undefined ? externalDate : internalDate;
  const setDate = onDateChange || setInternalDate;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal flex items-center gap-2",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Date</span>
            <span className="text-muted-foreground">|</span>
            {date?.from ? (
              date.to ? (
                <span className="px-2 py-0.5 rounded-md bg-muted text-sm">
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-muted text-sm">
                  {format(date.from, "LLL dd, y")}
                </span>
              )
            ) : (
              <span className="text-sm text-muted-foreground">Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setDate(undefined)}
            >
              Clear dates
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
