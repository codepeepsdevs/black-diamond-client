import { EventAddon, Event, TicketType, PromoCode } from "@/constants/types";
import {
  editEventDetailsSchema,
  newAddOnSchema,
  newEventSchema,
  newPromocodeFormSchema,
  newTicketFormSchema,
} from "./events.schemas";
import * as Yup from "yup";

export type CreateEventDetailsData = Omit<
  Yup.InferType<typeof newEventSchema>,
  "date"
>;

export type UpdateEventDetailsData = Omit<
  Yup.InferType<typeof editEventDetailsSchema>,
  "date"
> & {
  eventId: string;
};

export type CreateEventDetailsResponse = Event;

export type UpdateEventDetailsResponse = Event;

export type CreateEventTicketTypeData = Omit<
  Yup.InferType<typeof newTicketFormSchema>,
  "startTime" | "endTime"
> & {
  eventId: Event["id"];
};

export type CreateEventTicketTypeResponse = TicketType;

export type CreateEventAddonData = Yup.InferType<typeof newAddOnSchema> & {
  eventId: string;
};

export type CreateEventAddonResponse = EventAddon;

export type CreateEventPromocodeData = Yup.InferType<
  typeof newPromocodeFormSchema
>;

export type CreateEventPromocodeResponse = PromoCode;

export type UpdateTicketTypeResponse = TicketType;

export type UpdateTicketTypeData = Omit<
  Yup.InferType<typeof newTicketFormSchema>,
  "startTime" | "endTime"
> & {
  ticketTypeId: string;
};

export type GetEventRevenueResponse = {
  revenue: string;
};
