import { useCreateEventPromocode } from "@/api/events/events.queries";
import { newPromocodeFormSchema } from "@/api/events/events.schemas";
import { CreateEventPromocodeResponse } from "@/api/events/events.types";
import { TicketType, ErrorResponse } from "@/constants/types";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@radix-ui/react-dialog";
import { AxiosError, AxiosResponse } from "axios";
import { useParams } from "next/navigation";
import { ComponentProps, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlinePercentage } from "react-icons/ai";
import { FaDollarSign, FaRegCalendar, FaRegClock } from "react-icons/fa";
import AdminButton from "../buttons/AdminButton";
import ErrorToast from "../toast/ErrorToast";
import { FormError } from "./FormError";
import IconInputField from "./IconInputField";
import RadioButton from "./RadioButton";
import Input from "./Input";
import * as Yup from "yup";
import { SelectTicketsDropDown } from "./PromocodeTicketsDropdown";
import SuccessToast from "../toast/SuccessToast";

export function AddPromoCodeDialog({
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

  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const [pickType, setPickType] = useState<"all" | "selected">("all");

  function onError(error: AxiosError<ErrorResponse>) {
    const errorMessage = getApiErrorMessage(
      error,
      "Unable to create promocode"
    );
    ErrorToast({
      title: "Error",
      descriptions: errorMessage,
    });
  }

  function onSuccess(data: AxiosResponse<CreateEventPromocodeResponse>) {
    SuccessToast({
      title: "Success",
      description: "Event promocode successfully created",
    });
    reset();
    props.onOpenChange?.(false);
  }

  const {
    mutate: createEventPromoCode,
    isPending: createEventPromoCodeIspending,
  } = useCreateEventPromocode(onError, onSuccess, eventId);

  const selectedTicketTypeIds = watch("applyToTicketIds");
  const setSelectedTicketTypeIds = (value: string[]) =>
    setValue("applyToTicketIds", value);

  function onSubmit(values: Yup.InferType<typeof newPromocodeFormSchema>) {
    createEventPromoCode({ ...values, eventId });
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
                    min={new Date().toISOString().split("T")[0]}
                    max="9999-12-31"
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
                    min={new Date().toISOString().split("T")[0]}
                    max="9999-12-31"
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
                        ticketTypes
                          .filter(
                            (ticketType) => ticketType.visibility !== "HIDDEN"
                          )
                          .map((ticketType) => ticketType.id)
                      );
                      setPickType("selected");
                    }}
                  />
                  <div className="flex w-full">
                    <div>Only certain visible tickets</div>
                    <SelectTicketsDropDown
                      disabled={pickType === "all"}
                      ticketTypes={ticketTypes.filter(
                        (ticketType) => ticketType.visibility !== "HIDDEN"
                      )}
                      selectedTicketTypeIds={selectedTicketTypeIds}
                      setSelectedTicketTypeIds={setSelectedTicketTypeIds}
                    />
                    <FormError error={errors.applyToTicketIds?.[0]} />
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
