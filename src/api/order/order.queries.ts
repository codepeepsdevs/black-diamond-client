import {
  DateRangeData,
  ErrorResponse,
  OptionProps,
  Order,
  PageData,
} from "@/constants/types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import {
  assignGuestOrder,
  checkPaymentStatus,
  fillTicketDetails,
  generateOrderReport,
  generatePartyList,
  getOrderDetails,
  getOrders,
  getRevenue,
  getTicketsSoldStats,
  getTicketTypeSales,
  getUserPastEventOrders,
  getUserUpcomingEventOrders,
} from "./order.apis";
import { FillTicketDetailsData } from "@/app/tickets/[ticketId]/fill-details/page";
import {
  AssignGuestOrderData,
  AssignGuestOrderResponse,
  FillTicketDetailsResponse,
  GeneratePartyListData,
  GetOrders,
  GetRevenueData,
  GetRevenueResponse,
  GetTicketSoldStatsResponse,
  GetUserOrders,
  OrderDetailsResponse,
  PaymentStatusResponse,
  TicketTypeSalesResponse,
} from "./order.types";

export const useOrderDetails = (orderId: string) => {
  return useQuery<AxiosResponse<OrderDetailsResponse>>({
    queryKey: ["order-details", orderId],
    queryFn: () => getOrderDetails(orderId),
    placeholderData: keepPreviousData,
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useFillTicketDetails = (
  onError: (error: AxiosError<Error>) => void,
  onSuccess: (data: AxiosResponse<FillTicketDetailsResponse>) => void
) => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<FillTicketDetailsResponse>,
    AxiosError<Error>,
    FillTicketDetailsData
  >({
    mutationFn: fillTicketDetails,
    onError,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["order-details", data.data.orderId],
      });

      onSuccess(data);
    },
  });
};

export const useUserUpcomingEventsOrders = (page?: PageData) => {
  return useQuery<AxiosResponse<GetUserOrders>>({
    queryKey: ["upcoming-event-orders", page],
    queryFn: () => getUserUpcomingEventOrders(page),
    placeholderData: keepPreviousData,
    // enabled: false,
    // refetchInterval: 0,
  });
};

// export type ExtendedOrder = Order & {
//   orderAmount: number;
// };

export const useGetOrders = (options?: OptionProps & DateRangeData) => {
  return useQuery<AxiosResponse<GetOrders>>({
    queryKey: ["get-orders", options],
    queryFn: () => getOrders(options),
    placeholderData: keepPreviousData,
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useUserPastEventOrders = (page?: PageData) => {
  return useQuery<AxiosResponse<GetUserOrders>>({
    queryKey: ["past-event-orders", page],
    queryFn: () => getUserPastEventOrders(page),
    // enabled: false,
    // refetchInterval: 0,
  });
};

export const useAssignGuestOrder = (
  onError: (e: AxiosError<Error>) => void,
  onSuccess: (data: AxiosResponse<AssignGuestOrderResponse>) => void
) => {
  return useMutation<
    AxiosResponse<AssignGuestOrderResponse>,
    AxiosError<Error>,
    AssignGuestOrderData
  >({
    mutationFn: assignGuestOrder,
    onError,
    onSuccess,
  });
};

export const useCheckPaymentStatus = (orderId: string) => {
  return useQuery<AxiosResponse<PaymentStatusResponse>, AxiosError<Error>>({
    queryKey: [`payment-status-${orderId}`],
    queryFn: () => checkPaymentStatus(orderId),
  });
};

export const useGetRevenue = (range?: GetRevenueData) => {
  return useQuery<AxiosResponse<GetRevenueResponse>, AxiosError<Error>>({
    queryKey: [`revenue`, range],
    queryFn: () => getRevenue(range),
  });
};

export const useGetTicketTypeSales = (eventId: string) => {
  return useQuery<AxiosResponse<TicketTypeSalesResponse>, AxiosError<Error>>({
    queryKey: [`ticket-type-sales`, eventId],
    queryFn: () => getTicketTypeSales(eventId),
  });
};

export const useGetTicketsSoldStats = (range?: DateRangeData) => {
  return useQuery<AxiosResponse<GetTicketSoldStatsResponse>, AxiosError<Error>>(
    {
      queryKey: [`tickets-sold-stats`, range],
      queryFn: () => getTicketsSoldStats(range),
    }
  );
};

export const useGenerateOrderReport = (
  onError: (e: AxiosError<ErrorResponse>) => void,
  onSuccess: () => void
) => {
  return useMutation<void, AxiosError<Error>, DateRangeData>({
    mutationKey: [`generate-order-report`],
    mutationFn: generateOrderReport,
    onError,
    onSuccess,
  });
};

export const useGeneratePartyList = (
  onError: (e: AxiosError<ErrorResponse>) => void,
  onSuccess: () => void
) => {
  return useMutation<void, AxiosError<Error>, GeneratePartyListData>({
    mutationKey: [`generate-party-list`],
    mutationFn: generatePartyList,
    onError,
    onSuccess,
  });
};
