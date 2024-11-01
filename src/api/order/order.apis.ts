import { FillTicketDetailsData } from "@/app/tickets/[ticketId]/fill-details/page";
import { request } from "@/utils/axios-utils";
import {
  AssignGuestOrderData,
  AssignGuestOrderResponse,
  GetRevenueData,
  GetRevenueResponse,
  PaymentStatusResponse,
  GetTicketSoldStatsResponse,
  TicketTypeSalesResponse,
  GetUserOrders,
} from "./order.types";
import {
  DateRangeData,
  Event,
  OptionProps,
  Order,
  PageData,
} from "@/constants/types";
import { AxiosResponse } from "axios";

export const getOrderDetails = async (orderId: string) => {
  return await request({
    url: `/orders/get-order/${orderId}`,
    method: "get",
  });
};

export const fillTicketDetails = async (formData: FillTicketDetailsData) => {
  return await request<Order>({
    url: `/orders/fill-ticket-details`,
    method: "post",
    data: formData,
  });
};

export const getUserUpcomingEventOrders = async (_page?: PageData) => {
  const page = _page?.page;
  const limit = _page?.limit;

  return await request<GetUserOrders>({
    url: `/orders/user-upcoming-events-orders?page=${page || ""}&limit=${limit || ""}`,
    method: "get",
  });
};

export const getOrders = async (options?: OptionProps & DateRangeData) => {
  return await request({
    url: `/orders/get-orders?page=${options?.page || ""}limit=${options?.limit || ""}&eventStatus=${options?.eventStatus || ""}&startDate=${options?.startDate?.toISOString() || ""}&endDate=${options?.endDate?.toISOString()}`,
    method: "get",
  });
};

export const getUserPastEventOrders = async (_page?: PageData) => {
  const page = _page?.page;
  const limit = _page?.limit;

  return await request<GetUserOrders>({
    url: `/orders/user-past-events-orders?page=${page || ""}&limit=${limit || ""}`,
    method: "get",
  });
};

export const assignGuestOrder = async (data: AssignGuestOrderData) => {
  return await request<AssignGuestOrderResponse>({
    url: `/orders/assign-guest-order`,
    method: "post",
    data,
  });
};

export const checkPaymentStatus = async (orderId: string) => {
  return await request<PaymentStatusResponse>({
    url: `/orders/check-payment-status/${orderId}`,
    method: "get",
  });
};

export const getRevenue = async (range?: GetRevenueData) => {
  return await request<GetRevenueResponse>({
    url: `/orders/get-revenue?startDate=${range?.startDate?.toISOString() || ""}&endDate=${range?.endDate?.toISOString() || ""}`,
    method: "get",
  });
};

export const getTicketTypeSales = async (eventId: Event["id"]) => {
  if (!eventId) {
    throw new Error("Unable to get ticket type sales");
  }
  return (await request({
    url: `/orders/ticket-type-sales/${eventId}`,
    method: "get",
  })) as AxiosResponse<TicketTypeSalesResponse>;
};

export const getTicketsSoldStats = async (range?: GetRevenueData) => {
  return await request<GetTicketSoldStatsResponse>({
    url: `/orders/tickets-sold-stats?startDate=${range?.startDate?.toISOString() || ""}&endDate=${range?.endDate?.toISOString() || ""}`,
    method: "get",
  });
};
