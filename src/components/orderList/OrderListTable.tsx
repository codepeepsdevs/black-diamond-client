import React, { useEffect, useMemo, useState } from "react";
import Checkbox from "../shared/Checkbox";
import { FiChevronsLeft, FiChevronsRight, FiRefreshCw, FiSearch, FiX } from "react-icons/fi";
import { OptionProps, Order } from "@/constants/types";
import {
  useBulkReconcileOrders,
  useGetOrders,
  useReconcileSingleOrder,
} from "@/api/order/order.queries";
import { useAdminGetEvents } from "@/api/events/events.queries";
import { FaSortDown } from "react-icons/fa6";
import * as dateFns from "date-fns";
import { cn } from "@/utils/cn";
import { parseAsInteger, useQueryState } from "nuqs";
import LoadingMessage from "../shared/Loader/LoadingMessage";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import ErrorToast from "../toast/ErrorToast";
import SuccessToast from "../toast/SuccessToast";

type OrderListTableProps = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  eventId?: string;
  hideEventFilter?: boolean;
};

const OrderListTable = ({ startDate, endDate, eventId: lockedEventId, hideEventFilter }: OrderListTableProps) => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [eventFilter, setEventFilter] = useState<OptionProps["eventStatus"]>("all");
  const [selectedEventId, setSelectedEventId] = useState<string>(lockedEventId ?? "");
  const [paymentFilter, setPaymentFilter] = useState<OptionProps["paymentStatus"]>("all");
  const [statusFilter, setStatusFilter] = useState<OptionProps["status"]>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // keep selectedEventId in sync if lockedEventId changes
  useEffect(() => {
    if (lockedEventId) setSelectedEventId(lockedEventId);
  }, [lockedEventId]);

  // debounce search 400ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const hasActiveFilters =
    eventFilter !== "all" ||
    paymentFilter !== "all" ||
    statusFilter !== "all" ||
    !!selectedEventId ||
    !!debouncedSearch;

  // fetch events for dropdown (only when not locked)
  const eventsFilterOpt = useMemo(() => ({ limit: 50, search: "" }) as OptionProps, []);
  const eventsQuery = useAdminGetEvents(
    !lockedEventId && !hideEventFilter ? eventsFilterOpt : undefined
  );
  const eventsData = (eventsQuery as any)?.data?.data?.events ?? (eventsQuery as any)?.data?.data ?? [];

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const orderListQuery = useGetOrders({
    eventStatus: lockedEventId ? undefined : eventFilter === "all" ? undefined : eventFilter,
    eventId: lockedEventId || selectedEventId || undefined,
    paymentStatus: paymentFilter === "all" ? undefined : paymentFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: debouncedSearch || undefined,
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

  // Clear selection & reset to page 1 on filter change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, eventFilter, selectedEventId, paymentFilter, statusFilter, debouncedSearch, startDate, endDate]);

  useEffect(() => {
    // when filters change, reset page to 1 (but avoid loop on initial page=1)
    // we do it via effect that watches filters -> setPage(1) if page !==1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (setter: (v: any) => void) => (v: any) => {
    setter(v);
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handleClearAll = () => {
    setEventFilter("all");
    if (!lockedEventId) setSelectedEventId("");
    setPaymentFilter("all");
    setStatusFilter("all");
    handleSearchClear();
    setPage(1);
  };

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
      {/* FILTER BAR */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A7AA] text-sm pointer-events-none" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search order, customer, event, email…"
              className="bg-[#151515] text-white placeholder-[#6b6b6b] pl-9 pr-9 py-3 w-72 text-sm border border-transparent focus:border-[#2a2a2a] focus:outline-none"
            />
            {searchInput && (
              <button
                onClick={handleSearchClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A7AA] hover:text-white"
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>

          {!lockedEventId && !hideEventFilter && (
            <>
              <FilterSelect
                onSelect={handleFilterChange(setEventFilter)}
                value={eventFilter as string}
                items={[
                  { title: "All Events", value: "all" },
                  { title: "Past Events", value: "past" },
                  { title: "Upcoming Events", value: "upcoming" },
                ]}
              />
              {/* Event selector */}
              <div className="relative">
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    setPage(1);
                  }}
                  className="bg-[#151515] text-white w-56 h-12 px-3 pr-8 text-sm border border-transparent focus:border-[#2a2a2a] focus:outline-none appearance-none"
                >
                  <option value="">All events (by ID)</option>
                  {Array.isArray(eventsData) &&
                    eventsData.slice(0, 50).map((ev: any) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name?.slice(0, 32) ?? ev.id}
                      </option>
                    ))}
                </select>
                <FaSortDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60 -mt-1" />
              </div>
            </>
          )}

          <FilterSelect
            onSelect={handleFilterChange(setPaymentFilter)}
            value={paymentFilter as string}
            items={[
              { title: "Any Payment", value: "all" },
              { title: "Paid", value: "SUCCESSFUL" },
              { title: "Not Paid", value: "PENDING" },
              { title: "Failed", value: "FAILED" },
            ]}
          />

          <FilterSelect
            onSelect={handleFilterChange(setStatusFilter)}
            value={statusFilter as string}
            items={[
              { title: "Any Order Status", value: "all" },
              { title: "Completed", value: "COMPLETED" },
              { title: "Pending", value: "PENDING" },
              { title: "Cancelled", value: "CANCELLED" },
            ]}
          />

          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-sm text-[#A3A7AA] hover:text-white px-3 py-2 border border-[#2a2a2a] bg-[#151515]"
            >
              Clear filters
            </button>
          )}

          {orderListQuery.isFetching && !orderListQuery.isPending && (
            <span className="text-xs text-[#A3A7AA] flex items-center gap-2">
              <FiRefreshCw className="animate-spin" /> Updating…
            </span>
          )}
        </div>
        {debouncedSearch && searchInput !== debouncedSearch && (
          <span className="text-xs text-[#6b6b6b]">Typing…</span>
        )}
      </div>
      {/* END FILTER BAR */}

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
                  <td colSpan={10} className="h-24 text-center">
                    <span className="inline-flex items-center gap-2">
                      <FiRefreshCw className="animate-spin" /> Loading orders..
                    </span>
                  </td>
                </tr>
              ) : orderListQuery.isError ? (
                <tr>
                  <td colSpan={10} className="h-24 text-center text-red-400">
                    Failed to load orders.{" "}
                    <button
                      onClick={() => orderListQuery.refetch()}
                      className="underline hover:text-red-300"
                    >
                      Retry
                    </button>
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
                    <td className="p-4 m-4 font-mono text-xs max-w-[140px] truncate" title={order.id}>{order.id}</td>
                    <td className="p-4 m-4">
                      {order.firstName} {order.lastName}
                    </td>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="h-24 text-center">
                    No results{hasActiveFilters ? " for current filters" : ""}.
                    {hasActiveFilters && (
                      <button onClick={handleClearAll} className="ml-2 underline text-white hover:text-[#A3A7AA]">
                        Clear filters
                      </button>
                    )}
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
              className="size-10 rounded-lg bg-[#151515] text-2xl grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed"
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
            <div className="h-10 min-w-10 rounded-lg bg-[#757575] grid place-items-center text-white text-sm px-3">
              {page}
            </div>
            <button
              className="size-10 rounded-lg bg-[#151515] text-2xl grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed"
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
                {orderListData.ordersCount > 50 && (
                  <span className="text-[#A3A7AA] text-xs ml-2">(capped page size 50 for performance)</span>
                )}
              </div>
            ) : null
          ) : null}
        </div>
      </div>
    </>
  );
};

