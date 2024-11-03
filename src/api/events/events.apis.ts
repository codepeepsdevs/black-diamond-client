import {
  AddOn,
  Event,
  EventStatus,
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
  GetEventRevenueResponse,
  RemoveSlideData,
  RemoveSlideResponse,
  UpdateEventDetailsData,
  UpdateEventDetailsResponse,
  UpdateTicketTypeData,
  UpdateTicketTypeResponse,
} from "./events.types";
import toast from "react-hot-toast";
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

export const getEvent = async (eventId: Event["id"]) => {
  return await request<Event & EventStatus>({
    url: `/events/get-event/${eventId}`,
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
  })) as AxiosResponse<(TicketType & TicketCount)[]>;
};

export const getEventPromocodes = async (eventId: Event["id"]) => {
  if (!eventId) {
    throw new Error("Unable to get event promo codes");
  }
  return (await request({
    url: `/events/${eventId}/get-promocodes`,
    method: "get",
  })) as AxiosResponse<PromoCode[]>;
};

export const getPromocode = async (key: string) => {
  return (await request({
    url: `/events/apply-promocode`,
    method: "post",
    data: {
      key,
    },
  })) as AxiosResponse<PromoCode>;
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

  images.forEach((image: File) => formData.append("images", image));

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
  startDate,
  startTime,
  endDate,
  endTime,
  ...data
}: CreateEventPromocodeData) => {
  const [startTimeHours, startTimeMinutes] = startTime
    .split(":")
    .map((value) => Number(value));

  const [endTimeHours, endTimeMinutes] = endTime
    .split(":")
    .map((value) => Number(value));

  return (await request({
    url: "/events/create-event-promocode",
    method: "post",
    data: {
      ...data,
      promoEndDate: dateFns
        .add(startDate, {
          hours: startTimeHours,
          minutes: startTimeMinutes,
        })
        .toISOString(),
      promoStartDate: dateFns
        .add(endDate, {
          hours: endTimeHours,
          minutes: endTimeMinutes,
        })
        .toISOString(),
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

export const getEventRevenue = async (eventId: Event["id"]) => {
  if (!eventId) {
    throw new Error("Unable to get event revenue");
  }
  return (await request({
    url: `/events/get-revenue/${eventId}`,
    method: "get",
  })) as AxiosResponse<GetEventRevenueResponse>;
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
