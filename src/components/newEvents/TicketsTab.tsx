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
import {
  FaCheck,
  FaDollarSign,
  FaRegCalendar,
  FaRegClock,
} from "react-icons/fa6";
import { cn } from "@/utils/cn";
import {
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
} from "@/api/events/events.queries";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse } from "@/constants/types";
import { CreateEventTicketTypeResponse } from "@/api/events/events.types";
// import { useNewEventStore } from "@/store/new-event.store";
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
import { newYorkTimeZone } from "@/utils/date-formatter";
import { SelectVisibilityDropDown } from "./TicketTypeVisibility";
import { NewTicketDialog } from "../shared/NewTicketDialog";

export default function TicketsTab({ isActive }: { isActive: boolean }) {
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("details")
  );
  // const eventId = useNewEventStore((state) => state.eventId);
  const [eventId, setEventId] = useQueryState(
    "newEventId",
    parseAsString.withDefault("")
  );

  const { register, formState, handleSubmit, setValue, watch } = useForm<
    Yup.InferType<typeof updateEventTicketTypeSchema>
  >({
    resolver: yupResolver(updateEventTicketTypeSchema),
  });

  const watchedDisplayTicketsRemainder = watch("displayTicketsRemainder");
  const watchedShowSalesEndMessage = watch("showSalesEndMessage");

  function onSubmit(values: Yup.InferType<typeof updateEventTicketTypeSchema>) {
    setCurrentTab("code");
  }
  const ticketTypes = useGetEventTicketTypes(eventId || "");

  function handleAction(
    action: (typeof actions)[number],
    ticketTypeId: string
  ) {
    switch (action) {
      case "edit":
        //   TODO: handle edit tickettype
        break;
      case "delete":
      //   TODO: handle delete tickettype?
    }
  }

  return (
    <div className={cn("mt-16 text-[#A3A7AA]", isActive ? "block" : "hidden")}>
      <AdminButton
        variant="outline"
        onClick={() => setNewTicketDialogOpen(true)}
        className="flex items-center px-6 gap-x-2"
      >
        <FaSave className="-mt-1" />
        <span>Add New Ticket</span>
      </AdminButton>
      <NewTicketDialog
        eventId={eventId}
        open={newTicketDialogOpen}
        onOpenChange={setNewTicketDialogOpen}
      />

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
                  {ticketType.endDate ? (
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
                  ) : null}
                </div>
                <div>Sold: </div>
                <div>
                  {ticketType._count.tickets}/{ticketType.quantity}
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
  );
}

// function AddTicketDialog({ ...props }: ComponentProps<typeof Dialog>) {
//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//   } = useForm<Yup.InferType<typeof newTicketFormSchema>>({
//     resolver: yupResolver(newTicketFormSchema),
//   });

//   const [ticketCategory, setTicketCategory] = useState<"free" | "paid">("paid");
//   // const eventId = useNewEventStore((state) => state.eventId);
//   const [eventId, setEventId] = useQueryState(
//     "newEventId",
//     parseAsString.withDefault("")
//   );

//   function onCreateEventTicketTypeSuccess(
//     data: AxiosResponse<CreateEventTicketTypeResponse>
//   ) {
//     toast.success(data?.data?.name + "Ticket type created successfully");
//     // The new ticket types should be automatically fetched because the query cache has been invalidated
//     props?.onOpenChange?.(false); // conditionally closing the modal dialog
//     reset();
//   }

//   function onCreateEventTicketTypeError(error: AxiosError<ErrorResponse>) {
//     toast.error("An error occurred while creating event ticket type");
//   }

//   const {
//     mutate: createEventTicketType,
//     isPending: createEventTicketTypeIsPending,
//     isError: createEventTicketTypeIsError,
//   } = useCreateEventTicketType(
//     onCreateEventTicketTypeError,
//     onCreateEventTicketTypeSuccess
//   );

//   function onSubmit({
//     startDate,
//     endDate,
//     ...values
//   }: Yup.InferType<typeof newTicketFormSchema>) {
//     createEventTicketType({
//       ...values,
//       eventId: eventId || "",
//       startDate: new Date(startDate).toISOString(),
//       endDate: new Date(endDate).toISOString(),
//     });
//   }

//   const watchedVisibility = watch("visibility");

//   return (
//     <Dialog {...props}>
//       <DialogPortal>
//         <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
//           <DialogContent className="bg-[#333333] text-[#A3A7AA] p-6 w-96">
//             <DialogTitle className="text-xl font-semibold">
//               Add Ticket
//             </DialogTitle>
//             <DialogDescription className="hidden">
//               Add new ticket dialog
//             </DialogDescription>
//             <DialogClose />

