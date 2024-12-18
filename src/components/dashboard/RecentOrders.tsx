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
import { useGetOrders } from "@/api/order/order.queries";
import { FaSort, FaSortDown } from "react-icons/fa6";
import * as dateFns from "date-fns";
import { cn } from "@/utils/cn";
import toast from "react-hot-toast";

const RecentOrdersTable = ({
  startDate,
  endDate,
}: {
  startDate: Date | undefined;
  endDate: Date | undefined;
}) => {
  const orderListQuery = useGetOrders({ startDate, endDate, limit: 10 });
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

  return (
    <>
      <div className="text-[#A3A7AA] overflow-x-auto">
        <div className="mt-6">
          <table className="w-full bg-[#151515] whitespace-nowrap overflow-x-auto">
            <thead>
              <tr className="border-b border-b-[#A3A7AA] text-white">
                <th className="p-4 m-4 text-left">Date</th>
                <th className="p-4 m-4 text-left">Event Name</th>
                <th className="p-4 m-4 text-left">Order #</th>
                <th className="p-4 m-4 text-left">Customer Name</th>
                <th className="p-4 m-4 text-left">Ticket Qty</th>
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
                    <td className="p-4 m-4">{order.tickets.length}</td>
                    <td className="p-4 m-4">{order.amountPaid}</td>
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
                      {" "}
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
                    </td>
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
      </div>
    </>
  );
};

export default RecentOrdersTable;

function FilterSelect({
  items,
  onSelect,
}: {
  onSelect: (value: string) => void;
  items: {
    title: string;
    value: string;
  }[];
}) {
  const [selectValue, setSelectValue] = useState(items[0].value);
  const [selectOpen, setSelectOpen] = useState(false);
  return (
    <div className="text-white relative">
      {/* SELECT DISPLAY */}
      <button
        className={
          "bg-[#151515] w-44 h-14 px-6 flex items-center gap-x-8 justify-between"
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
