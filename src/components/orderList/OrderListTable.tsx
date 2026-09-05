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

  const eventOptions = useMemo(() => {
    const base = [{ title: "All events", value: "" }];
    if (Array.isArray(eventsData)) {
      eventsData.slice(0, 50).forEach((ev: any) => {
        base.push({ title: ev.name ?? ev.id.slice(0, 8), value: ev.id });
      });
    }
    return base;
  }, [eventsData]);

  return (
    <>
      {/* FILTER BAR */}
      <div className="rounded-xl border border-[#262626] bg-[#0f0f0f] p-4 space-y-4">
        {/* Search row */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b6b6b] text-sm pointer-events-none" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by order ID, customer, event, email or phone…"
              className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg text-white placeholder-[#6b6b6b] pl-10 pr-9 py-2.5 text-sm focus:border-[#333] focus:bg-[#1e1e1e] focus:outline-none transition-colors"
            />
            {searchInput ? (
              <button
                onClick={handleSearchClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-6 rounded-md bg-white/10 hover:bg-white/15 text-white/60 hover:text-white grid place-items-center transition-colors"
                aria-label="Clear search"
              >
                <FiX className="size-3.5" />
              </button>
            ) : debouncedSearch && searchInput !== debouncedSearch ? (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b6b6b]">Typing…</span>
            ) : null}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="text-sm text-[#A3A7AA] hover:text-white px-4 py-2.5 rounded-lg border border-[#262626] bg-[#1a1a1a] hover:bg-[#1e1e1e] transition-colors"
              >
                Clear filters
              </button>
            )}
            {orderListQuery.isFetching && !orderListQuery.isPending && (
              <span className="text-xs text-[#A3A7AA] flex items-center gap-1.5 px-2">
                <FiRefreshCw className="animate-spin size-3.5" /> Updating
              </span>
            )}
          </div>
        </div>

        {/* Filter grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {!lockedEventId && !hideEventFilter ? (
            <>
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium tracking-widest uppercase text-[#6b6b6b]">Event Period</span>
                <FilterSelect
                  onSelect={handleFilterChange(setEventFilter)}
                  value={eventFilter as string}
                  items={[
                    { title: "All Periods", value: "all" },
                    { title: "Past Events", value: "past" },
                    { title: "Upcoming Events", value: "upcoming" },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium tracking-widest uppercase text-[#6b6b6b]">Specific Event</span>
                <FilterSelect
                  onSelect={(v: string) => {
                    setSelectedEventId(v);
                    setPage(1);
                  }}
                  value={selectedEventId}
                  items={eventOptions}
                  placeholder="All events"
                />
              </div>
            </>
          ) : (
            <>
              <div className="hidden lg:block" />
              <div className="hidden lg:block" />
            </>
          )}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium tracking-widest uppercase text-[#6b6b6b]">Payment</span>
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
          </div>
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium tracking-widest uppercase text-[#6b6b6b]">Order Status</span>
            <FilterSelect
              onSelect={handleFilterChange(setStatusFilter)}
              value={statusFilter as string}
              items={[
                { title: "Any Status", value: "all" },
                { title: "Completed", value: "COMPLETED" },
                { title: "Pending", value: "PENDING" },
                { title: "Cancelled", value: "CANCELLED" },
              ]}
            />
          </div>
        </div>
        {(lockedEventId || selectedEventId) && (
          <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
            <span className="size-2 rounded-full bg-emerald-500/60" />
            Filtered to single event
            {!lockedEventId && (
              <button onClick={() => { setSelectedEventId(""); setPage(1); }} className="text-white/70 hover:text-white underline underline-offset-2">
                show all
              </button>
            )}
          </div>
        )}
      </div>
      {/* END FILTER BAR */}

      {/* BULK ACTION BAR */}
      {selectedIds.size > 0 && (
        <div className="mt-4 flex items-center justify-between bg-[#1e1e1e] border border-[#262626] rounded-xl px-4 py-3">
          <span className="text-white text-sm">
            {selectedIds.size} pending order{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-sm text-[#A3A7AA] hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => bulkReconcile({ orderIds: Array.from(selectedIds) })}
              disabled={bulkPending || selectedIds.size > 100}
              className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-zinc-100 transition-colors"
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

      <div className="mt-6 rounded-xl border border-[#262626] overflow-hidden bg-[#0f0f0f]">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-[#1a1a1a]">
              <tr className="text-[#6b6b6b] text-xs uppercase tracking-widest">
                <th className="p-3 text-left font-medium w-12">
                  <Checkbox
                    checked={allPendingSelected}
                    onChange={toggleAllPending}
                    disabled={pendingOrdersOnPage.length === 0}
                    aria-label="Select all pending on page"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Event Name</th>
                <th className="px-4 py-3 text-left font-medium">Order ID</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Tickets</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Payment</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {orderListQuery.isPending ? (
                <tr>
                  <td colSpan={10} className="h-24 text-center text-[#6b6b6b]">
                    <span className="inline-flex items-center gap-2 text-sm">
                      <FiRefreshCw className="animate-spin" /> Loading orders…
                    </span>
                  </td>
                </tr>
              ) : orderListQuery.isError ? (
                <tr>
                  <td colSpan={10} className="h-24 text-center text-red-400 text-sm">
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
                  <tr key={order.id} className="hover:bg-[#1a1a1a]/70 transition-colors group">
                    <td className="px-4 py-3">
                      {order.paymentStatus === "PENDING" ? (
                        <Checkbox
                          checked={selectedIds.has(order.id)}
                          onChange={() => toggleOne(order.id)}
                          aria-label={`Select order ${order.id}`}
                        />
                      ) : (
                        <span className="text-[#333]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white text-sm leading-tight">{dateFns.format(new Date(order.createdAt), "dd MMM yyyy")}</div>
                      <div className="text-[#6b6b6b] text-xs">{dateFns.format(new Date(order.createdAt), "hh:mm a")}</div>
                    </td>
                    <td className="px-4 py-3 max-w-[220px] truncate text-white text-sm" title={order.event.name}>{order.event.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-white/80 max-w-[140px] truncate" title={order.id}>{order.id}</td>
                    <td className="px-4 py-3 text-white text-sm whitespace-nowrap">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex size-6 rounded-full bg-[#1e1e1e] text-white text-xs font-medium place-items-center justify-center">
                        {order.tickets.length}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white text-sm font-medium">${Number(order.amountPaid).toFixed(2) ?? 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                          order.paymentStatus === "SUCCESSFUL"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : order.paymentStatus === "FAILED"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full mr-1.5", order.paymentStatus === "SUCCESSFUL" ? "bg-emerald-400" : order.paymentStatus === "FAILED" ? "bg-red-400" : "bg-amber-400")} />
                        {order.paymentStatus === "SUCCESSFUL" ? "Paid" : order.paymentStatus === "FAILED" ? "Failed" : "Not Paid"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {order.paymentStatus === "SUCCESSFUL" ? (
                        <span
                          className={cn(
                            "inline-flex px-2.5 py-1 rounded-full text-xs font-medium border",
                            order.status === "COMPLETED"
                              ? "bg-white text-black border-white"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          )}
                        >
                          {order.status === "COMPLETED" ? "Successful" : "Pending"}
                        </span>
                      ) : (
                        <span className="text-[#555] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order.paymentStatus === "PENDING" ? (
                        <button
                          onClick={() => reconcileOne(order.id)}
                          disabled={singlePending || bulkPending}
                          className="text-xs bg-[#212121] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white px-3 py-1.5 rounded-lg disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                          title="Verify with Stripe - if paid, mark SUCCESSFUL and send confirmation email"
                        >
                          <FiRefreshCw className={cn("size-3", singlePending && "animate-spin")} />
                          Confirm
                        </button>
                      ) : (
                        <span className="text-xs text-[#444]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="h-24 text-center text-[#6b6b6b] text-sm">
                    No results{hasActiveFilters ? " for current filters" : ""}.
                    {hasActiveFilters && (
                      <button onClick={handleClearAll} className="ml-2 underline decoration-white/20 underline-offset-4 text-white hover:text-[#A3A7AA] text-sm">
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 bg-[#0f0f0f] border-t border-[#1e1e1e]">
          <div className="text-sm text-[#A3A7AA]">
            {orderListQuery.isFetching ? (
              <span className="inline-flex items-center gap-2">
                <FiRefreshCw className="animate-spin size-3.5" /> Loading…
              </span>
            ) : orderListData?.ordersCount ? (
              <span>
                Showing <span className="text-white font-medium">{page * 10 - 9}–{isLast ? orderListData.ordersCount : page * 10}</span> of{" "}
                <span className="text-white font-medium">{orderListData.ordersCount}</span>
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="size-8 rounded-lg bg-[#1a1a1a] border border-[#262626] hover:bg-[#1e1e1e] text-white grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              onClick={() =>
                setPage((prev) => {
                  if (prev <= 1) return 1;
                  return prev - 1;
                })
              }
              disabled={page == 1}
              aria-label="Previous page"
            >
              <FiChevronsLeft className="size-4" />
            </button>
            <div className="h-8 min-w-8 rounded-lg bg-white text-black grid place-items-center text-sm font-medium px-3">
              {page}
            </div>
            <button
              className="size-8 rounded-lg bg-[#1a1a1a] border border-[#262626] hover:bg-[#1e1e1e] text-white grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isLast}
              aria-label="Next page"
            >
              <FiChevronsRight className="size-4" />
            </button>
          </div>
        </div>
        {/* END TABLE FOOTER */}
      </div>
    </>
  );
};

export default OrderListTable;

type FilterSelectProps = {
  items: { title: string; value: string }[];
  onSelect: (value: any) => void;
  value?: string;
  placeholder?: string;
};

function FilterSelect({ items, onSelect, value, placeholder }: FilterSelectProps) {
  const [selectOpen, setSelectOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const current = value !== undefined ? value : items[0]?.value;
  const currentLabel = items.find((item) => item.value === current)?.title ?? placeholder ?? items[0]?.title ?? "";
  useEffect(() => {
    if (!selectOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setSelectOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setSelectOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectOpen(false);
    };
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [selectOpen]);
  return (
    <div ref={ref} className="text-white relative w-full">
      <button
        className="w-full bg-[#1a1a1a] hover:bg-[#1e1e1e] border border-[#262626] rounded-lg h-10 px-3 flex items-center gap-x-2 justify-between focus:outline-none focus:border-[#333] focus:ring-1 focus:ring-white/5 transition-colors text-left"
        onClick={() => setSelectOpen((state) => !state)}
        aria-expanded={selectOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm whitespace-nowrap truncate pr-2" title={currentLabel}>{currentLabel}</span>
        <FaSortDown className={cn("-mt-1 shrink-0 size-3 transition-transform", selectOpen ? "rotate-180 text-white/60" : "text-white/40")} />
      </button>
      <div
        role="listbox"
        className={cn(
          "bg-[#1c1c1c] border border-[#262626] rounded-lg flex flex-col divide-y divide-[#262626] min-w-full w-max max-w-[min(380px,calc(100vw-2rem))] absolute top-[44px] left-0 shadow-xl z-20 max-h-64 overflow-y-auto overflow-x-hidden",
          selectOpen ? "flex" : "hidden"
        )}
      >
        {items.map((item) => (
          <button
            key={`${item.value}-${item.title}`}
            role="option"
            aria-selected={current === item.value}
            title={item.title}
            onClick={() => {
              onSelect(item.value);
              setSelectOpen(false);
            }}
            className={cn(
              "px-3 py-2.5 hover:bg-[#252525] text-sm text-left whitespace-normal break-words leading-snug transition-colors w-full",
              current === item.value ? "bg-[#252525] text-white font-medium" : "text-[#A3A7AA]"
            )}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
