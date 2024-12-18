"use client";

import DetailsTab from "@/components/newEvents/DetailsTab";
import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { parseAsString, useQueryState } from "nuqs";
import { SearchQueryState } from "@/constants/types";
// import { useNewEventStore } from "@/store/new-event.store";
import Link from "next/link";

const tabsList = [
  { id: "details", title: "Details Page" },
  // { id: "ticket", title: "Ticket" },
  // { id: "code", title: "Code" },
  // { id: "add-ons", title: "Add Ons" },
  // { id: "dashboard", title: "Dashboard" },
] as const;

// const fillTypeOptions = ["new", "edit"] as const;
export type Tabs = (typeof tabsList)[number]["id"];

export default function NewEventPage() {
  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("details")
  ) as SearchQueryState<Tabs>;

  // const eventId = useNewEventStore((state) => state.eventId);
  const [eventId, setEventId] = useQueryState(
    "newEventId",
    parseAsString.withDefault("")
  ) as SearchQueryState<string>;

  useEffect(() => {
    if (currentTab !== "details" && !eventId) {
      setCurrentTab("details");
    }
  }, [eventId, currentTab]);

  return (
    <section>
      <div className="mx-8 mt-20 pt-10">
        {/* TOP BREADCRUMB */}
        <h1 className="text-3xl font-semibold text-white flex items-center gap-x-4">
          <Link href={"/admin/events"} className="text-[#A3A7AA]">
            Events
          </Link>
          <FaChevronRight className="size-4" />
          <span>New Event</span>
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
        {currentTab === "details" && (
          <DetailsTab isActive={currentTab === "details"} />
        )}
        {/* END TAB CONTENTS */}

        {/* TICKETS TAB */}
        {/* {currentTab === "ticket" && (
          <TicketsTab isActive={currentTab === "ticket"} />
        )} */}
        {/* END TICKETS TAB */}

        {/* {currentTab === "code" && (
          <PromoCodeTab isActive={currentTab === "code"} />
        )}

        {currentTab === "add-ons" && (
          <EventAddOnTab isActive={currentTab === "add-ons"} />
        )} */}

        {/* {currentTab === "dashboard" && (
          <EventDetailsDashboard isActive={currentTab === "dashboard"} />
        )} */}
      </div>
    </section>
  );
}
