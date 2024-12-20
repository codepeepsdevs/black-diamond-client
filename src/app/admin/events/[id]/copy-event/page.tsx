"use client";

import { AdminButton } from "@/components";
import { cn } from "@/utils/cn";
import React, { ComponentProps, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useAdminGetEvent } from "@/api/events/events.queries";
import { SearchQueryState } from "@/constants/types";
import * as Dialog from "@radix-ui/react-dialog";
import { MdGppBad } from "react-icons/md";
import EditDetailsTab from "@/components/manageEvent/EditDetailsTab";
import * as Yup from "yup";
import { editEventDetailsSchema } from "@/api/events/events.schemas";
import Link from "next/link";
import * as dateFnsTz from "date-fns-tz";
import * as dateFns from "date-fns";
import { newYorkTimeZone } from "@/utils/date-formatter";

export default function CopyEventPage() {
  const params = useParams<{ id: string }>();
  const [notFoundDialogOpen, setNotFoundDialogOpen] = useState(false);
  const [detailsDefault, setDetailsDefault] = useState<Yup.InferType<
    typeof editEventDetailsSchema
  > | null>(null);
  const [defaultMedia, setDefaultMedia] = useState<{
    images: string[];
    coverImage: string | undefined;
  }>({
    images: [],
    coverImage: "",
  });

  const eventId = params.id;

  const eventQuery = useAdminGetEvent(eventId);
  const event = eventQuery.data?.data;

  useEffect(() => {
    if ((eventQuery.isFetched && !event) || eventQuery.isError) {
      // inform the user that there is no event matching this id and make them go back
      setNotFoundDialogOpen(true);
    }
  }, [event]);

  useEffect(() => {
    const zonedStartTime = dateFnsTz.toZonedTime(
      new Date(event?.startTime || Date.now()),
      newYorkTimeZone
    );
    const zonedEndTime = dateFnsTz.toZonedTime(
      new Date(event?.endTime || Date.now()),
      newYorkTimeZone
    );

    if (eventQuery.isSuccess) {
      setDetailsDefault({
        startDate: dateFns.format(zonedStartTime, "yyyy-MM-dd"),
        startTime: dateFns.format(zonedStartTime, "HH:mm"),
        endDate: dateFns.format(zonedEndTime, "yyyy-MM-dd"),
        endTime: dateFns.format(zonedEndTime, "HH:mm"),
        location: event?.location || "",
        name: event?.name || "",
        refundPolicy: event?.refundPolicy || "",
        summary: event?.summary || "",
        locationType: event?.locationType || "VENUE",
        hasRefundPolicy: event?.hasRefundPolicy ?? false,
        // coverImage: event?.coverImage,
        // images: event?.coverImage,
      });
      setDefaultMedia({
        coverImage: event?.coverImage,
        images: event?.images || [],
      });
    }
  }, [eventQuery.isSuccess, eventQuery.data?.data]);

  return (
    <>
      <section>
        <div className="mx-8 mt-20 pt-10">
          {/* TOP BREADCRUMB */}
          <h1 className="text-3xl font-semibold text-white flex items-center gap-x-4">
            <Link
              href={"/admin/events"}
              className="text-[#A3A7AA] hover:opacity-80"
            >
              Events
            </Link>
            <FaChevronRight className="size-4" />
            <span>Copy Event</span>
          </h1>
          {/* END TOP BREADCRUMB */}

          {/* TAB BUTTONS */}
          <div className="text-[#757575] border-y border-y-[#151515] mt-6">
            <div
              className={cn(
                "border-b border-b-transparent inline-block py-3 px-4 text-white border-b-white"
              )}
            >
              Event Details
            </div>
          </div>
          {/* END TAB BUTTONS */}

          {/* TAB CONTENTS */}
          <EditDetailsTab
            defaultValues={detailsDefault}
            defaultMedia={defaultMedia}
          />
          {/* END TAB CONTENTS */}
        </div>
      </section>
      <EventNotFoundDialog
        open={notFoundDialogOpen}
        onOpenChange={setNotFoundDialogOpen}
      />
    </>
  );
}

function EventNotFoundDialog({ ...props }: ComponentProps<typeof Dialog.Root>) {
  const router = useRouter();
  return (
    <Dialog.Root {...props} modal={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <Dialog.Content className="relative bg-[#333333] text-[#A3A7AA] p-6 mx-auto py-9 max-w-lg">
            <div className="bg-red-500 text-white size-24 mx-auto rounded-full grid place-items-center">
              <MdGppBad className="text-4xl" />
            </div>

            <div className="text-white text-2xl lg:text-4xl font-medium text-center mt-16">
              Event not found
            </div>

            <div className="text-center my-6 space-y-4">
              <p className="text-white text-base lg:text-xl">
                The event you are trying to edit does not exist or could not be
                found. It might have been deleted, moved, or is currently
                unavailable. Please check the event list and try again.{" "}
              </p>
            </div>

            <div className="flex justify-center">
              <AdminButton
                variant="outline"
                className=""
                onClick={() => router.push("/admin/events")}
              >
                GO BACK
              </AdminButton>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
