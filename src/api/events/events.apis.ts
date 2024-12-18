import {
  AddOn,
  Event,
  EventStatus,
  ExtendNested,
  OptionProps,
  // PageData,
  PromoCode,
  TicketCount,
  TicketType,
} from "@/constants/types";
import { request } from "@/utils/axios-utils";
import axios, { AxiosResponse } from "axios";
import {
  AdminGetEvents,
  CreateEventAddonData,
  CreateEventAddonResponse,
  CreateEventDetailsData,
  CreateEventDetailsResponse,
  CreateEventPromocodeData,
  CreateEventPromocodeResponse,
  CreateEventTicketTypeData,
  CreateEventTicketTypeResponse,
  DeleteEventData,
  DeleteEventResponse,
  DeletePromocodeData,
  DeletePromocodeResponse,
  DeleteTicketTypeData,
  DeleteTicketTypeResponse,
  GetEventRevenueResponse,
  GetEventTicketTypesResponse,
  GetPromocodeResponse,
  GetPromocodesResponse,
  PageViewResponse,
  PublishEventResponse,
  RemoveSlideData,
  RemoveSlideResponse,
  UnpublishEventResponse,
  UpdateEventDetailsData,
  UpdateEventDetailsResponse,
  UpdatePromocodeData,
  UpdatePromocodeResponse,
  UpdateTicketTypeData,
  UpdateTicketTypeResponse,
} from "./events.types";
import * as dateFns from "date-fns";

// export const getUpcomingEvents = async (_page?: PageData) => {
//   const page = _page?.page || 1;
//   const limit = _page?.limit || 10;
//   return await request({
//     url: `/events/upcoming-events?page=${page}&limit=${limit}`,
//     method: "get",
//   });
// };

// export const getPastEvents = async (_page?: PageData) => {
//   const page = _page?.page || 1;
//   const limit = _page?.limit || 10;
//   return await request({
//     url: `/events/past-events?page=${page}&limit=${limit}`,
//     method: "get",
//   });
// };

export const getEvents = async (options: OptionProps) => {
  return await request({
    url: `/events/get-events?eventStatus=${options.eventStatus || ""}&search=${options.search || ""}&page=${options.page || ""}&limit=${options.limit || ""}`,
    method: "get",
  });
};

export const adminGetEvents = async (options: OptionProps) => {
  return await request<AdminGetEvents>({
    url: `/events/admin-get-events?eventStatus=${options.eventStatus || ""}&search=${options.search || ""}&page=${options.page || ""}&limit=${options.limit || ""}`,
    method: "get",
  });
};

export type EventWithSoldQuantity = Omit<Event, "ticketTypes"> &
  EventStatus & {
    ticketTypes: (TicketType & {
      soldQuantity: number;
    })[];
  };

export const getEvent = async (eventId: Event["id"]) => {
  return await request<EventWithSoldQuantity>({
    url: `/events/get-event/${eventId}`,
    method: "get",
  });
};

export const adminGetEvent = async (eventId: Event["id"]) => {
  return await request<EventWithSoldQuantity>({
    url: `/events/admin-get-event/${eventId}`,
    method: "get",
  });
};

export const getEventTicketTypes = async (eventId: Event["id"]) => {
  if (!eventId) {
    throw new Error("Unable to get ticket types");
  }
  return (await request({
    url: `/events/${eventId}/get-ticket-types`,
    method: "get",
  })) as AxiosResponse<GetEventTicketTypesResponse>;
};

export const getEventPromocodes = async (eventId: Event["id"]) => {
  if (!eventId) {
    throw new Error("Unable to get event promo codes");
  }
  return (await request({
    url: `/events/${eventId}/get-promocodes`,
    method: "get",
  })) as AxiosResponse<GetPromocodesResponse>;
};

export const getPromocode = async ({
  key,
  eventId,
}: {
  key: string;
  eventId: string;
}) => {
  return (await request({
    url: `/events/apply-promocode`,
    method: "post",
    data: {
      key,
      eventId,
    },
  })) as AxiosResponse<GetPromocodeResponse>;
};

export const getAddons = async (eventId: Event["id"]) => {
  if (!eventId) {
    throw new Error("Unable to get event addons");
  }
  return (await request({
    url: `/events/${eventId}/get-addons`,
    method: "get",
  })) as AxiosResponse<AddOn[]>;
};

// export const createEventPromocodes = async (data: CreateEventPromocodeData) => {
//   return await request<PromoCode[]>({
//     url: `/events/create-event-promocodes`,
//     method: "post",
//     data: data,
//   });
// };

export const createEventDetails = async ({
  images,
  ...data
}: CreateEventDetailsData) => {
  const formData = new FormData();
  Object.entries(data).map(([key, value]) => {
    formData.append(key, value);
  });

  images?.forEach((image: File) => formData.append("images", image));

  // const formData = jsonToFormData(data);
  return (await request({
    url: "/events/create-event-details",
    method: "post",
    data: formData,
  })) as AxiosResponse<CreateEventDetailsResponse>;
};

