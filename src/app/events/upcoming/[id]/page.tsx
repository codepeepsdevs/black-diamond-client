"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { CustomButton, Input, RenderCarousel } from "@/components";

import {
  Calander,
  Share,
  Location,
  TicketCalander,
  Minus,
  Add,
} from "../../../../../public/icons";
import EventTickets from "@/components/eventPage/EventTickets";
import { useOrderStore } from "@/store/order.store";
import {
  useGetAddons,
  useGetEvent,
  useGetPromocode,
} from "@/api/events/events.queries";
import LoadingMessage from "@/components/shared/Loader/LoadingMessage";
import * as dateFns from "date-fns";
import toast from "react-hot-toast";
import { AxiosError, AxiosResponse } from "axios";
import { PromoCode } from "@/constants/types";
import LoadingSkeleton from "@/components/shared/Loader/LoadingSkeleton";
import {
  getApiErrorMessage,
  getTimeZoneDateRange,
} from "@/utils/utilityFunctions";
import ErrorToast from "@/components/toast/ErrorToast";
import { useWindowsize } from "@/hooks";
import Loading from "@/app/loading";

const UpComingEventDetailPage = () => {
  const order = useOrderStore();
  const [promocode, setPromocode] = useState<string>(
    order.promocode?.key || ""
  );

  const params = useParams<{ id: string }>();
  const router = useRouter();

  const eventQuery = useGetEvent(params.id || "");
  const eventData = eventQuery.data?.data;
  const eventAddonsQuery = useGetAddons(params.id || "");

  useEffect(() => {
    if (eventQuery.isSuccess && eventAddonsQuery.isSuccess) {
      if (!eventQuery.data?.data) {
        router.replace("/events");
        return;
      }
      order.setOrder({
        event: eventQuery.data.data,
        ticketOrders: eventQuery.data.data?.ticketTypes.map((ticketType) => ({
          name: ticketType.name,
          ticketTypeId: ticketType.id,
          quantity: 0,
          price: ticketType.price,
        })),
        addonOrders: eventAddonsQuery.data?.data.map((addon) => ({
          addonId: addon.id,
          quantity: 0,
          name: addon.name,
          price: addon.price,
        })),
      });
    }
  }, [
    eventQuery.isFetched,
    eventQuery.data?.data,
    eventAddonsQuery.isFetched,
    eventAddonsQuery.data?.data,
  ]);

  function handleBuyTicket() {
    const ticketsPlaced =
      order.ticketOrders?.reduce(
        (accValue, currItem) => accValue + currItem.quantity,
        0
      ) || 0;
    if (ticketsPlaced >= 1) {
      router.push("/checkout");
    } else {
      ErrorToast({
        title: "Error",
        descriptions: ["Please select at least one ticket"],
      });
    }
  }

  function onGetPromocodeError(error: AxiosError<Error>) {
    const errorMessage = getApiErrorMessage(error, "Error applying promocode");
    ErrorToast({
      title: "Error",
      descriptions: errorMessage,
    });
  }

  function onGetPromocodeSuccess(data: AxiosResponse<PromoCode>) {
    toast.success("Promocode applied successfully");
    order.setPromocode(data.data);
  }

  const { mutate: getPromocode, isPending: getPromocodeIsPending } =
    useGetPromocode(onGetPromocodeError, onGetPromocodeSuccess);

  // update total discount anytime promocode or order is updated
  useEffect(() => {
    order.updateDiscount();
  }, [order.promocode, order.ticketOrders]);

  if (eventQuery.isPending) {
    return <Loading />;
  } else if (!eventQuery.isPending && eventData?.eventStatus === "PAST") {
    return router.push("/events/past/" + eventData.id);
  }
  return (
    <>
      <div className="w-full flex items-center justify-center text-white">
        <div className="w-full flex flex-col gap-10 sm:gap-20 ">
          <div className="w-full">
            {eventQuery.isPending && (
              <LoadingSkeleton className="h-full opacity-10" />
            )}
            {eventQuery.isSuccess && (
              <RenderCarousel
                properties={{
                  centerMode: true,
                  centerSlidePercentage: 100,
                }}
                imageStyles="w-full min-h-[350px] sm:min-h-[calc(100vh_-_120px)]"
                containerClassName="w-full [&_.carousel-slider]:h-full  [&_.carousel-root]:h-full min-h-[350px] sm:min-h-[calc(100vh_-_120px)] overflow-hidden"
                carouselImages={eventQuery.data?.data?.images || []}
                variant="events"
              />
            )}
          </div>
          <div className="min-w-full flex flex-col md:flex-row items-start gap-x-20 lg:gap-x-48 gap-y-8">
            {/* EVENT DETAILS SECTION */}
            <div className="md:flex-1 flex flex-col gap-6 text-[#f2f2f2]">
              <div className="flex items-center gap-x-5">
                {eventQuery.isPending ? (
                  <LoadingSkeleton
                    count={1}
                    containerClassName="flex-1 text-2xl"
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-bold capitalize text-white">
                    {eventQuery.data?.data?.name.toLowerCase()}
                  </h1>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-white text-xl font-bold">Date and Time</h3>

                <div className="flex items-center gap-2">
                  <Image src={TicketCalander} alt="calander" />
                  {eventQuery.isPending ? (
                    <LoadingSkeleton
                      count={1}
                      containerClassName="opacity-10 flex-1"
                    />
                  ) : eventData?.startTime && eventData.endTime ? (
                    <p className="text-xs md:text-sm">
                      {getTimeZoneDateRange(
                        new Date(eventData?.startTime || Date.now()),
                        new Date(eventData?.endTime || Date.now())
                      )}
                    </p>
                  ) : (
                    <p>N/A</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-white text-xl font-bold">Location</h3>

                <div className="flex items-center gap-2">
                  <Image src={Location} alt="location" />
                  {eventQuery.isPending && (
                    <LoadingSkeleton containerClassName="flex-1" />
                  )}
                  {eventQuery.data?.data.locationType === "VENUE" && (
                    <p className="text-xs md:text-sm">
                      {eventQuery.data?.data?.location}
                    </p>
                  )}
                  {eventQuery.data?.data.locationType === "ONLINE_EVENT" && (
                    <a
                      href={eventQuery.data.data.location}
                      target="_blank"
                      className="text-xs md:text-sm"
                    >
                      {eventQuery.data?.data?.location}
                    </a>
                  )}
                  {eventQuery.data?.data.locationType === "TO_BE_ANNOUNCED" && (
                    <p className="text-xs md:text-sm">TO BE ANNOUNCED</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-white text-xl font-bold">Refund Policy</h3>
                <p className="text-xs md:text-sm">
                  {" "}
                  {eventQuery.isPending && (
                    <LoadingSkeleton containerClassName="flex-1" />
                  )}
                  {eventQuery.data?.data.refundPolicy}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-white text-xl font-bold">Summary</h3>
                <p className="leading-5 md:leading-7 text-xs md:text-sm text-justify">
                  {eventQuery.isPending && (
                    <LoadingSkeleton containerClassName="flex-1" />
                  )}
                  {eventQuery.data?.data?.summary}
                </p>
              </div>
            </div>
            {/* END EVENT DETAILS SECTION */}

            {/* TICKET ORDERS SECTION */}
            <div className="md:flex-1 max-md:w-full">
              <div className="text-white mb-8 text-xl font-bold">Tickets</div>

              {/* PROMO CODE INPUT */}
              <div className="border-white border flex items-center p-3 mb-11">
                <input
                  value={promocode}
                  onChange={(e) => setPromocode(e.target.value)}
                  className="flex-1 bg-transparent focus:outline-none"
                  placeholder="Enter code"
                />
                <button onClick={() => getPromocode(promocode)}>
                  {getPromocodeIsPending ? "Applying.." : "Apply"}
                </button>
              </div>
              {/* END PROMO CODE INPUT */}

              <EventTickets />

              <p className="my-8 text-xs md:text-sm text-white">
                Grab your tickets before it's sold out!
              </p>

              {/* ADDONS SECTION */}
              {eventAddonsQuery.data?.data &&
              eventAddonsQuery.data?.data.length > 0 ? (
                <>
                  <div className="text-2xl mb-8">Add-ons</div>

                  <div className="bg-[#151515] border border-[#333333] mb-10">
                    <div className="border-b border-b-[#333]">
                      {eventAddonsQuery.isPending ? (
                        <LoadingMessage>Loading addons..</LoadingMessage>
                      ) : (
                        eventAddonsQuery.data?.data.map((addon) => {
                          return (
                            <div
                              key={addon.id}
                              className="flex items-center gap-x-4 p-4 border-b border-b-[#333] last:border-b-transparent"
                            >
                              <Image
                                src={addon.image}
                                alt=""
                                width={250}
                                height={250}
                                className="size-16 object-cover"
                              />

                              <div className="flex-1">
                                <div className="font-medium text-white text-xl">
                                  {addon.name}
                                </div>
                                <div className="text-white  font-medium">
                                  ${addon.price}
                                </div>
                                <div className="text-[#A3A7AA] text-sm">
                                  Sales end on{" "}
                                  {dateFns.format(
                                    new Date(addon.endTime),
                                    "MM dd, yyyy"
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    order.updateAddonOrders(
                                      addon.id,
                                      "decrement"
                                    )
                                  }
                                >
                                  <Image
                                    className="cursor-pointer"
                                    src={Minus}
                                    alt="minus"
                                  />
                                </button>
                                <div>
                                  {order.addonOrders?.find(
                                    (addonOrder) =>
                                      addonOrder.addonId === addon.id
                                  )?.quantity || 0}
                                </div>
                                <button
                                  onClick={() =>
                                    order.updateAddonOrders(
                                      addon.id,
                                      "increment"
                                    )
                                  }
                                >
                                  <Image
                                    className="cursor-pointer"
                                    src={Add}
                                    alt="add"
                                  />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                      {eventAddonsQuery.isError && <div></div>}
                    </div>

                    <div className="">
                      {order.addonOrders
                        ?.filter((addonOrder) => addonOrder.quantity > 0)
                        .map((placedOrder) => {
                          return (
                            <div
                              key={placedOrder.addonId}
                              className="flex item-center justify-between p-2 text-[#A3A7AA]"
                            >
                              <p>
                                {placedOrder.quantity} x {placedOrder.name}
                              </p>
                              <p>${placedOrder.quantity * placedOrder.price}</p>
                            </div>
                          );
                        })}

                      <p className="text-end text-white p-2">
                        $
                        <span className="font-bold">
                          {order.addonOrders?.reduce(
                            (accValue, addonOrder) =>
                              accValue + addonOrder.price * addonOrder.quantity,
                            0
                          )}{" "}
                        </span>
                        total
                      </p>
                    </div>
                  </div>
                </>
              ) : null}
              {/* END ADDONS SECTION */}

              <CustomButton
                className="font-black py-3 w-[145px]"
                onClick={handleBuyTicket}
                content="BUY TICKET"
              />
            </div>
            {/* END TICKET ORDERS SECTION */}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpComingEventDetailPage;
