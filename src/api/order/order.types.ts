import { DateRangeData, Order, TicketType } from "@/constants/types";
import { ExtendedOrder } from "./order.queries";

export type GetUserOrders = {
  userOrders: Order[];
  orderCount: number;
};

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
    tickets: number;
  };
})[];

export type GetTicketSoldStatsResponse = {
  ticketsSold: number;
  upTrend: boolean;
};

export type GetOrders = {
  orders: ExtendedOrder[];
  ordersCount: number;
};

export type FillTicketDetailsResponse = {
  message: string;
  orderId: string;
};

export type GeneratePartyListData = {
  eventId: string;
};
