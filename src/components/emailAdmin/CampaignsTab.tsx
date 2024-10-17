import React, { ComponentProps, useState } from "react";
import IconInputField from "../shared/IconInputField";
import { FiPlusCircle, FiSearch } from "react-icons/fi";
import AdminButton from "../buttons/AdminButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import Input from "../shared/Input";
import { newEmailCampaignIcon } from "../../../public/icons";

export default function CampaignsTab() {
  const [newCampaignNameDialogOpen, setNewCampaignNameDialogOpen] =
    useState(false);
  return (
    <>
      <div className="">
        <div className="overflow-x-auto py-1">
          {/* LIST TABLE ACTIONS */}
          <div className="flex items-center gap-x-8 justify-between mt-12">
            <IconInputField
              Icon={<FiSearch />}
              placeholder="Search by name"
              className="max-w-lg flex-1"
            />

            <AdminButton
              onClick={() => setNewCampaignNameDialogOpen(true)}
              className="flex items-center gap-x-2 font-medium"
            >
              <FiPlusCircle className="" />
              <span>New Camapaign</span>
            </AdminButton>
          </div>
          {/* END LIST TABLE ACTIONS */}
        </div>
      </div>

      <NewCampaignNameDialog
        open={newCampaignNameDialogOpen}
        onOpenChange={setNewCampaignNameDialogOpen}
      />
    </>
  );
}

function NewCampaignNameDialog({ ...props }: ComponentProps<typeof Dialog>) {
  const [listName, setListName] = useState<string>("");
  const router = useRouter();

  function onSubmit() {}

  return (
    <Dialog defaultOpen open={props.open} onOpenChange={props.onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-10 pb-20">
          <DialogContent className="relative bg-[#333333] text-[#A3A7AA] text-center p-6 w-full max-w-xl mx-auto">
            <DialogClose className="absolute top-5 right-5">
              <FaTimes />
            </DialogClose>
            <Image
              src={newEmailCampaignIcon}
              alt=""
              width={250}
              height={250}
              className="size-32 mx-auto"
            />
            <DialogTitle className="text-white my-6 font-bold text-2xl text-center">
              Create a new email Campaign
            </DialogTitle>

            <Input placeholder="Campaign name*" variant="white" />

            <div className="text-right space-x-4 mt-6 ml-auto">
              <AdminButton
                onClick={() => props.onOpenChange?.(false)}
                variant="primary"
              >
                Cancel
              </AdminButton>
              <AdminButton disabled={true} variant="outline" onClick={onSubmit}>
                Get Started
              </AdminButton>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
