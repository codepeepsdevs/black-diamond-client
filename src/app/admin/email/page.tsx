"use client";

import CampaignsTab from "@/components/emailAdmin/CampaignsTab";
import SubscribersListTab from "@/components/emailAdmin/SubscribersListTab";
import { SearchQueryState } from "@/constants/types";
import { cn } from "@/utils/cn";
import { parseAsString, useQueryState, UseQueryStateReturn } from "nuqs";
import React from "react";

const tabsList = [
  { id: "campaigns", title: "Campaigns" },
  { id: "subscriber-list", title: "Subscriber's List" },
] as const;

type Tabs = (typeof tabsList)[number]["id"];

export default function EmailPage() {
  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("subscriber-list")
  ) as SearchQueryState<Tabs>;

  return (
    <section>
      <div className="mx-8 mt-20 pt-10 text-[#A3A7AA]">
        <h1 className="text-3xl font-semibold text-white">Email</h1>

        {/* TAB BUTTONS */}
        <div className="text-[#757575] border-y border-y-[#151515] mt-6">
          {tabsList.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "border-b border-b-transparent py-3 px-4",
                tab.id === currentTab && "text-white border-b-white"
              )}
              onClick={() => setCurrentTab(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>
        {/* END TAB BUTTONS */}

        {currentTab === "subscriber-list" && <SubscribersListTab />}
        {currentTab === "campaigns" && <CampaignsTab />}
      </div>
    </section>
  );
}
