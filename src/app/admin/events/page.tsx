"use client";

import {
  useAdminGetEvents,
  useDeleteEvent,
  useGetEvents,
} from "@/api/events/events.queries";
import { DeleteEventResponse } from "@/api/events/events.types";
import { AdminButton } from "@/components";
import { CopyEventDialog } from "@/components/copyEvent/CopyEventDialog";
import LoadingMessage from "@/components/shared/Loader/LoadingMessage";
import LoadingSvg from "@/components/shared/Loader/LoadingSvg";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import {
  ErrorResponse,
  Event,
  EventStatus,
  OptionProps,
} from "@/constants/types";
import { cn } from "@/utils/cn";
import { newYorkTimeZone } from "@/utils/date-formatter";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import { useGetUser } from "@/api/user/user.queries";
import { canModifyData } from "@/utils/roleHelpers";
import { AxiosError, AxiosResponse } from "axios";
// import { formatEventDate } from "@/utils/date-formatter";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaSortDown } from "react-icons/fa6";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiMoreVertical,
  FiPlusCircle,
} from "react-icons/fi";

const actions = ["view", "edit", "copy", "delete"] as const;

export default function AdminEventsPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [eventStatus, setEventStatus] =
    useState<OptionProps["eventStatus"]>("all");
  const eventsQuery = useAdminGetEvents({ page, eventStatus });
  const eventsData = eventsQuery.data?.data;
  const router = useRouter();
  const loadingToastId = useRef("");
  const [copyEventDialogOpen, setCopyEventDialogOpen] = useState(false);
  const [eventToCopyId, setEventToCopyId] = useState<null | string>(null);
  const userQuery = useGetUser();
  const userData = userQuery.data?.data;
  const canModify = canModifyData(userData?.role || "");

  const { mutate: deleteEvent, isPending: deleteEventPending } = useDeleteEvent(
    onDeleteError,
    onDeleteSuccess
  );
  function onDeleteError(e: AxiosError<ErrorResponse>) {
    toast.dismiss(loadingToastId.current);
    const errorMessage = getApiErrorMessage(e, "Something went wrong");
    ErrorToast({
      title: "Error",
      descriptions: errorMessage,
    });
  }

  function onDeleteSuccess(data: AxiosResponse<DeleteEventResponse>) {
    toast.dismiss(loadingToastId.current);
    SuccessToast({
      title: "Success",
      description: "Event deleted successfully",
    });
  }

  const isLast = eventsData?.eventsCount
    ? page * 10 >= eventsData.eventsCount
      ? true
      : false
    : true;

  function handleAction(
    action: (typeof actions)[number],
    eventId: string,
    eventStatus?: EventStatus["eventStatus"]
  ) {
    switch (action) {
      case "view":
        const routeView =
          eventStatus === "PAST"
            ? `/events/past/${eventId}`
            : `/events/upcoming/${eventId}`;
        router.push(routeView);
        break;
      case "edit":
        const eventLink = "/admin/events/" + eventId;
        router.push(eventLink);
        break;
      case "delete":
        deleteEvent({ eventId });
        break;
      case "copy":
        setEventToCopyId(eventId);
        setCopyEventDialogOpen(true);
    }
  }

  return (
    <>
      <section>
        <div className="mx-8 mt-20 pt-10">
          <h1 className="text-3xl font-semibold text-white">Events</h1>

          {/* EVENT ACTION BUTTONS */}
          <div className="flex items-center gap-x-6 justify-end">
            {/* FILTER SELECT */}
            <FilterSelect
              onSelect={setEventStatus}
              items={[
                { title: "All", value: "all" },
                {
                  title: "Draft",
                  value: "draft",
                },
                {
                  title: "Upcoming Events",
                  value: "upcoming",
                },
                {
                  title: "Past",
                  value: "past",
                },
              ]}
            />
            {/* END FILTER SELECT */}

            {/* NEW EVENT BUTTON */}
            {canModify ? (
              <AdminButton
                variant="primary"
                className="flex items-center gap-x-2 leading-5"
                onClick={() => router.push(`/admin/events/new-event`)}
              >
                <FiPlusCircle />
                <span className="pt-1">New Event</span>
              </AdminButton>
            ) : null}
            {/* END NEW EVENT BUTTON */}
          </div>
          {/* END EVENT ACTION BUTTONS */}

          {/* EVENTS LIST */}
          <div className="overflow-x-auto whitespace-nowrap min-w-0">
            <table className="w-full mt-12 overflow-x-auto min-w-max">
              {/* LIST HEAEDER */}
              <thead className="bg-[#A3A7AA] leading-10 text-left [&_th]:px-4">
                <tr>
                  <th>Event</th>
                  <th>Sold</th>
                  <th>Gross</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              {/* END LIST HEAEDER */}
              {/* LIST BODY */}
              {eventsQuery.isPending ? (
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <LoadingMessage>Loading events..</LoadingMessage>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="text-text-color [&>tr>td]:px-4">
                  {eventsQuery.data?.data || !eventsQuery.isError ? (
                    eventsData?.events.map((event) => {
                      return (
                        <tr
                          key={event.id}
                          className={cn(
                            "hover:bg-[#131313] transition-all",
                            canModify && "cursor-pointer"
                          )}
                          onClick={() => {
                            if (canModify) {
                              handleAction("view", event.id, event.eventStatus);
                            }
                          }}
                        >
                          <td className="py-6">
                            <div className="flex items-start gap-x-6">
                              {/* MONTH AND DAY */}
                              <div className="text-center space-y-2 pl-4">
                                {new Date(event.startTime)
                                  .toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    timeZone: newYorkTimeZone, // PDT timezone
                                  })
                                  .toUpperCase()
                                  .split(" ")
                                  .map((item) => (
                                    <div key={item} className="text-text-color">
                                      {item}
                                    </div>
                                  ))}
                              </div>
                              {/* END MONTH AND DAY */}
                              {/* COVER IMAGE */}
                              <Image
                                src={event.coverImage}
                                alt="Event Poster"
                                width={180}
                                height={180}
                                className="aspect-square size-24 object-cover"
                              />
                              {/* END COVER IMAGE */}

                              {/* EVENT DETAILS */}
                              <div>
                                <div className="text-xl font-medium">
                                  {event.name}
                                </div>
                                <p className="mt-2">{event.location}</p>
                                <p>
                                  {new Intl.DateTimeFormat("en-US", {
                                    weekday: "long", // Full day name
                                    year: "numeric",
                                    month: "long", // Full month name
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true, // 12-hour format
                                    timeZone: newYorkTimeZone, // PDT timezone
                                    timeZoneName: "short", // Abbreviated time zone
                                  }).format(new Date(event.startTime))}
                                </p>
                              </div>
                              {/* END EVENT DETAILS */}
                            </div>
                          </td>

                          <td>
                            <div>
                              <div>
                                <div>
                                  {event.totalSales}/{event.totalTickets}
                                </div>
                                {/* PROGRESS FOR SALES/TOTAL */}
                                <div className="bg-[#333333] rounded-full h-1 min-w-40 overflow-hidden">
                                  <div
                                    style={{
                                      width: `${(event.totalSales / event.totalTickets) * 100}%`,
                                    }}
                                    className="bg-[#A3A7AA] h-full"
                                  ></div>
                                </div>
                                {/* END PROGRESS FOR SALES/TOTAL */}
                              </div>
                            </div>
                          </td>

                          {/* GROSS */}
                          <td>${event.gross}</td>
                          {/* END GROSS */}

                          {/* STATUS */}
                          <td className="capitalize">
                            {event.isPublished
                              ? event.eventStatus?.toLowerCase()
                              : "draft"}
                          </td>
                          {/* END STATUS */}

                          {/* ACTIONS */}
                          <td>
                            <ActionDropDown
                              eventStatus={event.eventStatus}
                              eventId={event.id}
                              handleAction={handleAction}
                              canModify={canModify}
                            />
                          </td>
                          {/* END ACTIONS */}
                        </tr>
                      );
                    })
                  ) : (
                    <div>Error fetching Events..</div>
                  )}
                </tbody>
              )}
              {/* END LIST BODY */}
            </table>
          </div>
          {/* END EVENTS LIST */}

          {/* TABLE PAGINATION */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="space-x-2 flex items-center">
                <button
                  className="size-10 rounded-lg bg-[#151515] text-2xl grid place-items-center"
                  onClick={() =>
                    setPage((prev) => {
                      if (prev <= 1) {
                        return 1;
                      }
                      return prev - 1;
                    })
                  }
                  disabled={page == 1}
                >
                  <FiChevronsLeft />
                </button>
                <div className="h-10 min-w-10 rounded-lg bg-[#757575] grid place-items-center">
                  {page}
                </div>
                <button
                  className="size-10 rounded-lg bg-[#151515] text-2xl grid place-items-center"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={isLast}
                >
                  <FiChevronsRight />
                </button>
              </div>
            </div>
          </div>
          <div className="text-white mt-2">
            {eventsQuery.isFetching ? (
              <LoadingMessage>Loading events..</LoadingMessage>
            ) : page && eventsData?.eventsCount ? (
              <div>
                Showing {page * 10 - 9}-
                {isLast ? eventsData.eventsCount : page * 10} of{" "}
                {eventsData.eventsCount}
              </div>
            ) : null}
          </div>
          {/* END TABLE PAGINATION */}
        </div>
      </section>

      <CopyEventDialog
        open={copyEventDialogOpen}
        onOpenChange={(value) => {
          setEventToCopyId(null);
          setCopyEventDialogOpen(value);
        }}
        eventId={eventToCopyId}
      />
    </>
  );
}

