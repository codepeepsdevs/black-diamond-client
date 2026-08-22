import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import {
  checkInById,
  checkInByQRCode,
  getCheckInStats,
  getEventTickets,
  undoCheckIn,
} from "./checkin.apis";
import {
  CheckInByIdResponse,
  CheckInByQRCodeRequest,
  CheckInByQRCodeResponse,
  CheckInStatsResponse,
  GetTicketsForEventResponse,
  UndoCheckInResponse,
} from "./checkin.types";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import { ErrorResponse } from "@/constants/types";

export const useGetEventTickets = (options: {
  eventId: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery<
    AxiosResponse<GetTicketsForEventResponse>,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["checkin-event-tickets", options],
    queryFn: () => getEventTickets(options),
    placeholderData: keepPreviousData,
    enabled: Boolean(options.eventId),
  });
};

export const useGetCheckInStats = (eventId: string) => {
  return useQuery<
    AxiosResponse<CheckInStatsResponse>,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["checkin-stats", eventId],
    queryFn: () => getCheckInStats(eventId),
    enabled: Boolean(eventId),
  });
};

export const useCheckInByQRCode = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<CheckInByQRCodeResponse>,
    AxiosError<ErrorResponse>,
    CheckInByQRCodeRequest
  >({
    mutationKey: ["checkin-by-qr"],
    mutationFn: checkInByQRCode,
    onError: (e) => {
      ErrorToast({
        title: "Check-in failed",
        descriptions: getApiErrorMessage(e, "Unable to check in by QR code"),
      });
    },
    onSuccess: async (res) => {
      SuccessToast({ title: "Success", description: res.data.message });
      await queryClient.invalidateQueries({
        queryKey: ["checkin-stats", eventId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["checkin-event-tickets"],
      });
    },
  });
};

export const useCheckInById = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<CheckInByIdResponse>,
    AxiosError<ErrorResponse>,
    string
  >({
    mutationKey: ["checkin-by-id"],
    mutationFn: checkInById,
    onError: (e) => {
      ErrorToast({
        title: "Check-in failed",
        descriptions: getApiErrorMessage(e, "Unable to check in ticket"),
      });
    },
    onSuccess: async (res) => {
      SuccessToast({ title: "Success", description: res.data.message });
      await queryClient.invalidateQueries({
        queryKey: ["checkin-stats", eventId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["checkin-event-tickets"],
      });
    },
  });
};

export const useUndoCheckIn = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<UndoCheckInResponse>,
    AxiosError<ErrorResponse>,
    string
  >({
    mutationKey: ["undo-checkin"],
    mutationFn: undoCheckIn,
    onError: (e) => {
      ErrorToast({
        title: "Undo failed",
        descriptions: getApiErrorMessage(e, "Unable to undo check-in"),
      });
    },
    onSuccess: async (res) => {
      SuccessToast({ title: "Success", description: res.data.message });
      await queryClient.invalidateQueries({
        queryKey: ["checkin-stats", eventId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["checkin-event-tickets"],
      });
    },
  });
};
