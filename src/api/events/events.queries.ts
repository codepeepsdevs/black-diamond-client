import {
  keepPreviousData,
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
  adminGetEvents,
  removeImageFromSlide,
  publishEvent,
  unpublishEvent,
  EventWithSoldQuantity,
  getViewCount,
  deleteTicketType,
  deleteEvent,
  deletePromocode,
  updatePromocode,
  adminGetEvent,
  copyEventDetails,
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
  AdminGetEvents,
  CopyEventResponse,
  CreateEventAddonResponse,
  CreateEventDetailsResponse,
  CreateEventPromocodeResponse,
  CreateEventTicketTypeResponse,
  DeleteEventData,
  DeleteEventResponse,
  DeletePromocodeResponse,
  DeleteTicketTypeResponse,
  GetEventRevenueResponse,
  GetEvents,
  GetEventTicketTypesResponse,
  GetPromocodeResponse,
  GetPromocodesResponse,
  PageViewResponse,
  PublishEventResponse,
  RemoveSlideData,
  RemoveSlideResponse,
  UnpublishEventResponse,
  UpdateEventDetailsResponse,
  UpdatePromocodeResponse,
  UpdateTicketTypeResponse,
} from "./events.types";
import toast from "react-hot-toast";
import ErrorToast from "@/components/toast/ErrorToast";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import SuccessToast from "@/components/toast/SuccessToast";

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

export const useGetEvents = (options: OptionProps) => {
  return useQuery<AxiosResponse<GetEvents>>({
    queryKey: ["get-events", options],
    queryFn: () => getEvents(options),
    placeholderData: keepPreviousData,
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useAdminGetEvents = (options: OptionProps) => {
  return useQuery<AxiosResponse<AdminGetEvents>>({
    queryKey: ["admin-get-events", options],
    queryFn: () => adminGetEvents(options),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutes - events list can be slightly stale
  });
};

export const useGetEvent = (eventId: Event["id"]) => {
  return useQuery<AxiosResponse<EventWithSoldQuantity>>({
    queryKey: ["get-event", eventId],
    queryFn: () => getEvent(eventId),
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useAdminGetEvent = (eventId: Event["id"]) => {
  return useQuery<AxiosResponse<EventWithSoldQuantity>>({
    queryKey: ["admin-get-event", eventId],
    queryFn: () => adminGetEvent(eventId),
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useGetEventTicketTypes = (eventId: Event["id"]) => {
  return useQuery<
    AxiosResponse<GetEventTicketTypesResponse>,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["get-event-ticket-types", eventId],
    queryFn: () => getEventTicketTypes(eventId),
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useGetPromocodes = (eventId: Event["id"]) => {
  return useQuery<
    AxiosResponse<GetPromocodesResponse>,
    AxiosError<ErrorResponse>
  >({
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
  onSuccess: (data: AxiosResponse<GetPromocodeResponse>) => void
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEventDetails,
    onError,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-get-event", data.data.id],
      });
      onSuccess(data);
    },
  });
};

export const useCopyEventDetails = (
  onError: (error: AxiosError<ErrorResponse>) => void,
  onSuccess: (data: AxiosResponse<CopyEventResponse>) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: copyEventDetails,
    onError,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-get-events"],
      });
      onSuccess(data);
    },
  });
};

export const useUpdateTicketType = (
  onError: (error: AxiosError<ErrorResponse>) => void,
  onSuccess: (data: AxiosResponse<UpdateTicketTypeResponse>) => void
) => {
  const queryClient = useQueryClient();
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

export const useUpdatePromocode = (
  onError: (error: AxiosError<ErrorResponse>) => void,
  onSuccess: (data: AxiosResponse<UpdatePromocodeResponse>) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePromocode,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-event-promocode"],
      });
      onSuccess(data);
    },
  });
};

export const useDeleteTicketType = (
  onError?: (error: AxiosError<ErrorResponse>) => void,
  onSuccess?: (data: AxiosResponse<DeleteTicketTypeResponse>) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTicketType,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-event-ticket-types", data.data.eventId],
      });
      onSuccess?.(data);
    },
  });
};

export const useDeletePromocode = (
  onError?: (error: AxiosError<ErrorResponse>) => void,
  onSuccess?: (data: AxiosResponse<DeletePromocodeResponse>) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePromocode,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-event-promocode"], // TODO: Figure out what to invalidate
      });
      onSuccess?.(data);
    },
  });
};

export const useDeleteEvent = (
  onError?: (error: AxiosError<ErrorResponse>) => void,
  onSuccess?: (data: AxiosResponse<DeleteEventResponse>) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-get-events"],
      });
      onSuccess?.(data);
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

export const usePublishEvent = (eventId: Event["id"]) => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<PublishEventResponse>,
    AxiosError<ErrorResponse>,
    string
  >({
    mutationKey: ["publish-event", eventId],
    mutationFn: publishEvent,
    onError: (e) => {
      const errorMessage = getApiErrorMessage(
        e,
        "Something went wrong while publishing event"
      );
      ErrorToast({
        title: "Error",
        descriptions: errorMessage,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-get-event", eventId],
      });
      SuccessToast({
        title: "Success",
        description: "Event successfully published",
      });
    },
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useUnpublishEvent = (eventId: Event["id"]) => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<UnpublishEventResponse>,
    AxiosError<ErrorResponse>,
    string
  >({
    mutationKey: ["unpublish-event", eventId],
    mutationFn: unpublishEvent,
    onError: (e) => {
      const errorMessage = getApiErrorMessage(
        e,
        "Something went wrong while unpublishing event"
      );
      ErrorToast({
        title: "Error",
        descriptions: errorMessage,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-get-event", eventId],
      });
      SuccessToast({
        title: "Success",
        description: "Event successfully unpublished",
      });
    },
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useRemoveImageFromSlide = (
  onError?: (error: AxiosError<ErrorResponse>) => void,
  onSuccess?: (data: AxiosResponse<RemoveSlideResponse>) => void
) => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<RemoveSlideResponse>,
    AxiosError<Error>,
    RemoveSlideData
  >({
    mutationFn: removeImageFromSlide,
    mutationKey: ["remove-image"],
    onError: (e) => {
      const errorMessage = getApiErrorMessage(
        e,
        "Something went wrong while deleting slide"
      );
      ErrorToast({
        title: "Delete Error",
        descriptions: errorMessage,
      });
      onError?.(e);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-get-event", data.data.eventId],
      });

      SuccessToast({
        title: "Success",
        description: data.data.message,
      });

      onSuccess?.(data);
    },
  });
};

export const usePageView = (eventId: string) => {
  return useQuery({
    queryKey: ["s"],
    queryFn: () => getViewCount({ eventId }),
  });
};
