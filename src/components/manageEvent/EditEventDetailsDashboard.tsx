import Image from "next/image";
import React from "react";
import TicketsIcon from "./TicketIcon";
import { FiBookOpen, FiDownload, FiUpload, FiUser } from "react-icons/fi";
import { VscTriangleDown } from "react-icons/vsc";
import { FaFacebookF, FaTwitter } from "react-icons/fa6";
import toast from "react-hot-toast";
import { cn } from "@/utils/cn";
import { useParams, useRouter } from "next/navigation";
import {
  useAdminGetEvent,
  useGetEventRevenue,
  usePageView,
  usePublishEvent,
  useUnpublishEvent,
} from "@/api/events/events.queries";
import * as dateFns from "date-fns";
import {
  getApiErrorMessage,
  getLowestTicket,
  getTimeZoneDateRange,
} from "@/utils/utilityFunctions";
import {
  useGeneratePartyList,
  useGetTicketTypeSales,
} from "@/api/order/order.queries";
import AdminButton from "../buttons/AdminButton";
import ErrorToast from "../toast/ErrorToast";
import SuccessToast from "../toast/SuccessToast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/constants/types";
import LoadingSvg from "../shared/Loader/LoadingSvg";
import * as dateFnsTz from "date-fns-tz";
import { newYorkTimeZone } from "@/utils/date-formatter";
import { MdOutlineFilterCenterFocus } from "react-icons/md";

