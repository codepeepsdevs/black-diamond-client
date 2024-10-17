import { cn } from "@/utils/cn";
import React, { ComponentProps } from "react";

function SubmitButton({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "button-transform capitalize bg-button-bg text-black font-bold px-8 py-3 text-sm lg:text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default SubmitButton;
