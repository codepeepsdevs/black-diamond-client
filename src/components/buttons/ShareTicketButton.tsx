import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import ErrorToast from "../toast/ErrorToast";
import html2canvas from "html2canvas";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";

export default function ShareTicketButton({
  nodeId,
}: {
  nodeId: string /** Nodeid is the id of the printable ticket component */;
}) {
  const [shareProcessing, setshareProcessing] = useState(false);
  const shareTicket = async () => {
    setshareProcessing(true);
    const node = document.getElementById(nodeId);
    const loadingToastId = toast.loading("Preparing to share ticket..");
    if (!node) {
      toast.error("Something went wrong while trying to share ticket", {
        id: loadingToastId,
      });
      setshareProcessing(false);
      return;
    }
    const ticketImage = await toPng(node);

    if (navigator.share) {
      // Step 2: Convert the canvas to a Blob
      const blob = await fetch(ticketImage).then((res) => res.blob());

      if (!blob) {
        toast.error("Unable to generate ticket to share", {
          id: loadingToastId,
        });
        setshareProcessing(false);
        return;
      }
      const file = new File([blob], "ticket.png", { type: "image/png" });

      const shareData: ShareData = {
        files: [file],
      };

      if (
        !navigator.canShare({
          files: [file],
        })
      ) {
        setshareProcessing(false);
        return toast.error("Share format not supported", {
          id: loadingToastId,
        });
      }

      try {
        await navigator.share(shareData);
        toast.success("Sharing processed successfully", { id: loadingToastId });
      } catch (error) {
        toast.error("Something went wrong while trying to share ticket", {
          id: loadingToastId,
        });
      } finally {
        setshareProcessing(false);
      }
    } else {
      toast.error("Sharing not supported", { id: loadingToastId });
    }
  };

  return (
    <button
      disabled={shareProcessing}
      className="bg-[#14171A] size-12 grid place-items-center rounded-full text-2xl"
      onClick={shareTicket}
    >
      <FiUpload />
    </button>
  );
}
