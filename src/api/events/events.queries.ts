import {
  keepPreviousData,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getEvents,
  getEventTicketTypes,
  createEventDetails,
  createEventTicketType,
  createEventPromocode,
  getEvent,
  getEventPromocodes,
  createEventAddon,
  getAddons,
  getPromocode,
  updateEventDetails,
  upateTicketTypeDetails,
  getEventRevenue,
} from "./events.apis";
import { AxiosError, AxiosResponse } from "axios";
import {
  AddOn,
  ErrorResponse,
  Event,
  EventStatus,
  OptionProps,
  PromoCode,
  TicketCount,
  TicketType,
} from "@/constants/types";
import {
  CreateEventAddonResponse,
  CreateEventDetailsResponse,
  CreateEventPromocodeResponse,
  CreateEventTicketTypeResponse,
  GetEventRevenueResponse,
  UpdateEventDetailsResponse,
  UpdateTicketTypeResponse,
} from "./events.types";
import toast from "react-hot-toast";

// export const useUpcomingEvents = (options: OptionProps) => {
//   return useQuery<AxiosResponse<Event[]>>({
//     queryKey: ["upcoming-events", options],
//     queryFn: () => getUpcomingEvents(options),
//     placeholderData: keepPreviousData,
//     // enabled: false,
//     // refetchInterval: 0,
//   });
// };

// export const usePastEvents = (page?: PageData) => {
//   return useQuery<AxiosResponse<Event[]>>({
//     queryKey: ["past-events", page],
//     queryFn: () => getPastEvents(page),
//     placeholderData: keepPreviousData,
//     // enabled: false,
//     // refetchInterval: 0,
//   });
// };

export type ExtendedEvents = (Event & {
  gross: number;
  totalSales: number;
  totalTickets: number;
} & EventStatus)[];

export const useGetEvents = (options: OptionProps) => {
  return useQuery<AxiosResponse<ExtendedEvents>>({
    queryKey: ["get-events", options],
    queryFn: () => getEvents(options),
    placeholderData: keepPreviousData,
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useGetEvent = (eventId: Event["id"]) => {
  return useQuery<AxiosResponse<Event & EventStatus>>({
    queryKey: ["get-event", eventId],
    queryFn: () => getEvent(eventId),
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useGetEventTicketTypes = (eventId: Event["id"]) => {
  return useQuery<
    AxiosResponse<(TicketType & TicketCount)[]>,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["get-event-ticket-types", eventId],
    queryFn: () => getEventTicketTypes(eventId),
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useGetPromocodes = (eventId: Event["id"]) => {
  return useQuery<AxiosResponse<PromoCode[]>, AxiosError<ErrorResponse>>({
    queryKey: ["get-event-promocode", eventId],
    queryFn: () => getEventPromocodes(eventId),
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useGetAddons = (eventId: Event["id"]) => {
  return useQuery<AxiosResponse<AddOn[]>, AxiosError<ErrorResponse>>({
    queryKey: ["get-addons", eventId],
    queryFn: () => getAddons(eventId),
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useGetPromocode = (
  onError: (error: AxiosError<Error>) => void,
  onSuccess: (data: AxiosResponse<PromoCode>) => void
) => {
  return useMutation({
    mutationFn: getPromocode,
    onError,
    onSuccess,
  });
};

export const useCreateEventDetails = (
  onError: (error: AxiosError<ErrorResponse>) => void,
  onSuccess: (data: AxiosResponse<CreateEventDetailsResponse>) => void
) => {
  return useMutation({
    mutationFn: createEventDetails,
    onError,
    onSuccess,
  });
};

export const useCreateEventTicketType = (
  onError: (error: AxiosError<Error>) => void,
  onSuccess: (data: AxiosResponse<CreateEventTicketTypeResponse>) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEventTicketType,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-event-ticket-types", data.data.eventId],
      });
      onSuccess(data);
    },
  });
};

export const useCreateEventPromocode = (
  onError: (error: AxiosError<Error>) => void,
  onSuccess: (data: AxiosResponse<CreateEventPromocodeResponse>) => void,
  eventId: Event["id"]
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEventPromocode,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-event-promocode", eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-event-ticket-types", eventId],
      });
      onSuccess(data);
    },
  });
};

export const useCreateEventAddon = (
  onError: (error: AxiosError<Error>) => void,
  onSuccess: (data: AxiosResponse<CreateEventAddonResponse>) => void,
  eventId: Event["id"]
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEventAddon,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-addons", eventId],
      });
      onSuccess(data);
    },
  });
};

export const useUpdateEventDetails = (
  onError: (error: AxiosError<ErrorResponse>) => void,
  onSuccess: (data: AxiosResponse<UpdateEventDetailsResponse>) => void
) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: updateEventDetails,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get-event", data.data.id] });
      onSuccess(data);
    },
  });
};

export const useUpdateTicketType = (
  onError: (error: AxiosError<ErrorResponse>) => void,
  onSuccess: (data: AxiosResponse<UpdateTicketTypeResponse>) => void
) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: upateTicketTypeDetails,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-event-ticket-types", data.data.eventId],
      });
      onSuccess(data);
    },
  });
};

export const useGetEventRevenue = (eventId: Event["id"]) => {
  return useQuery<
    AxiosResponse<GetEventRevenueResponse>,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["get-revenue", eventId],
    queryFn: () => getEventRevenue(eventId),
    // enabled: false,
    // refetchInterval: 0,
  });
};
