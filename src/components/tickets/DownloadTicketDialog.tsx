import { getEventDateAndTime } from "@/utils/date-formatter";
import * as Dialog from "@radix-ui/react-dialog";
import { useParams } from "next/navigation";
import { ComponentProps, useCallback } from "react";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { appleWalletIcon, Calander, Clock, Logo } from "../../../public/icons";
import { QRCodeSVG } from "qrcode.react";
import { Navigation } from "swiper/modules";
import ShareTicketButton from "../buttons/ShareTicketButton";
import AddToCalendarButton from "../buttons/AddToCalendarButton";
import DownloadTicketButton from "../buttons/DownloadTicketButton";
import { PdfTicket } from "./PdfTicket";
import { useOrderDetails } from "@/api/order/order.queries";

export function DownloadTicketDialog({
  onOpenChange,
  ...props
}: ComponentProps<typeof Dialog.Root>) {
  const params = useParams<{ ticketId: string }>();
  const { data, isPending, isError, isFetched } = useOrderDetails(
    params.ticketId
  );
  const orderDetails = data?.data;
  const totalCount = orderDetails?.tickets.length;
  const { date, time } = getEventDateAndTime(
    new Date(orderDetails?.event.startTime || Date.now())
  );

  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-50 backdrop-blur-sm fixed inset-0 z-50 grid place-items-center overflow-y-auto py-6">
          <Dialog.Content className="relative text-[#A3A7AA] mx-auto max-w-lg">
            <Dialog.DialogTitle className="hidden">
              Download ticket dialog
            </Dialog.DialogTitle>
            <Image
              src={orderDetails?.event.coverImage || ""}
              alt="Cover image"
              className="absolute inset-0 object-cover "
              fill
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            {/* END OVERLAY */}
            <div className="relative w-96 text-white">
              <Dialog.DialogClose
                onClick={() => onOpenChange?.(false)}
                className="text-white absolute right-4 top-4 z-10 text-2xl"
              >
                <FiX />
              </Dialog.DialogClose>
              <Swiper slidesPerView={1} loop modules={[Navigation]}>
                {orderDetails?.tickets.map((ticket, index) => {
                  return (
                    <SwiperSlide
                      key={ticket.id}
                      className="px-4 pt-8 pb-32 space-y-3"
                    >
                      {/* TICKET COUNT */}
                      <div className="font-bold p-1 max-w-fit mx-auto">
                        Ticket {index + 1} of {totalCount}
                      </div>
                      {/* END TICKET COUNT */}

                      {/* ADD TO WALLET BUTTON */}
                      <button className="w-full py-4 flex items-center justify-center gap-x-4 bg-black text-center font-bold">
                        <Image
                          src={appleWalletIcon}
                          alt=""
                          width={30}
                          height={20}
                        />
                        <span>Add to Apple Wallet</span>
                      </button>
                      {/* END ADD TO WALLET BUTTON */}

                      {/* TICKET DETAILS */}
                      <div className="bg-[#333333] w-full p-4 pb-8 hyphens-auto">
                        {/* LOGO AND CHECKIN CODE */}
                        <div className="flex items-center justify-between">
                          <Image src={Logo} alt="" width={60} height={60} />

                          <div className="flex flex-col text-right">
                            <span className="text-[#C0C0C0] text-xs">
                              CHECKIN CODE
                            </span>
                            <span className="font-bold text-sm mt-2">
                              {ticket.checkinCode}
                            </span>
                          </div>
                        </div>
                        {/* END LOGO AND CHECKIN CODE */}

                        {/* QR CODE */}
                        <div className="grid place-items-center my-4">
                          <QRCodeSVG
                            marginSize={1}
                            size={256}
                            value="https://www.eventsbyblackdiamond.com"
                          />
                        </div>
                        {/* END QR CODE */}

                        {/* HORIZONTAL LINE */}
                        <div
                          className="w-full h-0.5 my-5"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23C0C0C0FF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                          }}
                        />
                        {/* END HORIZONTAL LINE */}

                        {/* FILLED IN DETAILS */}
                        <div className="uppercase space-y-5 break-all hyphens-auto">
                          {/* NAME AND TICKET NAME */}
                          <div className="flex">
                            {/* NAME */}
                            <div className="flex flex-col flex-[1.5]">
                              <span className="text-[#C0C0C0] text-xs">
                                NAME
                              </span>
                              <span className="text-lg font-bold uppercase">
                                {ticket.firstName} {ticket.lastName}
                              </span>
                            </div>
                            {/* END NAME */}

                            {/* TICKET NAME */}
                            <div className="flex flex-col flex-1 text-right">
                              <span className="text-[#C0C0C0] text-xs">
                                TICKET
                              </span>
                              <span className="text-lg font-bold uppercase">
                                {ticket.ticketType?.name}
                              </span>
                            </div>
                            {/* END TICKET NAME */}
                          </div>
                          {/* END NAME AND TICKET NAME */}

                          {/* EVENT NAME AND TICKET PRICE */}
                          <div className="flex">
                            {/* EVENT NAME */}
                            <div className="flex flex-col flex-[1.5]">
                              <span className="text-[#C0C0C0] text-xs">
                                EVENT NAME
                              </span>
                              <span className="text-lg font-bold uppercase">
                                {orderDetails.event.name}
                              </span>
                            </div>
                            {/* END EVENT NAME */}

                            {/* TICKET PRICE */}
                            <div className="flex flex-col flex-1 text-right">
                              <span className="text-[#C0C0C0] text-xs">
                                TICKET PRICE
                              </span>
                              <span className="text-lg font-bold uppercase">
                                ${ticket.ticketType?.price.toFixed(2)}
                              </span>
                            </div>
                            {/* END TICKET PRICE */}
                          </div>
                          {/* END EVENT NAME AND TICKET PRICE */}

                          {/* DATE AND TIME */}
                          <div className="flex flex-col flex-[1.5]">
                            <span className="text-[#C0C0C0] text-xs">
                              DATE AND TIME
                            </span>
                            <div className="flex flex-col font-bold text-lg">
                              <p>{date}</p>

                              <p className="leading-none">{time}</p>
                            </div>
                          </div>
                          {/* END DATE AND TIME */}
                        </div>
                        {/* END FILLED IN DETAILS */}
                      </div>
                      {/* END TICKET DETAILS */}

                      {/* TICKET ACTIONS */}
                      <div className="text-[#C0C0C0] flex items-center gap-x-6 justify-center">
                        {/* SHARE BUTTON */}
                        <ShareTicketButton nodeId={ticket.id || ""} />
                        {/* END SHARE BUTTON */}

                        {/* ADD TO CALENDAR BUTTON */}
                        <AddToCalendarButton
                          calendarEvent={{
                            title: orderDetails.event.name,
                            details: orderDetails.event.description,
                            endDate: new Date(
                              orderDetails.event.endTime || Date.now()
                            ),
                            startDate: new Date(
                              orderDetails.event.startTime || Date.now()
                            ),
                            location: orderDetails.event.location,
                          }}
                        />
                        {/* END ADD TO CALENDAR BUTTON */}

                        {/* DOWNLOAD BUTTON */}
                        <DownloadTicketButton
                          nodeId={ticket.id || ""}
                          ticketName={`${orderDetails.event.name
                            .concat(ticket.id || "")
                            .split(" ")
                            .join("_")}`}
                        />
                        {/* END DOWNLOAD BUTTON */}
                      </div>
                      {/* END TICKET ACTIONS */}

                      <div className="h-0 overflow-hidden">
                        <PdfTicket
                          eventName={orderDetails.event.name}
                          startTime={
                            new Date(orderDetails.event.startTime || Date.now())
                          }
                          ticket={ticket}
                          id={ticket.id || ""}
                          coverImage={orderDetails.event.coverImage || ""}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
