"use client";

import { AdminButton } from "@/components";
import OrderListTable from "@/components/orderList/OrderListTable";
import React from "react";

export default function OrderListPage() {
  return (
    <section>
      <div className="mx-8 mt-20 pt-10">
        <h1 className="text-3xl font-semibold text-white">Order List</h1>
        <p className="text-[#A3A7AA] text-sm">View all your orders.</p>

        {/* TABLE ACTION BUTTONS */}
        {/* TODO: Generate pdf on the backend for download */}
        <div className="flex items-center gap-x-6 justify-end my-4">
          <AdminButton variant="ghost">Generate order report</AdminButton>
        </div>
        {/* END TABLE ACTION BUTTONS */}

        {/* ORDER TABLE */}
        <OrderListTable />
        {/* END ORDER TABLE */}
      </div>
    </section>
  );
}
