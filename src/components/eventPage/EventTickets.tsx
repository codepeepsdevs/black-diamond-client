"use client";

import React from "react";
import Image from "next/image";
import { Add, Minus } from "../../../public/icons";
import { useOrderStore } from "@/store/order.store";
import { newYorkTimeZone } from "@/utils/date-formatter";
import * as dateFnsTz from "date-fns-tz";

const EventTickets = () => {
  const order = useOrderStore();

  return (
    <div className=" bg-[#151515] border border-[#333333] text-[#A3A7AA]">
      {order.event?.ticketTypes.map((ticketType) => {
        return (
          <div className="p-2 border-[#333333] border-b" key={ticketType.id}>
            <div className="flex justify-between items-center text-base">
              <h3 className="text-white text-lg">{ticketType.name}</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    order.updateTicketOrders(ticketType.id, "decrement")
                  }
                >
                  <Image className="cursor-pointer" src={Minus} alt="minus" />
                </button>
                <div>
                  {order.ticketOrders?.find(
                    (ticketOrder) => ticketOrder.ticketTypeId === ticketType.id
                  )?.quantity || 0}
                </div>
                <button
                  onClick={() =>
                    order.updateTicketOrders(ticketType.id, "increment")
                  }
                >
                  <Image className="cursor-pointer" src={Add} alt="add" />
                </button>
              </div>
            </div>
            {/* <p className="text-white">
              ${ticketType.price} +{" "}
              <span className="text-sm">{ticketType.fee} Fee</span>
            </p> */}
            <p className="text-sm">
              Sales end on{" "}
              {order.event?.endTime
                ? dateFnsTz.format(order.event?.endTime, "MMM dd, yyyy", {
                    timeZone: newYorkTimeZone,
                  })
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
