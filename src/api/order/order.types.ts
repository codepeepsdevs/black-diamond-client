import { DateRangeData, Order, TicketType } from "@/constants/types";

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
  orders: Order[];
  ordersCount: number;
};

export type FillTicketDetailsResponse = {
  message: string;
  orderId: string;
};

export type GeneratePartyListData = {
  eventId: string;
};

export type BulkReconcileData = {
  orderIds: string[];
};

export type BulkReconcileResponse = {
  results: Array<{
    orderId: string;
    status: 'verified' | 'skipped' | 'error';
    reason: string;
    paid?: boolean;
  }>;
  summary: { verified: number; skipped: number; error: number };
};
