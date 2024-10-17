import { cn } from "@/utils/cn";
import React, { ComponentProps, useCallback } from "react";
import { FiDownload } from "react-icons/fi";
import ErrorToast from "../toast/ErrorToast";
import html2canvas from "html2canvas";

export default function DownloadTicketButton({
  className,
  nodeId,
  ticketName,
  ...props
}: ComponentProps<"button"> & { nodeId: string; ticketName: string }) {
  const onDownload = useCallback(() => {
    const node = document.getElementById(nodeId);
    if (!node) {
      ErrorToast({
        title: "Download Error",
        descriptions: ["Error downloading ticket"],
      });
      return;
    }

    html2canvas(node).then((canvas) => {
      const data = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      // Safari iOS workaround to open the image in a new tab
      if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        window.open(data);
      } else {
        link.href = data;
        link.download = ticketName || "ticket";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }, [nodeId, ticketName]);

  return (
    <button
      className={cn(
        "bg-[#14171A] size-12 grid place-items-center rounded-full text-2xl",
        className
      )}
      {...props}
      onClick={() => onDownload()}
    >
      <FiDownload />
    </button>
  );
}
