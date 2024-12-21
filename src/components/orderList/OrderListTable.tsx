import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import Checkbox from "../shared/Checkbox";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiMoreHorizontal,
} from "react-icons/fi";
import { OptionProps, Order } from "@/constants/types";
import { useGetOrders } from "@/api/order/order.queries";
import { FaSort, FaSortDown } from "react-icons/fa6";
import * as dateFns from "date-fns";
import { cn } from "@/utils/cn";
import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";
import LoadingMessage from "../shared/Loader/LoadingMessage";
import toast from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "../shared/Popover";

const OrderListTable = ({
  startDate,
  endDate,
}: {
  startDate: Date | undefined;
  endDate: Date | undefined;
}) => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [eventFilter, setEventFilter] =
    useState<OptionProps["eventStatus"]>("all");
  const orderListQuery = useGetOrders({
    eventStatus: eventFilter,
    page,
    limit: 10,
    startDate,
    endDate,
  });
  const orderListData = orderListQuery.data?.data;

  useEffect(() => {
    let toastId;
    if (!toastId && orderListQuery.isFetching) {
      toastId = toast.loading("Order table data loading");
    } else {
      toast.dismiss(toastId);
      toastId = null;
    }

    return () => {
      toastId && toast.dismiss(toastId);
    };
  }, [orderListQuery.isFetching]);

  const isLast = orderListData?.orders
    ? page * 10 >= orderListData.ordersCount
      ? true
      : false
    : true;

  return (
    <>
      {/* FILTER SELECT */}
      <FilterSelect
        onSelect={setEventFilter}
        items={[
          { title: "All Events", value: "all" },
          {
            title: "Past Events",
            value: "past",
          },
          {
            title: "Upcoming Events",
            value: "upcoming",
          },
          // {
          //   title: "Drafts",
          //   value: "drafts",
          // },
        ]}
      />
      {/* END FILTER SELECT */}
      <div className="text-[#A3A7AA] mt-6">
        <div className="overflow-x-auto">
          <table className="w-full bg-[#151515] whitespace-nowrap">
            <thead>
              <tr className="border-b border-b-[#A3A7AA] text-white">
                <th className="p-4 m-4 text-left">Date</th>
                <th className="p-4 m-4 text-left">Event Name</th>
                <th className="p-4 m-4 text-left">Order ID</th>
                <th className="p-4 m-4 text-left">Customer Name</th>
                <th className="p-4 m-4 text-left">Phone No.</th>
                <th className="p-4 m-4 text-left">Ticket</th>
                <th className="p-4 m-4 text-left">Amount</th>
                <th className="p-4 m-4 text-left">Payment Status</th>
                <th className="p-4 m-4 text-left">Order Status</th>
                {/* <th className="p-4 m-4"></th> */}
              </tr>
            </thead>
            <tbody>
              {orderListQuery.isPending ? (
                <tr>
                  <td colSpan={8} className="h-24 text-center">
                    Loading orders..
                  </td>
                </tr>
              ) : orderListData?.orders ? (
                orderListData.orders.map((order) => (
                  <tr key={order.id} className="odd:bg-black">
                    <td className="p-4 m-4">
                      <div className="capitalize">
                        <div>
                          {dateFns.format(
                            new Date(order.createdAt),
                            "dd/MM/yyyy"
                          )}
                        </div>
                        <div>
                          {dateFns.format(new Date(order.createdAt), "hh:mm a")}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 m-4">{order.event.name}</td>
                    <td className="p-4 m-4">{order.id}</td>
                    <td className="p-4 m-4">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="p-4 m-4">{order.phone}</td>
                    <td className="p-4 m-4">{order.tickets.length}</td>
                    <td className="p-4 m-4">${order.amountPaid ?? 0}</td>
                    <td className="p-4 m-4">
                      <span
                        className={cn(
                          order.paymentStatus === "SUCCESSFUL"
                            ? "text-[#34C759]"
                            : "text-[#E1306C]"
                        )}
                      >
                        {order.paymentStatus === "SUCCESSFUL"
                          ? "Paid"
                          : "Not Paid"}
                      </span>
                    </td>
                    <td className="p-4 m-4">
                      {order.paymentStatus === "SUCCESSFUL" ? (
                        <span
                          className={cn(
                            order.status === "COMPLETED"
                              ? "text-[#34C759]"
                              : "text-yellow-500"
                          )}
                        >
                          {order.status === "COMPLETED"
                            ? "Successful"
                            : "Pending"}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    {/* <td className="p-4 m-4">
                      <Popover>
                        <PopoverTrigger>
                          <FiMoreHorizontal className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          className="bg-black text-white"
                        >
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(order.id)
                            }
                          >
                            Copy payment ID
                          </button>
                          <button>View customer</button>
                          <button>View payment details</button>
                        </PopoverContent>
                      </Popover>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="h-24 text-center">
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
        {/* END TABLE PAGINATION */}
        <div className="text-white">
          {orderListQuery.isFetching ? (
            <LoadingMessage>Loading order list..</LoadingMessage>
          ) : page ? (
            orderListData?.ordersCount ? (
              <div>
                Showing {page * 10 - 9}-
                {isLast ? orderListData.ordersCount : page * 10} of{" "}
                {orderListData.ordersCount}
              </div>
            ) : null
          ) : null}
        </div>
      </div>
    </>
  );
};

export default OrderListTable;

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
    <div className="text-white relative inline-block z-[1]">
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
          "bg-[#151515] border border-black flex-col inline-flex divide-y divide-[#151515] min-w-36 absolute top-14 mt-2 right-0 overflow-hidden",
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
