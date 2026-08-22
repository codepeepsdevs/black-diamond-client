"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdminGetEvent } from "@/api/events/events.queries";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { MdOutlineFilterCenterFocus } from "react-icons/md";
import * as dateFns from "date-fns";
import { getTimeZoneDateRange } from "@/utils/utilityFunctions";
import AdminButton from "@/components/buttons/AdminButton";
import LoadingSvg from "@/components/shared/Loader/LoadingSvg";
import { cn } from "@/utils/cn";
import {
  useGetCheckInStats,
  useGetEventTickets,
  useCheckInById,
  useUndoCheckIn,
} from "@/api/checkin/checkin.queries";
import { parseAsInteger, useQueryState } from "nuqs";

export default function EventCheckinPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = params.id;
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
    parse: (v) => v,
    serialize: (v) => v || "",
  });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const limit = 10;
  const [actionInFlight, setActionInFlight] = useState<{
    id: string | null;
    type: "checkin" | "undo" | null;
  }>({ id: null, type: null });

  const eventQuery = useAdminGetEvent(eventId);
  const event = eventQuery.data?.data;

  const ticketsQuery = useGetEventTickets({
    eventId,
    page,
    limit,
    search: searchTerm || undefined,
  });
  const statsQuery = useGetCheckInStats(eventId);
  const { mutate: checkInById, isPending: checkInPending } =
    useCheckInById(eventId);
  const { mutate: undoCheckIn, isPending: undoPending } =
    useUndoCheckIn(eventId);
  const tickets = ticketsQuery.data?.data.tickets || [];
  const pagination = ticketsQuery.data?.data.pagination;
  const checkedInCount = statsQuery.data?.data.checkedInTickets || 0;
  const totalAttendees = statsQuery.data?.data.totalTickets || 0;

  if (eventQuery.isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSvg />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Event not found</div>
      </div>
    );
  }

  return (
    <section className="mx-8 mt-20 pt-10 pb-28 relative">
      {/* Header */}
      <div className="flex items-center gap-x-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-white hover:opacity-80"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-white">
            Check In: {event.name}
          </h1>
          <p className="text-[#A3A7AA] mt-1">
            {getTimeZoneDateRange(
              new Date(event.startTime || Date.now()),
              new Date(event.endTime || Date.now())
            )}
          </p>
        </div>
        <div className="text-green-500 font-semibold">
          Check Ins: {checkedInCount}/{totalAttendees}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A3A7AA]" />
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm || ""}
          onChange={(e) => {
            setPage(1);
            setSearchTerm(e.target.value);
          }}
          className="w-full bg-[#151515] border border-[#A3A7AA] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#A3A7AA] focus:outline-none focus:border-white"
        />
      </div>

      {/* Attendees List */}
      <div className="bg-[#151515] rounded-lg">
        {tickets.map((ticket, index) => (
          <div key={ticket.id}>
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="text-white font-medium">
                  {`${ticket.firstName || ""} ${ticket.lastName || ""}`.trim() ||
                    ticket.email ||
                    "Unnamed"}
                </div>
                <div className="text-[#A3A7AA] text-sm">
                  {ticket.ticketType?.name}
                </div>
              </div>
              <AdminButton
                onClick={() => {
                  if (ticket.checkedIn) {
                    setActionInFlight({ id: ticket.id, type: "undo" });
                    undoCheckIn(ticket.id, {
                      onSettled: () =>
                        setActionInFlight({ id: null, type: null }),
                    });
                  } else {
                    setActionInFlight({ id: ticket.id, type: "checkin" });
                    checkInById(ticket.id, {
                      onSettled: () =>
                        setActionInFlight({ id: null, type: null }),
                    });
                  }
                }}
                variant={ticket.checkedIn ? "primary" : "outline"}
                className={cn(
                  "flex items-center gap-x-2 px-4 py-2",
                  ticket.checkedIn && "bg-green-600 hover:bg-green-700"
                )}
                disabled={
                  (actionInFlight.id === ticket.id &&
                    (checkInPending || undoPending)) ||
                  false
                }
              >
                {actionInFlight.id === ticket.id &&
                (checkInPending || undoPending) ? (
                  <>
                    <LoadingSvg />
                    <span>
                      {actionInFlight.type === "undo"
                        ? "Unchecking..."
                        : "Checking..."}
                    </span>
                  </>
                ) : (
                  <>
                    <MdOutlineFilterCenterFocus />
                    <span>{ticket.checkedIn ? "Uncheck" : "Check In"}</span>
                  </>
                )}
              </AdminButton>
            </div>
            {index < tickets.length - 1 && (
              <div className="border-b border-[#A3A7AA] mx-4" />
            )}
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-[#A3A7AA] text-lg">
            {searchTerm || ""
              ? "No attendees found matching your search"
              : "No attendees found"}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-4 mt-4 text-[#A3A7AA]">
          <button
            className="underline disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="underline disabled:opacity-50"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Fixed Bottom Scan Button */}
      <div className="fixed left-0 right-0 bottom-6 flex items-center justify-center">
        <button
          onClick={() => router.push(`/admin/events/${eventId}/checkin/scan`)}
          className="flex items-center gap-x-3 rounded-full bg-[#E14545] px-6 py-4 text-white shadow-lg"
        >
          <MdOutlineFilterCenterFocus className="text-2xl" />
          <span className="text-lg font-medium">Scan QR</span>
        </button>
      </div>
    </section>
  );
}
