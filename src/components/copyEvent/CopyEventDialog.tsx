import { useCopyEventDetails } from "@/api/events/events.queries";
import { copyEventSchema } from "@/api/events/events.schemas";
import { CopyEventResponse } from "@/api/events/events.types";
import { ErrorResponse } from "@/constants/types";
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
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { FaRegCalendar, FaRegClock } from "react-icons/fa";
import AdminButton from "../buttons/AdminButton";
import ErrorToast from "../toast/ErrorToast";
import * as Yup from "yup";
import SuccessToast from "../toast/SuccessToast";
import Input from "../shared/Input";
import { FormError } from "../shared/FormError";
import IconInputField from "../shared/IconInputField";

export function CopyEventDialog({
  eventId,
  ...props
}: ComponentProps<typeof Dialog> & { eventId: string | null }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<Yup.InferType<typeof copyEventSchema>>({
    resolver: yupResolver(copyEventSchema),
  });

  function onError(error: AxiosError<ErrorResponse>) {
    const errorMessage = getApiErrorMessage(error, "Unable to copy event");
    ErrorToast({
      title: "Error",
      descriptions: errorMessage,
    });
  }

  function onSuccess(data: AxiosResponse<CopyEventResponse>) {
    SuccessToast({
      title: "Success",
      description: "Event copied successfully",
    });
    reset();
    props.onOpenChange?.(false);
  }

  const { mutate: copyEventDetails, isPending: copyEventDetailsPending } =
    useCopyEventDetails(onError, onSuccess);

  function onSubmit(values: Yup.InferType<typeof copyEventSchema>) {
    if (eventId) {
      copyEventDetails({ ...values, eventId });
    } else {
      ErrorToast({
        title: "Error",
        descriptions: ["Error copying event, event to copy not selected"],
      });
    }
  }

  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");

  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <DialogContent className="bg-[#333333] text-[#A3A7AA] p-6 max-w-md">
            <DialogTitle className="text-xl font-semibold">
              Copy Event
            </DialogTitle>
            <DialogDescription className="hidden">
              Copy event details
            </DialogDescription>
            <DialogClose />

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* EVENT TITLE */}
              <div>
                <label htmlFor="name">Event Title</label>
                <Input className="bg-white text-black" {...register("name")} />
                <FormError error={errors.name} />
              </div>
              {/* END EVENT TITLE */}

              {/* EVENT SUMMARY */}
              <div className="">
                <label htmlFor="event-summary">Event Summary</label>
                <textarea
                  rows={4}
                  className="w-full text-black p-4 border border-input-border"
                  {...register("summary")}
                />
                <FormError error={errors.summary} />
              </div>
              {/* END EVENT SUMMARY */}

              {/* DATE AND TIME */}
              <div className="py-6">
                <div className="text-xl font-semibold">Date and time</div>

                <div className="space-y-4 items-center gap-x-4">
                  {/* EVENT START DATE */}
                  <div>
                    <label htmlFor="start-date">Start Date</label>
                    <IconInputField
                      variant="white"
                      id="start-date"
                      type="date"
                      value={
                        new Date(watchedStartDate || new Date())
                          .toISOString()
                          .split("T")[0]
                      }
                      {...register("startDate", { required: true })}
                      Icon={<FaRegCalendar className="text-[#14171A]" />}
                    />
                    <FormError error={errors.startDate} />
                  </div>
                  {/* END EVENT START DATE */}

                  {/* EVENT START TIME */}
                  <div>
                    <label htmlFor="start-time">Start time</label>
                    <IconInputField
                      type="time"
                      {...register("startTime", { required: true })}
                      Icon={<FaRegClock className="text-[#14171A]" />}
                    />
                    <FormError error={errors.startTime} />
                  </div>
                  {/* END EVENT START TIME */}

                  {/* EVENT END DATE */}
                  <div>
                    <label htmlFor="end-date">End Date</label>
                    <IconInputField
                      variant="white"
                      id="end-date"
                      type="date"
                      value={
                        new Date(watchedEndDate || new Date())
                          .toISOString()
                          .split("T")[0]
                      }
                      {...register("endDate", { required: true })}
                      Icon={<FaRegCalendar className="text-[#14171A]" />}
                    />
                    <FormError error={errors.startDate} />
                  </div>
                  {/* END EVENT END DATE */}

                  {/* EVENT END TIME */}
                  <div>
                    <label htmlFor="date">End time</label>
                    <IconInputField
                      type="time"
                      {...register("endTime", { required: true })}
                      Icon={<FaRegClock className="text-[#14171A]" />}
                    />
                    <FormError error={errors.endTime} />
                  </div>
                  {/* END EVENT END TIME */}
                </div>
              </div>
              {/* END DATE AND TIME */}

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
                  disabled={copyEventDetailsPending}
                  variant="ghost"
                  className="flex-1 disabled:bg-opacity-50"
                >
                  {copyEventDetailsPending ? "Copying.." : "Copy Event"}
                </AdminButton>
              </div>
            </form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
