"use client";

import { useAdminGetEvents, useGetEvents } from "@/api/events/events.queries";
import {
  useGetOrders,
  useGetRevenue,
  useGetTicketsSoldStats,
} from "@/api/order/order.queries";
import { useGetUser, useUsersStats } from "@/api/user/user.queries";
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
  const userQuery = useGetUser();
  const userData = userQuery.data?.data;

  const upcomingEventsFilter = React.useMemo(() => ({ eventStatus: "upcoming" as const }), []);
  const upcomingEventsQuery = useAdminGetEvents(upcomingEventsFilter);
  const upcomingEvents = upcomingEventsQuery.data?.data;
  const dateRange = React.useMemo(
    () => ({
      startDate: date?.from,
      endDate: date?.to,
    }),
    [date?.from, date?.to]
  );

  const revenueQuery = useGetRevenue(dateRange);
  const revenueData = revenueQuery.data?.data;

  const ticketsSoldQuery = useGetTicketsSoldStats(dateRange);
  const ticketsSoldData = ticketsSoldQuery.data?.data;

  const usersStatsQuery = useUsersStats(dateRange);
  const usersStats = usersStatsQuery.data?.data;

  return (
    <section>
      <div className="mx-8 mt-20 pt-10 text-[#A3A7AA]">
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-[#A3A7AA] mb-5">
          Welcome {userQuery.isPending ? <LoadingSvg /> : userData?.firstname}
        </p>

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
            <div className="flex flex-col shrink-0 items-center justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
              <div className="flex items-center justify-center gap-x-1 h-6">
                {ticketsSoldQuery.isPending ? (
                  <span className="w-4 h-4 bg-white/10 animate-pulse rounded-full" aria-hidden />
                ) : ticketsSoldQuery.isError ? (
                  <span className="w-2 h-2 bg-gray-500 rounded-full" aria-hidden />
                ) : ticketsSoldData?.upTrend ? (
                  <VscTriangleUp className="text-green-500 text-2xl" />
                ) : (
                  <VscTriangleDown className="text-[#E1306C] text-2xl" />
                )}
                <span>Tickets sold</span>
              </div>
              <div className="text-white font-semibold text-6xl flex items-center justify-center min-h-[72px]">
                {ticketsSoldQuery.isPending ? (
                  <LoadingSvg sizeClass="w-8 h-8" />
                ) : ticketsSoldQuery.isError ? (
                  <span className="text-lg font-normal text-red-400">Failed to load</span>
                ) : (
                  <span className={ticketsSoldQuery.isFetching ? "opacity-60 transition-opacity" : ""}>
                    {ticketsSoldData?.ticketsSold ?? 0}
                  </span>
                )}
              </div>
            </div>
            {/* END TICKETS SOLD */}

            {/* REVENUE */}
            <div className="flex flex-col shrink-0 items-center justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
              <div className="flex items-center justify-center gap-x-1 h-6">
                {revenueQuery.isPending ? (
                  <span className="w-4 h-4 bg-white/10 animate-pulse rounded-full" aria-hidden />
                ) : revenueQuery.isError ? (
                  <span className="w-2 h-2 bg-gray-500 rounded-full" aria-hidden />
                ) : revenueData?.upTrend ? (
                  <VscTriangleUp className="text-green-500 text-2xl" />
                ) : (
                  <VscTriangleDown className="text-[#E1306C] text-2xl" />
                )}
                <span>Revenue</span>
              </div>
              <div className="text-white font-semibold text-6xl flex items-center justify-center min-h-[72px]">
                {revenueQuery.isPending ? (
                  <LoadingSvg sizeClass="w-8 h-8" />
                ) : revenueQuery.isError ? (
                  <span className="text-lg font-normal text-red-400">Failed to load</span>
                ) : (
                  <span className={revenueQuery.isFetching ? "opacity-60 transition-opacity" : ""}>
                    ${revenueData?.revenue != null ? revenueData.revenue.toFixed(2) : "0.00"}
                  </span>
                )}
              </div>
            </div>
            {/* END REVENUE */}

            {/* TOTAL USERS */}
            <div className="flex flex-col shrink-0 items-center justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
              <div className="flex items-center justify-center gap-x-1 h-6">
                {usersStatsQuery.isPending ? (
                  <span className="w-4 h-4 bg-white/10 animate-pulse rounded-full" aria-hidden />
                ) : usersStatsQuery.isError ? (
                  <span className="w-2 h-2 bg-gray-500 rounded-full" aria-hidden />
                ) : usersStats?.upTrend ? (
                  <VscTriangleUp className="text-green-500 text-2xl" />
                ) : (
                  <VscTriangleDown className="text-[#E1306C] text-2xl" />
                )}
                <span>Total Users</span>
              </div>
              <div className="text-white font-semibold text-6xl flex items-center justify-center min-h-[72px]">
                {usersStatsQuery.isPending ? (
                  <LoadingSvg sizeClass="w-8 h-8" />
                ) : usersStatsQuery.isError ? (
                  <span className="text-lg font-normal text-red-400">Failed to load</span>
                ) : (
                  <span className={usersStatsQuery.isFetching ? "opacity-60 transition-opacity" : ""}>
                    {usersStats?.usersCount ?? 0}
                  </span>
                )}
              </div>
            </div>
            {/* END TOTAL USERS */}

            {/* UPCOMING EVENTS */}
            <div className="flex flex-col shrink-0 items-center justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
              <div className="flex items-center justify-center gap-x-1 h-6">
                <VscTriangleDown className="text-[#E1306C] text-2xl" />
                <span>Upcoming Events</span>
              </div>
              <div className="text-white font-semibold text-6xl flex items-center justify-center min-h-[72px]">
                {upcomingEventsQuery.isPending ? (
                  <LoadingSvg sizeClass="w-8 h-8" />
                ) : upcomingEventsQuery.isError ? (
                  <span className="text-lg font-normal text-red-400">Failed to load</span>
                ) : (
                  <span className={upcomingEventsQuery.isFetching ? "opacity-60 transition-opacity" : ""}>
                    {upcomingEvents?.eventsCount ?? 0}
                  </span>
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
