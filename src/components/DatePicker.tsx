"use client";

import { HTMLAttributes } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";

interface DatePickerProps extends HTMLAttributes<HTMLDivElement> {
  setSearchDate: (date: DateRange | undefined) => void;
  searchDate: DateRange | undefined;
}

export function DatePicker({
  className,
  searchDate,
  setSearchDate,
}: DatePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="searchDate"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal bg-[#1E1E1E] border-[#555555] text-[#999999]",
              !searchDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" color="#FD6F10" />
            {searchDate?.from ? (
              searchDate.to ? (
                <>
                  {format(searchDate.from, "LLL dd, y")} -{" "}
                  {format(searchDate.to, "LLL dd, y")}
                </>
              ) : (
                format(searchDate.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={searchDate?.from}
            selected={searchDate}
            onSelect={setSearchDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
