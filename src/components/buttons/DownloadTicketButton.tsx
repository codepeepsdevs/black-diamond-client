import { cn } from "@/utils/cn";
import React, { ComponentProps, useCallback } from "react";
import { FiDownload } from "react-icons/fi";
import ErrorToast from "../toast/ErrorToast";
import html2canvas from "html2canvas";
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

    // const ticketImage = await toPng(node);
    // const newTab = window.open();
    // if (newTab) {
    //   newTab.document.write(`
    //         <style>
    //           body, html {
    //             height: 100%;
    //             margin: 0;
    //             display: flex;
    //             justify-content: center;
    //             align-items: center;
    //             background-color: #f5f5f5;
    //           }
    //         </style>
    //         <img src="${ticketImage}" alt="Ticket" style="max-width: 100%; max-height: 100%;" />
    //       `);
    // } else {
    //   toast.error("Unable to open ticket in new tab", { id: loadingToastId });
    // }
    toPng(node)
      .then((ticketImage) => {
        const link = document.createElement("a");

        // Safari iOS workaround to open the image in a new tab
        // if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`
            <style>
              body, html {
                height: 100%;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #f5f5f5;
              }
            </style>
            <img src="${ticketImage}" alt="Ticket" style="max-width: 100%; max-height: 100%;" />
          `);
        } else {
          ErrorToast({
            title: "Error",
            descriptions: ["Unable to open ticket in new tab"],
          });
        }
        // } else {
        //   link.href = data;
        //   link.download = ticketName || "ticket";

        //   document.body.appendChild(link);
        //   link.click();
        //   document.body.removeChild(link);
        // }
      })
      .finally(() => {
        toast.success("Ticket successfully generated", { id: loadingToastId });
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
