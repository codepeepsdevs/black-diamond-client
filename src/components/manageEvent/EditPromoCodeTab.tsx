import React, { ComponentProps, useEffect, useRef, useState } from "react";
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
import {
  ErrorResponse,
  Event,
  SearchQueryState,
  TicketType,
} from "@/constants/types";
import {
  useCreateEventPromocode,
  useDeletePromocode,
  useGetEventTicketTypes,
  useGetPromocodes,
  useUpdatePromocode,
} from "@/api/events/events.queries";
import toast from "react-hot-toast";
import LoadingSvg from "../shared/Loader/LoadingSvg";
import { newPromocodeFormSchema } from "@/api/events/events.schemas";
import { AxiosError, AxiosResponse } from "axios";
import {
  CreateEventPromocodeResponse,
  DeletePromocodeResponse,
} from "@/api/events/events.types";
import { FormError } from "../shared/FormError";
import { parseAsString, useQueryState } from "nuqs";
import { MdGppBad } from "react-icons/md";
import { Tabs } from "@/app/admin/events/new-event/page";
import { useParams } from "next/navigation";
import { SelectTicketsDropDown } from "../shared/PromocodeTicketsDropdown";
import { AddPromoCodeDialog } from "../shared/AddPromocodeDialog";
import LoadingMessage from "../shared/Loader/LoadingMessage";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import ErrorToast from "../toast/ErrorToast";
import * as dateFnsTz from "date-fns-tz";
import * as dateFns from "date-fns";
import { newYorkTimeZone } from "@/utils/date-formatter";
import SuccessToast from "../toast/SuccessToast";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
// import * as Dialog from '@radix-ui/react-dialog'

