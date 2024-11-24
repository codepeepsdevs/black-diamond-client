"use client";

import React from "react";
import Image from "next/image";
import { Add, Minus } from "../../../public/icons";
import { useOrderStore } from "@/store/order.store";
import { newYorkTimeZone } from "@/utils/date-formatter";
import * as dateFnsTz from "date-fns-tz";
import cn from "classnames";

const EventTickets = () => {
  const order = useOrderStore();

  return (
    <div className=" bg-[#151515] border border-[#333333] text-[#A3A7AA]">
      {order.event?.ticketTypes.map((ticketType) => {
        const soldQuantity = order.ticketOrders?.find(
          (ticketOrder) => ticketOrder.ticketTypeId === ticketType.id
        )?.soldQuantity;
        let soldOut = false;
        if (soldQuantity != undefined) {
          soldOut = soldQuantity >= ticketType.quantity;
        }
        return (
          <div className="p-2 border-[#333333] border-b" key={ticketType.id}>
            <div className="flex justify-between items-center text-base">
              <h3 className="flex items-center gap-1.5 text-white text-lg">
                {ticketType.name}{" "}
                <span className="text-red-500 text-sm">
                  {soldOut ? "Sold Out" : null}
                </span>
              </h3>
              <div
                className={cn(" flex items-center gap-1", {
                  // "blur-sm": ticketType.quantity < 1,
                })}
              >
                <button
                  disabled={soldOut}
                  onClick={() => {
                    order.updateTicketOrders(ticketType.id, "decrement");
                  }}
                  className="disabled:opacity-50"
                >
                  <Image className="cursor-pointer" src={Minus} alt="minus" />
                </button>
                <div>
                  {order.ticketOrders?.find(
                    (ticketOrder) => ticketOrder.ticketTypeId === ticketType.id
                  )?.quantity || 0}
                </div>
                <button
                  disabled={soldOut}
                  onClick={() => {
                    order.updateTicketOrders(ticketType.id, "increment");
                  }}
                  className="disabled:opacity-50"
                >
                  <Image className="cursor-pointer" src={Add} alt="add" />
                </button>
              </div>
            </div>
            {/* <p className="text-white">
              ${ticketType.price} +{" "}
              <span className="text-sm">{ticketType.fee} Fee</span>
            </p> */}
            <p
              className={cn("text-sm", {
                // "blur-sm": ticketType.quantity < 1,
              })}
            >
              Sales end on{" "}
              {order.event?.endTime
                ? dateFnsTz.format(
                    dateFnsTz.toZonedTime(
                      order.event?.endTime,
                      newYorkTimeZone
                    ),
                    "MMM dd, yyyy"
                  )
                : "N/A"}
            </p>
          </div>
        );
      })}

      {/* ORDER DETAILS */}
      <div className="">
        {order.ticketOrders
          ?.filter((order) => order.quantity > 0)
          .map((placedOrder) => {
            return (
              <div
                key={placedOrder.ticketTypeId}
                className="flex item-center justify-between p-2"
              >
                <p>
                  {placedOrder.quantity} x {placedOrder.name}
                </p>
                <p>${placedOrder.quantity * placedOrder.price}</p>
              </div>
            );
          })}

        {/* <p className="text-end text-white p-2">
          $<span className="font-bold">{order.totalDiscount} </span>
          {""}Discount
        </p> */}
        <p className="text-end text-white p-2">
          $
          <span className="font-bold">
            {(order.ticketOrders?.reduce(
              (accValue, ticketOrder) =>
                accValue + ticketOrder.price * ticketOrder.quantity,
              0
            ) || 0) - (order.totalDiscount || 0)}{" "}
          </span>
          total
        </p>
      </div>
      {/* ORDER DETAILS */}
    </div>
  );
};

export default EventTickets;
