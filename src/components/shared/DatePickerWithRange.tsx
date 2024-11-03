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
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full sm:w-[300px] text-[#A3A7AA] flex items-center text-left font-normal py-3 px-2 bg-[#151515]"
            )}
          >
            <FaCalendar className="mr-2 size-7" />
            <div className="text-xs space-y-1">
              <div className="text-white font-medium text-sm">
                Change Period
              </div>
              {props.selected?.from ? (
                props.selected.to ? (
                  <>
                    {format(props.selected.from, "LLL dd, y")} -{" "}
                    {format(props.selected.to, "LLL dd, y")}
                  </>
                ) : (
                  format(props.selected.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </div>
            <FaSortDown className="text-2xl ml-auto -mt-2" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 bg-[#151515] shadow-lg text-white"
          align="start"
        >
          <Calendar
            mode="range"
            defaultMonth={props.selected?.from}
            selected={props.selected}
            onSelect={props.onSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
