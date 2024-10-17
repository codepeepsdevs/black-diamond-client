import { DateRangeData, Order, TicketType } from "@/constants/types";

export type AssignGuestOrderData = {
  orderId: string;
};

export type AssignGuestOrderResponse = {
  message: string;
};

export type OrderDetailsResponse = Order;

export type PaymentStatusResponse = {
  paid: boolean;
  message: string;
};

export type GetRevenueData = DateRangeData;

export type GetRevenueResponse = {
  revenue: number;
  upTrend: boolean;
};

export type TicketTypeSalesResponse = (TicketType & {
  _count: {
    tickets: true;
  };
})[];

export type GetTicketSoldStatsResponse = {
  ticketsSold: number;
  upTrend: boolean;
};
