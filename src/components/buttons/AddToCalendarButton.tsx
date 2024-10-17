import React from "react";
import { FaRegCalendar } from "react-icons/fa6";
import { Popover, PopoverContent, PopoverTrigger } from "../shared/Popover";
import Image from "next/image";
import { googleCalendarIcon, otherCalendarIcon } from "../../../public/icons";
import {
  createGoogleCalendarLink,
  createICSFile,
} from "@/utils/utilityFunctions";
import { CalendarEvent } from "@/constants/types";

export default function AddToCalendarButton({
  calendarEvent,
}: {
  calendarEvent: CalendarEvent;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="bg-[#14171A] size-12 grid place-items-center rounded-full text-2xl">
          <FaRegCalendar />
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex items-center gap-x-8 justify-center px-6 py-2 bg-[#14171A] max-w-fit">
        {/* GOOGLE CALENDAR */}
        <button
          onClick={() => window.open(createGoogleCalendarLink(calendarEvent))}
        >
          <div className="size-12 mx-auto mb-2 p-2 grid place-items-center rounded-full">
            <Image
              src={googleCalendarIcon}
              className="size-7"
              alt="GoogleCal"
            />
          </div>
          <div className="text-xs leading-3 text-[#C0C0C0]">
            Google <br /> Calendar
          </div>
        </button>
        {/* END GOOGLE CALENDAR */}

        {/* OTHER CALENDAR */}
        <button onClick={() => createICSFile(calendarEvent)}>
          <div className="size-12 mx-auto mb-2 p-2 grid place-items-center rounded-full">
            <Image src={otherCalendarIcon} className="size-7" alt="OtherCal" />
          </div>
          <div className="text-xs leading-3 text-[#C0C0C0]">
            Other <br /> Calendars
          </div>
        </button>
        {/* END OTHER CALENDAR */}
      </PopoverContent>
    </Popover>
  );
}
