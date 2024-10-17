"use client";

import { AdminButton } from "@/components";
import UserListTable from "@/components/userListPage/UserListTable";
import React from "react";
import { FaAddressBook } from "react-icons/fa6";
import { FiPlusCircle } from "react-icons/fi";

export default function UserListPage() {
  return (
    <section>
      <div className="mx-8 mt-20 pt-10">
        <h1 className="text-3xl font-semibold text-white">User List</h1>

        {/* TABLE ACTION BUTTONS */}
        <div className="flex items-center gap-x-6 justify-end my-4">
          <AdminButton variant="ghost" className="flex items-center gap-x-2">
            <FiPlusCircle />
            <span>New User</span>
          </AdminButton>
          <AdminButton variant="ghost" className="flex items-center gap-x-2">
            <FaAddressBook />
            <span>Generate User List</span>
          </AdminButton>
        </div>
        {/* END TABLE ACTION BUTTONS */}

        {/* ORDER TABLE */}
        <UserListTable />
        {/* END ORDER TABLE */}
      </div>
    </section>
  );
}
