"use client";

import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [attendee, setAttendee] = useState<AttendeeLike | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [scannerPaused, setScannerPaused] = useState(false);
  const { mutate: checkInByQRCodeMutate } = useCheckInByQRCode(eventId);

  const lastDecodedTextRef = useRef<string | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const RESCAN_COOLDOWN_MS = 1500;

  const handleScan = (detectedCodes: Array<{ rawValue: string }>) => {
    if (!detectedCodes || detectedCodes.length === 0) return;

    const decodedText = detectedCodes[0].rawValue;

    // Prevent duplicate scans
    const now = Date.now();
    if (
      decodedText === lastDecodedTextRef.current &&
      now - lastScanTimeRef.current < RESCAN_COOLDOWN_MS
    ) {
      return;
    }

    // Prevent scanning while dialog is open or fetching
    if (dialogOpen || isFetchingDetails || scannerPaused) {
      return;
    }

    lastDecodedTextRef.current = decodedText;
    lastScanTimeRef.current = now;

    // Pause scanner while fetching details
    setScannerPaused(true);
    setIsFetchingDetails(true);

    // Fetch ticket details asynchronously
    (async () => {
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
      } catch (e) {
        ErrorToast({
          title: "Lookup failed",
          descriptions: ["Unable to load ticket details for scanned code."],
        });
        // Resume scanning on error
        setScannerPaused(false);
      } finally {
        setIsFetchingDetails(false);
      }
    })();
  };

  const handleError = (error: unknown) => {
    ErrorToast({
      title: "Unable to access camera",
      descriptions: ["Please check your camera permissions and try again."],
    });
  };

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
      // Resume scanning after successful check-in
      setTimeout(() => {
        setScannerPaused(false);
      }, 500);
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
    <section className="relative bg-black min-h-screen">
      <div className="mx-8 mt-20 pt-10 text-[#A3A7AA]">
        <div className="flex flex-col items-center">
          {/* QR Scanner */}
          <div className="w-full max-w-md">
            {!scannerPaused && (
              <Scanner
                onScan={handleScan}
                onError={handleError}
                styles={{
                  container: {
                    width: "100%",
                    aspectRatio: "1",
                    maxWidth: "400px",
                    maxHeight: "400px",
                  },
                }}
                constraints={{
                  facingMode: "environment",
                }}
              />
            )}
          </div>

          <CheckinConfirmationDialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                // Resume scanning when dialog closes without confirm
                setAttendee(null);
                setTimeout(() => {
                  setScannerPaused(false);
                }, 400);
              }
            }}
            attendee={attendee}
            onConfirm={handleConfirm}
            isConfirming={isConfirming}
          />
        </div>
      </div>
    </section>
  );
}
