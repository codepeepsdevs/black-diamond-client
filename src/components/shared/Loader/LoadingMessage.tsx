import React, { ComponentProps } from "react";
import LoadingSvg from "./LoadingSvg";

export default function LoadingMessage({ children }: ComponentProps<"div">) {
  return (
    <div className="flex items-center gap-x-4">
      <LoadingSvg />
      <span className="text-white">{children}</span>
    </div>
  );
}
