"use client";

import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { RiAppsLine } from "react-icons/ri";
import { CgFileDocument } from "react-icons/cg";
import Link from "next/link";
import { FaChevronRight, FaEnvelope, FaRegCalendar, FaUserClock } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

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
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-10 md:hidden"
        />
      )}
      <aside
        className={cn(
          "bg-[#0a0a0a] border-r border-[#1e1e1e] w-64 shrink-0 flex flex-col transition-transform duration-200 ease-out",
          "sticky top-24 h-[calc(100vh-6rem)] self-start",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-20 max-md:h-screen max-md:pt-20",
          "max-md:-translate-x-full",
          sidebarOpen && "max-md:translate-x-0"
        )}
      >
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-medium tracking-widest uppercase text-[#5a5a5a]">Menu</p>
          {sidebarLinks.map((sidebarLink) => {
            const isRootPage = sidebarLink.href === "/admin";
            const isActive = isRootPage ? pathname === sidebarLink.href : pathname.startsWith(sidebarLink.href);

            return (
              <Link
                href={sidebarLink.href}
                key={sidebarLink.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors border border-transparent",
                  isActive
                    ? "bg-white text-black border-white shadow-sm"
                    : "text-[#A3A7AA] hover:bg-[#1a1a1a] hover:text-white hover:border-[#262626] hover:shadow-sm"
                )}
              >
                <sidebarLink.Icon
                  className={cn("size-[18px] shrink-0 transition-colors", isActive ? "text-black" : "text-[#6b6b6b] group-hover:text-white")}
                />
                <span className="truncate">{sidebarLink.title}</span>
                {isActive && <span className="ml-auto size-1.5 rounded-full bg-black/20" aria-hidden />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[#1e1e1e] mt-auto">
          <div className="rounded-lg bg-[#121212] border border-[#1e1e1e] px-3 py-3">
            <p className="text-xs font-medium text-white">Black Diamond</p>
            <p className="text-xs text-[#6b6b6b]">Admin panel</p>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setSidebarOpen((state) => !state)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarOpen}
          className="absolute -right-3 top-28 hidden max-md:flex size-8 rounded-full bg-[#1a1a1a] border border-[#262626] text-white shadow-lg place-items-center hover:bg-[#1e1e1e] hover:border-[#2a2a2a] transition-colors"
        >
          <FaChevronRight className={cn("size-3 transition-transform", sidebarOpen && "rotate-180")} />
        </button>
        {/* Desktop collapse hint - subtle */}
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          aria-label="Toggle sidebar"
          className="absolute -right-3 top-28 hidden md:grid place-items-center size-7 rounded-full bg-[#1a1a1a] border border-[#262626] text-white/60 hover:text-white shadow-md opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all md:hidden"
        >
          <FaChevronRight className="size-3" />
        </button>
      </aside>
    </>
  );
}