export const createEventTicketType = async (
  data: CreateEventTicketTypeData
) => {
  return (await request({
    url: "/events/create-event-ticket-type",
    method: "post",
    data: data,
  })) as AxiosResponse<CreateEventTicketTypeResponse>;
};

export const createEventAddon = async ({
  startDate,
  startTime,
  endDate,
  endTime,
  ...data
}: CreateEventAddonData) => {
  const [startTimeHours, startTimeMinutes] = startTime
    .split(":")
    .map((value) => Number(value));

  const [endTimeHours, endTimeMinutes] = endTime
    .split(":")
    .map((value) => Number(value));

  const formData = new FormData();
  const extendedData = {
    ...data,
    startTime: dateFns
      .add(startDate, {
        hours: startTimeHours,
        minutes: startTimeMinutes,
      })
      .toISOString(),
    endTime: dateFns
      .add(endDate, {
        hours: endTimeHours,
        minutes: endTimeMinutes,
      })
      .toISOString(),
  };
  Object.entries(extendedData).map(([key, value]) => {
    formData.append(key, value);
  });

  return (await request({
    url: "/events/create-event-addon",
    method: "post",
    data: formData,
  })) as AxiosResponse<CreateEventAddonResponse>;
};

export const createEventPromocode = async ({
  eventId,
  ...data
}: CreateEventPromocodeData) => {
  return (await request({
    url: `/events/create-event-promocode/${eventId}`,
    method: "post",
    data: {
      ...data,
    },
  })) as AxiosResponse<CreateEventPromocodeResponse>;
};

export const updateEventDetails = async ({
  eventId,
  images,
  coverImage,
  ...data
}: UpdateEventDetailsData) => {
  const formData = new FormData();
  Object.entries(data).map(([key, value]) => {
    formData.append(key, value);
  });

  if (coverImage) {
    formData.append("coverImage", coverImage);
  }

  if (images && images.length > 0) {
    images.forEach((image: File) => formData.append("images", image));
  }
  return (await request({
    url: `/events/update-event/${eventId}`,
    method: "put",
    data: formData,
  })) as AxiosResponse<UpdateEventDetailsResponse>;
};

export const upateTicketTypeDetails = async ({
  ticketTypeId,
  ...data
}: UpdateTicketTypeData) => {
  // const formData = jsonToFormData(data);
  return (await request({
    url: `/events/ticket-type/${ticketTypeId}`,
    method: "put",
    data: data,
  })) as AxiosResponse<UpdateTicketTypeResponse>;
};

export const updatePromocode = async ({
  promocodeId,
  ...data
}: UpdatePromocodeData) => {
  // const formData = jsonToFormData(data);
  return (await request({
    url: `/events/promocode/${promocodeId}`,
    method: "put",
    data: data,
  })) as AxiosResponse<UpdatePromocodeResponse>;
};

export const deleteTicketType = async ({
  ticketTypeId,
}: DeleteTicketTypeData) => {
  // const formData = jsonToFormData(data);
  return (await request({
    url: `/events/ticket-type/${ticketTypeId}`,
    method: "delete",
    data: ticketTypeId,
  })) as AxiosResponse<DeleteTicketTypeResponse>;
};

export const deletePromocode = async ({ promocodeId }: DeletePromocodeData) => {
  // const formData = jsonToFormData(data);
  return (await request({
    url: `/events/promocode/${promocodeId}`,
    method: "delete",
    data: promocodeId,
  })) as AxiosResponse<DeletePromocodeResponse>;
};

export const deleteEvent = async ({ eventId }: DeleteEventData) => {
  // const formData = jsonToFormData(data);
  return (await request({
    url: `/events/delete-event/${eventId}`,
    method: "delete",
    data: eventId,
  })) as AxiosResponse<DeleteEventResponse>;
};

export const getEventRevenue = async (eventId: Event["id"]) => {
  if (!eventId) {
    throw new Error("Unable to get event revenue");
  }
  return (await request({
    url: `/events/get-revenue/${eventId}`,
    method: "get",
  })) as AxiosResponse<GetEventRevenueResponse>;
};

export const publishEvent = async (eventId: Event["id"]) => {
  if (!eventId) {
    throw new Error("Please select event to publish");
  }
  return (await request({
    url: `/events/publish-event/${eventId}`,
    method: "put",
  })) as AxiosResponse<PublishEventResponse>;
};

export const unpublishEvent = async (eventId: Event["id"]) => {
  if (!eventId) {
    throw new Error("Please select event to publish");
  }
  return (await request({
    url: `/events/unpublish-event/${eventId}`,
    method: "put",
  })) as AxiosResponse<UnpublishEventResponse>;
};

export const removeImageFromSlide = async (data: RemoveSlideData) => {
  return request<RemoveSlideResponse>({
    url: `/events/remove-image/${data.eventId}`,
    method: "delete",
    data: {
      image: data.image,
    },
  });
};

export const incPageView = async (data: { eventId: string }) => {
  console.log("incpage");
  return request<{}>({
    url: `/events/inc-pageview/${data.eventId}`,
    method: "get",
  });
};

export const getViewCount = async (data: { eventId: string }) => {
  return request<PageViewResponse>({
    url: `/events/view-count/${data.eventId}`,
    method: "get",
  });
};
