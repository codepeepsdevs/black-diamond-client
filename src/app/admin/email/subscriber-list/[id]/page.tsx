"use client";

import {
  useGetSubscriberList,
  useUploadListByCSV,
} from "@/api/subscriber-list/subscriber-list.queries";
import { AdminButton } from "@/components";
import AddMultipleSubscribersTab from "@/components/emailAdmin/AddMultipleSubscribersTab";
import AddSingleSubscriberTab from "@/components/emailAdmin/AddSingleSubscriberTab";
import IconInputField from "@/components/shared/IconInputField";
import { cn } from "@/utils/cn";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import Link from "next/link";
import { useParams } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import React, {
  ComponentProps,
  HTMLInputTypeAttribute,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { FaChevronLeft, FaTimes } from "react-icons/fa";
import { FiDownload, FiPlusCircle, FiSearch } from "react-icons/fi";

export default function ManageSubscriberListPage({
  params,
}: {
  params: { id: string };
}) {
  const subscriberListQuery = useGetSubscriberList(params.id);
  const [manageSubDialog, setManageSubDialogOpen] = useState<boolean>(false);

  return (
    <section>
      <div className="mx-8 mt-20 pt-10">
        <Link
          href={"/admin/email"}
          className="flex items-center gap-x-2 font-medium text-[#4267B2]"
        >
          <FaChevronLeft />
          <span>Back to all lists</span>
        </Link>

        <h1 className="font-semibold text-3xl text-white mt-6">
          Manage subscriber list
        </h1>

        {/* LIST TABLE ACTIONS */}
        <div className="flex items-center gap-x-16 justify-between mt-12">
          <IconInputField
            Icon={<FiSearch />}
            placeholder="Search by email"
            className="max-w-lg flex-1"
          />

          <AdminButton
            onClick={() => setManageSubDialogOpen(true)}
            variant="primary"
            className="font-medium"
          >
            Manage subscribers
          </AdminButton>
          <ManageListDialog
            open={manageSubDialog}
            onOpenChange={setManageSubDialogOpen}
          />
        </div>
        {/* END LIST TABLE ACTIONS */}

        <table className="text-[#A3A7AA] w-full mt-12 text-left">
          <thead className="bg-[#A3A7AA] text-black leading-10 [&_th]:px-6">
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody className=" divide-y-[#151515]">
            {subscriberListQuery.isPending ? (
              <tr>
                <td colSpan={3}>Loading data..</td>
              </tr>
            ) : (
              subscriberListQuery.data?.data.subscribers.map((subscriber) => {
                return (
                  <tr className="[&>td]:p-6">
                    <td>{subscriber.name}</td>
                    <td>{subscriber.email}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ManageListDialog({ ...props }: ComponentProps<typeof Dialog>) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  // const [csvFile, setCsvFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  let loadingToast = useRef<string>("");

  const params = useParams<{ id: string }>();
  const formRef = React.useRef<HTMLInputTypeAttribute>(null);

  const { mutate: uploadListByCSV, isPending: uploadListByCSVPending } =
    useUploadListByCSV(
      (e) => {
        toast.error("An error occurred while uploading list", {
          id: loadingToast.current,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      (data) => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.dismiss(loadingToast.current);
      }
    );

  function handleUploadCSVFile(csvFile: File) {
    loadingToast.current = toast.loading(
      "Uploading file.. please do not press anything.."
    );
    if (!csvFile) {
      return toast.error("Please select a CSV file to upload", {
        id: loadingToast.current,
      });
    }
    // TODO: Implement a loader and block further actions until upload returns
    uploadListByCSV({
      csvFile: csvFile,
      listId: params.id,
    });
  }
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger />
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <DialogContent className="relative bg-[#333333] text-[#A3A7AA] p-6 w-full max-w-md mx-auto">
            <DialogClose className="absolute top-5 right-5">
              <FaTimes />
            </DialogClose>

            <div>
              <div className="text-[#A3A7AA]">Manage Subscribers</div>
              <div className="text-[#BDBDBD] text-xl font-bold my-4">
                Import Subscribers
              </div>

              <form
                ref={formRef.current}
                className="bg-[#151515] p-4 leading-5 border border-[#333333]"
              >
                <div className="text-[#BDBDBD]">Upload CSV</div>
                <p className="text-[#A3A7AA] text-xs mt-2">
                  Make sure your CSV is formatted with email addresses in the
                  first column (A), first names in the second column (B), and
                  last names in the third column (C). Only email addresses are
                  required.
                </p>
                <button
                  type="button"
                  disabled={uploadListByCSVPending}
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#4267B2] text-xs font-medium mt-4"
                >
                  {uploadListByCSVPending ? "Uploading CSV.." : "Upload CSV"}
                </button>
                <input
                  onChange={(e) => {
                    if (e.target.files) {
                      // setCsvFile(e.target.files[0]);
                      handleUploadCSVFile(e.target.files[0]);
                    }
                  }}
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                />
              </form>

              <div className="bg-[#151515] p-4 leading-5 border border-[#333333] mt-4">
                <div>Manually add subscribers</div>
                <button
                  onClick={() => setDialogOpen(true)}
                  className="text-[#4267B2] mt-4 text-xs font-medium"
                >
                  Add subscriber
                </button>
                <ManuallyAddSubscribers
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                />
              </div>

              {/* TODO: Export subscribers */}
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}

function ManuallyAddSubscribers({ ...props }: ComponentProps<typeof Dialog>) {
  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("multiple")
  );
  return (
    <Dialog defaultOpen open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger />
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm fixed z-[99] inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <DialogContent className="relative bg-[#333333] text-[#A3A7AA] p-6 w-full max-w-md mx-auto">
            <DialogClose className="absolute top-5 right-5">
              <FaTimes />
            </DialogClose>

            <div>
              <div className="text-[#A3A7AA] mb-2">Manage Subscribers</div>

              <div className="bg-[#151515] p-4 leading-5">
                <div className="text-[#BDBDBD] text-xl font-bold">
                  Manually add subscribers
                </div>

                <div className="flex items-center gap-x-14 justify-between my-5">
                  <AdminButton
                    type="button"
                    variant="outline"
                    className={cn(
                      "flex-1 rounded-none font-medium transition-colors",
                      currentTab === "single" &&
                        "bg-[#4267B2] bg-opacity-15 border-[#4267B2] text-[#4267B2]"
                    )}
                    onClick={() => {
                      setCurrentTab("single");
                    }}
                  >
                    Add single subscribers
                  </AdminButton>
                  <AdminButton
                    type="button"
                    variant="outline"
                    className={cn(
                      "flex-1 rounded-none font-medium transition-colors",
                      currentTab === "multiple" &&
                        "bg-[#4267B2] bg-opacity-15 outline-[#4267B2] text-[#4267B2]"
                    )}
                    onClick={() => {
                      setCurrentTab("multiple");
                    }}
                  >
                    Add multiple subscribers
                  </AdminButton>
                </div>

                {currentTab === "single" && <AddSingleSubscriberTab />}
                {currentTab === "multiple" && <AddMultipleSubscribersTab />}
              </div>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
