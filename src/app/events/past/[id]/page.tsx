"use client";

import { RenderCarousel, SubmitButton } from "@/components";
import React, { ComponentProps, useEffect, useState } from "react";
import Image from "next/image";

import { Share, TicketCalander, Location } from "../../../../../public/icons";
import PastEventCard from "@/components/eventPage/PastEventCard";
import ShareEventModal from "@/components/shared/Modals/ShareEventModal";
import { useParams, useRouter } from "next/navigation";
import { useGetEvent } from "@/api/events/events.queries";
import * as dateFns from "date-fns";
import * as Dialog from "@radix-ui/react-dialog";
import { MdFmdBad } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LoadingMessage from "@/components/shared/Loader/LoadingMessage";
import LoadingSkeleton from "@/components/shared/Loader/LoadingSkeleton";
import { newYorkTimeZone } from "@/utils/date-formatter";
import * as dateFnsTz from "date-fns-tz";
import { getTimeZoneDateRange } from "@/utils/utilityFunctions";

const PastEventsDetailPage = () => {
  const [eventModalState, setEventModalState] = useState<boolean>(false);
  const [eventNotFoundDialogOpen, setEventNotFoundDialogOpen] = useState(false);
  const params = useParams<{ id: string }>();

  const pastEventQuery = useGetEvent(params.id);
  const pastEvent = pastEventQuery.data?.data;

  useEffect(() => {
    if (!pastEventQuery.isPending && pastEventQuery.data?.status === 404) {
      setEventNotFoundDialogOpen(true);
    }
  }, []);

  return (
    <>
      <div className="w-full flex items-center justify-center text-white">
        <div className="w-full flex flex-col gap-10 sm:gap-20 ">
          <div className="w-full">
            {pastEventQuery.isPending && (
              <LoadingSkeleton className="h-full opacity-10" />
            )}
            {pastEventQuery.isSuccess && (
              <RenderCarousel
                properties={{
                  centerMode: true,
                  centerSlidePercentage: 100,
                }}
                imageStyles="w-full min-h-[350px] sm:min-h-[calc(100vh_-_120px)]"
                containerClassName="w-full [&_.carousel-slider]:h-full [&_.carousel-root]:h-full min-h-[350px] sm:min-h-[calc(100vh_-_120px)] overflow-hidden"
                carouselImages={pastEventQuery.data?.data?.images || []}
                variant="events"
              />
            )}
          </div>
          <div className="flex items-start md:grid md:grid-cols-2 gap-4">
            {/* EVENT DETAILS SECTION */}
            <div className="md:flex-1 flex flex-col gap-6 text-[#f2f2f2]">
              <div className="flex items-center gap-x-5">
                {pastEventQuery.isPending ? (
                  <LoadingSkeleton
                    count={1}
                    containerClassName="flex-1 text-2xl"
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-bold capitalize text-white">
                    {pastEventQuery.data?.data?.name.toLowerCase()}
                  </h1>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-white text-xl font-bold">Date and Time</h3>

                <div className="flex items-center gap-2">
                  <Image src={TicketCalander} alt="calander" />
                  {pastEventQuery.isPending ? (
                    <LoadingSkeleton
                      count={1}
                      containerClassName="opacity-10 flex-1"
                    />
                  ) : pastEventQuery.data?.data?.startTime &&
                    pastEventQuery.data.data.endTime ? (
                    <p className="text-xs md:text-sm">
                      {getTimeZoneDateRange(
                        new Date(pastEvent?.startTime || Date.now()),
                        new Date(pastEvent?.endTime || Date.now())
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
                  {pastEventQuery.isPending && (
                    <LoadingSkeleton containerClassName="flex-1" />
                  )}
                  <p className="text-xs md:text-sm">
                    {pastEventQuery.data?.data?.location}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-white text-xl font-bold">Summary</h3>
                <p className="leading-5 md:leading-7 text-xs md:text-sm text-justify">
                  {pastEventQuery.isPending && (
                    <LoadingSkeleton containerClassName="flex-1" />
                  )}
                  {pastEventQuery.data?.data?.summary}
                </p>
              </div>
            </div>
            {/* END EVENT DETAILS SECTION */}

            <div className="hidden md:flex md:flex-col md:gap-4  items-end">
              <Image
                onClick={() => {
                  setEventModalState(true);
                }}
                className="cursor-pointer"
                src={Share}
                alt="share"
              />

              {/* <PastEventCard /> */}

              <div className="md:w-[300px] lg:w-[378px] bg-[#151515] border-2 border-[#333333] text-[#A3A7AA]">
                {pastEventQuery.isPending ? (
                  <Skeleton
                    count={3}
                    containerClassName="opacity-5"
                    className="h-14"
                  />
                ) : (
                  pastEvent?.ticketTypes.map((ticketType) => {
                    return (
                      <div className="p-2 border-[#333333] border-b-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white text-lg">
                            {ticketType.name}
                          </h3>
                          {/* <div className="flex items-center gap-1">
                        <Image className="cursor-pointer" src={Minus} alt="minus" />
                        <h1>1</h1>
                        <Image className="cursor-pointer" src={Add} alt="add" />
                      </div> */}
                        </div>
                        <p className="text-sm">Sale ended</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <Image
              className="md:hidden cursor-pointer"
              src={Share}
              alt="share"
              onClick={() => {
                setEventModalState(true);
              }}
            />
          </div>
        </div>
      </div>
      <ShareEventModal
        isOpen={eventModalState}
        onClose={() => {
          setEventModalState(false);
        }}
        tab="past"
        eventId={params.id}
      />
      <EventNotFoundDialog
        defaultOpen
        open={eventNotFoundDialogOpen}
        onOpenChange={setEventNotFoundDialogOpen}
      />
    </>
  );
};

export default PastEventsDetailPage;

function EventNotFoundDialog({ ...props }: ComponentProps<typeof Dialog.Root>) {
  const router = useRouter();
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <Dialog.Content className="relative bg-[#333333] text-[#A3A7AA] p-6 mx-auto py-9 max-w-lg">
            <div className="bg-[#4267B2] text-white size-24 mx-auto rounded-full grid place-items-center">
              <MdFmdBad className="text-4xl" />
            </div>

            <div className="text-white text-2xl lg:text-4xl font-medium text-center mt-16">
              Event not found
            </div>

            <div className="text-center my-6 space-y-4">
              <p className="text-white text-base lg:text-xl">
                The event details could not be found!
              </p>
              {/* <p className="text-text-color text-sm lg:text-base">
              Order #{orderId}
            </p> */}
            </div>

            <div className="flex justify-center">
              <SubmitButton
                className=""
                onClick={() => router.push(`/events/`)}
              >
                GO BACK TO EVENTS
              </SubmitButton>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
