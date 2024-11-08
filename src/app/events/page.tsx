"use client";

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Events from "@/components/eventPage/Events";
import { IoSearch } from "react-icons/io5";
import { parseAsString, useQueryState } from "nuqs";

import { useGetEvents } from "@/api/events/events.queries";
import { SearchQueryState } from "@/constants/types";

const EventTabs = [
  {
    label: "Upcoming Events",
    value: "upcoming",
  },
  {
    label: "Past Events",
    value: "past",
  },
] as const;

const EventsPage = () => {
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("upcoming")
  ) as SearchQueryState<"upcoming" | "past">;
  const [filterString, setFilterString] = useState<string>("");

  const eventsQuery = useGetEvents({
    eventStatus: activeTab,
    search: filterString,
  });
  const eventsData = eventsQuery.data?.data;

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setFilterString(value);
  };

  return (
    <div className=" flex flex-col gap-6 text-white mt-4">
      <h1 className="text-4xl font-bold">Events</h1>

      <div className="flex flex-col gap-6 text-[#757575]">
        <div className="flex items-center gap-5">
          {EventTabs.map((item, index) => (
            <h3
              key={index}
              onClick={() => {
                setActiveTab(item.value);
              }}
              className={classNames({
                "cursor-pointer": true,
                "border-b-2 border-white text-white pb-2 px-5":
                  item.value == activeTab,
              })}
            >
              {item.label}
            </h3>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white md:w-[60%] lg:w-[40%] px-4 py-3">
          <IoSearch className="text-[#757575] text-2xl" />
          <input
            onChange={handleSearch}
            className="border-none outline-none w-full placeholder:text-[#33333380]"
            placeholder="Search by title..."
          />
        </div>
      </div>

      <Events
        events={eventsData?.events || []}
        isPending={eventsQuery.isPending}
        isError={eventsQuery.isError}
        tab={activeTab}
      />
    </div>
  );
};

export default EventsPage;
