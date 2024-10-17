"use client";

import Image from "next/image";
import React, { ComponentProps, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { FiDownload, FiX } from "react-icons/fi";
import { cn } from "@/utils/cn";
import { OrderImage } from "../../../../../public/images";
import { useParams, useRouter } from "next/navigation";
import { useOrderDetails } from "@/api/order/order.queries";
import { ITicketDetail, Order, Ticket } from "@/constants/types";
// import { formatEventDate } from "@/utils/date-formatter";
import toast from "react-hot-toast";
import { Router } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import ErrorToast from "@/components/toast/ErrorToast";
import LoadingMessage from "@/components/shared/Loader/LoadingMessage";
import { getPDTDate } from "@/utils/utilityFunctions";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { DownloadTicketDialog } from "@/components/tickets/DownloadTicketDialog";
import Loading from "@/app/loading";

export default function ViewTicketDetailsPage() {
  const params = useParams<{ ticketId: string }>();
  const router = useRouter();
  const { data, isPending, isError, isFetched } = useOrderDetails(
    params.ticketId
  );
  const orderDetails = data?.data;
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  useEffect(() => {
    if (isFetched && !orderDetails) {
      toast.error("Order not found");
      router.push("/tickets/");
    }
  }, [orderDetails]);

  useEffect(() => {
    if (isFetched && orderDetails?.paymentStatus !== "SUCCESSFUL") {
      ErrorToast({
        title: "Payment Error",
        descriptions: ["Order has not been paid for"],
      });
      router.push("/tickets");
      return;
    }
    if (
      isFetched &&
      orderDetails?.paymentStatus === "SUCCESSFUL" &&
      orderDetails?.status !== "COMPLETED"
    ) {
      ErrorToast({
        title: "Error",
        descriptions: ["Please fill in the ticket details"],
      });
      router.push(`/tickets/${params.ticketId}/fill-details`);
      return;
    }
    if (isFetched && orderDetails?.status === "CANCELLED") {
      ErrorToast({
        title: "Error",
        descriptions: ["Order has not been cancelled"],
      });
      router.push(`/tickets`);
      return;
    }
  }, [orderDetails]);

  if (isPending) {
    return <Loading />;
  }

  return (
    <>
      <section>
        <div className="container">
          {isPending && (
            <LoadingMessage className="text-white">
              Loading details
            </LoadingMessage>
          )}
          {isError && <div className="text-white">Details not found</div>}
          {isFetched && orderDetails && (
            <div>
              <div className="flex justify-between gap-x-20 mb-4 lg:mb-9">
                <h1 className="text-2xl md:text-4xl text-white font-medium">
                  {orderDetails?.event.name}
                </h1>

                <DownloadButton
                  onClick={() => setShowDownloadDialog(true)}
                  className="max-md:hidden"
                />
              </div>

              <div className="flex flex-col md:flex-row md:gap-x-16 max-md:gap-y-8">
                {/* EVENT POSTER */}
                <div className="min-w-fit">
                  <Image
                    src={orderDetails?.event.coverImage || ""}
                    alt=""
                    width={365}
                    height={413}
                    className="object-cover w-full"
                  />
                  <p className="text-[#A3A7AA] mt-5">
                    {orderDetails &&
                      getPDTDate(
                        new Date(orderDetails.event.startTime),
                        new Date(orderDetails.event.endTime)
                      )}
                  </p>

                  <div className="space-y-5 mt-5">
                    <OutlineButton
                      href={`/events/${orderDetails.event.eventStatus === "UPCOMING" ? "upcoming" : "past"}/${orderDetails.event.id}`}
                    >
                      VIEW EVENT
                    </OutlineButton>
                    <OutlineButton href={"/contact-us"}>
                      CONTACT SUPPORT
                    </OutlineButton>
                    <Link
                      href={"/tickets/"}
                      className="text-[#4267B2] flex items-center gap-x-3"
                    >
                      <FaArrowLeft />
                      <span>Back to my tickets</span>
                    </Link>
                    <DownloadButton
                      onClick={() => setShowDownloadDialog(true)}
                      className="md:hidden"
                    />
                  </div>
                </div>
                {/* END EVENT POSTER */}

                {/* TICKET DETAIL FORMS */}
                <div className="space-y-16 mb-6">
                  {orderDetails?.tickets.map((item, index) => {
                    return (
                      <TicketDetail
                        ticket={item}
                        index={index + 1}
                        key={item.id}
                      />
                    );
                  })}
                </div>
                {/* END TICKET DETAIL FORMS */}
              </div>
            </div>
          )}
        </div>
      </section>

      <DownloadTicketDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
      />
    </>
  );
}

function TicketDetail({
  ticket,
  index,
}: {
  ticket: Partial<Ticket>;
  index: number;
}) {
  return (
    <div className="break-words hyphens-auto">
      <div className="text-white font-medium text-2xl">
        Ticket {index} [{ticket.ticketType?.name}]
      </div>
      <div className="text-white font-medium text-xl my-4">
        Contact Information
      </div>

      {/* TICKET DETAILS */}
      <div className="space-y-4">
        <div>
          <div className="text-input-color">First Name</div>
          <div className="text-white">{ticket.firstName}</div>
        </div>
        <div>
          <div className="text-input-color">Last Name</div>
          <div className="text-white">{ticket.lastName}</div>
        </div>
        <div>
          <div className="text-input-color">Email Address</div>
          <div className="text-white">{ticket.email}</div>
        </div>
        <div>
          <div className="text-input-color">Phone Number</div>
          <div className="text-white">{ticket.phone}</div>
        </div>
      </div>
      {/* END TICKET DETAILS */}
    </div>
  );
}

function OutlineButton({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "border border-white py-3 block text-center text-white w-full",
        className
      )}
      {...props}
    />
  );
}

function DownloadButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      className={cn("flex text-white items-center gap-x-3 py-3", className)}
      {...props}
    >
      <FiDownload />
      <span>Download</span>
    </button>
  );
}
