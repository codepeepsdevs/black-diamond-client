"use client";

import { useGenerateOrderReport } from "@/api/order/order.queries";
import { AdminButton } from "@/components";
import OrderListTable from "@/components/orderList/OrderListTable";
import { DatePickerWithRange } from "@/components/shared/DatePickerWithRange";
import LoadingMessage from "@/components/shared/Loader/LoadingMessage";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { ErrorResponse } from "@/constants/types";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import { AxiosError } from "axios";
import { subMonths } from "date-fns";
import React from "react";
import { DateRange } from "react-day-picker";

export default function OrderListPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const onError = (e: AxiosError<ErrorResponse>) => {
    const errorMessage = getApiErrorMessage(e, "Error generating order report");
    ErrorToast({
      title: "Error",
      descriptions: errorMessage,
    });
  };

  const onSuccess = () => {
    SuccessToast({
      title: "Success",
      description: "Order report generated successfully",
    });
  };

  const {
    mutate: handleGenerateOrderReport,
    isPending: generateOrderReportPending,
  } = useGenerateOrderReport(onError, onSuccess);

  return (
    <section className="min-h-screen bg-black">
      <div className="mx-8 mt-20 pt-10 max-w-[1600px]">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Order List</h1>
          <p className="text-[#A3A7AA] text-sm">View, search and reconcile all orders. Filters are instantly applied.</p>
        </div>

        {/* Action bar */}
        <div className="mt-6 rounded-xl border border-[#262626] bg-[#0f0f0f] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Live data — updates on filter change
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <AdminButton
              onClick={() =>
                handleGenerateOrderReport({
                  startDate: date?.from,
                  endDate: date?.to,
                })
              }
              variant="ghost"
              className="font-medium whitespace-nowrap rounded-lg border border-[#262626] bg-[#1a1a1a] hover:bg-[#1e1e1e] px-4 py-2.5"
              disabled={generateOrderReportPending}
            >
              {generateOrderReportPending ? (
                <LoadingMessage>Generating…</LoadingMessage>
              ) : (
                "Generate order report"
              )}
            </AdminButton>
            <DatePickerWithRange selected={date} onSelect={setDate} mode="range" />
          </div>
        </div>

        {/* ORDER TABLE */}
        <div className="mt-6">
          <OrderListTable startDate={date?.from} endDate={date?.to} />
        </div>
        {/* END ORDER TABLE */}
      </div>
    </section>
  );
}
