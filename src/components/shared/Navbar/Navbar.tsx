"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo, MenuBurger, userProfile } from "../../../../public/icons";
import CustomButton from "../../buttons/CustomButton";
import { cn } from "@/utils/cn";
import { usePathname, useRouter } from "next/navigation";
import Menu from "./Menu";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import useScrolledAway from "@/hooks/useScrolledAway";
import { navItems } from "./data";
import Profile from "./Profile";
import { useGetUser } from "@/api/user/user.queries";

const Navbar = ({ className }: { className?: string }) => {
  const userQuery = useGetUser();
  const userData = userQuery.data?.data;
  const router = useRouter();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const pathname = usePathname();

  const isScrolledAway = useScrolledAway();

  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setShowMenu(false));

  return (
    <div className="relative">
      <nav
        className={cn(
          `bg-transparent sticky w-full flex items-center justify-between py-4 px-4 lg:px-10 ${
            isScrolledAway && "bg-black"
          }`,
          className
        )}
      >
        <div className="flex items-center gap-7">
          <Image
            className="cursor-pointer w-14 lg:w-16"
            src={Logo}
            alt="Logo"
            onClick={() => {
              router.push("/");
            }}
          />

          <div className="hidden md:flex items-center gap-5">
            {navItems.map((item, index) => {
              const isActive =
                item.url === "/"
                  ? pathname === item.url
                  : pathname.startsWith(item.url);

              // const isTickets = item.url === "/tickets";

              return (
                <Link
                  key={index}
                  href={item.url}
                  className={`text-text-color font-semibold ${
                    isActive ? "text-white" : ""
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            {/* {user && (
              <Link
                href={"/tickets"}
                className={`text-text-color font-semibold ${
                  pathname.startsWith("/tickets") ? "text-white" : ""
                }`}
              >
                Tickets
              </Link>
            )} */}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {userData ? (
            <Image
              className="block cursor-pointer"
              priority
              src={userProfile}
              alt="userProfile"
              onClick={() => {
                setShowMenu(false);
                setShowProfileMenu(!showProfileMenu);
              }}
            />
          ) : (
            <CustomButton
              className="hidden md:flex w-[94px] h-[40px] font-bold "
              content="LOG IN"
              onClick={() => {
                router.push("/login");
              }}
              styles={{
                boxShadow: "0px 2px 4px -2px #000000",
              }}
            />
          )}

          <div ref={menuRef}>
            <Image
              className="block md:hidden w-6"
              priority
              src={MenuBurger}
              alt="menu burger"
              onClick={() => {
                setShowProfileMenu(false);
                setShowMenu(!showMenu);
              }}
            />
            {showMenu ? (
              <Menu
                isOpen={showMenu}
                onClose={() => {
                  setShowMenu(false);
                }}
              />
            ) : null}

            {showProfileMenu ? (
              <Profile
                isOpen={showProfileMenu}
                onClose={() => {
                  setShowProfileMenu(false);
                }}
              />
            ) : null}
          </div>
        </div>
      </nav>
      {/* {toggle ? (
        <div className="md:hidden absolute top-0 left-0 h-screen w-full bg-black">
          <div className="flex flex-col items-start justify-start gap-5">
            <Link className="text-text-color font-semibold" href="/">
              Home
            </Link>
            <Link className="text-text-color font-semibold" href="/events">
              Events
            </Link>
            <Link className="text-text-color font-semibold" href="#">
              FAQs
            </Link>
            <Link className="text-text-color font-semibold" href="#">
              Contact us
            </Link>
          </div>
        </div>
      ) : null} */}
    </div>
  );
};

export default Navbar;