export default function EditEventDetailsDashboard({
  isActive,
  canModify = true,
}: {
  isActive: boolean;
  canModify?: boolean;
}) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = params.id;

  const { mutate: publishEvent, isPending: publishEventPending } =
    usePublishEvent(eventId);
  const { mutate: unpublishEvent, isPending: unpublishEventPending } =
    useUnpublishEvent(eventId);

  const onError = (e: AxiosError<ErrorResponse>) => {
    const errorMessage = getApiErrorMessage(e, "Error generating party list");
    ErrorToast({
      title: "Error",
      descriptions: errorMessage,
    });
  };

  const onSuccess = () => {
    SuccessToast({
      title: "Success",
      description: "Order report generated successfully",
    });
  };
  const { mutate: generatePartyList, isPending: generatePartyListPending } =
    useGeneratePartyList(onError, onSuccess);

  const eventQuery = useAdminGetEvent(eventId);
  const event = eventQuery.data?.data;

  const ticketTypeSalesQuery = useGetTicketTypeSales(eventId);
  const ticketTypeSales = ticketTypeSalesQuery.data?.data;

  const totalTickets = event?.ticketTypes.reduce((accValue, ticketType) => {
    return (accValue += ticketType.quantity);
  }, 0);
  const totalTicketsSold = ticketTypeSales?.reduce((accValue, ticket) => {
    return (accValue += ticket._count.tickets);
  }, 0);

  const eventRevenueQuery = useGetEventRevenue(eventId);
  const eventRevenue = eventRevenueQuery.data?.data;

  const viewCountQuery = usePageView(eventId);
  const viewCountData = viewCountQuery.data?.data;

  const eventLink = `${window.location.protocol}//${window.location.host}/events/${event?.eventStatus?.toLowerCase()}/${eventId}`;
  // const eventLink = `https://${process.env.NEXT_PUBLIC_FRONTEND_URL}/events/${event?.eventStatus.toLowerCase()}/${eventId}`;
  const daysToEvent = event?.startTime
    ? dateFns.differenceInDays(new Date(event.startTime), new Date())
    : null;
  const daysPastEvent = event?.endTime
    ? dateFns.differenceInDays(new Date(), new Date(event.startTime))
    : null;

  const lowestPrice = event?.ticketTypes
    ? getLowestTicket(event?.ticketTypes)?.price || 0
    : 0;

  const checkinDisabled =
    !event?.isPublished ||
    (daysPastEvent && daysPastEvent > 0) ||
    eventQuery.isPending;
  console.log("checkinDisabled:", checkinDisabled);
  console.log("event?.isPublished:", event?.isPublished);
  console.log("daysPastEvent:", daysPastEvent);
  console.log("eventQuery.isPending:", eventQuery.isPending);

  function shareLink(platform: "facebook" | "twitter") {
    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventLink)}`;
    const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      "New Event on Blackdiamond, Grab your tickets nowww!"
    )}&url=${encodeURIComponent(eventLink)}`;

    if (platform === "facebook") {
      return facebookShare;
    }
    if (platform === "twitter") {
      return twitterShare;
    }
  }

  return (
    <div className={cn("text-[#A3A7AA]", isActive ? "block" : "hidden")}>
      {!canModify && (
        <div className="mb-4 bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-300 px-4 py-3 rounded">
          <p className="text-sm font-medium">
            You are in read-only mode. You can view event dashboard but cannot publish/unpublish events.
          </p>
        </div>
      )}
      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-end mt-8 gap-3">
        {canModify && (
          <>
            {event?.isPublished ? (
              <AdminButton
                disabled={unpublishEventPending}
                onClick={() => unpublishEvent(eventId)}
                variant="primary"
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 border border-red-500/20 rounded-lg px-4 py-2 shadow-sm disabled:opacity-50 transition-colors"
              >
                {unpublishEventPending ? <LoadingSvg sizeClass="w-4 h-4" /> : <FiDownload className="size-4" />}{" "}
                <span>Unpublish</span>
              </AdminButton>
            ) : (
              <AdminButton
                disabled={publishEventPending}
                onClick={() => publishEvent(eventId)}
                variant="primary"
                className="flex items-center gap-2 bg-white text-black hover:bg-zinc-100 border border-white rounded-lg px-4 py-2 shadow-sm disabled:opacity-50 transition-colors"
              >
                {publishEventPending ? <LoadingSvg sizeClass="w-4 h-4" variant /> : <FiUpload className="size-4" />}
                <span>Publish</span>
              </AdminButton>
            )}
          </>
        )}

        <AdminButton
          disabled={generatePartyListPending}
          onClick={() =>
            generatePartyList({
              eventId,
            })
          }
          variant="primary"
          className="inline-flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#1e1e1e] hover:border-[#2a2a2a] border border-[#262626] rounded-lg px-4 py-2 text-white shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {generatePartyListPending ? <LoadingSvg sizeClass="w-4 h-4" /> : <FiBookOpen className="size-4 opacity-70" />}
          <span>Party List</span>
        </AdminButton>

        <AdminButton
          disabled={checkinDisabled}
          onClick={() => router.push(`/admin/events/${eventId}/checkin`)}
          variant="ghost"
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 text-black border border-white rounded-lg px-4 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:!bg-[#1a1a1a] disabled:!text-white/40 disabled:!border-[#262626] disabled:opacity-100 disabled:cursor-not-allowed transition-colors text-sm font-medium !text-black disabled:!text-white/40"
        >
          <MdOutlineFilterCenterFocus className="size-4 opacity-70" />
          <span>Check-in</span>
        </AdminButton>
      </div>
      {/* END ACTION BUTTONS */}
      <div className="rounded-xl border border-[#262626] bg-[#0f0f0f] overflow-hidden mt-8">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Image
            src={event?.coverImage || ""}
            alt="Cover image"
            width={180}
            height={180}
            className="size-28 rounded-xl object-cover shrink-0 border border-[#262626] bg-[#1a1a1a]"
          />
          <div className="space-y-2.5 flex-1 min-w-0">
            <h3 className="text-white font-medium text-lg leading-tight truncate">{event?.name || "Untitled Event"}</h3>
            <div className="space-y-1">
              <p className="text-[#A3A7AA] text-sm">
                {getTimeZoneDateRange(
                  new Date(event?.startTime || Date.now()),
                  new Date(event?.endTime || Date.now())
                )}
              </p>
              <p className="text-[#6b6b6b] text-sm truncate">{event?.location || "No location"}</p>
            </div>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a1a1a] border border-[#262626] text-sm text-white">
                <TicketsIcon />
                <span>${lowestPrice}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a1a1a] border border-[#262626] text-sm text-white">
                <FiUser className="size-3.5" />
                <span>{totalTickets ?? 0} tickets</span>
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto sm:text-right">
            {daysToEvent === null ? (
              <span className="inline-flex px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#262626] text-sm text-[#6b6b6b]">No date</span>
            ) : daysToEvent > 0 ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
                <span className="size-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                In {daysToEvent} day(s)
              </span>
            ) : daysPastEvent ? (
              <span className="inline-flex px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium">
                {Math.abs(daysPastEvent)} day(s) ago
              </span>
            ) : (
              <span className="inline-flex px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-medium">Today</span>
            )}
          </div>
        </div>
      </div>

      {/* EVENT METRICS */}
      <div className="overflow-x-auto -mx-1 px-1 pb-2">
        <div className="flex gap-4 mt-8">
          {/* TICKETS SOLD */}
          <div className="flex flex-col shrink-0 items-center justify-center space-y-3 text-center bg-[#0f0f0f] border border-[#262626] rounded-xl w-80 h-56 shadow-sm hover:border-[#2a2a2a] transition-colors">
            <div className="flex items-center justify-center gap-x-1.5 text-sm text-[#6b6b6b]">
              <VscTriangleDown className="text-[#E1306C] text-lg" />
              <span className="tracking-wide">Tickets sold</span>
            </div>
            {ticketTypeSalesQuery.isPending ? (
              <div className="flex items-center justify-center min-h-[72px]">
                <LoadingSvg sizeClass="w-8 h-8" />
              </div>
            ) : ticketTypeSalesQuery.isError ? (
              <div className="flex items-center justify-center min-h-[72px]">
                <span className="text-sm font-normal text-red-400">Failed to load</span>
              </div>
            ) : (
              <div className="text-white font-semibold text-5xl tracking-tight">
                {totalTicketsSold ?? 0}
                <span className="text-[#6b6b6b] font-normal text-3xl">/{totalTickets ?? 0}</span>
              </div>
            )}
            <span className="text-xs text-[#6b6b6b]">{totalTicketsSold ?? 0} confirmed</span>
          </div>
          {/* END TICKETS SOLD */}

          {/* REVENUE */}
          <div className="flex flex-col shrink-0 items-center justify-center space-y-3 text-center bg-[#0f0f0f] border border-[#262626] rounded-xl w-80 h-56 shadow-sm hover:border-[#2a2a2a] transition-colors">
            <div className="flex items-center justify-center gap-x-1.5 text-sm text-[#6b6b6b]">
              <VscTriangleDown className="text-[#E1306C] text-lg" />
              <span className="tracking-wide">Revenue</span>
            </div>
            {eventRevenueQuery.isPending ? (
              <div className="flex items-center justify-center min-h-[72px]">
                <LoadingSvg sizeClass="w-8 h-8" />
              </div>
            ) : eventRevenueQuery.isError ? (
              <div className="flex items-center justify-center min-h-[72px]">
                <span className="text-sm font-normal text-red-400">Failed to load</span>
              </div>
            ) : (
              <div className="text-white font-semibold text-5xl tracking-tight">
                ${Number(eventRevenue?.revenue ?? 0).toFixed(2)}
              </div>
            )}
            <span className="text-xs text-[#6b6b6b]">Total paid</span>
          </div>
          {/* END REVENUE */}

          {/* PAGE VIEWS */}
          <div className="flex flex-col shrink-0 items-center justify-center space-y-3 text-center bg-[#0f0f0f] border border-[#262626] rounded-xl w-80 h-56 shadow-sm hover:border-[#2a2a2a] transition-colors">
            <div className="flex items-center justify-center gap-x-1.5 text-sm text-[#6b6b6b]">
              <VscTriangleDown className="text-[#E1306C] text-lg" />
              <span className="tracking-wide">Page Views</span>
            </div>
            {viewCountQuery.isPending ? (
              <div className="flex items-center justify-center min-h-[72px]">
                <LoadingSvg sizeClass="w-8 h-8" />
              </div>
            ) : viewCountQuery.isError ? (
              <div className="flex items-center justify-center min-h-[72px]">
                <span className="text-sm font-normal text-red-400">Failed to load</span>
              </div>
            ) : (
              <div className="text-white font-semibold text-5xl tracking-tight">
                {viewCountData?.views ?? 0}
              </div>
            )}
            <span className="text-xs text-[#6b6b6b]">Unique views</span>
          </div>
          {/* END PAGE VIEWS */}
        </div>
      </div>
      {/* END EVENT METRICS */}

      {/* SHARE EVENT */}
      <div className="mt-10 rounded-xl border border-[#262626] bg-[#0f0f0f] p-6">
        <div className="text-lg font-medium text-white mb-5">Share</div>

        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-medium tracking-widest uppercase text-[#6b6b6b]">Event link</span>
            <div className="flex items-center gap-3 rounded-lg border border-[#262626] bg-[#1a1a1a] px-3 py-2.5">
              <p className="truncate text-sm text-[#A3A7AA] flex-1 min-w-0">{eventLink}</p>
              <button
                className="shrink-0 text-sm font-medium text-white bg-[#252525] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(eventLink);
                    toast.success("Event link copied successfully");
                  } catch (e) {
                    toast.error("Event link failed to copy");
                  }
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-medium tracking-widest uppercase text-[#6b6b6b]">Share on</span>
            <div className="flex items-center gap-3">
              <a href={shareLink("facebook")} target="_blank" className="size-9 rounded-lg bg-[#1a1a1a] border border-[#262626] hover:bg-[#1e1e1e] grid place-items-center text-[#A3A7AA] hover:text-white transition-colors">
                <FaFacebookF className="size-4" />
              </a>
              <a href={shareLink("twitter")} target="_blank" className="size-9 rounded-lg bg-[#1a1a1a] border border-[#262626] hover:bg-[#1e1e1e] grid place-items-center text-[#A3A7AA] hover:text-white transition-colors">
                <FaTwitter className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* END SHARE EVENT */}

      {/* SALES BY TICKET TYPE */}
      <div className="mt-8 rounded-xl border border-[#262626] bg-[#0f0f0f] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#262626] flex items-center justify-between">
          <h3 className="text-white font-medium">Sales by ticket type</h3>
          <span className="text-xs text-[#6b6b6b]">{ticketTypeSales?.length ?? 0} types</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1a1a] text-left text-xs uppercase tracking-widest text-[#6b6b6b]">
              <tr>
                <th className="px-6 py-3 font-medium">Ticket Type</th>
                <th className="px-6 py-3 font-medium">Sold</th>
                <th className="px-6 py-3 font-medium">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e] text-sm">
              {ticketTypeSales?.length ? (
                ticketTypeSales.map((ticketType) => {
                  const sold = ticketType._count.tickets;
                  const pct = ticketType.quantity ? Math.round((sold / ticketType.quantity) * 100) : 0;
                  return (
                    <tr key={ticketType.id} className="hover:bg-[#1a1a1a]/50 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{ticketType.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-white">
                            {sold}/{ticketType.quantity}
                          </span>
                          <div className="hidden sm:block w-20 h-1.5 rounded-full bg-[#1e1e1e] overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className="text-xs text-[#6b6b6b]">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">${ticketType.price}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[#6b6b6b] text-sm">
                    No ticket types yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* END SALES BY TICKET TYPE */}
    </div>
  );
}
