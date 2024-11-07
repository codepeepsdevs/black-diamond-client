import { cn } from "@/utils/cn";
import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import { toPng } from "html-to-image";
import ErrorToast from "../toast/ErrorToast";
import LoadingSvg from "../shared/Loader/LoadingSvg";

export default function DownloadTicketButton({
  className,
  nodeId,
  ticketName,
  ...props
}: ComponentProps<"button"> & { nodeId: string; ticketName: string }) {
  const ticketImage = useRef<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    generatePng();
  }, [nodeId]);

  const generatePng = async () => {
    const node = document.getElementById(nodeId);
    if (!node) {
      return;
    }
    setProcessing(true);
    return toPng(node)
      .then((_ticketImage) => {
        ticketImage.current = _ticketImage;
        return _ticketImage;
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const onDownload = async () => {
    await generatePng();
    if (ticketImage.current) {
      const link = document.createElement("a");

      link.href = ticketImage.current;
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
      toast.success("Ticket successfully generated");
    } else {
      ErrorToast({
        title: "Error",
        descriptions: ["Ticket download is unavailable"],
      });
    }
  };

  return (
    <button
      disabled={processing}
      className={cn(
        "bg-[#14171A] size-12 grid place-items-center rounded-full text-2xl relative",
        className
      )}
      {...props}
      onClick={() => onDownload()}
    >
      <FiDownload />
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
