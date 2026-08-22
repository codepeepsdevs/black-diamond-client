"use client";

import React, { ComponentProps, useEffect, useState } from "react";
import AdminSidebar from "@/components/shared/AdminSidebar";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog";
import { MdGppBad } from "react-icons/md";
import { AdminButton } from "@/components";
import LoadingMessage from "@/components/shared/Loader/LoadingMessage";
import { useGetUser } from "@/api/user/user.queries";
import Loading from "../loading";
import { isAdminOrViewer, isReadOnly } from "@/utils/roleHelpers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const userQuery = useGetUser();
  const userData = userQuery.data?.data;

  useEffect(() => {
    if (userQuery.isPending) {
      return;
    }
    if (!isAdminOrViewer(userData?.role || "")) {
      setShowDialog(true);
    }
  }, [userData, userQuery.isPending]);
  if (userQuery.isPending) {
    return <Loading />;
  }
  return (
    <>
      {/* {userQuery.isPending && (
        <div className="min-h-48 flex items-center container">
          <LoadingMessage className="text-4xl">
            Loading admin dashboard.
          </LoadingMessage>
        </div>
      )} */}
      {isAdminOrViewer(userData?.role || "") && (
        <div className={`flex min-h-[50vh] `}>
          <AdminSidebar />
          {/* The min-w-0 is to prevent the contents of the container from overflowing */}
          <div className="flex-1 min-w-0 max-w-screen-xl mx-auto">
            {isReadOnly(userData?.role || "") && (
              <div className="mx-8 mt-20 pt-10 mb-4">
                <div className="bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-300 px-4 py-3 rounded">
                  <p className="text-sm font-medium">
                    You are in read-only mode. You can view all data but cannot make changes.
                  </p>
                </div>
              </div>
            )}
            {children}
          </div>
        </div>
      )}

      <UnauthorizedDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
}

function UnauthorizedDialog({ ...props }: ComponentProps<typeof Dialog>) {
  const router = useRouter();
  return (
    <Dialog {...props} modal={true}>
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <DialogContent className="relative bg-[#333333] text-[#A3A7AA] p-6 mx-auto py-9 max-w-lg">
            <div className="bg-red-500 text-white size-24 mx-auto rounded-full grid place-items-center">
              <MdGppBad className="text-4xl" />
            </div>

            <div className="text-white text-2xl lg:text-4xl font-medium text-center mt-16">
              Unauthorized access
            </div>

            <div className="text-center my-6 space-y-4">
              <p className="text-white text-base lg:text-xl">
                User not authorized to visit this page{" "}
              </p>
              {/* <p className="text-text-color text-sm lg:text-base">
                This is a protected page
              </p> */}
            </div>

            <div className="flex justify-center">
              <AdminButton
                variant="outline"
                className=""
                onClick={() => router.push("/")}
              >
                GO BACK
              </AdminButton>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
