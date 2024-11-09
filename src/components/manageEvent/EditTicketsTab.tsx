import React, { ComponentProps, useEffect, useState } from "react";
import AdminButton from "../buttons/AdminButton";
import { FaSave } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import * as Yup from "yup";
import Input from "../shared/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import IconInputField from "../shared/IconInputField";
import { FaDollarSign, FaRegCalendar, FaRegClock } from "react-icons/fa6";
import { cn } from "@/utils/cn";
import {
  editTicketFormSchema,
  newTicketFormSchema,
  updateEventTicketTypeSchema,
} from "@/api/events/events.schemas";
import { FiMoreVertical } from "react-icons/fi";
import { BsDot } from "react-icons/bs";
import Checkbox from "../shared/Checkbox";
import { parseAsString, useQueryState } from "nuqs";
import {
  useCreateEventTicketType,
  useGetEventTicketTypes,
  useUpdateTicketType,
} from "@/api/events/events.queries";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse } from "@/constants/types";
import {
  CreateEventTicketTypeResponse,
  UpdateTicketTypeResponse,
} from "@/api/events/events.types";
import toast from "react-hot-toast";
import * as dateFns from "date-fns";
import * as dateFnsTz from "date-fns-tz";
import { FormError } from "../shared/FormError";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { MdGppBad } from "react-icons/md";
import { Router } from "next/router";
import { useParams, useRouter } from "next/navigation";
import ErrorToast from "../toast/ErrorToast";
import SuccessToast from "../toast/SuccessToast";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import { useGetTicketTypeSales } from "@/api/order/order.queries";
import { newYorkTimeZone } from "@/utils/date-formatter";

