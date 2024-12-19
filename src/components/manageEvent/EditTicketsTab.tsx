import React, { ComponentProps, useEffect, useRef, useState } from "react";
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
import {
  FaDollarSign,
  FaEye,
  FaRegCalendar,
  FaRegClock,
} from "react-icons/fa6";
import { cn } from "@/utils/cn";
import {
  ticketFormSchema,
  updateEventTicketTypeSchema,
} from "@/api/events/events.schemas";
import { FiChevronUp, FiEyeOff, FiMoreVertical } from "react-icons/fi";
import { BsDot } from "react-icons/bs";
import Checkbox from "../shared/Checkbox";
import { parseAsString, useQueryState } from "nuqs";
import {
  useAdminGetEvent,
  useDeleteTicketType,
  useGetEventTicketTypes,
  useUpdateTicketType,
} from "@/api/events/events.queries";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse } from "@/constants/types";
import {
  CreateEventTicketTypeResponse,
  DeleteTicketTypeResponse,
  UpdateTicketTypeResponse,
} from "@/api/events/events.types";
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
import { useParams, useRouter } from "next/navigation";
import ErrorToast from "../toast/ErrorToast";
import SuccessToast from "../toast/SuccessToast";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import { useGetTicketTypeSales } from "@/api/order/order.queries";
import { newYorkTimeZone } from "@/utils/date-formatter";
import { SelectVisibilityDropDown } from "../newEvents/TicketTypeVisibility";
import { NewTicketDialog } from "../shared/NewTicketDialog";
import toast from "react-hot-toast";
import LoadingMessage from "../shared/Loader/LoadingMessage";
import NotOnSaleStatus from "./NotOnSaleStatus";
import SaleEndedStatus from "./SaleEndedStatus";
import OnSaleStatus from "./OnSaleStatus";
import SoldOutStatus from "./SoldOutStatus";

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
  let loadingToastId = useRef("");
  const [ticketToEdit, setTicketToEdit] = useState<Yup.InferType<
    typeof ticketFormSchema
  > | null>(null);

  const eventQuery = useAdminGetEvent(eventId);
  const eventData = eventQuery.data?.data;

  const onDeleteSuccess = async (
    data: AxiosResponse<DeleteTicketTypeResponse>
  ) => {
    SuccessToast({
      title: "Success",
      description: data.data.message || "Ticket type deleted successfully",
    });
    toast.dismiss(loadingToastId.current);
  };

  const onDeleteError = async (e: AxiosError<ErrorResponse>) => {
    const errorMessage = getApiErrorMessage(e, "Something went wrong");
    ErrorToast({
      title: "Error",
      descriptions: errorMessage,
    });
    toast.dismiss(loadingToastId.current);
  };

  const { mutate: deleteTicketType, isPending: deleteTicketTypePending } =
    useDeleteTicketType(onDeleteError, onDeleteSuccess);

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
          endDate: dateFns.format(zonedEndDate, "yyyy-MM-dd"),
          endTime: dateFns.format(zonedEndDate, "HH:mm"),
          maxQty: ticketToEdit.maxQty,
          minQty: ticketToEdit.minQty,
          visibility: ticketToEdit.visibility,
        });
        setTicketToEditId(ticketToEdit.id);
        setEditTicketDialogOpen(true);
        break;
      case "delete":
        //   TODO: handle delete tickettype?
        deleteTicketType({ ticketTypeId });

        loadingToastId.current = toast.loading("Deleting ticket type");
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

        <div className="overflow-x-auto text-[#A3A7AA] mt-10">
          <table className="w-full text-left">
            <thead className="bg-[#A3A7AA] text-black leading-10 font-medium [&_th]:px-4">
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Sold/Total</th>
                <th>Price </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="[&_td]:p-4">
              {ticketTypes.isPending ? (
                <tr>
                  <td colSpan={5}>
                    <LoadingMessage>Loading ticket types..</LoadingMessage>
                  </td>
                </tr>
              ) : null}
              {ticketTypes.data?.data ? (
                ticketTypes.data?.data.map((ticketType) => {
                  const soldOut =
                    ticketType._count.tickets >= ticketType.quantity;
                  return (
                    <tr
                      className="border-b border-b-[#151515] hover:bg-[#131313] transition-all cursor-pointer"
                      key={ticketType.id}
                      onClick={() => handleAction("edit", ticketType.id)}
                    >
                      <td>{ticketType.name}</td>
                      <td>
                        <div className="flex items-center mt-2 min-w-72">
                          {ticketType.saleStatus === "not-on-sale" ? (
                            <NotOnSaleStatus
                              eventData={eventData}
                              ticketType={ticketType}
                            />
                          ) : ticketType.saleStatus === "sale-ended" ? (
                            <SaleEndedStatus
                              eventData={eventData}
                              ticketType={ticketType}
                            />
                          ) : !soldOut ? (
                            <OnSaleStatus
                              eventData={eventData}
                              ticketType={ticketType}
                            />
                          ) : (
                            <SoldOutStatus
                              eventData={eventData}
                              ticketType={ticketType}
                            />
                          )}
                        </div>
                        {ticketType.visibility === "HIDDEN" ? (
                          <p className="flex gap-x-1 items-center text-xs ml-6">
                            <FiEyeOff />
                            <span className="">Hidden</span>
                          </p>
                        ) : null}
                      </td>
                      <td>
                        {ticketType._count.tickets}/{ticketType.quantity}
                      </td>
                      <td>${ticketType.price.toFixed(2)}</td>
                      <td>
                        <ActionDropDown
                          disabled={deleteTicketTypePending}
                          handleAction={handleAction}
                          ticketTypeId={ticketType.id}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="text-white py-4" colSpan={5}>
                    No ticket type created
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* END TICKET TYPE LIST */}

        {/* DISPLAY SETTINGS */}
        {/* <form className="mt-12" onSubmit={handleSubmit(onSubmit)}>
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
        </form> */}
        {/* END DISPLAY SETTINGS */}
      </div>
      {/* <NoTicketsToEditDialog  /> */}
      <NewTicketDialog
        eventId={eventId}
        open={newTicketDialogOpen}
        onOpenChange={setNewTicketDialogOpen}
      />
    </>
  );
}

function EditTicketDialog({
  ticketTypeId,
  defaultValues,
  ...props
}: ComponentProps<typeof Dialog> & {
  defaultValues: Yup.InferType<typeof ticketFormSchema>;
  ticketTypeId: string;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<Yup.InferType<typeof ticketFormSchema>>({
    resolver: yupResolver(ticketFormSchema),
    defaultValues,
    shouldUnregister: false,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const [ticketCategory, setTicketCategory] = useState<"free" | "paid">("paid");
  const [advancedOpen, setAdvancedOpen] = useState(false);

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
  }: Yup.InferType<typeof ticketFormSchema>) {
    let dates = {};
    if (
      (values.visibility === "CUSTOM_SCHEDULE" ||
        values.visibility === "HIDDEN_WHEN_NOT_ON_SALE") &&
      startDate &&
      endDate
    ) {
      dates = {
        startDate: new Date(startDate).toISOString(),
        startTime,
        endDate: new Date(endDate).toISOString(),
        endTime,
      };
    }
    updateTicketType({
      ticketTypeId: ticketTypeId,
      ...values,
      ...dates,
    });
  }

  const watchedEndDate = watch("endDate");
  const watchedStartDate = watch("startDate");
  const watchedVisibility = watch("visibility");

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
              <div>
                <button
                  type="button"
                  className="flex items-center gap-x-1"
                  onClick={() => setAdvancedOpen((state) => !state)}
                >
                  <FiChevronUp
                    className={cn(
                      "text-xl transition-transform",
                      !advancedOpen && "rotate-180"
                    )}
                  />
                  Advanced settings
                </button>
                <div
                  className={cn(
                    !advancedOpen && "invisible h-0 overflow-hidden"
                  )}
                >
                  <div>
                    <p>Tickets per order</p>
                    <div className="flex items-center gap-x-4 gap-y-4">
                      <div className="flex-1">
                        <label htmlFor="min-qty">Min Quantity</label>
                        <Input
                          variant="white"
                          {...register("minQty")}
                          id="min-qty"
                          type="number"
                          pattern="[0-9]"
                          min={1}
                        />
                        <FormError error={errors.minQty} />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="max-qty">Max Qty</label>
                        <Input
                          variant="white"
                          id="min-qty"
                          type="number"
                          {...register("maxQty")}
                          pattern="[0-9]"
                          min={1}
                        />
                        <FormError error={errors.maxQty} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="visibility">Visibility*</label>
                    <SelectVisibilityDropDown
                      selected={watchedVisibility}
                      setSelected={(value) => setValue("visibility", value)}
                    />
                    <FormError error={errors.visibility} />
                  </div>
                  <div
                    className={cn(
                      "hidden items-center gap-x-4 gap-y-4 transition overflow-hidden",
                      (watchedVisibility === "CUSTOM_SCHEDULE" ||
                        watchedVisibility === "HIDDEN_WHEN_NOT_ON_SALE") &&
                        "flex"
                    )}
                  >
                    <div className="flex-1">
                      <label htmlFor="start-date">Start Date*</label>
                      <IconInputField
                        variant="white"
                        value={
                          new Date(watchedStartDate || new Date())
                            .toISOString()
                            .split("T")[0]
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
                  <div
                    className={cn(
                      "hidden items-center gap-x-4 gap-y-4 transition overflow-hidden",
                      (watchedVisibility === "CUSTOM_SCHEDULE" ||
                        watchedVisibility === "HIDDEN_WHEN_NOT_ON_SALE") &&
                        "flex"
                    )}
                  >
                    <div className="flex-1">
                      <label htmlFor="end-date">End Date*</label>
                      <IconInputField
                        variant="white"
                        value={
                          new Date(watchedEndDate || new Date())
                            .toISOString()
                            .split("T")[0]
                        }
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
  disabled,
}: {
  ticketTypeId: string;
  disabled?: boolean;
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
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen((state) => !state);
          }}
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
                  disabled={disabled}
                  key={item}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(item, ticketTypeId);
                    setDropdownOpen(false);
                  }}
                  className="px-6 py-3 hover:bg-[#2c2b2b] capitalize text-left disabled:text-opacity-50"
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
