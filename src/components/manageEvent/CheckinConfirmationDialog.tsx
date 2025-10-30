"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import AdminButton from "@/components/buttons/AdminButton";
import { cn } from "@/utils/cn";

export type AttendeeLike = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  admissionType?: string;
  price?: number | string;
};

export default function CheckinConfirmationDialog({
  open,
  attendee,
  onConfirm,
  onOpenChange,
  isConfirming,
}: {
  open: boolean;
  attendee: AttendeeLike | null;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  isConfirming?: boolean;
}) {
  const attendeeName =
    attendee?.name ||
    `${attendee?.firstName || ""} ${attendee?.lastName || ""}`.trim();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-[92vw] max-w-md rounded-xl bg-[#151515] p-6 text-white shadow-xl"
          )}
        >
          <Dialog.Title className="text-xl font-semibold">
            Confirm check-in
          </Dialog.Title>
          <div className="mt-4 space-y-2 text-[#A3A7AA]">
            <div className="text-white text-lg font-medium">
              {attendeeName || "Unknown attendee"}
            </div>
            {attendee?.admissionType && (
              <div>Ticket: {attendee.admissionType}</div>
            )}
            <div>Proceed to check this attendee in?</div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <AdminButton
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-28"
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              onClick={onConfirm}
              disabled={isConfirming}
              className="min-w-28"
            >
              {isConfirming ? "Checking in..." : "Confirm"}
            </AdminButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
