"use client";

import { cn } from "@/utils/cn";
import React, { ComponentProps, forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordInput = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    return (
      <div className="flex items-center bg-white text-black border border-[#333333]">
        <input
          type={passwordVisible ? "text" : "password"}
          ref={ref}
          className={cn("w-full text-black text-base bg-white p-4", className)}
          {...props}
        />
        <button
          type="button"
          className="aspect-square border-none text-black px-4"
          onClick={() => setPasswordVisible((state) => !state)}
        >
          {!passwordVisible && <FiEye />}
          {passwordVisible && <FiEyeOff />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
