import { cn } from "@/utils/cn";
import React, { ComponentProps, forwardRef } from "react";

const Input = forwardRef<
  HTMLInputElement,
  ComponentProps<"input"> & { variant?: "white" | "black" }
>(({ variant = "black", className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full text-input-color bg-input-bg p-4 border border-input-border",
        variant == "white" && "bg-white text-black",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
