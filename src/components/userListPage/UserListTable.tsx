import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import Checkbox from "../shared/Checkbox";
import { FiChevronsLeft, FiChevronsRight, FiSearch } from "react-icons/fi";
import { FaSort } from "react-icons/fa6";
import {
  useAdminUsersStats,
  useGetUsers,
  useNewUsersTodayStats,
} from "@/api/user/user.queries";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import IconInputField from "../shared/IconInputField";
import LoadingMessage from "../shared/Loader/LoadingMessage";
import { parseAsInteger, useQueryState } from "nuqs";
import { GetUserData } from "@/api/user/user.types";
import { debounce } from "@/utils/utilityFunctions";
import * as dateFns from "date-fns";

const UserListTable = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useState<string>("");

  const usersQuery = useGetUsers({ page: page, limit: 10, search });
  const usersData = usersQuery.data?.data;
  const newUsersTodayStatsQuery = useNewUsersTodayStats();
  const newUsersTodayStats = newUsersTodayStatsQuery.data?.data;
  const adminUsersStatsQuery = useAdminUsersStats();
  const adminUsersStats = adminUsersStatsQuery.data?.data;

  const isLast = usersData?.usersCount
    ? page * 10 >= usersData.usersCount
      ? true
      : false
    : true;

  const debouncedHandleSearch = debounce((e) => {
    setSearch(e.target.value);
  }, 250);

  return (
    <div className="text-[#A3A7AA]">
      {/* INFO CARDS */}
      <div className="overflow-x-auto">
        <div className="flex gap-x-8 whitespace-nowrap mt-12">
          {/* NEW USERS */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              {newUsersTodayStats?.upTrend ? (
                <VscTriangleUp className="text-green-500 text-2xl" />
              ) : (
                <VscTriangleDown className="text-[#E1306C] text-2xl" />
              )}
              <span>New Users</span>
            </div>
            <div className="text-white font-semibold text-6xl">
              {newUsersTodayStats?.newUsersCount}
            </div>
          </div>
          {/* END NEW USERS */}

          {/* TOTAL USERS */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              {/* <VscTriangleDown className="text-[#E1306C] text-2xl" /> */}
              <span>Total Users</span>
            </div>
            <div className="text-white font-semibold text-6xl">
              {usersData?.usersCount || 0}
            </div>
          </div>
          {/* END TOTAL USERS */}

          {/* TOTAL ADMINS */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              {/* <VscTriangleDown className="text-[#E1306C] text-2xl" /> */}
              <span>Total Admins</span>
            </div>
            <div className="text-*white font-semibold text-6xl">
              {adminUsersStats?.adminsCount || 0}
            </div>
          </div>
          {/* END TOTAL ADMINS */}
        </div>
      </div>
      {/* END INFO CARDS */}

      {/* SEARCH USER INPUT FIELD */}
      <div className="mt-10">
        <IconInputField
          onChange={debouncedHandleSearch}
          Icon={<FiSearch />}
          placeholder="Search user"
        />
      </div>
      {/* END SEARCH USER INPUT FIELD */}

      <div className="mt-6 whitespace-nowrap overflow-x-auto">
        <table className="w-full bg-[#151515]">
          <thead>
            <tr className="border-b border-b-[#A3A7AA] text-white">
              {/* <th className="p-4 m-4">
                <Checkbox
                  // TODO: Fix the checking of rows
                  checked={}
                  onChange={}
                  aria-label="Select all"
                />
              </th> */}
              <th className="p-4 m-4 text-left">User #</th>
              <th className="p-4 m-4 text-left">Name</th>
              <th className="p-4 m-4 text-left">Email</th>
              <th className="p-4 m-4 text-left">Phone Number</th>
              <th className="p-4 m-4 text-left">Amount Spent</th>
              <th className="p-4 m-4 text-left">Role</th>
              <th className="p-4 m-4 text-left">Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {usersQuery.isPending ? (
              <tr>
                <td colSpan={7} className="h-24 text-center">
                  Loading list of users..
                </td>
              </tr>
            ) : usersData?.users ? (
              usersData.users.map((user) => (
                <tr key={user.id} className="odd:bg-black">
                  <td className="p-4 m-4">{user.id}</td>
                  <td className="p-4 m-4 capitalize">
                    {user.firstname} {user.lastname}
                  </td>
                  <td className="p-4 m-4">{user.email}</td>
                  <td className="p-4 m-4">{user.phone}</td>
                  <td className="p-4 m-4">{user.amountSpent}</td>
                  <td className="p-4 m-4 uppercase font-medium">{user.role}</td>
                  <td className="p-4 m-4">
                    {dateFns.format(new Date(user.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* TABLE PAGINATION */}
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
      <div className="text-white">
        {usersQuery.isFetching ? (
          <LoadingMessage>Loading users..</LoadingMessage>
        ) : page ? (
          usersData?.usersCount ? (
            <div>
              Showing {page * 10 - 9}-
              {isLast ? usersData.usersCount : page * 10} of{" "}
              {usersData.usersCount}
            </div>
          ) : null
        ) : null}
      </div>
      {/* END TABLE PAGINATION */}
    </div>
  );
};

export default UserListTable;
