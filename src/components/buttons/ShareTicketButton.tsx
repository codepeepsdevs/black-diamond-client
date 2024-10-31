import React from "react";
import { FiUpload } from "react-icons/fi";
import ErrorToast from "../toast/ErrorToast";
import html2canvas from "html2canvas";

export default function ShareTicketButton({
  nodeId,
}: {
  nodeId: string /** Nodeid is the id of the printable ticket component */;
}) {
  const shareTicket = async () => {
    alert("starting sharing");
    const node = document.getElementById(nodeId);
    if (!node) {
      ErrorToast({
        title: "Share error",
        descriptions: ["Something went wrong while trying to share ticket"],
      });
      return;
    }
    const canvas = await html2canvas(node);
    const imgData = canvas.toDataURL("image/png");

    if (navigator.share) {
      alert("Device can share");
      const blob = await fetch(imgData).then((res) => res.blob());
      const file = new File([blob], "ticket.png", { type: "image/png" });

      const shareData: ShareData = {
        files: [file],
      };

      if (
        !navigator.canShare({
          files: [file],
        })
      ) {
        alert("Device cannot share file");
        return ErrorToast({
          title: "Share Error",
          descriptions: ["Share format not supported"],
        });
      }

      try {
        alert("Device can share this file, sharing now");
        await navigator.share(shareData);
      } catch (error) {
        alert("something went wrong while sharing");
        ErrorToast({
          title: "Share error",
          descriptions: ["Something went wrong while trying to share ticket"],
        });
      }
    } else {
      ErrorToast({
        title: "Share error",
        descriptions: ["Sharing not supported"],
      });
    }
  };
  return (
    <button
      className="bg-[#14171A] size-12 grid place-items-center rounded-full text-2xl"
      onClick={shareTicket}
    >
      <FiUpload />
    </button>
  );
}
