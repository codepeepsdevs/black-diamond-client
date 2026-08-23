"use client";

import { cn } from "@/utils/cn";
import * as React from "react";
import {
  Chevron,
  DateRange,
  DayFlag,
  DayPicker,
  Nav,
  NextMonthButton,
  PreviousMonthButton,
  SelectionState,
  UI,
} from "react-day-picker";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        [UI.Months]:
          "flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0",
        [UI.Month]: "space-y-4",
        [UI.MonthCaption]: "flex justify-center pt-1 relative items-center h-8",
        [UI.CaptionLabel]: "text-sm font-medium text-white",
        [UI.Nav]:
          "space-x-1 flex items-center justify-between absolute left-0 right-0 top-0",
        [UI.MonthGrid]: "w-full border-collapse space-y-1",
        [UI.Weekdays]: "flex",
        [UI.Weekday]: "text-[#6b6b6b] rounded-md w-9 font-normal text-[0.75rem] uppercase tracking-wide",
        [UI.Week]: "flex w-full mt-2",
        [UI.Day]:
          "h-9 w-9 text-center grid place-items-center text-sm p-0 relative rounded-md hover:bg-white/10 transition-colors [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-white/10 [&:has([aria-selected])]:bg-white [&:has([aria-selected])]:text-black first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        [SelectionState.range_end]: "day-range-end",
        [SelectionState.selected]:
          "bg-white text-black hover:bg-white hover:text-black focus:bg-white focus:text-black rounded-md",
        [DayFlag.today]: "bg-transparent ring-1 ring-white/20 text-white font-medium",
        [DayFlag.outside]:
          "day-outside text-[#6b6b6b] opacity-40 aria-selected:bg-white/10 aria-selected:text-white/60 aria-selected:opacity-100",
        [DayFlag.disabled]: "text-[#6b6b6b] opacity-30",
        [SelectionState.range_middle]:
          "aria-selected:bg-white/10 aria-selected:text-white",
        [DayFlag.hidden]: "invisible",
        ...classNames,
      }}
      components={{
        // Chevron: ({ ...props }) => (
        //   <Chevron {...props} className={cn(className, "")} />
        // ),
        // Nav: ({ className, ...props }) => (
        //   <Nav
        //     {...props}
        //     className={cn(className, "px-3 flex items-center justify-between")}
        //   />
        // ),
        PreviousMonthButton: ({ className, ...props }) => {
          return (
            <button
              {...props}
              className="size-7 rounded-md bg-transparent hover:bg-white/10 text-white/60 hover:text-white grid place-items-center absolute left-0 top-0 transition-colors"
            >
              <FiChevronLeft className="size-4" />
            </button>
          );
        },
        NextMonthButton: ({ className, ...props }) => {
          return (
            <button
              {...props}
              className="size-7 rounded-md bg-transparent hover:bg-white/10 text-white/60 hover:text-white grid place-items-center absolute right-0 top-0 transition-colors"
            >
              <FiChevronRight className="size-4" />
            </button>
          );
        },
        // PreviousMonthButton: ({ className, ...props }) => (
        //   <PreviousMonthButton
        //     {...props}
        //     className={cn(className, "text-white bg-[#333333] shrink-0")}
        //   />
        // ),
        // IconLeft: ({ ...props }) => (
        //   <FiChevronRight className="h-4 w-4 text-white" />
        // ),
        // IconRight: ({ ...props }) => (
        //   <FiChevronRight className="h-4 w-4 text-white" />
        // ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
