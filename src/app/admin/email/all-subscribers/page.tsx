"use client";

import { useListSubscribers } from "@/api/subscribers/subscriber.queries";
import { AdminButton } from "@/components";
import IconInputField from "@/components/shared/IconInputField";
import Link from "next/link";
import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FiDownload, FiPlusCircle, FiSearch } from "react-icons/fi";
import * as dateFns from "date-fns";
import { Subscriber } from "@/api/subscribers/subscriber.types";
import { fuzzyMatch } from "@/utils/utilityFunctions";

export default function AllSubscribersPage() {
  const subscribersQuery = useListSubscribers();
  const [filteredList, setFilteredList] = useState<Subscriber[] | undefined>(
    subscribersQuery.data?.data
  );

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    const filtered = filteredList?.filter((subscriber) =>
      fuzzyMatch(value, subscriber.name)
    );

    setFilteredList(filtered);
  };

  return (
    <section>
      <div className="mx-8 mt-20 pt-10">
        <Link
          href={"/admin/email"}
          className="flex items-center gap-x-2 font-medium text-[#4267B2]"
        >
          <FaChevronLeft />
          <span>Back to all lists</span>
        </Link>

        <h1 className="font-semibold text-3xl text-white mt-6">
          All Subscribers
        </h1>

        {/* LIST TABLE ACTIONS */}
        <div className="flex items-center gap-x-16 justify-between mt-12">
          <IconInputField
            Icon={<FiSearch />}
            placeholder="Search by name"
            className="max-w-lg flex-1"
            onChange={handleSearch}
          />

          <AdminButton
            variant="primary"
            className="flex items-center gap-x-2 font-medium"
          >
            <FiDownload className="" />
            <span>Download List</span>
          </AdminButton>
        </div>
        {/* END LIST TABLE ACTIONS */}

        <table className="text-[#A3A7AA] w-full mt-12 text-left">
          <thead className="bg-[#A3A7AA] text-black leading-10 [&_th]:px-6">
            <tr>
              <th>Email</th>
              <th>Lists</th>
            </tr>
          </thead>
          <tbody className=" divide-y-[#151515]">
            {subscribersQuery.isPending ? (
              <tr>
                <td colSpan={3}>Loading data..</td>
              </tr>
            ) : filteredList ? (
              filteredList.map((subscriber) => {
                return (
                  <tr className="[&>td]:p-6">
                    <td>{subscriber.email}</td>
                    <td>
                      {subscriber.subscriberList
                        .map((item) => item.name)
                        .join(", ")}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={2}>No data..</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
