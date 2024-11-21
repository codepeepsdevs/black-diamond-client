"use client";

import { useGetUser } from "@/api/user/user.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { isTokenExpired } from "@/utils/tokenChecker";
import { parseAsString, useQueryState } from "nuqs";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userQuery = useGetUser();
  const user = userQuery.data?.data;
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = encodeURIComponent(pathname);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    const isExpired = isTokenExpired(token || "");

    if (!token || isExpired) {
      ErrorToast({
        title: "Authentication Error",
        descriptions: ["User must be logged in to view orders/tickets"],
      });
      router.push(`/login?redirectUrl=${currentPath}`);
    }
  }, [pathname]);

  if (userQuery.isFetched && userQuery.data?.status === 401) {
    ErrorToast({
      title: "Authentication Error",
      descriptions: ["User must be logged in to view orders/tickets"],
    });

    return router.push(`/login?redirectUrl=${currentPath}`);
  }
  return (
    <div className="bg-black my-[4rem] sm:my-[6rem] px-5 lg:px-10 py-8">
      {children}
    </div>
  );
}
