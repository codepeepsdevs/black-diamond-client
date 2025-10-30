"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { MdOutlineFlashOn, MdOutlineFlashOff } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import toast from "react-hot-toast";
import CheckinConfirmationDialog, {
  AttendeeLike,
} from "@/components/manageEvent/CheckinConfirmationDialog";
import { useCheckInByQRCode } from "@/api/checkin/checkin.queries";
import { getTicketByCheckinCode } from "@/api/checkin/checkin.apis";
import ErrorToast from "@/components/toast/ErrorToast";

export default function ScanQrPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const eventId = params.id;

  const [scannerReady, setScannerReady] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attendee, setAttendee] = useState<AttendeeLike | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const { mutate: checkInByQRCodeMutate } = useCheckInByQRCode(eventId);

  const containerId = useMemo(
    () => "qr-reader-container-" + Math.random().toString(36).slice(2),
    []
  );
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const lastDecodedTextRef = useRef<string | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const RESCAN_COOLDOWN_MS = 1500;

  const stopScanner = useCallback(async () => {
    try {
      if (html5QrCodeRef.current?.isScanning) {
        await html5QrCodeRef.current.stop();
      }
    } catch {}
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(containerId);
        html5QrCodeRef.current = html5QrCode;
        setScannerReady(true);
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            const now = Date.now();
            if (
              decodedText === lastDecodedTextRef.current &&
              now - lastScanTimeRef.current < RESCAN_COOLDOWN_MS
            ) {
              return;
            }
            lastDecodedTextRef.current = decodedText;
            lastScanTimeRef.current = now;
            // Fetch ticket details by code, then open confirm dialog
            (async () => {
              setIsFetchingDetails(true);
              try {
                const res = await getTicketByCheckinCode(decodedText);
                const t = res.data;
                setAttendee({
                  id: t.checkinCode,
                  name:
                    `${t.firstName || ""} ${t.lastName || ""}`.trim() ||
                    t.email ||
                    decodedText,
                  admissionType: t.ticketType?.name,
                });
                setDialogOpen(true);
                stopScanner();
              } catch (e) {
                ErrorToast({
                  title: "Lookup failed",
                  descriptions: [
                    "Unable to load ticket details for scanned code.",
                  ],
                });
              } finally {
                setIsFetchingDetails(false);
              }
            })();
          },
          () => {}
        );
      } catch (e) {
        ErrorToast({
          title: "Unable to access camera",
          descriptions: ["Please check your camera permissions and try again."],
        });
      }
    };
    startScanner();
    return () => {
      stopScanner();
      html5QrCodeRef.current?.clear();
    };
  }, [containerId, stopScanner]);

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await new Promise<void>((resolve, reject) => {
        checkInByQRCodeMutate(
          { checkinCode: attendee?.id || "" },
          {
            onSuccess: () => resolve(),
            onError: () => reject(),
          }
        );
      });
      setDialogOpen(false);
      setAttendee(null);
      // Resume scanning
      if (html5QrCodeRef.current && !html5QrCodeRef.current.isScanning) {
        setTimeout(async () => {
          await html5QrCodeRef.current?.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
              const now = Date.now();
              if (
                decodedText === lastDecodedTextRef.current &&
                now - lastScanTimeRef.current < RESCAN_COOLDOWN_MS
              ) {
                return;
              }
              lastDecodedTextRef.current = decodedText;
              lastScanTimeRef.current = now;
              setAttendee({ id: decodedText, name: decodedText });
              setDialogOpen(true);
              stopScanner();
            },
            () => {}
          );
        }, 500);
      }
    } catch {
      ErrorToast({
        title: "Check-in failed",
        descriptions: ["Unable to check in attendee"],
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <section className="relative bg-black">
      <div className="mx-8 mt-20 pt-10 text-[#A3A7AA]">
        {/* Top Bar */}
        {/* <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
        <button
          onClick={() => router.back()}
          className="text-white hover:opacity-80"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-2xl" />
        </button>

        <div className="text-white text-lg font-medium">Scan</div>

        <button
          onClick={() => setTorchOn((v) => !v)}
          className="text-white hover:opacity-80"
          aria-label="Toggle flash"
        >
          {torchOn ? (
            <MdOutlineFlashOff className="text-2xl" />
          ) : (
            <MdOutlineFlashOn className="text-2xl" />
          )}
        </button>
      </div> */}

        {/* Camera */}
        <div id={containerId} className="w-[400px] h-[400px]" />

        {/* Overlay */}
        {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 border-2 border-white/80 rounded-md" />
      </div> */}

        <CheckinConfirmationDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              // resume scanning when dialog closes without confirm
              if (
                html5QrCodeRef.current &&
                !html5QrCodeRef.current.isScanning
              ) {
                setTimeout(() => {
                  html5QrCodeRef.current
                    ?.start(
                      { facingMode: "environment" },
                      { fps: 10, qrbox: 250 },
                      (decodedText) => {
                        const now = Date.now();
                        if (
                          decodedText === lastDecodedTextRef.current &&
                          now - lastScanTimeRef.current < RESCAN_COOLDOWN_MS
                        ) {
                          return;
                        }
                        lastDecodedTextRef.current = decodedText;
                        lastScanTimeRef.current = now;
                        setAttendee({ id: decodedText, name: decodedText });
                        setDialogOpen(true);
                        stopScanner();
                      },
                      () => {}
                    )
                    .catch(() => {});
                }, 400);
              }
            }
          }}
          attendee={attendee}
          onConfirm={handleConfirm}
          isConfirming={isConfirming}
        />
      </div>
    </section>
  );
}
