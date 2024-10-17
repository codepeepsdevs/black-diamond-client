import { Event, Order, Ticket, User } from "@/constants/types";
import { OrderStates } from "@/store/order.store";
import * as Yup from "yup";
import { checkoutFormSchema } from "../events/events.schemas";

export type CheckoutData = Yup.InferType<typeof checkoutFormSchema> & {
  eventId: Event["id"];
  ticketOrders: {
    ticketTypeId: string;
    quantity: number;
  }[];
  addonOrders:
    | {
        addonId: string;
        quantity: number;
      }[]
    | null;
  promocodeId?: string;
  successUrl?: string;
  cancelUrl?: string;
};

export type CreateIntentResponse = {
  clientSecret: string;
};

// export type CheckoutResponse = {
//   message: string;
//   data: Order;
// } & CreateIntentResponse;

export type CheckoutResponse = {
  message: string;
  data: Order;
  sessionId: string;
  sessionUrl: string;
};
