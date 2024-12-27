import Image from "next/image";
import React from "react";
import TicketsIcon from "./TicketIcon";
import { FiBookOpen, FiDownload, FiUpload, FiUser } from "react-icons/fi";
import { VscTriangleDown } from "react-icons/vsc";
import { FaFacebookF, FaTwitter } from "react-icons/fa6";
import toast from "react-hot-toast";
import { cn } from "@/utils/cn";
import { useParams } from "next/navigation";
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

export default function EditEventDetailsDashboard({
  isActive,
}: {
  isActive: boolean;
}) {
  const params = useParams<{ id: string }>();
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
    ? dateFns.differenceInDays(new Date(event.startTime), new Date())
    : null;

  const lowestPrice = event?.ticketTypes
    ? getLowestTicket(event?.ticketTypes)?.price || 0
    : 0;

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

  console.table({
    endDate: event?.endTime,
    endDateNY: dateFnsTz.toZonedTime(
      event?.endTime ?? new Date(),
      newYorkTimeZone
    ),
  });

  return (
    <div className={cn("text-[#A3A7AA]", isActive ? "block" : "hidden")}>
      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-end mt-12 gap-x-4">
        {event?.isPublished ? (
          <AdminButton
            disabled={unpublishEventPending}
            onClick={() => unpublishEvent(eventId)}
            variant="primary"
            className="flex items-center gap-2 bg-red-500 disabled:opacity-50"
          >
            {unpublishEventPending ? <LoadingSvg /> : <FiDownload />}{" "}
            <span>Unpublish</span>
          </AdminButton>
        ) : (
          <AdminButton
            disabled={publishEventPending}
            onClick={() => publishEvent(eventId)}
            variant="primary"
            className="flex items-center gap-2 disabled:opacity-50"
          >
            {publishEventPending ? <LoadingSvg /> : <FiUpload />}
            <span>Publish</span>
          </AdminButton>
        )}

        <AdminButton
          disabled={generatePartyListPending}
          onClick={() =>
            generatePartyList({
              eventId,
            })
          }
          variant="primary"
          className="flex items-center gap-2 disabled:opacity-50"
        >
          {generatePartyListPending ? <LoadingSvg /> : <FiBookOpen />}
          <span>Party List</span>
        </AdminButton>
      </div>
      {/* END ACTION BUTTONS */}
      <div className="bg-[#151515] overflow-y-auto mt-12">
        <div className="p-6 flex items-center w-full gap-x-6 whitespace-nowrap">
          <Image
            src={event?.coverImage || ""}
            alt="Cover image"
            width={180}
            height={180}
            className="size-24 object-cover shrink-0"
          />
          <div className="space-y-2 flex-1">
            <div>{event?.name}</div>
            <div>
              <p>
                {getTimeZoneDateRange(
                  new Date(event?.startTime || Date.now()),
                  new Date(event?.endTime || Date.now())
                )}
              </p>
              <p>{event?.location}</p>
            </div>
            <div className="flex items-center gap-x-4 [&>div]:flex [&>div]:items-center [&>div]:gap-x-2">
              <div>
                <TicketsIcon />
                <span>${lowestPrice}</span>
              </div>
              <div>
                <FiUser />
                <span>{totalTickets}</span>
              </div>
            </div>
          </div>

          {daysToEvent === null ? (
            "N/A"
          ) : daysToEvent > 0 ? (
            <p className="text-[#34C759] font-medium text-xl self-end pl-32">
              Your event is in {daysToEvent} day(s)!
            </p>
          ) : daysPastEvent ? (
            <p className="text-red-500 font-medium text-xl self-end pl-32">
              This event was {Math.abs(daysPastEvent)} day(s) ago!
            </p>
          ) : (
            "N/A"
          )}
        </div>
      </div>

      {/* EVENT METRICS */}
      <div className="overflow-x-auto">
        <div className="flex gap-x-8 whitespace-nowrap mt-12">
          {/* TICKETS SOLD */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              <VscTriangleDown className="text-[#E1306C] text-2xl" />
              <span>Tickets sold</span>
            </div>
            {ticketTypeSalesQuery.isPending ? (
              <LoadingSvg />
            ) : (
              <div className="text-white font-semibold text-6xl">
                {totalTicketsSold}/{totalTickets}
              </div>
            )}
          </div>
          {/* END TICKETS SOLD */}

          {/* REVENUE */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              <VscTriangleDown className="text-[#E1306C] text-2xl" />
              <span>Revenue</span>
            </div>
            {eventRevenueQuery.isPending ? (
              <LoadingSvg />
            ) : (
              <div className="text-white font-semibold text-6xl">
                ${Number(eventRevenue?.revenue).toFixed(2)}
              </div>
            )}
          </div>
          {/* END REVENUE */}

          {/* PAGE VIEWS */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              <VscTriangleDown className="text-[#E1306C] text-2xl" />
              <span>Page Views</span>
            </div>
            {viewCountQuery.isPending ? (
              <LoadingSvg />
            ) : (
              <div className="text-white font-semibold text-6xl">
                {viewCountData?.views}
              </div>
            )}
          </div>
          {/* END PAGE VIEWS */}
        </div>
      </div>
      {/* END EVENT METRICS */}

      {/* SHARE EVENT */}
      <div className="mt-12">
        <div className="text-2xl font-medium text-white mb-6">Share</div>

        <div className="space-y-2">
          <div>Event link</div>
          <div className="flex items-center gap-x-4">
            <p className="truncate">{eventLink}</p>
            <button
              className="text-[#4267B2] whitespace-nowrap"
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
          <div>
            <p>Share on</p>

            <div className="flex items-center mt-2 gap-x-4">
              {/* <FaYoutube /> */}
              <a href={shareLink("facebook")} target="_blank">
                <FaFacebookF />
              </a>
              <a href={shareLink("twitter")} target="_blank">
                <FaTwitter />
              </a>
              {/* <FaInstagram /> */}
            </div>
          </div>
        </div>
      </div>
      {/* END SHARE EVENT */}

      {/* SALES BY TICKET TYPE */}
      <div className="mt-16">
        <div className="text-2xl font-medium text-white">
          Sale by ticket type
        </div>

        <table className="w-full mt-6">
          <thead className="text-left text-base [&>*]:font-normal">
            <tr>
              <th>Ticket Type</th>
              <th>Sold</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody className="[&>td]:pt-6">
            {ticketTypeSales?.map((ticketType) => {
              return (
                <tr key={ticketType.id}>
                  <td>{ticketType.name}</td>
                  <td>
                    {ticketType._count.tickets}/{ticketType.quantity}
                  </td>
                  <td>${ticketType.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* END SALES BY TICKET TYPE */}
    </div>
  );
}
