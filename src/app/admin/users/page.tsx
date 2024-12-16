"use client";

import { downloadUsers } from "@/api/user/user.apis";
import { useDownloadUsers } from "@/api/user/user.queries";
import { AdminButton } from "@/components";
import LoadingMessage from "@/components/shared/Loader/LoadingMessage";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import UserListTable from "@/components/userListPage/UserListTable";
import { ErrorResponse } from "@/constants/types";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import { AxiosError } from "axios";
import React from "react";
import { FaAddressBook } from "react-icons/fa6";
import { FiPlusCircle } from "react-icons/fi";

export default function UserListPage() {
  const onDownloadError = (e: AxiosError<ErrorResponse>) => {
    const errorMessage = getApiErrorMessage(e, "Unable to export users");
    ErrorToast({
      title: "Download Error",
      descriptions: errorMessage,
    });
  };

  const onDownloadSuccess = async (
    data: Awaited<ReturnType<typeof downloadUsers>>
  ) => {
    SuccessToast({
      title: "Download success",
      description: "Users details successfully exported",
    });
  };
  const { mutate: handleDownloadUsers, isPending } = useDownloadUsers(
    onDownloadError,
    onDownloadSuccess
  );
  return (
    <section>
      <div className="mx-8 mt-20 pt-10">
        <h1 className="text-3xl font-semibold text-white">User List</h1>

        {/* TABLE ACTION BUTTONS */}
        <div className="flex items-center gap-x-6 justify-end my-4">
          {/* <AdminButton variant="ghost" className="flex items-center gap-x-2">
            <FiPlusCircle />
            <span>New User</span>
          </AdminButton> */}
          <AdminButton
            onClick={() => handleDownloadUsers()}
            disabled={isPending}
            variant="ghost"
            className="flex items-center gap-x-2 disabled:opacity-60"
          >
            {isPending ? (
              <LoadingMessage>Exporting User List..</LoadingMessage>
            ) : (
              <>
                <FaAddressBook />
                <span>Generate User List</span>
              </>
            )}
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
