"use client";

import { AdminButton } from "@/components";
import { cn } from "@/utils/cn";
import React, { ComponentProps, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useGetEvent } from "@/api/events/events.queries";
import { SearchQueryState } from "@/constants/types";
import * as Dialog from "@radix-ui/react-dialog";
import { MdGppBad } from "react-icons/md";
import EditDetailsTab from "@/components/manageEvent/EditDetailsTab";
import EditTicketsTab from "@/components/manageEvent/EditTicketsTab";
import EditPromoCodeTab from "@/components/manageEvent/EditPromoCodeTab";
import EditEventAddOnTab from "@/components/manageEvent/EditEventAddOnTab";
import EditEventDetailsDashboard from "@/components/manageEvent/EditEventDetailsDashboard";
import * as Yup from "yup";
import { editEventDetailsSchema } from "@/api/events/events.schemas";
import DetailsTab from "@/components/newEvents/DetailsTab";
import TicketsTab from "@/components/newEvents/TicketsTab";
import PromoCodeTab from "@/components/newEvents/PromoCodeTab";
import EventAddOnTab from "@/components/newEvents/EventAddOnTab";

const tabsList = [
  { id: "details", title: "Details Page" },
  { id: "ticket", title: "Ticket" },
  { id: "code", title: "Code" },
  { id: "add-ons", title: "Add Ons" },
  { id: "dashboard", title: "Dashboard" },
] as const;

type Tabs = (typeof tabsList)[number]["id"];

export default function ManageEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [notFoundDialogOpen, setNotFoundDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("details")
  ) as SearchQueryState<Tabs>;
  const [detailsDefault, setDetailsDefault] = useState<Yup.InferType<
    typeof editEventDetailsSchema
  > | null>(null);

  const eventId = params.id;

  const eventQuery = useGetEvent(eventId);
  const event = eventQuery.data?.data;

  useEffect(() => {
    if ((eventQuery.isFetched && !event) || eventQuery.isError) {
      // inform the user that there is no event matching this id and make them go back
      setNotFoundDialogOpen(true);
    }
  }, [event]);

  useEffect(() => {
    if (currentTab !== "details" && !eventId) {
      setCurrentTab("details");
    }
  }, [eventId, currentTab]);

  useEffect(() => {
    if (eventQuery.isSuccess) {
      setDetailsDefault({
        date: new Date(event?.startTime || Date.now()),
        endTime: new Date(event?.endTime || Date.now())
          .toTimeString()
          .slice(0, 5),
        startTime: new Date(event?.startTime || Date.now())
          .toTimeString()
          .slice(0, 5),
        location: event?.location || "",
        name: event?.name || "",
        refundPolicy: event?.refundPolicy || "",
        summary: event?.summary || "",
        locationType: event?.locationType || "VENUE",
        // coverImage: event?.coverImage,
        // images: event?.coverImage,
      });
    }
  }, [eventQuery.isSuccess]);

  return (
    <>
      <section>
        <div className="mx-8 mt-20 pt-10">
          {/* TOP BREADCRUMB */}
          <h1 className="text-3xl font-semibold text-white flex items-center gap-x-4">
            <span className="text-[#A3A7AA]">Events</span>{" "}
            <FaChevronRight className="size-4" />
            <span>Manage Event</span>
          </h1>
          {/* END TOP BREADCRUMB */}

          {/* TAB BUTTONS */}
          <div className="text-[#757575] border-y border-y-[#151515] mt-6">
            {tabsList.map((tab) => (
              <button
                key={tab.id}
                className={cn(
                  "border-b border-b-transparent py-3 px-4",
                  tab.id === currentTab && "text-white border-b-white"
                )}
                disabled={!Boolean(eventId)}
                onClick={() => setCurrentTab(tab.id)}
              >
                {tab.title}
              </button>
            ))}
          </div>
          {/* END TAB BUTTONS */}

          {/* PREVIEW BUTTON */}
          {/* FIXME: preview button is disabled for now */}
          {/* <AdminButton
          variant="ghost"
          className="flex items-center px-6 gap-x-3 ml-auto mt-12"
        >
          <PreviewIcon />

          <span className="font-medium mt-1">Preview</span>
        </AdminButton> */}
          {/* END PREVIEW BUTTON */}

          {/* TAB CONTENTS */}
          {currentTab === "details" && detailsDefault !== null && (
            <EditDetailsTab
              defaultValues={detailsDefault}
              isActive={currentTab === "details"}
            />
          )}
          {/* END TAB CONTENTS */}

          {/* TICKETS TAB */}
          {currentTab === "ticket" && (
            <EditTicketsTab isActive={currentTab === "ticket"} />
          )}
          {/* END TICKETS TAB */}

          {currentTab === "code" && (
            <EditPromoCodeTab isActive={currentTab === "code"} />
          )}

          {currentTab === "add-ons" && (
            <EditEventAddOnTab isActive={currentTab === "add-ons"} />
          )}

          {currentTab === "dashboard" && (
            <EditEventDetailsDashboard isActive={currentTab === "dashboard"} />
          )}
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