//             <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
//               {/* FREE OR PAID TICKET TYPE */}
//               <div className="flex items-center gap-x-14 justify-between">
//                 <AdminButton
//                   type="button"
//                   variant="outline"
//                   className={cn(
//                     "flex-1 rounded-none font-medium transition-colors",
//                     ticketCategory === "free" &&
//                       "bg-[#4267B2] bg-opacity-15 border-[#4267B2] text-[#4267B2]"
//                   )}
//                   onClick={() => {
//                     setValue("price", 0);
//                     setTicketCategory("free");
//                   }}
//                 >
//                   Free
//                 </AdminButton>
//                 <AdminButton
//                   type="button"
//                   variant="outline"
//                   className={cn(
//                     "flex-1 rounded-none font-medium transition-colors",
//                     ticketCategory === "paid" &&
//                       "bg-[#4267B2] bg-opacity-15 outline-[#4267B2] text-[#4267B2]"
//                   )}
//                   onClick={() => {
//                     setTicketCategory("paid");
//                   }}
//                 >
//                   Paid
//                 </AdminButton>
//               </div>
//               {/* END FREE OR PAID TICKET TYPE */}
//               <div>
//                 <label htmlFor="name">Ticket Name*</label>
//                 <Input {...register("name")} />
//                 <FormError error={errors.name} />
//               </div>
//               <div>
//                 <label htmlFor="quantity">Ticket Quantity*</label>
//                 <Input {...register("quantity")} />
//                 <FormError error={errors.quantity} />
//               </div>
//               <div>
//                 <label htmlFor="price">Ticket Price</label>
//                 <IconInputField
//                   variant="white"
//                   disabled={ticketCategory === "free"}
//                   className="bg-input-bg"
//                   Icon={<FaDollarSign />}
//                   value={ticketCategory === "free" ? watch("price") : undefined}
//                   {...register("price")}
//                 />
//                 <FormError error={errors.price} />
//               </div>
//               <div>
//                 <label htmlFor="visibility">Visibility*</label>
//                 <SelectVisibilityDropDown
//                   selected={watchedVisibility}
//                   setSelected={(value) => setValue("visibility", value)}
//                 />
//                 <FormError error={errors.visibility} />
//               </div>
//               <div className="flex items-center gap-x-4 gap-y-4">
//                 <div>
//                   <label htmlFor="start-date">Start Date*</label>
//                   <IconInputField
//                     className="bg-input-bg"
//                     Icon={<FaRegCalendar />}
//                     {...register("startDate", { required: true })}
//                     id="start-date"
//                     type="date"
//                   />
//                   <FormError error={errors.startDate} />
//                 </div>
//                 <div>
//                   <label htmlFor="start-time">Start Time*</label>
//                   <IconInputField
//                     id="start-time"
//                     type="time"
//                     className="bg-input-bg"
//                     {...register("startTime", { required: true })}
//                     Icon={<FaRegClock />}
//                   />
//                   <FormError error={errors.startTime} />
//                 </div>
//               </div>
//               <div className="flex items-center gap-x-4">
//                 <div className="flex-1">
//                   <label htmlFor="end-date">End Date*</label>
//                   <IconInputField
//                     className="bg-input-bg"
//                     Icon={<FaRegCalendar />}
//                     {...register("endDate", { required: true })}
//                     type="date"
//                   />
//                   <FormError error={errors.endDate} />
//                 </div>
//                 <div className="flex-1">
//                   <label htmlFor="end-time">End Time*</label>
//                   <IconInputField
//                     className="bg-input-bg"
//                     Icon={<FaRegClock />}
//                     type="time"
//                     {...register("endTime", { required: true })}
//                   />
//                   <FormError error={errors.endTime} />
//                 </div>
//               </div>

//               <div className="flex items-center gap-x-12 mt-4 gap-y-4">
//                 <AdminButton
//                   disabled={createEventTicketTypeIsPending}
//                   type="button"
//                   onClick={() => props?.onOpenChange?.(false)}
//                   variant="outline"
//                   className="flex-1"
//                 >
//                   Cancel
//                 </AdminButton>
//                 <AdminButton
//                   disabled={createEventTicketTypeIsPending}
//                   variant="ghost"
//                   className="flex-1"
//                 >
//                   {createEventTicketTypeIsPending ? "Saving..." : "Save"}
//                 </AdminButton>
//               </div>
//             </form>
//           </DialogContent>
//         </DialogOverlay>
//       </DialogPortal>
//     </Dialog>
//   );
// }

const actions = ["edit", "copy", "delete"] as const;

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
