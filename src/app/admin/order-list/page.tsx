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
    <section>
      <div className="mx-8 mt-20 pt-10">
        <h1 className="text-3xl font-semibold text-white">Order List</h1>
        <p className="text-[#A3A7AA] text-sm">View all your orders.</p>

        {/* TABLE ACTION BUTTONS */}
        <div className="flex items-center gap-x-6 justify-end my-4">
          <AdminButton
            onClick={() =>
              handleGenerateOrderReport({
                startDate: date?.from,
                endDate: date?.to,
              })
            }
            variant="ghost"
            className="font-medium"
            disabled={generateOrderReportPending}
          >
            {generateOrderReportPending ? (
              <LoadingMessage>Generating order report..</LoadingMessage>
            ) : (
              "Generate order report"
            )}
          </AdminButton>
          <DatePickerWithRange
            selected={date}
            onSelect={setDate}
            mode="range"
          />
        </div>
        {/* END TABLE ACTION BUTTONS */}

        {/* ORDER TABLE */}
        <OrderListTable startDate={date?.from} endDate={date?.to} />
        {/* END ORDER TABLE */}
      </div>
    </section>
  );
}
