"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  useUserPastEventOrders,
  useUserUpcomingEventsOrders,
} from "@/api/order/order.queries";
import { Order } from "@/constants/types";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import ErrorToast from "@/components/toast/ErrorToast";
import { loadStripe } from "@stripe/stripe-js";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import LoadingMessage from "@/components/shared/Loader/LoadingMessage";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  formatPurchaseDate,
  getTimeZoneDateRange,
} from "@/utils/utilityFunctions";
import * as dateFns from "date-fns";
import LoadingSkeleton from "@/components/shared/Loader/LoadingSkeleton";

const tabs = {
  UPCOMING_TICKETS: "upcoming-tickets",
  PAST_TICKETS: "past-tickets",
} as const;

export default function MyOrdersPage() {
  const [ppage, setPPage] = useQueryState(
    "ppage",
    parseAsInteger.withDefault(1)
  );
  const [upage, setUPage] = useQueryState(
    "upage",
    parseAsInteger.withDefault(1)
  );
  const [currentTab, setCurrentTab] =
    useState<(typeof tabs)[keyof typeof tabs]>("upcoming-tickets");
  const upcomingData = useUserUpcomingEventsOrders({ page: upage, limit: 10 });
  const pastData = useUserPastEventOrders({ page: ppage, limit: 10 });
  const upcomingEventOrders = upcomingData.data?.data;
  const pastEventOrders = pastData.data?.data;

  const isUlast = upcomingEventOrders?.orderCount
    ? upage * 10 >= upcomingEventOrders.orderCount
      ? true
      : false
    : true;

  const isPlast = pastEventOrders?.orderCount
    ? upage * 10 >= pastEventOrders.orderCount
      ? true
      : false
    : true;

  return (
    <div className=" mb-20">
      <h1 className="text-4xl font-medium text-white">My Ticket Orders</h1>

      {/* TAB CONTAINER */}
      <div className="text-xl font-medium mt-8">
        <button
          data-active={currentTab === "upcoming-tickets"}
          className="text-[#757575] py-3 px-4 data-[active=true]:text-white transition-colors data-[active=true]:border-b"
          onClick={() => setCurrentTab("upcoming-tickets")}
        >
          Upcoming Tickets
        </button>
        <button
          data-active={currentTab === "past-tickets"}
          className="text-[#757575] py-3 px-4 data-[active=true]:text-white transition-colors data-[active=true]:border-b"
          onClick={() => setCurrentTab("past-tickets")}
        >
          Past Tickets
        </button>
      </div>
      {/* END TAB CONTAINER */}

      {/* UPCOMING TICKETS LIST */}
      <div
        className={cn(
          "mt-11 space-y-4 md:space-y-10",
          currentTab === "upcoming-tickets" ? "block" : "hidden"
        )}
      >
        {upcomingData.isPending && !upcomingData.isError ? (
          <>
            {new Array(3).fill(0).map((_, index) => {
              return (
                <LoadingSkeleton key={index} className="w-full h-40 md:h-48" />
              );
            })}
          </>
        ) : upcomingEventOrders?.orderCount === 0 ? (
          <div></div>
        ) : (
          upcomingEventOrders?.userOrders?.map((order, index) => (
            <UpcomingOrderCard order={order} key={index} />
          ))
        )}

        {/* UPCOMING TICKETS PAGINATION */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2 flex items-center">
            <button
              className="size-10 rounded-lg bg-[#151515] text-2xl grid place-items-center"
              onClick={() =>
                setUPage((prev) => {
                  if (prev <= 1) {
                    return 1;
                  }
                  return prev - 1;
                })
              }
              disabled={upage == 1}
            >
              <FiChevronsLeft />
            </button>
            <div className="h-10 min-w-10 rounded-lg bg-[#757575] grid place-items-center">
              {upage}
            </div>
            <button
              className="size-10 rounded-lg bg-[#151515] text-2xl grid place-items-center"
              onClick={() => setUPage((prev) => prev + 1)}
              disabled={isUlast}
            >
              <FiChevronsRight />
            </button>
          </div>
        </div>
        <div className="text-white">
          {upcomingData.isFetching ? (
            <LoadingMessage>Loading upcoming events tickets</LoadingMessage>
          ) : upage ? (
            upcomingEventOrders?.orderCount ? (
              <div>
                Showing {upage * 10 - 9}-
                {isUlast ? upcomingEventOrders.orderCount : upage * 10} of{" "}
                {upcomingEventOrders.orderCount}
              </div>
            ) : null
          ) : null}
        </div>
        {/* END UPCOMING TICKETS PAGINATION */}
      </div>
      {/* END UPCOMING TICKETS LIST */}

      {/* PAST TICKETS LIST */}
      <div
        className={cn(
          "mt-11 space-y-6 md:space-y-20",
          currentTab === "past-tickets" ? "block" : "hidden"
        )}
      >
        {pastData.isPending && !pastData.isError ? (
          <>
            {new Array(3).fill(0).map((_, index) => {
              return (
                <LoadingSkeleton key={index} className="w-full h-40 md:h-48" />
              );
            })}
          </>
        ) : pastEventOrders?.orderCount === 0 ? (
          <div></div>
        ) : (
          pastEventOrders?.userOrders?.map((order, index) => (
            <PastOrderCard order={order} key={index} />
          ))
        )}

        {/* PAST TICKETS PAGINATION */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2 flex items-center">
            <button
              className="size-10 rounded-lg bg-[#151515] text-2xl grid place-items-center"
              onClick={() =>
                setPPage((prev) => {
                  if (prev <= 1) {
                    return 1;
                  }
                  return prev - 1;
                })
              }
              disabled={ppage == 1}
            >
              <FiChevronsLeft />
            </button>
            <div className="h-10 min-w-10 rounded-lg bg-[#757575] grid place-items-center">
              {ppage}
            </div>
            <button
              className="size-10 rounded-lg bg-[#151515] text-2xl grid place-items-center"
              onClick={() => setPPage((prev) => prev + 1)}
              disabled={isPlast}
            >
              <FiChevronsRight />
            </button>
          </div>
        </div>
        <div className="text-white">
          {pastData.isFetching ? (
            <LoadingMessage>Loading past event tickets</LoadingMessage>
          ) : ppage ? (
            pastEventOrders?.orderCount ? (
              <div>
                Showing {ppage * 10 - 9}-
                {isPlast ? pastEventOrders.orderCount : ppage * 10} of{" "}
                {pastEventOrders.orderCount}
              </div>
            ) : null
          ) : null}
        </div>
        {/* END PAST TICKETS PAGINATION */}
      </div>
      {/* END PAST TICKETS LIST */}
    </div>
  );
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);
function UpcomingOrderCard({ order }: { order: Order }) {
  const router = useRouter();

  const handleLink: React.MouseEventHandler<HTMLAnchorElement> = async (e) => {
    e.preventDefault();

    switch (order.status) {
      case "PENDING":
        router.push(`/tickets/${order.id}/fill-details`);
        break;
      case "COMPLETED":
        router.push(`/tickets/${order.id}/view-details`);
        break;
      case "CANCELLED":
        ErrorToast({
          title: "Error",
          descriptions: ["This order has been cancelled"],
        });
        break;
      // }
    }
  };
  return (
    <div className="relative overflow-hidden text-sm md:text-base max-w-4xl">
      <div className="border border-input-color flex gap-3 md:gap-5 h-44 md:h-60">
        {/* DATE */}
        <div className="my-4 text-center text-sm md:text-2xl space-y-2 pl-4">
          {dateFns
            .format(order.event.startTime, "MMM d")
            .toUpperCase()
            .toUpperCase()
            .split(" ")
            .map((item) => (
              <div key={item} className="text-text-color">
                {item}
              </div>
            ))}
        </div>
        {/* END DATE */}

        {/* DETAILS */}
        <div className="flex-1 my-4 text-xs md:text-base min-w-0 truncate break-words hyphens-auto">
          <div className="text-input-color font-medium text-sm md:text-2xl">
            {order.event.name}
          </div>
          <p className="my-4 text-input-color">
            {getTimeZoneDateRange(
              new Date(order.event.startTime || Date.now()),
              new Date(order.event.endTime || Date.now())
            )}{" "}
            <br />
            Order #{order.id} <br />
            Purchased on{" "}
            {formatPurchaseDate(new Date(order.createdAt || Date.now()))} <br />
          </p>
          <div className="flex items-center gap-x-2">
            <Link
              href={`#`}
              onClick={handleLink}
              className="text-[#4267B2] text-sm md:text-base"
            >
              View Order Tickets
            </Link>
            <span className="text-white bg-[#a3a7aa] px-1 rounded text-xs">
              {order.tickets.length}
            </span>
          </div>
        </div>
        {/* END DETAILS */}

        {/* EVENT POSTER */}
        <Image
          src={order.event.coverImage}
          alt=""
          width={350}
          height={350}
          className="max-md:w-32 w-60 h-full object-fill"
        />
        {/* END EVENT POSTER */}
      </div>

      {/* NOTCHES */}
      <div className="absolute bottom-12 left-0 size-10 md:size-14 rounded-full bg-black border border-input-color -translate-x-1/2"></div>
      <div className="absolute bottom-12 right-0 size-10 md:size-14 rounded-full bg-black border border-input-color translate-x-1/2"></div>
      {/* END NOTCHES */}
    </div>
  );
}

function PastOrderCard({ order }: { order: Order }) {
  const router = useRouter();

  const handleLink: React.MouseEventHandler<HTMLAnchorElement> = async (e) => {
    e.preventDefault();
    if (order.paymentStatus !== "SUCCESSFUL" || order.status !== "COMPLETED") {
      ErrorToast({
        title: "Error",
        descriptions: [
          "Event has already past, cannot pay for or fill details for a past event",
        ],
      });
      return;
    } else {
      router.push(`/tickets/${order.id}/view-details`);
    }
  };
  return (
    <div className="relative overflow-hidden text-sm md:text-base max-w-4xl">
      <div className="border border-input-color flex gap-3 md:gap-5 h-44 md:h-60">
        {/* DATE */}
        <div className="my-4 text-center text-sm md:text-2xl space-y-2 pl-4">
          {dateFns
            .format(order.event.startTime, "MMM d")
            .toUpperCase()
            .split(" ")
            .map((item) => (
              <div key={item} className="text-text-color">
                {item}
              </div>
            ))}
        </div>
        {/* END DATE */}

        {/* DETAILS */}
        <div className="flex-1 my-4 text-xs md:text-base min-w-0 truncate break-words hyphens-auto">
          <div className="text-input-color font-medium text-sm md:text-2xl">
            {order.event.name}
          </div>
          <p className="my-4 text-input-color">
            {getTimeZoneDateRange(
              new Date(order.event.startTime || Date.now()),
              new Date(order.event.endTime || Date.now())
            )}{" "}
            <br />
            Order #{order.id} <br />
            Purchased on{" "}
            {formatPurchaseDate(new Date(order.createdAt || Date.now()))} <br />
          </p>
          <div className="flex items-center gap-x-2">
            <Link
              href={`#`}
              onClick={handleLink}
              className="text-[#4267B2] text-sm md:text-base"
            >
              View Order Tickets
            </Link>
            <span className="text-white bg-[#a3a7aa] px-1 rounded text-xs">
              {order.tickets.length}
            </span>
          </div>
        </div>
        {/* END DETAILS */}

        {/* EVENT POSTER */}
        <Image
          src={order.event.coverImage}
          alt=""
          width={350}
          height={350}
          className="max-md:w-32 w-60 h-full object-fill"
        />
        {/* END EVENT POSTER */}
      </div>

      {/* NOTCHES */}
      <div className="absolute bottom-12 left-0 size-10 md:size-14 rounded-full bg-black border border-input-color -translate-x-1/2"></div>
      <div className="absolute bottom-12 right-0 size-10 md:size-14 rounded-full bg-black border border-input-color translate-x-1/2"></div>
      {/* END NOTCHES */}
    </div>
  );
}
