import Image from "next/image";
import React, { ComponentProps, useState } from "react";
import IconInputField from "../shared/IconInputField";
import { FiPlusCircle, FiSearch } from "react-icons/fi";
import AdminButton from "../buttons/AdminButton";
import { PiPlusCircle } from "react-icons/pi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import Input from "../shared/Input";
import { FaTimes } from "react-icons/fa";
import {
  useCreateSubscriberList,
  useGetSubscriberLists,
  useUploadListByCSV,
} from "@/api/subscriber-list/subscriber-list.queries";
import toast from "react-hot-toast";
import LoadingMessage from "../shared/Loader/LoadingMessage";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";

export default function SubscribersListTab() {
  const router = useRouter();
  const [importListDialogOpen, setImportListDialogOpen] = useState(false);
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);

  const subscriberListsQuery = useGetSubscriberLists();
  const subscriberLists = subscriberListsQuery.data?.data;

  return (
    <>
      <div className="">
        <div className="overflow-x-auto py-1">
          {/* SUSCRIBER LIST ACTIONS */}
          <div className="flex items-center gap-x-5 whitespace-nowrap min-w-max">
            {/* IMPORT A LIST */}
            <button
              onClick={() => setImportListDialogOpen(true)}
              className="flex items-center gap-x-2 mt-4 text-left border border-[#333333] bg-[#151515] px-4 py-2"
            >
              <Image
                src={"/icons/email-admin/import-list-icon.svg"}
                alt=""
                width={250}
                height={250}
                className="size-16"
              />

              <div>
                <div className="text-[#A3A7AA] font-semibold">
                  Import a list
                </div>
                <p className="text-xs mt-2">
                  Upload a CSV or import an existing list
                </p>
              </div>
            </button>
            <UploadEmailListDialog
              open={importListDialogOpen}
              onOpenChange={setImportListDialogOpen}
            />
            {/* END IMPORT A LIST */}

            {/* ALL SUBSCRIBED USERS */}
            <Link
              href="/admin/email/all-subscribers"
              className="flex items-center gap-x-2 mt-4 text-left border border-[#333333] bg-[#151515] px-4 py-2"
            >
              <Image
                src={"/icons/email-admin/all-subscribers-icon.svg"}
                alt=""
                width={250}
                height={250}
                className="size-16"
              />

              <div>
                <div className="text-[#A3A7AA] font-semibold">
                  All subscribers{" "}
                </div>
                <p className="text-xs mt-2">
                  Search for people across all lists
                </p>
              </div>
            </Link>
            {/* END ALL SUBSCRIBED USERS */}

            {/* UNSUBSCRIBED USERS */}
            <Link
              href={"/admin/email/unsubscribed-users"}
              className="flex items-center gap-x-2 mt-4 text-left border border-[#333333] bg-[#151515] px-4 py-2"
            >
              <Image
                src={"/icons/email-admin/unsubscribed-users-icon.svg"}
                alt=""
                width={250}
                height={250}
                className="size-16"
              />

              <div>
                <div className="text-[#A3A7AA] font-semibold">
                  Unsubscribed Users
                </div>
                <p className="text-xs mt-2">View or delete unsubscribers </p>
              </div>
            </Link>
            {/* END UNSUBSCRIBED USERS */}
          </div>
          {/* END SUSCRIBER LIST ACTIONS */}
        </div>

        {/* LIST TABLE ACTIONS */}
        <div className="flex items-center gap-x-8 justify-between mt-12">
          <IconInputField
            Icon={<FiSearch />}
            placeholder="Search by name"
            className="max-w-lg flex-1"
          />

          <AdminButton
            onClick={() => setNewListDialogOpen(true)}
            className="flex items-center gap-x-2 font-medium"
          >
            <FiPlusCircle className="" />
            <span>New List</span>
          </AdminButton>
        </div>
        {/* END LIST TABLE ACTIONS */}

        {/* SUBSCRIBER LIST TABLE */}
        <table className="text-[#A3A7AA] w-full mt-12 text-left">
          <thead className="bg-[#A3A7AA] text-black leading-10 [&_th]:px-6">
            <tr>
              <th>List</th>
              <th>Active subscribers</th>
            </tr>
          </thead>
          <tbody className="divide-y-[#151515]">
            {subscriberListsQuery.isPending && (
              <tr>
                <td colSpan={2}>
                  <LoadingMessage>Loading subscriber lists</LoadingMessage>
                </td>
              </tr>
            )}
            {subscriberListsQuery.isError && (
              <tr>
                <td colSpan={2}>
                  <div>Error Loading subscriber lists</div>
                </td>
              </tr>
            )}
            {subscriberLists?.map((list) => {
              return (
                <tr key={list.id} className="[&>td]:p-6">
                  <td>{list.name}</td>
                  <td>{list._count.subscribers}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* END SUBSCRIBER LIST TABLE */}
      </div>

      <CreateNewListDialog
        open={newListDialogOpen}
        onOpenChange={setNewListDialogOpen}
      />
    </>
  );
}

function UploadEmailListDialog({ ...props }: ComponentProps<typeof Dialog>) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [listName, setListName] = useState<string>("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const { mutate: uploadListByCSV, isPending: uploadListByCSVPending } =
    useUploadListByCSV((e) => {
      ErrorToast({
        title: "Error",
        descriptions: ["An error occurred while uploading list"],
      });
    });

  const {
    mutate: createSubscriberList,
    isPending: createSubscriberListIsPending,
  } = useCreateSubscriberList((data) => {
    if (!csvFile) {
      return toast.error("No file uploaded");
    }
    uploadListByCSV({
      listId: data.data.id,
      csvFile: csvFile,
    });
  });

  function onSubmit() {
    createSubscriberList({
      name: listName,
    });
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger />
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-10 pb-20">
          <DialogContent className="relative bg-[#333333] text-[#A3A7AA] text-center p-6 w-full max-w-xl mx-auto">
            <DialogClose className="absolute top-5 right-5">
              <FaTimes />
            </DialogClose>
            <Image
              src={"/icons/email-admin/upload-list-icon.svg"}
              alt=""
              width={250}
              height={250}
              className="size-32 mx-auto"
            />
            <DialogTitle className="text-white my-6 font-bold text-2xl text-center">
              Upload your list
            </DialogTitle>

            <Input
              variant="white"
              placeholder="Give your list a name*"
              onChange={(e) => setListName(e.target.value)}
            />
            <p className="text-[#C0C0C0] text-sm text-center mt-2 mb-10">
              Make sure your CSV is formatted with email addresses in the first
              column (A), first names in the second column (B), and last names
              in the third column (C). Only email addresses are required.
            </p>
            <div className="flex items-center gap-x-4">
              <div>
                <AdminButton
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  Choose file
                </AdminButton>
                <input
                  onChange={(e) =>
                    setCsvFile(e.target.files && e.target.files[0])
                  }
                  ref={fileInputRef}
                  type="file"
                  id="csvFile"
                  className="hidden"
                  accept=".csv"
                />
              </div>
              <AdminButton
                variant="primary"
                disabled={
                  !csvFile ||
                  !listName ||
                  createSubscriberListIsPending ||
                  uploadListByCSVPending
                }
                onClick={onSubmit}
              >
                {createSubscriberListIsPending ? "Uploading.." : "Upload"}
              </AdminButton>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}

function CreateNewListDialog({ ...props }: ComponentProps<typeof Dialog>) {
  const [listName, setListName] = useState<string>("");
  const router = useRouter();

  const {
    mutate: createSubscriberList,
    isPending: createSubscriberListIsPending,
  } = useCreateSubscriberList((data) => {
    if (!data.data.id) {
      return ErrorToast({
        title: "CSV upload error",
        descriptions: ["Error creating subscriber list"],
      });
    }
    SuccessToast({
      title: "CSV uploaded",
      description: "Subscriber list created successfully",
    });
    router.push("/admin/email/subscriber-list/" + data.data.id);
  });

  function onSubmit() {
    createSubscriberList({ name: listName });
  }
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger />
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-10 pb-20">
          <DialogContent className="relative bg-[#333333] text-[#A3A7AA] text-center p-6 w-full max-w-xl mx-auto">
            <DialogClose className="absolute top-5 right-5">
              <FaTimes />
            </DialogClose>
            <Image
              src={"/icons/email-admin/upload-list-icon.svg"}
              alt=""
              width={250}
              height={250}
              className="size-32 mx-auto"
            />
            <DialogTitle className="text-white my-6 font-bold text-2xl text-center">
              Create a new list
            </DialogTitle>

            <Input
              onChange={(e) => setListName(e.target.value)}
              placeholder="Give your list a name for future reference*"
              variant="white"
            />
            <p className="text-[#C0C0C0] text-sm text-center mt-2 mb-10">
              Make sure your CSV is formatted with email addresses in the first
              column (A), first names in the second column (B), and last names
              in the third column (C). Only email addresses are required.
            </p>

            <div className="text-right space-x-4">
              <AdminButton
                onClick={() => props.onOpenChange?.(false)}
                variant="primary"
              >
                Cancel
              </AdminButton>
              <AdminButton
                disabled={createSubscriberListIsPending}
                variant="outline"
                onClick={onSubmit}
              >
                {createSubscriberListIsPending ? "Creating.." : "Continue"}
              </AdminButton>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