export default function EditTicketsTab({ isActive }: { isActive: boolean }) {
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);
  const [editTicketDialogOpen, setEditTicketDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("details")
  );
  const [ticketToEditId, setTicketToEditId] = useState<string | null>(null);

  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const [ticketToEdit, setTicketToEdit] = useState<Yup.InferType<
    typeof editTicketFormSchema
  > | null>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<Yup.InferType<typeof updateEventTicketTypeSchema>>({
    resolver: yupResolver(updateEventTicketTypeSchema),
  });

  const watchedDisplayTicketsRemainder = watch("displayTicketsRemainder");
  const watchedShowSalesEndMessage = watch("showSalesEndMessage");

  function onSubmit(values: Yup.InferType<typeof updateEventTicketTypeSchema>) {
    // TODO: Handle updating event details..
    setCurrentTab("code");
  }
  const ticketTypes = useGetEventTicketTypes(eventId);
  const ticketTypeSalesQuery = useGetTicketTypeSales(eventId);
  const ticketTypeSalesData = ticketTypeSalesQuery.data?.data;

  function handleAction(
    action: (typeof actions)[number],
    ticketTypeId: string
  ) {
    switch (action) {
      case "edit":
        const ticketToEdit = ticketTypes.data?.data.find(
          (ticketType) => ticketType.id === ticketTypeId
        );
        if (!ticketToEdit) {
          // show
          ErrorToast({
            title: "Error editing ticket",
            descriptions: ["Cannot find details of ticket to edit"],
          });
          return;
        }
        const zonedStartDate = dateFnsTz.toZonedTime(
          new Date(ticketToEdit.startDate || Date.now()),
          newYorkTimeZone
        );
        const zonedEndDate = dateFnsTz.toZonedTime(
          new Date(ticketToEdit.endDate || Date.now()),
          newYorkTimeZone
        );
        setTicketToEdit({
          name: ticketToEdit.name,
          price: ticketToEdit.price,
          quantity: Number(ticketToEdit.quantity),
          startDate: dateFns.format(zonedStartDate, "yyyy-MM-dd"),
          startTime: dateFns.format(zonedStartDate, "HH:mm"),
          // new Date(ticketToEdit.startDate || Date.now())
          //   .toTimeString()
          //   .slice(0, 5),
          endDate: dateFns.format(zonedEndDate, "yyyy-MM-dd"),
          endTime: dateFns.format(zonedEndDate, "HH:mm"),
          // new Date(ticketToEdit.endDate || Date.now())
          //   .toTimeString()
          //   .slice(0, 5),
        });
        setTicketToEditId(ticketToEdit.id);
        setEditTicketDialogOpen(true);
        break;
      case "delete":
      //   TODO: handle delete tickettype?
    }
  }

  return (
    <>
      <div
        className={cn("mt-16 text-[#A3A7AA]", isActive ? "block" : "hidden")}
      >
        <AdminButton
          variant="outline"
          onClick={() => setNewTicketDialogOpen(true)}
          className="flex items-center px-6 gap-x-2"
        >
          <FaSave className="-mt-1" />
          <span>Add New Ticket</span>
        </AdminButton>

        {ticketToEdit && ticketToEditId && (
          <EditTicketDialog
            key={ticketToEditId}
            ticketTypeId={ticketToEditId}
            defaultValues={ticketToEdit}
            open={editTicketDialogOpen}
            onOpenChange={setEditTicketDialogOpen}
          />
        )}

        {/* TICKET TYPE LIST */}
        <div className="font-medium mt-12">
          {ticketTypes.isPending ? (
            <div>Loading ticket types..</div>
          ) : ticketTypes.isError ? (
            <div>Error loading ticket types..</div>
          ) : (
            ticketTypes.data?.data.map((ticketType) => {
              return (
                <div
                  key={ticketType.id}
                  className="flex gap-x-24 py-4 whitespace-nowrap overflow-x-auto"
                >
                  <div className="flex-1">
                    <div className="font-medium text-xl">{ticketType.name}</div>
                    <div className="flex items-center mt-2">
                      <BsDot className="text-[#34C759] text-2xl -ml-2" />
                      <p className="">
                        On Sale · Ends{" "}
                        {dateFns.format(
                          dateFnsTz.toZonedTime(
                            new Date(ticketType.endDate),
                            newYorkTimeZone
                          ),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                  <div>Sold: </div>
                  <div>
                    {
                      ticketTypeSalesData?.find((ticketType) => ticketType.id)
                        ?._count.tickets
                    }
                    /{ticketType.quantity}
                  </div>
                  <div>${ticketType.price.toFixed(2)}</div>

                  <ActionDropDown
                    handleAction={handleAction}
                    ticketTypeId={ticketType.id}
                  />
                </div>
              );
            })
          )}
        </div>
        {/* END TICKET TYPE LIST */}

        {/* DISPLAY SETTINGS */}
        <form className="mt-12" onSubmit={handleSubmit(onSubmit)}>
          <div className="font-medium text-xl text-[#BDBDBD]">
            Display Settings
          </div>
          <div className="flex gap-x-4 items-center mt-6">
            <Checkbox
              checked={watchedDisplayTicketsRemainder}
              onClick={() =>
                setValue(
                  "displayTicketsRemainder",
                  !watchedDisplayTicketsRemainder
                )
              }
            />
            <div>
              <p className="font-normal text-[#BDBDBD]">
                Display number of tickets remaining.
              </p>
              <p className="font-normal text-xs text-[#757575]">
                The number of tickets remaining will be displayed to attendees.
              </p>
            </div>
          </div>

          <div className="text-[#BDBDBD] mt-4">
            <div className="flex gap-x-4 items-center">
              <Checkbox
                checked={watchedShowSalesEndMessage}
                onClick={() =>
                  setValue("showSalesEndMessage", !watchedShowSalesEndMessage)
                }
              />
              <div>
                <p className="font-normal text-[#BDBDBD]">
                  Display a message after ticket sales end
                </p>
                <p className="font-normal text-xs text-[#757575]">
                  You can add a message to the top of your event’s listing page
                  that shows up after sales have ended.
                </p>
              </div>
            </div>
            <textarea
              rows={8}
              className={
                "w-full bg-white outline-none  text-base  p-4 border border-input-border mt-2"
              }
              {...register("ticketSalesEndMessage")}
            />
          </div>

          <AdminButton
            variant="ghost"
            className="font-medium flex items-center gap-x-2 px-6 mt-12"
          >
            <FaSave />
            <span>Save and continue</span>
          </AdminButton>
        </form>
        {/* END DISPLAY SETTINGS */}
      </div>
      {/* <NoTicketsToEditDialog  /> */}
      <NewTicketDialog
        open={newTicketDialogOpen}
        onOpenChange={setNewTicketDialogOpen}
      />
    </>
  );
}

function NewTicketDialog({ ...props }: ComponentProps<typeof Dialog> & {}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<Yup.InferType<typeof newTicketFormSchema>>({
    resolver: yupResolver(newTicketFormSchema),
  });

  const [ticketCategory, setTicketCategory] = useState<"free" | "paid">("paid");
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  function onCreateEventTicketTypeSuccess(
    data: AxiosResponse<CreateEventTicketTypeResponse>
  ) {
    toast.success(data?.data?.name + "Ticket type created successfully");
    // The new ticket types should be automatically fetched because the query cache has been invalidated
    props?.onOpenChange?.(false); // conditionally closing the modal dialog
    reset();
  }

  function onCreateEventTicketTypeError(error: AxiosError<ErrorResponse>) {
    toast.error("An error occurred while creating event ticket type");
  }

  const {
    mutate: createEventTicketType,
    isPending: createEventTicketTypeIsPending,
    isError: createEventTicketTypeIsError,
  } = useCreateEventTicketType(
    onCreateEventTicketTypeError,
    onCreateEventTicketTypeSuccess
  );

  function onSubmit({
    startDate,
    startTime,
    endDate,
    endTime,
    ...values
  }: Yup.InferType<typeof newTicketFormSchema>) {
    const [startTimeHours, startTimeMinutes] = startTime
      .split(":")
      .map((value) => Number(value));

    const [endTimeHours, endTimeMinutes] = endTime
      .split(":")
      .map((value) => Number(value));

    createEventTicketType({
      ...values,
      eventId: eventId || "",
      startDate: dateFnsTz
        .fromZonedTime(
          dateFns.add(dateFns.startOfDay(startDate), {
            hours: startTimeHours,
            minutes: startTimeMinutes,
          }),
          newYorkTimeZone
        )
        .toISOString(),
      endDate: dateFnsTz
        .fromZonedTime(
          dateFns.add(dateFns.startOfDay(endDate), {
            hours: endTimeHours,
            minutes: endTimeMinutes,
          }),
          newYorkTimeZone
        )
        .toISOString(),
    });
  }

  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogOverlay className="bg-black border bg-opacity-50 z-[99] backdrop-blur-sm fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <DialogContent className="bg-[#333333] text-[#A3A7AA] p-6 max-w-lg">
            <DialogTitle className="text-xl font-semibold">
              Add Ticket
            </DialogTitle>
            <DialogDescription className="hidden">
              Add new ticket dialog
            </DialogDescription>
            <DialogClose />

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* FREE OR PAID TICKET TYPE */}
              <div className="flex items-center gap-x-14 justify-between">
                <AdminButton
                  type="button"
                  variant="outline"
                  className={cn(
                    "flex-1 rounded-none font-medium transition-colors",
                    ticketCategory === "free" &&
                      "bg-[#4267B2] bg-opacity-15 border-[#4267B2] text-[#4267B2]"
                  )}
                  onClick={() => {
                    setValue("price", 0);
                    setTicketCategory("free");
                  }}
                >
                  Free
                </AdminButton>
                <AdminButton
                  type="button"
                  variant="outline"
                  className={cn(
                    "flex-1 rounded-none font-medium transition-colors",
                    ticketCategory === "paid" &&
                      "bg-[#4267B2] bg-opacity-15 outline-[#4267B2] text-[#4267B2]"
                  )}
                  onClick={() => {
                    setTicketCategory("paid");
                  }}
                >
                  Paid
                </AdminButton>
              </div>
              {/* END FREE OR PAID TICKET TYPE */}
              <div>
                <label htmlFor="name">Ticket Name*</label>
                <Input {...register("name")} />
                <FormError error={errors.name} />
              </div>
              <div>
                <label htmlFor="quantity">Ticket Quantity*</label>
                <Input {...register("quantity")} />
                <FormError error={errors.quantity} />
              </div>
              <div>
                <label htmlFor="price">Ticket Price</label>
                <IconInputField
                  variant="white"
                  disabled={ticketCategory === "free"}
                  className="bg-input-bg"
                  Icon={<FaDollarSign />}
                  value={ticketCategory === "free" ? watch("price") : undefined}
                  {...register("price")}
                />
                <FormError error={errors.price} />
              </div>
              <div className="flex items-center gap-x-4 gap-y-4">
                <div className="flex-1">
                  <label htmlFor="start-date">Start Date*</label>
                  <IconInputField
                    variant="white"
                    className="bg-input-bg"
                    Icon={<FaRegCalendar />}
                    {...register("startDate", { required: true })}
                    id="start-date"
                    type="date"
                  />
                  <FormError error={errors.startDate} />
                </div>
                <div className="flex-1">
                  <label htmlFor="start-time">Start Time*</label>
                  <IconInputField
                    variant="white"
                    id="start-time"
                    type="time"
                    className="bg-input-bg"
                    {...register("startTime", { required: true })}
                    Icon={<FaRegClock />}
                  />
                  <FormError error={errors.startTime} />
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="flex-1">
                  <label htmlFor="end-date">End Date*</label>
                  <IconInputField
                    variant="white"
                    className="bg-input-bg"
                    Icon={<FaRegCalendar />}
                    {...register("endDate", { required: true })}
                    type="date"
                  />
                  <FormError error={errors.endDate} />
                </div>
                <div className="flex-1">
                  <label htmlFor="end-time">End Time*</label>
                  <IconInputField
                    variant="white"
                    className="bg-input-bg"
                    Icon={<FaRegClock />}
                    type="time"
                    {...register("endTime", { required: true })}
                  />
                  <FormError error={errors.endTime} />
                </div>
              </div>

              <div className="flex items-center gap-x-12 mt-4 gap-y-4">
                <AdminButton
                  disabled={createEventTicketTypeIsPending}
                  type="button"
                  onClick={() => props?.onOpenChange?.(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  disabled={createEventTicketTypeIsPending}
                  variant="ghost"
                  className="flex-1"
                >
                  {createEventTicketTypeIsPending ? "Saving..." : "Save"}
                </AdminButton>
              </div>
            </form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}

function EditTicketDialog({
  ticketTypeId,
  defaultValues,
  ...props
}: ComponentProps<typeof Dialog> & {
  defaultValues: Yup.InferType<typeof editTicketFormSchema>;
  ticketTypeId: string;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<Yup.InferType<typeof editTicketFormSchema>>({
    resolver: yupResolver(editTicketFormSchema),
    defaultValues,
    shouldUnregister: false,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const [ticketCategory, setTicketCategory] = useState<"free" | "paid">("paid");

  function onUpdateTicketTypeSuccess(
    data: AxiosResponse<UpdateTicketTypeResponse>
  ) {
    SuccessToast({
      title: "Update successful",
      description: "Ticket type updated successfully",
    });
    props?.onOpenChange?.(false); // conditionally closing the modal dialog
  }

  function onUpdateTicketTypeError(error: AxiosError<ErrorResponse>) {
    const errorMessage = getApiErrorMessage(
      error,
      "An error occurred while updating event ticket type"
    );
    ErrorToast({ title: "Update error", descriptions: errorMessage });
  }

  const {
    mutate: updateTicketType,
    isPending: updateTicketTypeIsPending,
    isError: updateTicketTypeIsError,
  } = useUpdateTicketType(onUpdateTicketTypeError, onUpdateTicketTypeSuccess);

  function onSubmit({
    startDate,
    startTime,
    endDate,
    endTime,
    ...values
  }: Yup.InferType<typeof editTicketFormSchema>) {
    const [startTimeHours, startTimeMinutes] = startTime
      .split(":")
      .map((value) => Number(value));

    const [endTimeHours, endTimeMinutes] = endTime
      .split(":")
      .map((value) => Number(value));

    updateTicketType({
      ...values,
      startDate: dateFnsTz
        .fromZonedTime(
          dateFns.add(dateFns.startOfDay(startDate), {
            hours: startTimeHours,
            minutes: startTimeMinutes,
          }),
          newYorkTimeZone
        )
        .toISOString(),
      endDate: dateFnsTz
        .fromZonedTime(
          dateFns.add(dateFns.startOfDay(endDate), {
            hours: endTimeHours,
            minutes: endTimeMinutes,
          }),
          newYorkTimeZone
        )
        .toISOString(),
      ticketTypeId: ticketTypeId,
    });
  }

  const watchedEndDate = watch("endDate");
  const watchedStartDate = watch("startDate");
  // FIXME: Date not filling in on dialog dialog open
  useEffect(() => {
    setValue("endDate", defaultValues.endDate);
    setValue("startDate", defaultValues.startDate);
  }, [defaultValues]);

  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20 z-[99]">
          <DialogContent className="bg-[#333333] text-[#A3A7AA] p-6 max-w-lg">
            <DialogTitle className="text-xl font-semibold">
              Edit Ticket Details
            </DialogTitle>
            <DialogDescription className="hidden">
              Edit ticket dialog
            </DialogDescription>
            <DialogClose />

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* FREE OR PAID TICKET TYPE */}
              <div className="flex items-center gap-x-14 justify-between">
                <AdminButton
                  type="button"
                  variant="outline"
                  className={cn(
                    "flex-1 rounded-none font-medium transition-colors",
                    ticketCategory === "free" &&
                      "bg-[#4267B2] bg-opacity-15 border-[#4267B2] text-[#4267B2]"
                  )}
                  onClick={() => {
                    setValue("price", 0);
                    setTicketCategory("free");
                  }}
                >
                  Free
                </AdminButton>
                <AdminButton
                  type="button"
                  variant="outline"
                  className={cn(
                    "flex-1 rounded-none font-medium transition-colors",
                    ticketCategory === "paid" &&
                      "bg-[#4267B2] bg-opacity-15 outline-[#4267B2] text-[#4267B2]"
                  )}
                  onClick={() => {
                    setTicketCategory("paid");
                  }}
                >
                  Paid
                </AdminButton>
              </div>
              {/* END FREE OR PAID TICKET TYPE */}
              <div>
                <label htmlFor="name">Ticket Name*</label>
                <Input {...register("name")} />
                <FormError error={errors.name} />
              </div>
              <div>
                <label htmlFor="quantity">Ticket Quantity*</label>
                <Input {...register("quantity")} />
                <FormError error={errors.quantity} />
              </div>
              <div>
                <label htmlFor="price">Ticket Price</label>
                <IconInputField
                  variant="white"
                  disabled={ticketCategory === "free"}
                  className="bg-input-bg"
                  Icon={<FaDollarSign />}
                  value={ticketCategory === "free" ? watch("price") : undefined}
                  {...register("price")}
                />
                <FormError error={errors.price} />
              </div>
              <div className="flex items-center gap-x-4 gap-y-4">
                <div className="flex-1">
                  <label htmlFor="start-date">Start Date*</label>
                  <IconInputField
                    variant="white"
                    value={
                      new Date(watchedStartDate).toISOString().split("T")[0]
                    }
                    className="bg-input-bg"
                    Icon={<FaRegCalendar />}
                    {...register("startDate", { required: true })}
                    id="start-date"
                    type="date"
                  />
                  <FormError error={errors.startDate} />
                </div>
                <div className="flex-1">
                  <label htmlFor="start-time">Start Time*</label>
                  <IconInputField
                    variant="white"
                    id="start-time"
                    type="time"
                    className="bg-input-bg"
                    {...register("startTime", { required: true })}
                    Icon={<FaRegClock />}
                  />
                  <FormError error={errors.startTime} />
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="flex-1">
                  <label htmlFor="end-date">End Date*</label>
                  <IconInputField
                    variant="white"
                    value={new Date(watchedEndDate).toISOString().split("T")[0]}
                    className="bg-input-bg"
                    Icon={<FaRegCalendar />}
                    {...register("endDate", { required: true })}
                    type="date"
                  />
                  <FormError error={errors.endDate} />
                </div>
                <div className="flex-1">
                  <label htmlFor="end-time">End Time*</label>
                  <IconInputField
                    variant="white"
                    className="bg-input-bg"
                    Icon={<FaRegClock />}
                    type="time"
                    {...register("endTime", { required: true })}
                  />
                  <FormError error={errors.endTime} />
                </div>
              </div>

              <div className="flex items-center gap-x-12 mt-4 gap-y-4">
                <AdminButton
                  disabled={updateTicketTypeIsPending}
                  type="button"
                  onClick={() => props?.onOpenChange?.(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  disabled={updateTicketTypeIsPending}
                  variant="ghost"
                  className="flex-1"
                >
                  {updateTicketTypeIsPending ? "Saving..." : "Save"}
                </AdminButton>
              </div>
            </form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}

const actions = ["edit", "delete"] as const;

function ActionDropDown({
  ticketTypeId,
  handleAction,
}: {
  ticketTypeId: string;
  handleAction: (
    action: (typeof actions)[number],
    ticketTypeId: string
  ) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
      {/* <div className="relative"> */}
      {/* ACTION BUTTON */}
      <PopoverTrigger asChild>
        <button
          className="flex items-start mt-1"
          onClick={() => setDropdownOpen((state) => !state)}
        >
          <FiMoreVertical />
        </button>
      </PopoverTrigger>
      {/* ACTION BUTTON */}
      <PopoverPortal>
        <PopoverContent>
          <div
            className={cn(
              "bg-[#151515] text-white flex-col inline-flex divide-y divide-[#151515] min-w-36"
            )}
          >
            {actions.map((item) => {
              return (
                <button
                  key={item}
                  onClick={() => {
                    handleAction(item, ticketTypeId);
                    setDropdownOpen(false);
                  }}
                  className="px-6 py-3 hover:bg-[#2c2b2b] capitalize text-left"
                >
                  {item.toLowerCase()}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </PopoverPortal>
      {/* </div> */}
    </Popover>
  );
}

function NoTicketsToEditDialog({ ...props }: ComponentProps<typeof Dialog>) {
  // const [currentTab, setCurrentTab] = useQueryState(
  //   "tab",
  //   parseAsString.withDefault("details")
  // ) as SearchQueryState<Tabs>;
  const router = useRouter();
  return (
    <Dialog {...props} modal={true}>
      <DialogPortal>
        <DialogOverlay className="bg-black backdrop-blur-sm bg-opacity-50 z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <DialogContent className="relative bg-[#333333] text-[#A3A7AA] p-6 mx-auto py-9 max-w-lg">
            <div className="bg-red-500 text-white size-24 mx-auto rounded-full grid place-items-center">
              <MdGppBad className="text-4xl" />
            </div>

            <div className="text-white text-2xl lg:text-4xl font-medium text-center mt-16">
              Fetching ticket error
            </div>

            <div className="text-center my-6 space-y-4">
              <p className="text-white text-base lg:text-xl">
                Cannot fetch details of ticket to edit{" "}
              </p>
              <p className="text-text-color text-sm lg:text-base">
                You can go back or reload the page to try again.{" "}
              </p>
            </div>

            <div className="flex justify-center">
              <AdminButton
                variant="outline"
                className=""
                onClick={() => router.push("/admin/events/")}
              >
                GO BACK
              </AdminButton>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
