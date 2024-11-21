"use client";

import React from "react";
import EventCard from "../shared/EventCard";
import { TickerObjectProps } from "../../../public/images";
import { Event, TicketType } from "@/constants/types";
import LoadingSkeleton from "../shared/Loader/LoadingSkeleton";

interface EventsProps {
  isPending: boolean;
  isError: boolean;
  events: Event[];
  tab: string;
}

const Events: React.FC<EventsProps> = ({ tab, isPending, isError, events }) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {isPending && !isError ? (
        <>
          {new Array(3).fill(0).map((_, index) => {
            return (
              <LoadingSkeleton key={index} className="w-full h-48 sm:h-60" />
            );
          })}
        </>
      ) : (
        events.map((event, index) => {
          return (
            <EventCard
              id={event.id}
              key={event.id}
              index={index}
              image={event.coverImage}
              title={event.name}
              ticketTypes={event.ticketTypes}
              startTime={new Date(event.startTime)}
              eventBriteUrl={event?.eventBriteURL}
              tab={tab}
            />
          );
        })
      )}
    </div>
  );
};

export default Events;
