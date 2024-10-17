import React, { ComponentProps, useState } from "react";
import AdminButton from "../buttons/AdminButton";
import { cn } from "@/utils/cn";
import { BsDot } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import Image from "next/image";
import RadioButton from "../shared/RadioButton";
import Input from "../shared/Input";
import IconInputField from "../shared/IconInputField";
import { AiOutlinePercentage } from "react-icons/ai";
import { FaDollarSign, FaRegCalendar, FaRegClock } from "react-icons/fa6";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { newAddOnSchema } from "@/api/events/events.schemas";
import { FaSave } from "react-icons/fa";
import { parseAsString, useQueryState } from "nuqs";
import { useCreateEventAddon, useGetAddons } from "@/api/events/events.queries";
// import { useNewEventStore } from "@/store/new-event.store";
import toast from "react-hot-toast";
import { FormError } from "../shared/FormError";
import AddonImageInput from "./AddonImageInput";
import * as dateFns from "date-fns";
import LoadingMessage from "../shared/Loader/LoadingMessage";
import ErrorToast from "../toast/ErrorToast";
import { useRouter } from "next/navigation";

export default function EventAddOnTab({ isActive }: { isActive: boolean }) {
  const [createAddOnDialogOpen, setCreateAddonDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("details")
  );
  // const newEventId = useNewEventStore((state) => state.eventId);
  const [eventId, setEventId] = useQueryState(
    "newEventId",
    parseAsString.withDefault("")
  );

  const addonsQuery = useGetAddons(eventId || "");

  return (
    <div className={cn("text-[#A3A7AA] mt-10", isActive ? "block" : "hidden")}>
      <AdminButton
        variant="outline"
        onClick={() => setCreateAddonDialogOpen(true)}
        className="flex items-center px-6 gap-x-2"
      >
        Create Add on
      </AdminButton>
      <CreateAddonDialog
        open={createAddOnDialogOpen}
        onOpenChange={setCreateAddonDialogOpen}
      />

      {/* LIST OF ADD ONS */}
      <div className="mt-12 overflow-x-auto whitespace-nowrap">
        {addonsQuery.isPending && (
          <LoadingMessage>Loading event addons list..</LoadingMessage>
        )}
        {addonsQuery.data?.data.map((addon) => {
          {
            /* ADDON ITEM */
          }
          return (
            <div className="border-b border-b-[#151515] flex font-medium py-4 [&>div]:px-5">
              <Image
                src={addon.image}
                alt=""
                width={180}
                height={180}
                className="size-20 object-cover"
              />
              <div className="flex-1">
                <div className="text-xl">{addon.name}</div>
                <div className="flex items-center mt-2">
                  <BsDot className="text-[#34C759] text-2xl -ml-2" />
                  <p className="">
                    On Sale ·{" "}
                    {dateFns.format(
                      new Date(addon.endTime),
                      "MMM dd, yyyy 'at' hh:mm a"
                    )}
                  </p>
                </div>
              </div>
              <div>Sold: 0/24</div>
              <div>Price: ${addon.price || 0}</div>
              <div>
                <button>
                  <FiMoreVertical />
                </button>
              </div>
            </div>
          );
        })}
        {/* END ADDON ITEM */}
      </div>
      {/* END LIST OF ADD ONS */}

      <AdminButton
        variant="ghost"
        className="flex items-center gap-x-2 font-medium mt-10"
        onClick={() => setCurrentTab("add-ons")}
      >
        <FaSave />
        <span>Save and continue</span>
      </AdminButton>
    </div>
  );
}