function FilterSelect({
  items,
  onSelect,
}: {
  onSelect: (value: OptionProps["eventStatus"]) => void;
  items: {
    title: string;
    value: OptionProps["eventStatus"];
  }[];
}) {
  const [selectValue, setSelectValue] = useState(items[0].value);
  const [selectOpen, setSelectOpen] = useState(false);
  return (
    <div className="text-white relative">
      {/* SELECT DISPLAY */}
      <button
        className={
          "bg-[#151515] w-44 h-14 px-4 flex items-center gap-x-4 justify-between"
        }
        onClick={() => setSelectOpen((state) => !state)}
      >
        <span>{items.find((item) => item.value === selectValue)?.title}</span>

        <FaSortDown className="-mt-2" />
      </button>
      {/* END SELECT DISPLAY */}

      {/* SELECT DROPDOWN */}
      <div
        className={cn(
          "bg-[#151515] flex-col inline-flex divide-y divide-[#151515] min-w-36 absolute top-14 mt-2 right-0 overflow-hidden",
          selectOpen ? "h-max" : "h-0"
        )}
      >
        {items.map((item) => {
          return (
            <button
              key={item.value}
              onClick={() => {
                setSelectValue(item.value);
                onSelect(item.value);
                setSelectOpen(false);
              }}
              className="px-6 py-3 hover:bg-[#2c2b2b]"
            >
              {item.title}
            </button>
          );
        })}
      </div>
      {/* END SELECT DROPDOWN */}
    </div>
  );
}

