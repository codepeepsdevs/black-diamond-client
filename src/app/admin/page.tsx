"use client";

import { useAdminGetEvents, useGetEvents } from "@/api/events/events.queries";
import {
  useGetOrders,
  useGetRevenue,
  useGetTicketsSoldStats,
} from "@/api/order/order.queries";
import { useUsersStats } from "@/api/user/user.queries";
import RecentOrdersTable from "@/components/dashboard/RecentOrders";
import { DatePickerWithRange } from "@/components/shared/DatePickerWithRange";
import LoadingSvg from "@/components/shared/Loader/LoadingSvg";
import { subMonths } from "date-fns";
import React from "react";
import { DateRange } from "react-day-picker";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";

export default function AdminHomePage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const upcomingEventsQuery = useAdminGetEvents({
    eventStatus: "upcoming",
  });
  const upcomingEvents = upcomingEventsQuery.data?.data;
  const revenueQuery = useGetRevenue({
    startDate: date?.from,
    endDate: date?.to,
  });
  const revenueData = revenueQuery.data?.data;

  const ticketsSoldQuery = useGetTicketsSoldStats({
    startDate: date?.from,
    endDate: date?.to,
  });
  const ticketsSoldData = ticketsSoldQuery.data?.data;

  const usersStatsQuery = useUsersStats({
    endDate: date?.to,
    startDate: date?.from,
  });
  const usersStats = usersStatsQuery.data?.data;

  return (
    <section>
      <div className="mx-8 mt-20 pt-10 text-[#A3A7AA]">
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-[#A3A7AA] mb-5">Welcome Liam</p>

        <div className="flex gap-x-2 justify-end items-center">
          <DatePickerWithRange
            selected={date}
            onSelect={setDate}
            mode="range"
          />
        </div>

        {/* INFO CARDS */}
        <div className="overflow-x-auto">
          <div className="flex gap-x-8 justify-between whitespace-nowrap mt-12">
            {/* TICKETS SOLD */}
            <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
              <div className="flex items-center justify-center gap-x-1">
                {ticketsSoldData?.upTrend ? (
                  <VscTriangleUp className="text-green-500 text-2xl" />
                ) : (
                  <VscTriangleDown className="text-[#E1306C] text-2xl" />
                )}
                <span>Tickets sold</span>
              </div>
              <div className="text-white font-semibold text-6xl">
                {ticketsSoldQuery.isFetching ? (
                  <LoadingSvg />
                ) : (
                  <span>{ticketsSoldData?.ticketsSold || 0}</span>
                )}
              </div>
            </div>
            {/* END TICKETS SOLD */}

            {/* REVENUE */}
            <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
              <div className="flex items-center justify-center gap-x-1">
                {revenueData?.upTrend ? (
                  <VscTriangleUp className="text-green-500 text-2xl" />
                ) : (
                  <VscTriangleDown className="text-[#E1306C] text-2xl" />
                )}
                <span>Revenue</span>
              </div>
              <div className="text-white font-semibold text-6xl">
                {revenueQuery.isFetching ? (
                  <LoadingSvg />
                ) : (
                  <span>${revenueData?.revenue.toFixed(2) || 0}</span>
                )}
              </div>
            </div>
            {/* END REVENUE */}

            {/* TOTAL USERS */}
            <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
              <div className="flex items-center justify-center gap-x-1">
                {usersStats?.upTrend ? (
                  <VscTriangleUp className="text-green-500 text-2xl" />
                ) : (
                  <VscTriangleDown className="text-[#E1306C] text-2xl" />
                )}
                <span>Total Users</span>
              </div>
              <div className="text-white font-semibold text-6xl">
                {usersStatsQuery.isFetching ? (
                  <LoadingSvg />
                ) : (
                  <span>{usersStats?.usersCount || 0}</span>
                )}
              </div>
            </div>
            {/* END TOTAL USERS */}

            {/* UPCOMING EVENTS */}
            <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
              <div className="flex items-center justify-center gap-x-1">
                <VscTriangleDown className="text-[#E1306C] text-2xl" />
                <span>Upcoming Events</span>
              </div>
              <div className="text-white font-semibold text-6xl">
                {upcomingEventsQuery.isFetching ? (
                  <LoadingSvg />
                ) : (
                  <span>{upcomingEvents?.eventsCount || 0}</span>
                )}
              </div>
            </div>
            {/* END UPCOMING EVENTS */}
          </div>
        </div>
        {/* END INFO CARDS */}

        <div className="mt-12">
          <div className="text-xl font-medium text-white">Recent Order</div>
          <RecentOrdersTable startDate={date?.from} endDate={date?.to} />
        </div>
      </div>
    </section>
  );
}
