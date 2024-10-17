import React, { ComponentProps, useState } from "react";
import AdminButton from "../buttons/AdminButton";
import { FaPercentage, FaSave } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import Input from "../shared/Input";
import IconInputField from "../shared/IconInputField";
import {
  FaCheck,
  FaDollarSign,
  FaRegCalendar,
  FaRegClock,
} from "react-icons/fa6";
import { AiOutlinePercentage } from "react-icons/ai";
import RadioButton from "../shared/RadioButton";
import { FiMoreVertical, FiSave } from "react-icons/fi";
import { cn } from "@/utils/cn";
import { ErrorResponse, Event, TicketType } from "@/constants/types";
import {
  useCreateEventPromocode,
  useGetEventTicketTypes,
  useGetPromocodes,
} from "@/api/events/events.queries";
import toast from "react-hot-toast";
import LoadingSvg from "../shared/Loader/LoadingSvg";
// import { useNewEventStore } from "@/store/new-event.store";
import { newPromocodeFormSchema } from "@/api/events/events.schemas";
import { AxiosError, AxiosResponse } from "axios";
import { CreateEventPromocodeResponse } from "@/api/events/events.types";
import { FormError } from "../shared/FormError";
import { parseAsString, useQueryState } from "nuqs";

export default function PromoCodeTab({ isActive }: { isActive: boolean }) {
  const [addPromoCodeDialogOpen, setAddPromoCodeDialogOpen] = useState(false);
  const [eventId, setEventId] = useQueryState(
    "newEventId",
    parseAsString.withDefault("")
  );
  // const newEventId = useNewEventStore((state) => state.eventId);

  const ticketTypesQuery = useGetEventTicketTypes(eventId || "");
  const ticketTypes = ticketTypesQuery.data?.data;

  const promocodesQuery = useGetPromocodes(eventId || "");
  const promocodes = promocodesQuery.data?.data;

  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("details")
  );

  // Won't render the contents of promocode tab if there are no ticket types..
  if (ticketTypesQuery.isPending) {
    return (
      <div
        className={cn(
          "text-white flex items-center gap-x-2",
          isActive ? "block" : "hidden"
        )}
      >
        <span>Loading ticket types..</span>
        <LoadingSvg />
      </div>
    );
  } else if (ticketTypesQuery.isError) {
    toast.error(
      ticketTypesQuery.error.response?.data.message ||
        "An error occurred while fetching ticket types.."
    );

    return (
      <div
        className={cn(
          "text-white flex items-center gap-x-2",
          isActive ? "block" : "hidden"
        )}
      >
        Error loading ticket types..
      </div>
    );
  } else if (!ticketTypes || ticketTypes.length < 1) {
    return (
      <div
        className={cn(
          "text-white flex items-center gap-x-2",
          isActive ? "block" : "hidden"
        )}
      >
        Ticket types not available
      </div>
    );
  }

  return (
    <div className={cn("mt-10", isActive ? "block" : "hidden")}>
      <AdminButton
        variant="outline"
        onClick={() => setAddPromoCodeDialogOpen(true)}
        className="flex items-center px-6 gap-x-2"
      >
        <FaSave className="-mt-1" />
        <span>Add Promo Code</span>
      </AdminButton>
      <AddPromoCodeDialog
        ticketTypes={ticketTypes}
        open={addPromoCodeDialogOpen}
        onOpenChange={setAddPromoCodeDialogOpen}
      />

      {/* PROMO CODE TABLE LIST */}
      <div className="overflow-x-auto text-[#A3A7AA] mt-10">
        <table className="w-full text-left">
          <thead className="bg-[#A3A7AA] text-black leading-10 font-medium [&_th]:px-4">
            <tr>
              <th>Name</th>
              <th>Discount </th>
              <th>Uses/Limit</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="[&_td]:p-4">
            {promocodes ? (
              promocodes.map((promocode) => {
                return (
                  <tr className="border-b border-b-[#151515]">
                    <td>{promocode.name}</td>
                    <td>
                      {`${promocode.absoluteDiscountAmount.toFixed(2)}` ||
                        `${promocode.percentageDiscountAmount}%`}
                    </td>
                    {/* TODO: work on this */}
                    <td>{promocode.limit}</td>
                    <td></td>{" "}
                    {/* TODO: display status showing if promocode is still active */}
                    <td>
                      <FiMoreVertical />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="text-white py-4" colSpan={5}>
                  Promo codes list is empty
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* END PROMO CODE TABLE LIST */}

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

function AddPromoCodeDialog({
  ticketTypes,
  ...props
}: ComponentProps<typeof Dialog> & {
  ticketTypes: TicketType[];
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<Yup.InferType<typeof newPromocodeFormSchema>>({
    resolver: yupResolver(newPromocodeFormSchema),
    defaultValues: {
      applyToTicketIds: ticketTypes.map((ticketType) => ticketType.id),
    },
  });

  // const newEventId = useNewEventStore((state) => state.eventId);
  const [eventId, setEventId] = useQueryState(
    "newEventId",
    parseAsString.withDefault("")
  );
  const [pickType, setPickType] = useState<"all" | "selected">("all");

  function onError(error: AxiosError<ErrorResponse>) {
    toast.error("Unable to create promocode");
  }

  function onSuccess(data: AxiosResponse<CreateEventPromocodeResponse>) {
    toast.success("Event promocode successfully created");
    reset();
  }

  const {
    mutate: createEventPromoCode,
    isPending: createEventPromoCodeIspending,
  } = useCreateEventPromocode(onError, onSuccess, eventId || "");

  // For ticketIds to apply promo code to..
  // const [selectedTicketTypeIds, setSelectedTicketTypeIds] = useState<
  //   TicketType["id"][]
  // >([]);
  const selectedTicketTypeIds = watch("applyToTicketIds");
  const setSelectedTicketTypeIds = (value: string[]) =>
    setValue("applyToTicketIds", value);

  function onSubmit(values: Yup.InferType<typeof newPromocodeFormSchema>) {
    createEventPromoCode(values);
  }

  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <DialogContent className="bg-[#333333] text-[#A3A7AA] p-6 max-w-md">
            <DialogTitle className="text-xl font-semibold">
              Add Code
            </DialogTitle>
            <DialogDescription className="hidden">
              Add new promo code
            </DialogDescription>
            <DialogClose />

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name">Code Name*</label>
                <Input {...register("name")} />
                <FormError error={errors.name} />
              </div>
              <div>
                <label htmlFor="code-key">Code Key*</label>
                <div className="text-xs">
                  Secret key that applies the discount
                </div>
                <Input {...register("key")} />
                <FormError error={errors.key} />
              </div>
              <div>
                <label htmlFor="ticket-limit">Ticket Limit*</label>
                <Input {...register("limit")} />
                <FormError error={errors.limit} />
              </div>
              <label htmlFor="discount-amount">Discount Amount</label>
              <div className="flex items-center gap-x-4 gap-y-4">
                <div className="flex-1">
                  <IconInputField
                    className="bg-input-bg"
                    Icon={<FaDollarSign />}
                    {...register("absoluteDiscountAmount")}
                  />
                  <FormError error={errors.absoluteDiscountAmount} />
                </div>
                <div>or</div>
                <div className="flex-1">
                  <IconInputField
                    className="bg-input-bg"
                    Icon={<AiOutlinePercentage />}
                    {...register("percentageDiscountAmount")}
                  />
                  <FormError error={errors.percentageDiscountAmount} />
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
                  <label htmlFor="quantity">Start Time*</label>
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

              <div className="space-y-4 mt-6">
                <div>Apply code to:</div>
                <div className="flex items-center gap-x-3">
                  <RadioButton
                    selected={pickType === "all"}
                    value={"all"}
                    onSelect={() => {
                      setSelectedTicketTypeIds(
                        ticketTypes.map((ticketType) => ticketType.id)
                      );
                      setPickType("all");
                    }}
                  />
                  <div>All visible tickets</div>
                </div>
                <div className="flex items-center gap-x-3">
                  <RadioButton
                    value={"selected"}
                    selected={pickType === "selected"}
                    onSelect={() => {
                      setSelectedTicketTypeIds(
                        ticketTypes.map((ticketType) => ticketType.id)
                      );
                      setPickType("selected");
                    }}
                  />
                  <div className="flex w-full">
                    <div>Only certain visible tickets</div>
                    <SelectTicketsDropDown
                      disabled={pickType === "all"}
                      ticketTypes={ticketTypes}
                      selectedTicketTypeIds={selectedTicketTypeIds}
                      setSelectedTicketTypeIds={setSelectedTicketTypeIds}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-x-12 mt-4 gap-y-4">
                <AdminButton
                  type="button"
                  onClick={() => props?.onOpenChange?.(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  disabled={createEventPromoCodeIspending}
                  variant="ghost"
                  className="flex-1"
                >
                  {createEventPromoCodeIspending ? "Saving.." : "Save"}
                </AdminButton>
              </div>
            </form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}

function SelectTicketsDropDown({
  disabled,
  ticketTypes,
  selectedTicketTypeIds,
  setSelectedTicketTypeIds,
}: {
  disabled: boolean;
  ticketTypes: TicketType[];
  selectedTicketTypeIds: TicketType["id"][];
  setSelectedTicketTypeIds: (value: string[]) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleSelectTicketTypeId(ticketTypeId: string) {
    // setSelectedTicketTypeIds((prevState) => {
    const ticketTypeIdExists = selectedTicketTypeIds.includes(ticketTypeId);
    if (ticketTypeIdExists) {
      setSelectedTicketTypeIds(
        selectedTicketTypeIds.filter((selectedId) => {
          if (ticketTypeId === selectedId) {
            return false;
          } else {
            return true;
          }
        })
      );
    } else {
      setSelectedTicketTypeIds([...selectedTicketTypeIds, ticketTypeId]);
    }
    // });
  }

  return (
    <div className="relative ml-auto">
      {/* ACTION BUTTON */}
      <button
        disabled={disabled}
        type="button"
        className="text-[#4267B2] disabled:text-[#BDBDBD]"
        onClick={() => setDropdownOpen((state) => !state)}
      >
        Select
      </button>
      {/* ACTION BUTTON */}
      <div
        className={cn(
          "bg-[#151515] flex-col inline-flex divide-y divide-[#151515] min-w-56 absolute z-[1] top-8 mt-2 right-0 overflow-hidden",
          dropdownOpen ? "h-max" : "h-0"
        )}
      >
        {ticketTypes?.map((ticketType) => {
          return (
            <button
              key={ticketType.id}
              onClick={() => {
                handleSelectTicketTypeId(ticketType.id);
              }}
              className="px-6 py-3 hover:bg-[#2c2b2b] capitalize flex items-center gap-x-2"
            >
              <FaCheck
                className={cn(
                  "text-[#34C759] invisible",
                  selectedTicketTypeIds.includes(ticketType.id) && "visible"
                )}
              />
              <span>{ticketType.name.toLowerCase()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