export default OrderListTable;

type FilterSelectProps = {
  items: { title: string; value: string }[];
  onSelect: (value: any) => void;
  value?: string;
};

function FilterSelect({ items, onSelect, value }: FilterSelectProps) {
  const [selectOpen, setSelectOpen] = useState(false);
  const current = value ?? items[0].value;
  return (
    <div className="text-white relative inline-block z-[1]">
      <button
        className="bg-[#151515] min-w-36 h-12 px-4 flex items-center gap-x-3 justify-between border border-transparent focus:border-[#2a2a2a] focus:outline-none"
        onClick={() => setSelectOpen((state) => !state)}
      >
        <span className="text-sm whitespace-nowrap">{items.find((item) => item.value === current)?.title ?? items[0].title}</span>
        <FaSortDown className="-mt-2 shrink-0" />
      </button>
      <div
        className={cn(
          "bg-[#151515] border border-black flex-col inline-flex divide-y divide-[#2a2a2a] min-w-36 absolute top-12 mt-2 right-0 overflow-hidden shadow-lg",
          selectOpen ? "h-max" : "h-0"
        )}
      >
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => {
              onSelect(item.value);
              setSelectOpen(false);
            }}
            className={cn(
              "px-6 py-3 hover:bg-[#2c2b2b] text-sm text-left whitespace-nowrap",
              current === item.value && "bg-[#2c2b2b] text-white"
            )}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
