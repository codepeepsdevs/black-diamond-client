import React from "react";
import { BsDot } from "react-icons/bs";
import * as dateFnsTz from "date-fns-tz";
import * as dateFns from "date-fns";
import { newYorkTimeZone } from "@/utils/date-formatter";
import { EventWithSoldQuantity } from "@/api/events/events.apis";
import { GetEventTicketTypesResponse } from "@/api/events/events.types";

export default function SoldOutStatus({
  eventData,
  ticketType,
}: {
  ticketType: GetEventTicketTypesResponse[number];
  eventData: EventWithSoldQuantity | undefined;
}) {
  return (
    <p className="flex items-center text-xs">
      <BsDot className="text-3xl -ml-2 text-red-500" />
      <span>
        Sold Out{" "}
        {ticketType.endDate
          ? dateFns.format(
              dateFnsTz.toZonedTime(
                new Date(ticketType.endDate),
                newYorkTimeZone
              ),
              "MMM d, yyyy 'at' h:mm a"
            )
          : dateFns.format(
              dateFnsTz.toZonedTime(
                new Date(eventData?.endTime ?? new Date()),
                newYorkTimeZone
              ),
              "MMM d, yyyy 'at' h:mm a"
            )}
      </span>
    </p>
  );
}
