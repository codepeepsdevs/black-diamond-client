"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/utils/tokenChecker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    const isExpired = isTokenExpired(token || "");

    if (!token || isExpired) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <main className="">{children}</main>
    </>
  );
}
