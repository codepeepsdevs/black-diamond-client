import { useCreateEventTicketType } from "@/api/events/events.queries";
import { newTicketFormSchema } from "@/api/events/events.schemas";
import { CreateEventTicketTypeResponse } from "@/api/events/events.types";
import { ErrorResponse } from "@/constants/types";
import { cn } from "@/utils/cn";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { AxiosError, AxiosResponse } from "axios";
import { useParams } from "next/navigation";
import { ComponentProps, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaDollarSign, FaRegCalendar, FaRegClock } from "react-icons/fa6";
import * as Yup from "yup";
import AdminButton from "../buttons/AdminButton";
import { SelectVisibilityDropDown } from "../newEvents/TicketTypeVisibility";
import { FormError } from "./FormError";
import IconInputField from "./IconInputField";
import Input from "./Input";
import { FiChevronUp } from "react-icons/fi";
import SuccessToast from "../toast/SuccessToast";

export function NewTicketDialog({
  ...props
}: ComponentProps<typeof Dialog> & { eventId: string }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<Yup.InferType<typeof newTicketFormSchema>>({
    resolver: yupResolver(newTicketFormSchema),
    defaultValues: {
      visibility: "VISIBLE",
    },
  });

  const [ticketCategory, setTicketCategory] = useState<"free" | "paid">("paid");
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const [advancedOpen, setAdvancedOpen] = useState(false);
  function onCreateEventTicketTypeSuccess(
    data: AxiosResponse<CreateEventTicketTypeResponse>
  ) {
    SuccessToast({
      title: "Success",
      description: `${data?.data?.name}  Ticket type created successfully`,
    });
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
    endDate,
    startTime,
    endTime,
    ...values
  }: Yup.InferType<typeof newTicketFormSchema>) {
    let dates = {};
    if (values.visibility === "CUSTOM_SCHEDULE" && startDate && endDate) {
      dates = {
        startDate: new Date(startDate).toISOString(),
        startTime,
        endDate: new Date(endDate).toISOString(),
        endTime,
      };
    }
    createEventTicketType({
      ...values,
      eventId: eventId || "",
      ...dates,
    });
  }

  const watchedVisibility = watch("visibility");

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
                      watchedVisibility === "CUSTOM_SCHEDULE" && "flex"
                    )}
                  >
                    <div className="flex-1">
                      <label htmlFor="start-date">Start Date*</label>
                      <IconInputField
                        variant="white"
                        className="bg-input-bg"
                        Icon={<FaRegCalendar />}
                        {...register("startDate", { required: true })}
                        id="start-date"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
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
                      watchedVisibility === "CUSTOM_SCHEDULE" && "flex"
                    )}
                  >
                    <div className="flex-1">
                      <label htmlFor="end-date">End Date*</label>
                      <IconInputField
                        variant="white"
                        className="bg-input-bg"
                        Icon={<FaRegCalendar />}
                        {...register("endDate", { required: true })}
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
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
