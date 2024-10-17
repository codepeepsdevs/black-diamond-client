"use client";

import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { RiAppsLine } from "react-icons/ri";
import { CgFileDocument } from "react-icons/cg";
import Link from "next/link";
import {
  FaCalendar,
  FaChevronRight,
  FaEnvelope,
  FaRegCalendar,
  FaUserClock,
} from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { LuSettings } from "react-icons/lu";
import { motion } from "framer-motion";

type SidebarLink = { title: string; Icon: IconType; href: string };
const sidebarLinks: SidebarLink[] = [
  {
    title: "Dashboard",
    href: "/admin",
    Icon: RiAppsLine,
  },
  {
    title: "Order List",
    href: "/admin/order-list",
    Icon: CgFileDocument,
  },
  {
    title: "Events",
    href: "/admin/events",
    Icon: FaRegCalendar,
  },
  {
    title: "Users",
    href: "/admin/users",
    Icon: FaUserClock,
  },
  {
    title: "Email",
    href: "/admin/email",
    Icon: FaEnvelope,
  },
  // {
  //   title: "Site Settings",
  //   href: "/admin/site-settings",
  //   Icon: LuSettings,
  // },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <>
      <aside
        className={cn(
          "bg-[#121212] min-w-64 mt-24 pt-4 transition-transform relative",
          // mobile
          "max-md:absolute max-md:-translate-x-full max-md:h-full z-10",
          sidebarOpen && "max-md:translate-x-0"
        )}
      >
        {sidebarLinks.map((sidebarLink) => {
          const isRootPage = sidebarLink.href === "/admin";
          const isActive = isRootPage
            ? pathname === sidebarLink.href
            : pathname.startsWith(sidebarLink.href);

          return (
            <Link
              href={sidebarLink.href}
              key={sidebarLink.href}
              className={cn(
                "font-medium text-[#A3A7AA] hover:bg-[#333] transition-colors flex items-center gap-x-3 py-4 pl-8 border-l-4 border-l-transparent",
                isActive && "bg-black border-l-white"
              )}
            >
              <sidebarLink.Icon className="text-2xl" />
              <div>{sidebarLink.title}</div>
            </Link>
          );
        })}

        <button
          onClick={() => setSidebarOpen((state) => !state)}
          className="text-black text-2xl fixed bg-[#C0C0C0] p-2 rounded-full top-0 -mt-3 right-0 translate-x-full"
        >
          <FaChevronRight
            className={cn(sidebarOpen && "rotate-180 transition-transform")}
          />
        </button>
      </aside>
    </>
  );
}
