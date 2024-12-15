import { Event, Order, PromoCode } from "@/constants/types";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

export interface OrderStates {
  event?: Event | null;
  promocode?: PromoCode | null;
  ticketOrders?:
    | {
        name: string;
        ticketTypeId: string;
        quantity: number;
        price: number;
        soldQuantity: number;
      }[]
    | null;
  addonOrders?:
    | {
        name: string;
        addonId: string;
        quantity: number;
        price: number;
      }[]
    | null;
  //   checkedout?: boolean;
  orderId?: string | null;
  clientSecret?: string | null;
  totalDiscount?: number;
}

interface Actions {
  setEvent: (event: Event) => void;
  //   setCheckedOut: (checkedout: boolean) => void;
  setOrder: (order: OrderStates | null) => void;
  updateTicketOrders: (
    ticketTypeId: string,
    type: "increment" | "decrement"
  ) => void;
  updateAddonOrders: (addonId: string, type: "increment" | "decrement") => void;
  setOrderId: (orderId: string) => void;
  setClientSecret: (value: string) => void;
  setPromocode: (value: PromoCode | null) => void;
  clearOrder: () => void;
  updateDiscount: () => void;
}

export const useOrderStore = create(
  devtools(
    persist<OrderStates & Actions>(
      (set) => ({
        // event: null,
        // ticketOrders: null,
        // orderId: null,
        // promocode: null,
        totalDiscount: 0,

        setEvent: (event) =>
          set((prevState) => ({
            ...prevState,
            event,
          })),

        setOrder: (order) =>
          set((prevState) => {
            const newOrder: OrderStates = {
              event: order?.event || prevState.event,
              ticketOrders: order?.ticketOrders || prevState.ticketOrders,
              addonOrders: order?.addonOrders || prevState.addonOrders,
            };
            return newOrder;
          }),

        updateTicketOrders: (ticketTypeId, type) =>
          set((prevState) => {
            const newTicketOrders = prevState.ticketOrders?.map(
              (ticketOrder) => {
                if (ticketOrder.ticketTypeId === ticketTypeId) {
                  let newQuantity = 0;
                  if (type === "increment") {
                    newQuantity = ticketOrder.quantity + 1;
                  } else {
                    if (ticketOrder.quantity <= 0) {
                      newQuantity = 0;
                    } else {
                      newQuantity = ticketOrder.quantity - 1;
                    }
                  }
                  return {
                    ...ticketOrder,
                    quantity: newQuantity,
                  };
                } else {
                  return ticketOrder;
                }
              }
            );
            return {
              ...prevState,
              ticketOrders: newTicketOrders,
            };
          }),

        updateAddonOrders: (addonId, type) =>
          set((prevState) => {
            const addonOrders = prevState.addonOrders;
            const newAddonOrders = addonOrders?.map((addonOrder) => {
              if (addonOrder.addonId === addonId) {
                let newQuantity = 0;
                if (type === "increment") {
                  newQuantity = addonOrder.quantity + 1;
                } else {
                  if (addonOrder.quantity <= 0) {
                    newQuantity = 0;
                  } else {
                    newQuantity - 1;
                  }
                }
                return {
                  ...addonOrder,
                  quantity: newQuantity,
                };
              } else {
                return addonOrder;
              }
            });
            return {
              ...prevState,
              addonOrders: newAddonOrders,
            };
          }),

        setOrderId: (orderId) =>
          set(() => ({
            orderId,
          })),

        setClientSecret: (value) =>
          set(() => ({
            clientSecret: value,
          })),

        setPromocode: (value: PromoCode | null) => {
          set({ promocode: value });
        },
        updateDiscount: () => {
          set((prevState) => {
            let totalDiscount = 0;
            const promocode = prevState.promocode;
            if (!promocode) {
              return { totalDiscount };
            }
            // loop through the ticket orders
            prevState.ticketOrders?.forEach((ticketOrder) => {
              const ticketTypeDetails = prevState.event?.ticketTypes.find(
                (t) => t.id === ticketOrder.ticketTypeId
              );
              // check if the ticket includes the promocode id
              if (
                ticketTypeDetails?.promoCodeIds.includes(promocode?.id) &&
                ticketOrder.quantity > 0
              ) {
                console.log("match:", ticketOrder.name);
                let discount = 0; // calculate the discount amount using either absolute or percentage discount amount
                if (promocode?.absoluteDiscountAmount) {
                  console.log(
                    "absolute discount: ",
                    promocode.absoluteDiscountAmount
                  );
                  discount =
                    promocode.absoluteDiscountAmount * ticketOrder.quantity;
                } else if (promocode?.percentageDiscountAmount) {
                  console.log(
                    "absolute discount: ",
                    promocode.percentageDiscountAmount
                  );
                  discount =
                    ticketOrder.price *
                    promocode.percentageDiscountAmount *
                    0.01 *
                    ticketOrder.quantity;
                }
                // Discount must never be more than ticket price.. at most it can be equal to
                if (discount > ticketOrder.price) {
                  discount = ticketOrder.price;
                }
                totalDiscount += discount;
              }
            });
            return { totalDiscount } satisfies OrderStates;
          });
        },
        clearOrder: () => {
          set({
            addonOrders: null,
            clientSecret: null,
            event: null,
            orderId: null,
            promocode: null,
            ticketOrders: null,
            totalDiscount: 0,
          } satisfies OrderStates);
        },
      }),

      {
        name: "order",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