function CreateAddonDialog({ ...props }: ComponentProps<typeof Dialog>) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<Yup.InferType<typeof newAddOnSchema>>({
    resolver: yupResolver(newAddOnSchema),
    defaultValues: {},
  });
  // const newEventId = useNewEventStore((state) => state.eventId);
  const router = useRouter();
  const [eventId, setEventId] = useQueryState(
    "newEventId",
    parseAsString.withDefault("")
  );

  if (!eventId) {
    ErrorToast({ title: "Operation error", descriptions: ["Event not found"] });
    router.push("/admin/events");
    return;
  }

  function onError() {
    toast.error("An error occurred while creating event addon");
  }

  function onSuccess() {
    toast.success("Addon created successfully");
    reset();
  }

  const { mutate: createAddon, isPending } = useCreateEventAddon(
    onError,
    onSuccess,
    eventId || ""
  );

  function onSubmit(values: Yup.InferType<typeof newAddOnSchema>) {
    if (!eventId) {
      return toast.error("Event to create add on for not found");
    }
    createAddon({ ...values, eventId: eventId });
  }

  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <DialogContent className="bg-[#333333] text-[#A3A7AA] p-6 max-w-lg">
            <DialogTitle className="text-xl font-semibold">
              Create add-on
            </DialogTitle>
            <DialogDescription className="hidden">
              Add new event add-on
            </DialogDescription>
            <DialogClose />

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name">Name*</label>
                <Input {...register("name")} />
                <FormError error={errors.name} />
              </div>
              <div>
                <label htmlFor="total-quantity">Total Quantity*</label>
                <Input {...register("totalQuantity")} />
                <FormError error={errors.totalQuantity} />
              </div>
              <div>
                <label htmlFor="item-price">Item price*</label>
                <Input {...register("price")} />
                <FormError error={errors.price} />
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <textarea
                  className={
                    "w-full bg-input-bg outline-none  text-base  p-4 border border-input-border"
                  }
                  {...register("description")}
                />
                <FormError error={errors.description} />
              </div>
              <div>
                <AddonImageInput
                  onSelectFile={(file) => setValue("image", file)}
                />
              </div>
              <div className="font-medium text-[#BDBDBD]">
                Add-ons per order
              </div>
              <div className="flex items-center gap-x-4 gap-y-4">
                <div className="flex-1">
                  <label htmlFor="minimum-quantity">Minimum quantity</label>
                  <Input
                    className="bg-input-bg"
                    {...register("minimumQuantityPerOrder")}
                  />
                  <FormError error={errors.minimumQuantityPerOrder} />
                </div>
                <div className="flex-1">
                  <label htmlFor="maximum-quantity">Maximum quantity</label>
                  <Input
                    className="bg-input-bg"
                    {...register("maximumQuantityPerOrder")}
                  />
                  <FormError error={errors.maximumQuantityPerOrder} />
                </div>
              </div>
              <div className="flex items-center gap-x-4 gap-y-4">
                <div className="flex-1">
                  <label htmlFor="quantity">Start Date*</label>
                  <IconInputField
                    type="date"
                    className="bg-input-bg"
                    Icon={<FaRegCalendar />}
                    {...register("startDate")}
                  />
                  <FormError error={errors.startDate} />
                </div>
                <div className="flex-1">
                  <label htmlFor="start-tiime">Start Time*</label>
                  <IconInputField
                    type="time"
                    className="bg-input-bg"
                    Icon={<FaRegClock />}
                    {...register("startTime")}
                  />
                  <FormError error={errors.startTime} />
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="flex-1">
                  <label htmlFor="end-date">End Date*</label>
                  <IconInputField
                    type="date"
                    className="bg-input-bg"
                    Icon={<FaRegCalendar />}
                    {...register("endDate")}
                  />
                  <FormError error={errors.endDate} />
                </div>
                <div className="flex-1">
                  <label htmlFor="end-time">End Time*</label>
                  <IconInputField
                    type="time"
                    className="bg-input-bg"
                    Icon={<FaRegClock />}
                    {...register("endTime")}
                  />
                  <FormError error={errors.endTime} />
                </div>
              </div>
              {/* <div className="space-y-4 mt-6">
                <div>Apply code to:</div>
                <div className="flex items-center gap-x-3">
                  <RadioButton value={"all"} />
                  <div>All visible tickets</div>
                </div>
                <div className="flex items-center gap-x-3">
                  <RadioButton value={""} />
                  <div>All visible tickets</div>
                  {/* <SelectTicketsDropDown
                    ticketTypes={ticketTypes}
                    selectedTicketTypeIds={selectedTicketTypeIds}
                    setSelectedTicketTypeIds={setSelectedTicketTypeIds}
                  /> */}{" "}
              {/*
                </div>
              </div> */}
              <div className="flex items-center gap-x-12 mt-4 gap-y-4">
                <AdminButton variant="outline" className="flex-1">
                  Cancel
                </AdminButton>
                <AdminButton
                  disabled={isPending}
                  variant="ghost"
                  className="flex-1"
                >
                  {isPending ? "Saving.." : "Save"}
                </AdminButton>
              </div>
            </form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
