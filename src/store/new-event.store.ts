import { Event, TicketType } from "@/constants/types";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

export interface NewEventStates {
  //   event: Partial<Event> | null;
  eventId: Event["id"] | null;
}

interface Actions {
  //   setEvent: (newEvent: Partial<NewEventStates["event"]>) => void;
  //   addEventTicketTypes: (ticketTypes: Partial<TicketType>) => void;
  setEventId: (eventId: Event["id"]) => void;
}
/* 
export const useNewEventStore = create(
  devtools(
    persist<NewEventStates & Actions>(
      (set) => ({
        // event: null,
        // ticketTypes: null,
        // setEvent(newEvent) {
        //   return set((prevState) => {
        //     const prevEvent = prevState.event;
        //     return {
        //       event:
        //         newEvent == null
        //           ? null
        //           : ({
        //               name: newEvent?.name || prevEvent?.name,
        //               id: newEvent?.id || prevEvent?.id,
        //               description:
        //                 newEvent?.description || prevEvent?.description,
        //               coverImage: newEvent?.coverImage || prevEvent?.coverImage,
        //               createdAt: newEvent?.createdAt || prevEvent?.createdAt,
        //               displayTicketsRemainder:
        //                 newEvent?.displayTicketsRemainder ||
        //                 prevEvent?.displayTicketsRemainder,
        //               location: newEvent?.location || prevEvent?.location,
        //               startTime: newEvent?.startTime || prevEvent?.startTime,
        //               endTime: newEvent?.endTime || prevEvent?.endTime,
        //               summary: newEvent?.summary || prevEvent?.summary,
        //               isPublished:
        //                 newEvent?.isPublished || prevEvent?.isPublished,
        //               eventStatus:
        //                 newEvent?.eventStatus || prevEvent?.eventStatus,
        //               ticketSalesEndMessage:
        //                 newEvent?.ticketSalesEndMessage ||
        //                 prevEvent?.ticketSalesEndMessage,
        //               refundPolicy:
        //                 newEvent?.refundPolicy || prevEvent?.refundPolicy,
        //               updatedAt: newEvent?.updatedAt || prevEvent?.updatedAt,
        //               images: newEvent?.images || prevEvent?.images,
        //             } as NewEventStates["event"]),
        //     };
        //   });
        // },

        eventId: null,
        setEventId(eventId) {
          return set({
            eventId,
          });
        },
      }),
      {
        name: "new-event",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
); */