export default function EditPromoCodeTab({ isActive }: { isActive: boolean }) {
  const [addPromoCodeDialogOpen, setAddPromoCodeDialogOpen] = useState(false);
  const [editPromocodeDialogOpen, setEditPromocodeDialogOpen] = useState(false);
  const [noTicketsDialogOpen, setNoTicketsDialogOpen] = useState(false);
  const [promocodeToEdit, setPromoCodeToEdit] = useState<Yup.InferType<
    typeof newPromocodeFormSchema
  > | null>(null);
  const [promocodeToEditId, setPromoCodeToEditId] = useState<string | null>(
    null
  );
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  let loadingToastId = useRef("");

  const ticketTypesQuery = useGetEventTicketTypes(eventId);
  const ticketTypes = ticketTypesQuery.data?.data;

  const promocodesQuery = useGetPromocodes(eventId);

  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("details")
  );

  useEffect(() => {
    if (ticketTypesQuery.isError) {
      setNoTicketsDialogOpen(true);
    }
    if (ticketTypesQuery.isSuccess && !ticketTypes) {
      setNoTicketsDialogOpen(true);
    }
  }, [ticketTypes]);

  const onDeleteSuccess = async (
    data: AxiosResponse<DeletePromocodeResponse>
  ) => {
    SuccessToast({
      title: "Success",
      description: data.data.message || "Promocode deleted successfully",
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

  const { mutate: deletePromocode, isPending: deletePromocodePending } =
    useDeletePromocode(onDeleteError, onDeleteSuccess);

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
        "An error occurred while fetching promocodes.."
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

  function handleAction(action: (typeof actions)[number], promocodeId: string) {
    switch (action) {
      case "edit":
        const promocodeToEdit = promocodesQuery.data?.data.find(
          (promocode) => promocode.id === promocodeId
        );
        if (!promocodeToEdit) {
          // show
          ErrorToast({
            title: "Error editing promocode",
            descriptions: ["Cannot find details of ticket to edit"],
          });
          return;
        }
        const zonedStartDate = dateFnsTz.toZonedTime(
          new Date(promocodeToEdit.promoStartDate || Date.now()),
          newYorkTimeZone
        );
        const zonedEndDate = dateFnsTz.toZonedTime(
          new Date(promocodeToEdit.promoEndDate || Date.now()),
          newYorkTimeZone
        );
        setPromoCodeToEdit({
          applyToTicketIds: promocodeToEdit.ticketTypeIds,
          startDate: dateFns.format(zonedStartDate, "yyyy-MM-dd"),
          startTime: dateFns.format(zonedStartDate, "HH:mm"),
          endDate: dateFns.format(zonedEndDate, "yyyy-MM-dd"),
          endTime: dateFns.format(zonedEndDate, "HH:mm"),
          key: promocodeToEdit.key,
          limit: promocodeToEdit.limit,
          name: promocodeToEdit.name,
          absoluteDiscountAmount: promocodeToEdit.absoluteDiscountAmount,
          percentageDiscountAmount: promocodeToEdit.percentageDiscountAmount,
        });
        setPromoCodeToEditId(promocodeToEdit.id);
        setEditPromocodeDialogOpen(true);
        break;
      case "delete":
        //   TODO: handle delete tickettype?
        deletePromocode({ promocodeId });

        loadingToastId.current = toast.loading("Deleting ticket type");
    }
  }

  return (
    <>
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
                <th>Key</th>
                <th>Discount </th>
                <th>Uses/Limit</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="[&_td]:p-4">
              {promocodesQuery.isPending ? (
                <tr>
                  <td colSpan={6}>
                    <LoadingMessage>Loading promocodes..</LoadingMessage>
                  </td>
                </tr>
              ) : null}
              {promocodesQuery.data?.data ? (
                promocodesQuery.data?.data.map((promocode) => {
                  return (
                    <tr
                      className="border-b border-b-[#151515]"
                      key={promocode.id}
                    >
                      <td>{promocode.name}</td>
                      <td>{promocode.key}</td>
                      <td>
                        {`$${promocode.absoluteDiscountAmount.toFixed(2)}` ||
                          `${promocode.percentageDiscountAmount}%`}
                      </td>
                      {/* TODO: work on this */}
                      <td>
                        {promocode.used}/{promocode.limit}
                      </td>
                      <td>
                        <span
                          className={cn(
                            "px-1 text-white text-sm rounded-sm",
                            isActive === true ? "bg-green-500" : "#ef4444"
                          )}
                        >
                          {promocode.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {/* TODO: display status showing if promocode is still active */}
                      <td>
                        <ActionDropDown
                          disabled={deletePromocodePending}
                          handleAction={handleAction}
                          promocodeId={promocode.id}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="text-white py-4" colSpan={6}>
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
      <NoTicketsDialog
        open={noTicketsDialogOpen}
        onOpenChange={setNoTicketsDialogOpen}
      />
      {promocodeToEdit && (
        <EditPromoCodeDialog
          key={promocodeToEditId}
          promocodeId={promocodeToEditId}
          ticketTypes={ticketTypes}
          defaultValues={promocodeToEdit}
          open={editPromocodeDialogOpen}
          onOpenChange={setEditPromocodeDialogOpen}
        />
      )}
    </>
  );
}

const actions = ["edit", "delete"] as const;

function ActionDropDown({
  promocodeId,
  handleAction,
  disabled,
}: {
  promocodeId: string;
  disabled?: boolean;
  handleAction: (action: (typeof actions)[number], promocodeId: string) => void;
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
                  disabled={disabled}
                  key={item}
                  onClick={() => {
                    handleAction(item, promocodeId);
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

function EditPromoCodeDialog({
  ticketTypes,
  defaultValues,
  promocodeId,
  ...props
}: ComponentProps<typeof Dialog> & {
  ticketTypes: TicketType[];
  defaultValues: Yup.InferType<typeof newPromocodeFormSchema>;
  promocodeId: string | null;
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
    defaultValues,
  });

  const params = useParams<{ id: string }>();
  const [pickType, setPickType] = useState<"all" | "selected">("selected");

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
    props.onOpenChange?.(false);
  }

  const { mutate: updatePromocode, isPending: updatePromoCodeIspending } =
    useUpdatePromocode(onError, onSuccess);

  const selectedTicketTypeIds = watch("applyToTicketIds");
  const setSelectedTicketTypeIds = (value: string[]) =>
    setValue("applyToTicketIds", value);

  function onSubmit(values: Yup.InferType<typeof newPromocodeFormSchema>) {
    if (!promocodeId) {
      ErrorToast({
        title: "Error",
        descriptions: ["Promocode to delete not specified"],
      });
      return;
    }
    updatePromocode({ ...values, promocodeId });
  }

  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <DialogContent className="bg-[#333333] text-[#A3A7AA] p-6 max-w-md">
            <DialogTitle className="text-xl font-semibold">
              Edit Code
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
                  disabled={updatePromoCodeIspending}
                  variant="ghost"
                  className="flex-1"
                >
                  {updatePromoCodeIspending ? "Updating.." : "Update"}
                </AdminButton>
              </div>
            </form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}

function NoTicketsDialog({ ...props }: ComponentProps<typeof Dialog>) {
  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("details")
  ) as SearchQueryState<Tabs>;
  return (
    <Dialog {...props} modal={true}>
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <DialogContent className="relative bg-[#333333] text-[#A3A7AA] p-6 mx-auto py-9 max-w-lg">
            <div className="bg-red-500 text-white size-24 mx-auto rounded-full grid place-items-center">
              <MdGppBad className="text-4xl" />
            </div>

            <div className="text-white text-2xl lg:text-4xl font-medium text-center mt-16">
              No ticket type created
            </div>

            <div className="text-center my-6 space-y-4">
              <p className="text-white text-base lg:text-xl">
                It seems you haven't created a ticket type.
              </p>
              <p className="text-text-color text-sm lg:text-base">
                Please create it before you can apply a promocode
              </p>
            </div>

            <div className="flex justify-center">
              <AdminButton
                variant="outline"
                className=""
                onClick={() => setCurrentTab("details")}
              >
                BACK TO EVENT DETAILS TAB
              </AdminButton>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
