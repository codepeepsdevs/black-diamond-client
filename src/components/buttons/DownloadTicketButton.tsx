import { cn } from "@/utils/cn";
import React, { ComponentProps, useCallback } from "react";
import { FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import { toPng } from "html-to-image";

export default function DownloadTicketButton({
  className,
  nodeId,
  ticketName,
  ...props
}: ComponentProps<"button"> & { nodeId: string; ticketName: string }) {
  const onDownload = async () => {
    const loadingToastId = toast.loading(
      "Preparing your ticket.. please wait.."
    );
    const node = document.getElementById(nodeId);
    if (!node) {
      toast.error("Error downloading ticket", { id: loadingToastId });
      return;
    }

    toPng(node)
      .then((ticketImage) => {
        const link = document.createElement("a");

        link.href = ticketImage;
        link.download = ticketName || "ticket";

        // For non-iOS Safari, open in a new tab
        const isIOS =
          /iPad|iPhone|iPod/.test(navigator.userAgent) &&
          /Safari/.test(navigator.userAgent) &&
          !/Chrome/.test(navigator.userAgent);
        if (!isIOS) {
          link.target = "_blank";
        }

        // Simulate a click on the link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Ticket successfully generated", { id: loadingToastId });
      })
      .catch((e) => {
        toast.error("Error downloading ticket", { id: loadingToastId });
      })
      .finally(() => {
        toast.dismiss(loadingToastId);
      });
  };

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
