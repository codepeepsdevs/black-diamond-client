import React from "react";
import { BsDot } from "react-icons/bs";
import * as dateFnsTz from "date-fns-tz";
import * as dateFns from "date-fns";
import { newYorkTimeZone } from "@/utils/date-formatter";
import { EventWithSoldQuantity } from "@/api/events/events.apis";
import { GetEventTicketTypesResponse } from "@/api/events/events.types";

export default function NotOnSaleStatus({
  eventData,
  ticketType,
}: {
  ticketType: GetEventTicketTypesResponse[number];
  eventData: EventWithSoldQuantity | undefined;
}) {
  return (
    <p className="flex items-center gap-x-1">
      <div className="flex items-center whitespace-nowrap">
        <BsDot className="text-3xl -ml-2 text-yellow-500" />
        <span>Not on Sale · Starts</span>
      </div>
      {ticketType.startDate
        ? dateFns.format(
            dateFnsTz.toZonedTime(
              new Date(ticketType.startDate),
              newYorkTimeZone
            ),
            "MMM d, yyyy 'at' h:mm a"
          )
        : dateFns.format(
            dateFnsTz.toZonedTime(
              new Date(eventData?.startTime ?? new Date()),
              newYorkTimeZone
            ),
            "MMM d, yyyy 'at' h:mm a"
          )}
    </p>
  );
}