function ActionDropDown({
  eventId,
  eventStatus,
  handleAction,
  canModify,
}: {
  eventId: string;
  eventStatus: EventStatus["eventStatus"];
  handleAction: (
    action: (typeof actions)[number],
    eventId: string,
    eventStatus: EventStatus["eventStatus"]
  ) => void;
  canModify: boolean;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const availableActions = canModify
    ? actions
    : (["view"] as typeof actions);
  return (
    <div className="relative">
      {/* ACTION BUTTON */}
      <button
        className="p-3 hover:bg-[#2c2b2b] rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen((state) => !state);
        }}
      >
        <FiMoreVertical />
      </button>
      {/* ACTION BUTTON */}
      <div
        className={cn(
          "bg-[#151515] flex-col inline-flex divide-y divide-[#151515] min-w-36 absolute z-[1] top-8 mt-2 right-0 overflow-hidden",
          dropdownOpen ? "h-max" : "h-0"
        )}
      >
        {availableActions.map((item) => {
          return (
            <button
              key={item}
              onClick={(e) => {
                e.stopPropagation();
                handleAction(item, eventId, eventStatus);
                setDropdownOpen(false);
              }}
              className="px-6 py-3 hover:bg-[#2c2b2b] capitalize"
            >
              {item.toLowerCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
