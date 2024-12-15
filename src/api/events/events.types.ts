import {
  EventAddon,
  Event,
  TicketType,
  PromoCode,
  EventStatus,
} from "@/constants/types";
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

export type CreateEventTicketTypeData = Yup.InferType<
  typeof newTicketFormSchema
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
> & {
  eventId: string;
};

export type CreateEventPromocodeResponse = PromoCode;

export type GetPromocodesResponse = (PromoCode & {
  isActive: boolean;
  used: number;
})[];

export type GetPromocodeResponse = PromoCode & {
  isActive: boolean;
};

export type UpdateTicketTypeResponse = TicketType;

export type UpdateTicketTypeData = Yup.InferType<typeof newTicketFormSchema> & {
  ticketTypeId: string;
};

export type UpdatePromocodeResponse = PromoCode;
export type UpdatePromocodeData = Yup.InferType<
  typeof newPromocodeFormSchema
> & {
  promocodeId: string;
};

export type DeleteTicketTypeData = {
  ticketTypeId: string;
};

export type DeleteTicketTypeResponse = {
  message: string;
  ticketTypeId: string;
  eventId: string;
};

export type DeletePromocodeData = {
  promocodeId: string;
};

export type DeletePromocodeResponse = {
  message: string;
  promocodeId: string;
};

export type DeleteEventData = {
  eventId: string;
};

export type DeleteEventResponse = {
  message: string;
  eventId: string;
};

export type GetEventRevenueResponse = {
  revenue: string;
};

export type GetEvents = {
  events: (Event & EventStatus)[];
  eventsCount: number;
};

export type AdminExtendedEvent = Event &
  EventStatus & {
    gross: number;
    totalTickets: number;
    totalSales: number;
  };

export type AdminGetEvents = {
  events: AdminExtendedEvent[];
  gross: number;
  totalSales: number;
  eventsCount: number;
};

export type RemoveSlideResponse = {
  message: string;
  eventId: string;
};

export type RemoveSlideData = {
  eventId: string;
  image: string;
};

export type PublishEventResponse = Event;

export type UnpublishEventResponse = Event;

export type PageViewResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventId: string;
  views: number;
};
