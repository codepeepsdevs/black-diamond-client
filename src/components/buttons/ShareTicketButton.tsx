import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import ErrorToast from "../toast/ErrorToast";
import html2canvas from "html2canvas";
import { toPng } from "html-to-image";

export default function ShareTicketButton({
  nodeId,
}: {
  nodeId: string /** Nodeid is the id of the printable ticket component */;
}) {
  // const shareTicket = async () => {
  //   alert("starting sharing");
  //   const node = document.getElementById(nodeId);
  //   alert("node gotten" + node?.className);
  //   if (!node) {
  //     ErrorToast({
  //       title: "Share error",
  //       descriptions: ["Something went wrong while trying to share ticket"],
  //     });
  //     return;
  //   }
  //   const canvas = await html2canvas(node);
  //   // const imgData = canvas.toDataURL("image/png");
  //   alert("canvas instantiated from node");

  //   if (navigator.share) {
  //     alert("Device can share");
  //     // Step 2: Convert the canvas to a Blob
  //     const blob: Blob | null = await new Promise((resolve) =>
  //       canvas.toBlob(resolve, "image/png")
  //     );

  //     if (!blob) {
  //       alert("Could not create an image from the HTML element.");
  //       ErrorToast({
  //         title: "Share Error",
  //         descriptions: ["Unable to generate ticket to share"],
  //       });
  //       return;
  //     }
  //     const file = new File([blob], "ticket.png", { type: "image/png" });

  //     const shareData: ShareData = {
  //       files: [file],
  //     };

  //     if (
  //       !navigator.canShare({
  //         files: [file],
  //       })
  //     ) {
  //       alert("Device cannot share file");
  //       return ErrorToast({
  //         title: "Share Error",
  //         descriptions: ["Share format not supported"],
  //       });
  //     }

  //     try {
  //       alert("Device can share this file, sharing now");
  //       await navigator.share(shareData);
  //     } catch (error) {
  //       alert("something went wrong while sharing");
  //       ErrorToast({
  //         title: "Share error",
  //         descriptions: ["Something went wrong while trying to share ticket"],
  //       });
  //     }
  //   } else {
  //     ErrorToast({
  //       title: "Share error",
  //       descriptions: ["Sharing not supported"],
  //     });
  //   }
  // };
  const shareTicket = async () => {
    alert("starting sharing");
    const node = document.getElementById(nodeId);
    alert("node gotten" + node?.className);
    if (!node) {
      ErrorToast({
        title: "Share error",
        descriptions: ["Something went wrong while trying to share ticket"],
      });
      return;
    }
    const ticketImage = await toPng(node);
    // const imgData = canvas.toDataURL("image/png");
    alert("canvas instantiated from node");

    if (navigator.share) {
      alert("Device can share");
      // Step 2: Convert the canvas to a Blob
      const blob = await fetch(ticketImage).then((res) => res.blob());

      if (!blob) {
        alert("Could not create an image from the HTML element.");
        ErrorToast({
          title: "Share Error",
          descriptions: ["Unable to generate ticket to share"],
        });
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
