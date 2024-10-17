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
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        [UI.Month]: "space-y-4",
        [UI.MonthCaption]: "flex justify-center pt-1 relative items-center",
        [UI.CaptionLabel]: "text-sm font-medium",
        [UI.Nav]:
          "space-x-1 flex items-center justify-between absolute left-0 right-0",
        // nav_button: cn(
        //   "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        // ),
        // [UI.PreviousMonthButton]:
        //   "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        // [UI.NextMonthButton]:
        //   "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        [UI.MonthGrid]: "w-full border-collapse space-y-1",
        [UI.Weekdays]: "flex",
        [UI.Weekday]: "text-red-500 rounded-md w-9 font-normal text-[0.8rem]",
        [UI.Week]: "flex w-full mt-2",
        [UI.Day]:
          "h-9 w-9 text-center grid place-items-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-lime-500/50 [&:has([aria-selected])]:bg-lime-500 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        // day: cn("h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        [SelectionState.range_end]: "day-range-end",
        [SelectionState.selected]:
          "bg-orange-500 text-green-500 hover:bg-orange-500 hover:text-green-500 focus:bg-orange-500 focus:text-green-500",
        [DayFlag.today]: "bg-red-500 text-yellow-500",
        [DayFlag.outside]:
          "day-outside text-red-500 opacity-50 aria-selected:bg-lime-500/50 aria-selected:text-red-500 aria-selected:opacity-30",
        [DayFlag.disabled]: "text-red-500 opacity-50",
        [SelectionState.range_middle]:
          "aria-selected:bg-green-500 aria-selected:text-yellow-500",
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
              className="bg-red-500 h-7 w-7 p-0 opacity-50 hover:opacity-100 absolute grid place-items-center left-3 top-0 z-10"
            >
              <FiChevronLeft />
            </button>
          );
        },
        NextMonthButton: ({ className, ...props }) => {
          return (
            <button
              {...props}
              className="bg-red-500 h-7 w-7 p-0 opacity-50 hover:opacity-100 absolute grid place-items-center right-3 top-0 z-10"
            >
              <FiChevronRight />
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
