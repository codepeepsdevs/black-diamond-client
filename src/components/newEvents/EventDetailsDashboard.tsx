import Image from "next/image";
import React from "react";
import TicketsIcon from "./TicketIcon";
import { FiUser } from "react-icons/fi";
import { VscTriangleDown } from "react-icons/vsc";
import { FaYoutube } from "react-icons/fa";
import {
  FaFacebook,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa6";
import toast from "react-hot-toast";
import { cn } from "@/utils/cn";
import { parseAsString, useQueryState } from "nuqs";
import { useGetEvent, useGetEventRevenue } from "@/api/events/events.queries";
import { getLowestTicket, getPDTDate } from "@/utils/utilityFunctions";
import * as dateFns from "date-fns";
import { useGetTicketTypeSales } from "@/api/order/order.queries";

export default function EventDetailsDashboard({
  isActive,
}: {
  isActive: boolean;
}) {
  const [eventId, setEventId] = useQueryState(
    "newEventId",
    parseAsString.withDefault("")
  );

  const eventQuery = useGetEvent(eventId);
  const event = eventQuery.data?.data;

  const eventRevenueQuery = useGetEventRevenue(eventId);
  const eventRevenue = eventRevenueQuery.data?.data.revenue || 0;

  const ticketTypeSalesQuery = useGetTicketTypeSales(eventId);
  const ticketTypeSales = ticketTypeSalesQuery.data?.data;

  const lowestPrice = event?.ticketTypes
    ? getLowestTicket(event?.ticketTypes)?.price || 0
    : 0;

  const eventLink = `${window.location.protocol}//${window.location.host}/events/${event?.eventStatus.toLowerCase()}/${eventId}`;
  // `https://${process.env.NEXT_PUBLIC_FRONTEND_URL}/events/${event?.eventStatus.toLowerCase()}/${eventId}`;
  const differenceInDays = dateFns.differenceInDays(
    new Date(event?.endTime || Date.now()),
    new Date()
  );

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
      <div className="bg-[#151515] overflow-y-auto mt-12">
        <div className="p-6 flex items-center w-full gap-x-6 whitespace-nowrap">
          <Image
            src={event?.coverImage || ""}
            alt="Cover image"
            width={180}
            height={180}
            className="size-24 object-cover"
          />
          <div className="space-y-2 flex-1">
            <div>{event?.name}</div>
            <div>
              <p>
                {getPDTDate(
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
                <span>250</span>
              </div>
            </div>
          </div>

          <p className="text-[#34C759] font-medium text-xl self-end pl-32">
            Your event is in {differenceInDays} day(s)!
          </p>
        </div>
      </div>

      {/* EVENT METRICS */}
      <div className="overflow-x-auto">
        <div className="flex gap-x-8 justify-between whitespace-nowrap mt-12">
          {/* TICKETS SOLD */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              <VscTriangleDown className="text-[#E1306C] text-2xl" />
              <span>Tickets sold</span>
            </div>
            <div className="text-white font-semibold text-6xl">0/250</div>
          </div>
          {/* END TICKETS SOLD */}

          {/* REVENUE */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              <VscTriangleDown className="text-[#E1306C] text-2xl" />
              <span>Revenue</span>
            </div>
            <div className="text-white font-semibold text-6xl">
              ${eventRevenue}
            </div>
          </div>
          {/* END REVENUE */}

          {/* PAGE VIEWS */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              <VscTriangleDown className="text-[#E1306C] text-2xl" />
              <span>Page Views</span>
            </div>
            <div className="text-white font-semibold text-6xl">0</div>
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
            <p>{eventLink}</p>
            <button
              className="text-[#4267B2]"
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
                <tr>
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
