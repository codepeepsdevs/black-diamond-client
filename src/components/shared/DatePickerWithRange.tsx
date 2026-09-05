"use client";

import * as React from "react";
import { addDays, format, subMonths } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";

import AdminButton from "../buttons/AdminButton";
import { BsCalendar } from "react-icons/bs";
import { cn } from "@/utils/cn";
import { Calendar, CalendarProps } from "./Calendar";
import { FaCalendar } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

export function DatePickerWithRange({
  className,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  selected: DateRange | undefined;
  onSelect: (value: any) => void;
}) {
  return (
    <div className={cn("grid gap-2 w-full sm:w-auto", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full sm:w-[320px] flex items-center gap-3 text-left font-normal py-3 px-4 bg-[#1a1a1a] hover:bg-[#1e1e1e] border border-[#262626] rounded-xl transition-colors group min-w-0",
              "focus:outline-none focus:ring-1 focus:ring-white/10"
            )}
          >
            <span className="size-9 rounded-lg bg-[#252525] grid place-items-center shrink-0 group-hover:bg-[#2a2a2a] transition-colors">
              <FaCalendar className="text-white/80 text-sm" />
            </span>
            <div className="text-xs space-y-0.5 min-w-0 flex-1">
              <div className="text-white font-medium text-sm leading-none">Change Period</div>
              <div className="text-[#A3A7AA] text-xs truncate">
                {props.selected?.from ? (
                  props.selected.to ? (
                    <>
                      {format(props.selected.from, "LLL dd, y")} – {format(props.selected.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(props.selected.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </div>
            </div>
            <FaSortDown className="text-white/40 ml-auto -mt-1 shrink-0 group-hover:text-white/60 transition-colors" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 bg-[#1a1a1a] border border-[#262626] shadow-2xl rounded-xl overflow-hidden text-white w-[calc(100vw-1rem)] sm:w-auto max-w-[95vw] z-[100]"
          align="end"
          side="bottom"
          sideOffset={8}
          collisionPadding={16}
          avoidCollisions
        >
          <div className="bg-[#1a1a1a] max-w-[calc(100vw-1rem)] sm:max-w-[640px] overflow-auto">
            <Calendar
              mode="range"
              defaultMonth={props.selected?.from}
              selected={props.selected}
              onSelect={props.onSelect}
              numberOfMonths={2}
              className="p-2 sm:p-4"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
