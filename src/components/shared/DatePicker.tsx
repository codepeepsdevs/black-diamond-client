"use client";

import * as React from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { LuCalendar } from "react-icons/lu";
import { Calendar } from "./Calendar";
import { FaRegCalendar } from "react-icons/fa6";
import IconInputField from "./IconInputField";

export function DatePicker({
  value,
  onSelect,
  inputProps,
}: {
  onSelect: (date: Date) => void;
  value: Date;
  inputProps: React.ComponentProps<typeof IconInputField>;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <IconInputField
          {...inputProps}
          Icon={<FaRegCalendar className="text-[#14171A]" />}
        />
        <LuCalendar className="mr-2 h-4 w-4" />
        {value ? format(value, "PPP") : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onSelect} required />
      </PopoverContent>
    </Popover>
  );
}
