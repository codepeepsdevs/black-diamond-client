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
  FiRefreshCw,
} from "react-icons/fi";
import { OptionProps, Order } from "@/constants/types";
import {
  useBulkReconcileOrders,
  useGetOrders,
  useReconcileSingleOrder,
} from "@/api/order/order.queries";
import { FaSort, FaSortDown } from "react-icons/fa6";
import * as dateFns from "date-fns";
import { cn } from "@/utils/cn";
import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";
import LoadingMessage from "../shared/Loader/LoadingMessage";
import toast from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "../shared/Popover";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import ErrorToast from "../toast/ErrorToast";
import SuccessToast from "../toast/SuccessToast";

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const orderListQuery = useGetOrders({
    eventStatus: eventFilter,
    page,
    limit: 10,
    startDate,
    endDate,
  });
  const orderListData = orderListQuery.data?.data;

  const pendingOrdersOnPage =
    orderListData?.orders.filter((o) => o.paymentStatus === "PENDING") ?? [];
  const allPendingSelected =
    pendingOrdersOnPage.length > 0 &&
    pendingOrdersOnPage.every((o) => selectedIds.has(o.id));

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllPending = () => {
    if (allPendingSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pendingOrdersOnPage.forEach((o) => next.delete(o.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pendingOrdersOnPage.forEach((o) => next.add(o.id));
        return next;
      });
    }
  };

  // Clear selection on page/filter change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, eventFilter, startDate, endDate]);

  const onBulkError = (e: any) => {
    ErrorToast({
      title: "Reconcile failed",
      descriptions: getApiErrorMessage(e, "Failed to reconcile orders"),
    });
  };
  const onBulkSuccess = (res: any) => {
    const summary = res.data.summary;
    const verified = summary.verified;
    const skipped = summary.skipped;
    const failed = summary.error;
    const parts: string[] = [];
    if (verified > 0) parts.push(`${verified} payment${verified > 1 ? "s" : ""} confirmed — emails sent`);
    if (skipped > 0) parts.push(`${skipped} still pending (no payment found)`);
    if (failed > 0) parts.push(`${failed} failed to check`);
    const description = parts.length ? parts.join(". ") + "." : "No changes.";
    if (verified > 0) {
      SuccessToast({
        title: "Success!",
        description,
      });
    } else {
      ErrorToast({
        title: "Nothing confirmed",
        descriptions: [description],
        variant: "info",
      });
    }
    setSelectedIds(new Set());
  };

  const { mutate: bulkReconcile, isPending: bulkPending } =
    useBulkReconcileOrders(onBulkError, onBulkSuccess);

  const { mutate: reconcileOne, isPending: singlePending } =
    useReconcileSingleOrder(onBulkError, onBulkSuccess);

  const loadingToastRef = React.useRef<string | undefined>(undefined);
  useEffect(() => {
    if (orderListQuery.isFetching && !loadingToastRef.current) {
      loadingToastRef.current = toast.loading("Order table data loading");
    } else if (!orderListQuery.isFetching && loadingToastRef.current) {
      toast.dismiss(loadingToastRef.current);
      loadingToastRef.current = undefined;
    }
    return () => {
      if (loadingToastRef.current) {
        toast.dismiss(loadingToastRef.current);
        loadingToastRef.current = undefined;
      }
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

      {/* BULK ACTION BAR */}
      {selectedIds.size > 0 && (
        <div className="mt-4 flex items-center justify-between bg-[#1e1e1e] border border-[#2a2a2a] px-4 py-3">
          <span className="text-white text-sm">
            {selectedIds.size} pending order{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-sm text-[#A3A7AA] hover:text-white px-3 py-1.5"
            >
              Clear
            </button>
            <button
              onClick={() => bulkReconcile({ orderIds: Array.from(selectedIds) })}
              disabled={bulkPending || selectedIds.size > 100}
              className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {bulkPending ? (
                <>
                  <FiRefreshCw className="animate-spin" /> Confirming...
                </>
              ) : (
                <>Confirm Payments</>
              )}
            </button>
          </div>
        </div>
      )}
      {selectedIds.size > 100 && (
        <p className="text-xs text-amber-400 mt-2">Max 100 orders per bulk request. Deselect some.</p>
      )}

      <div className="text-[#A3A7AA] mt-6">
        <div className="overflow-x-auto">
          <table className="w-full bg-[#151515] whitespace-nowrap">
            <thead>
              <tr className="border-b border-b-[#A3A7AA] text-white">
                <th className="p-4 m-4 text-left">
                  <Checkbox
                    checked={allPendingSelected}
                    onChange={toggleAllPending}
                    disabled={pendingOrdersOnPage.length === 0}
                    aria-label="Select all pending on page"
                  />
                </th>
                <th className="p-4 m-4 text-left">Date</th>
                <th className="p-4 m-4 text-left">Event Name</th>
                <th className="p-4 m-4 text-left">Order ID</th>
                <th className="p-4 m-4 text-left">Customer Name</th>
                {/* <th className="p-4 m-4 text-left">Phone No.</th> */}
                <th className="p-4 m-4 text-left">Ticket</th>
                <th className="p-4 m-4 text-left">Amount</th>
                <th className="p-4 m-4 text-left">Payment Status</th>
                <th className="p-4 m-4 text-left">Order Status</th>
                <th className="p-4 m-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderListQuery.isPending ? (
                <tr>
                  <td colSpan={8} className="h-24 text-center">
                    Loading orders..
                  </td>
                </tr>
              ) : orderListData?.orders && orderListData.orders.length > 0 ? (
                orderListData.orders.map((order) => (
                  <tr key={order.id} className="odd:bg-black">
                    <td className="p-4 m-4">
                      {order.paymentStatus === "PENDING" ? (
                        <Checkbox
                          checked={selectedIds.has(order.id)}
                          onChange={() => toggleOne(order.id)}
                          aria-label={`Select order ${order.id}`}
                        />
                      ) : (
                        <span className="opacity-20">—</span>
                      )}
                    </td>
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
                    {/* <td className="p-4 m-4">{order.phone}</td> */}
                    <td className="p-4 m-4">{order.tickets.length}</td>
                    <td className="p-4 m-4">
                      ${Number(order.amountPaid).toFixed(2) ?? 0}
                    </td>
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
                    <td className="p-4 m-4">
                      {order.paymentStatus === "PENDING" ? (
                        <button
                          onClick={() => reconcileOne(order.id)}
                          disabled={singlePending || bulkPending}
                          className="text-xs bg-[#2a2a2a] hover:bg-[#333] text-white px-3 py-1.5 rounded disabled:opacity-50 flex items-center gap-1.5"
                          title="Verify with Stripe - if paid, mark SUCCESSFUL and send confirmation email"
                        >
                          <FiRefreshCw
                            className={cn(singlePending && "animate-spin")}
                          />
                          Confirm
                        </button>
                      ) : (
                        <span className="text-xs text-[#555]">—</span>
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
                  <td colSpan={10} className="h-24 text-center">
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
