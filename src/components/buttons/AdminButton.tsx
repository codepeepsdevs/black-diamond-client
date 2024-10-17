import { cn } from "@/utils/cn";
import React, { ComponentProps } from "react";

export default function AdminButton({
  children,
  className,
  variant = "ghost",
  ...props
}: ComponentProps<"button"> & {
  variant?: "primary" | "ghost" | "outline";
}) {
  return (
    <button
      className={cn(
        "h-12 rounded-lg px-4 text-center leading-5",
        variant == "primary"
          ? "bg-[#4267B2] text-white"
          : variant == "outline"
            ? "bg-transparent outline outline-1 text-white outline-white hover:bg-[#111] transition-colors"
            : "bg-button-bg text-black",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
