import React, { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";
import LoadingSvg from "../shared/Loader/LoadingSvg";
import { cn } from "@/utils/cn";

export default function ShareTicketButton({
  nodeId,
}: {
  nodeId: string /** Nodeid is the id of the printable ticket component */;
}) {
  const [processing, setProcessing] = useState(false);
  const blob = useRef<Blob | null>(null);

  useEffect(() => {
    convertToBlob();
  }, [nodeId]);

  const convertToBlob = async () => {
    setProcessing(true);
    const node = document.getElementById(nodeId);
    if (node) {
      const ticketImage = await toPng(node);
      // Step 2: Convert the canvas to a Blob
      blob.current = await fetch(ticketImage).then((res) => res.blob());
    }
    setProcessing(false);
  };

  const shareTicket = async () => {
    await convertToBlob();
    const loadingToastId = toast.loading("Preparing to share ticket..");

    window.setTimeout(async () => {
      if (navigator.share) {
        if (!blob.current) {
          toast.error("Unable to generate ticket to share", {
            id: loadingToastId,
          });
          return;
        }
        const file = new File([blob.current], "ticket.png", {
          type: "image/png",
        });

        const shareData: ShareData = {
          files: [file],
        };

        if (
          !navigator.canShare({
            files: [file],
          })
        ) {
          return toast.error("Share format not supported", {
            id: loadingToastId,
          });
        }

        try {
          await navigator.share(shareData);
          toast.success("Sharing processed successfully", {
            id: loadingToastId,
          });
        } catch (error) {
          toast.error("Something went wrong while trying to share ticket", {
            id: loadingToastId,
          });
        }
      } else {
        toast.error("Sharing not supported", { id: loadingToastId });
      }
    }, 3000);
  };

  return (
    <button
      disabled={processing}
      className="bg-[#14171A] size-12 grid place-items-center rounded-full text-2xl relative"
      onClick={shareTicket}
    >
      <FiUpload />
      <div
        className={cn(
          "absolute inset-0 grid place-items-center rounded-full bg-black/60",
          !processing && "hidden"
        )}
      >
        <LoadingSvg />
      </div>
    </button>
  );
}
