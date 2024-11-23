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
  FillTicketDetailsResponse,
  GeneratePartyListData,
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
  return await request<FillTicketDetailsResponse>({
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
    url: `/orders/get-orders?page=${options?.page || ""}&limit=${options?.limit || ""}&eventStatus=${options?.eventStatus || ""}&startDate=${options?.startDate?.toISOString() || ""}&endDate=${options?.endDate?.toISOString()}`,
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

export const generateOrderReport = async (range?: DateRangeData) => {
  const response = await request({
    url: `/orders/generate-order-report?startDate=${range?.startDate?.toISOString() || ""}&endDate=${range?.endDate?.toISOString() || ""}`,
    method: "get",
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    responseType: "blob",
  });

  // Extract the filename from the Content-Disposition header
  const disposition = response.headers["content-disposition"];
  let filename = "Order_Report"; // Fallback filename

  if (disposition && disposition.includes("filename=")) {
    const matches = disposition.match(/filename="?([^"]+)"?/);
    if (matches && matches[1]) {
      filename = matches[1];
    }
  }

  // Step 1: Create a blob from the response
  const blob = new Blob([response.data], { type: response.data.type });

  // Step 2: Create a download URL for the blob
  const downloadUrl = window.URL.createObjectURL(blob);

  // Step 3: Create a temporary link element
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;

  // Step 4: Trigger the download
  document.body.appendChild(link);
  link.click();

  // Step 5: Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export const generatePartyList = async (dto: GeneratePartyListData) => {
  const response = await request({
    url: `/orders/generate-party-list`,
    method: "post",
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    data: dto,
    responseType: "blob",
  });

  // Extract the filename from the Content-Disposition header
  const disposition = response.headers["content-disposition"];
  let filename = "Party_List"; // Fallback filename

  if (disposition && disposition.includes("filename=")) {
    const matches = disposition.match(/filename="?([^"]+)"?/);
    if (matches && matches[1]) {
      filename = matches[1];
    }
  }

  // Step 1: Create a blob from the response
  const blob = new Blob([response.data], { type: response.data.type });

  // Step 2: Create a download URL for the blob
  const downloadUrl = window.URL.createObjectURL(blob);

  // Step 3: Create a temporary link element
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;

  // Step 4: Trigger the download
  document.body.appendChild(link);
  link.click();

  // Step 5: Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
