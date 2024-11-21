import React, { useEffect, useState } from "react";
import AdminButton from "../buttons/AdminButton";
import { FaIdBadge, FaMapMarkerAlt, FaSave } from "react-icons/fa";
import PreviewIcon from "./PreviewIcon";
import Input from "../shared/Input";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormError } from "../shared/FormError";
import { FaRegCalendar, FaRegClock } from "react-icons/fa6";
import OnlineEventIcon from "./OnlineEventIcon";
import IconInputField from "../shared/IconInputField";
import {
  editEventDetailsSchema,
  newEventSchema,
} from "@/api/events/events.schemas";
import {
  useRemoveImageFromSlide,
  useUpdateEventDetails,
} from "@/api/events/events.queries";
import { AxiosError, AxiosResponse } from "axios";
import * as dateFns from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import SuccessToast from "../toast/SuccessToast";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import ErrorToast from "../toast/ErrorToast";
import { useParams } from "next/navigation";
import { SearchQueryState } from "@/constants/types";
import { Tabs } from "@/app/admin/events/new-event/page";
import EditEventCoverImageInput from "./EditEventCoverImageInput";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import EditEventImagesInputField from "./EditEventImagesInputField";
import { FiTrash2 } from "react-icons/fi";
import LoadingSvg from "../shared/Loader/LoadingSvg";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { newYorkTimeZone } from "@/utils/date-formatter";

export default function EditDetailsTab({
  isActive,
  defaultValues,
  defaultMedia,
}: {
  isActive: boolean;
  defaultValues: Yup.InferType<typeof editEventDetailsSchema>;
  defaultMedia: {
    images: string[] | undefined;
    coverImage: string | undefined;
  };
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<Yup.InferType<typeof editEventDetailsSchema>>({
    resolver: yupResolver(editEventDetailsSchema),
    defaultValues,
  });
  const params = useParams<{ id: string }>();
  const eventId = params.id;

  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("details")
  ) as SearchQueryState<Tabs>;

  const [imagesPreview, setImagesPreview] = useState<string[] | null>([]);

  function onEditDetailsSuccess(data: AxiosResponse<any>) {
    // Clear file input and image preview on success
    setValue("images", undefined);
    setImagesPreview(null);
    SuccessToast({
      title: "Update success",
      description: "Event details updated successfully",
    });
  }

  function onEditDetailsError(error: AxiosError<Error>) {
    const errorMessage = getApiErrorMessage(
      error,
      "An error occurred while updating event details.."
    );
    ErrorToast({
      title: "Updating error",
      descriptions: errorMessage,
    });
  }

  const { mutate: updateEventDetails, isPending: updateEventDetailsPending } =
    useUpdateEventDetails(onEditDetailsError, onEditDetailsSuccess);

  function onSubmit(values: Yup.InferType<typeof editEventDetailsSchema>) {
    console.log("----------------------------");
    const [startTimeHours, startTimeMinutes] = values.startTime
      .split(":")
      .map((value) => Number(value));

    const [endTimeHours, endTimeMinutes] = values.endTime
      .split(":")
      .map((value) => Number(value));

    updateEventDetails({
      name: values.name,
      summary: values.summary,
      location: values.location,
      refundPolicy: values.refundPolicy,
      startTime: fromZonedTime(
        dateFns.add(dateFns.startOfDay(values.date), {
          hours: startTimeHours,
          minutes: startTimeMinutes,
        }),
        newYorkTimeZone
      ) // convert to UTC from the user's local time
        .toISOString(),
      endTime: fromZonedTime(
        dateFns.add(dateFns.startOfDay(values.date), {
          hours: endTimeHours,
          minutes: endTimeMinutes,
        }),
        newYorkTimeZone
      ) // convert to UTC from the user's local time
        .toISOString(),
      eventId: eventId,
      locationType: values.locationType,
      images: values.images,
      coverImage: values.coverImage,
    });
  }

  const { mutate: removeImage, isPending: removeImagePending } =
    useRemoveImageFromSlide();

  const watchedDate = watch("date");
  useEffect(() => {
    setValue("date", defaultValues?.date || new Date());
  }, [defaultValues]);

  const watchedLocationType = watch("locationType");

  return (
    <div className={isActive ? "block" : "hidden"}>
      <form
        className="text-[#BDBDBD] space-y-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* UPLOAD COVER IMAGES SECTION */}
        <div>
          <label htmlFor="cover=image">Cover image</label>
          <EditEventCoverImageInput
            onSelectFile={(file) => {
              setValue("coverImage", file);
            }}
            oldCoverImage={defaultMedia.coverImage}
          />
        </div>
        {/* END UPLOAD COVER IMAGES SECTION */}

        {/* UPLOAD IMAGES SECTION */}
        <div>
          <label htmlFor="image-slides">Event slides</label>
          <EditEventImagesInputField
            onSelectFile={(files) => {
              setValue("images", files);
            }}
            imagesPreview={imagesPreview}
            setImagesPreview={setImagesPreview}
          />
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={10}
            className="[&_.swiper-slide]:w-40 mt-5 border border-[#121212]"
          >
            {defaultMedia.images?.map((image: string) => {
              return (
                <SwiperSlide key={image}>
                  <div className="relative">
                    <Image
                      src={image}
                      width={150}
                      height={150}
                      alt="Slide Image"
                      sizes=""
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-black text-red-500 text-lg p-0.5 border border-[#c0c0c0]"
                      onClick={() =>
                        removeImage({
                          eventId: eventId,
                          image: image,
                        })
                      }
                    >
                      <FiTrash2 />
                    </button>

                    {/* LOADING OVERLAY */}
                    {removeImagePending && (
                      <div className="absolute inset-0 bg-black opacity-70 grid place-items-center">
                        <LoadingSvg />
                      </div>
                    )}
                    {/* END LOADING OVERLAY */}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        {/* END UPLOAD IMAGES SECTION */}

        {/* EVENT OVERVIEW */}
        <div className="space-y-4 bg-[#151515] border-[#333333] py-6 px-4">
          <div className="text-xl font-semibold">Event Overview</div>
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
              rows={8}
              className="w-full text-black p-4 border border-input-border"
              {...register("summary")}
            />
            <FormError error={errors.summary} />
          </div>
          {/* END EVENT SUMMARY */}
        </div>
        {/* END EVENT OVERVIEW */}

        {/* DATE AND TIME */}
        <div className="bg-[#151515] px-4 py-6">
          <div className="text-xl font-semibold mb-4">Date and time</div>

          <div className="flex flex-col lg:flex-row gap-y-4 items-center gap-x-4">
            {/* EVENT DATE */}
            <div className="lg:flex-1 w-full">
              <label htmlFor="date">Date</label>
              <IconInputField
                variant="white"
                id="date"
                type="date"
                value={new Date(watchedDate).toISOString().split("T")[0]}
                {...register("date", { required: true })}
                Icon={<FaRegCalendar className="text-[#14171A]" />}
              />
              <FormError error={errors.date} />
            </div>
            {/* END EVENT DATE */}

            {/* EVENT START TIME */}
            <div className="lg:flex-1 w-full">
              <label htmlFor="start-time">Start time</label>
              <IconInputField
                type="time"
                {...register("startTime", { required: true })}
                Icon={<FaRegClock className="text-[#14171A]" />}
              />
              <FormError error={errors.startTime} />
            </div>
            {/* END EVENT START TIME */}

            {/* EVENT END TIME */}
            <div className="lg:flex-1 w-full">
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

        {/* LOCATION */}
        <div className="bg-[#151515] px-4 py-6">
          {/* TABS */}
          <div className="flex items-center flex-wrap gap-4 justify-stretch font-semibold">
            <AdminButton
              onClick={() => setValue("locationType", "VENUE")}
              type="button"
              variant={watchedLocationType === "VENUE" ? "primary" : "ghost"}
              className="text-sm flex items-center max-sm:flex-1 max-sm:justify-center gap-x-2 h-10 rounded-none"
            >
              <FaMapMarkerAlt />
              <span>Venue</span>
            </AdminButton>

            <AdminButton
              onClick={() => setValue("locationType", "ONLINE_EVENT")}
              type="button"
              variant={
                watchedLocationType === "ONLINE_EVENT" ? "primary" : "ghost"
              }
              className="text-sm flex items-center max-sm:flex-1 max-sm:justify-center gap-x-2 h-10 rounded-none"
            >
              <OnlineEventIcon />
              <span>Online event</span>
            </AdminButton>

            <AdminButton
              onClick={() => setValue("locationType", "TO_BE_ANNOUNCED")}
              type="button"
              variant={
                watchedLocationType === "TO_BE_ANNOUNCED" ? "primary" : "ghost"
              }
              className="text-sm flex items-center max-sm:flex-1 max-sm:justify-center gap-x-2 h-10 rounded-none"
            >
              <FaRegCalendar />
              <span>To be announced</span>
            </AdminButton>
          </div>
          {/* END TABS */}
          <FormError error={errors.locationType} />

          {/* INPUT FIELD */}
          <div className="mt-4">
            <label htmlFor="location">Location</label>
            <IconInputField
              {...register("location")}
              Icon={<FaMapMarkerAlt className="text-[#14171A]" />}
            />
          </div>
          {/* END INPUT FIELD */}
        </div>
        {/* EMD LOCATION */}
        {/* ABOUT THIS EVENT */}
        {/* <div className="bg-[#151515] border-[#333333] py-6 px-12">
          <div className="flex justify-between">
            <div className="text-[#A3A7AA] font-semibold text-xl">
              About this event
            </div>

            <div className="bg-[#A3A7AA] size-9 rounded-full inline-grid place-items-center text-black">
              <FaPlus />
            </div>
          </div>

          <p className="text-[#BDBDBD] mt-4">
            Use this section to provide more details about your event. You can
            include things to know, venue information, parking, accessibility
            options—anything that will help people know what to expect.
          </p>

          <div className="flex mt-8 items-center justify-between">
            <AdminButton
              variant="outline"
              className="flex items-center justify-center gap-x-2 min-w-48 text-white font-medium"
            >
              <FaList />
              <span>Add text</span>
            </AdminButton>

            <AdminButton
              variant="outline"
              className="flex items-center justify-center gap-x-2 min-w-48 text-white font-medium"
            >
              <AddImageIcon />
              <span className="mt-1">Add image</span>
            </AdminButton>

            <AdminButton
              variant="outline"
              className="flex items-center justify-center gap-x-2 min-w-48 text-white font-medium"
            >
              <AddVideoIcon />
              <span className="mt-1">Add video</span>
            </AdminButton>
          </div>
        </div> */}
        {/* END ABOUT THIS EVENT */}

        {/* ADDITIONAL INFORMATION */}
        <div className="bg-[#151515] border-[#333333] py-6 px-4 ">
          <div className="text-xl font-semibold">Additional Information</div>

          <div className="mt-4">
            <label htmlFor="refund-policy">Refund Policy</label>
            <Input
              className="bg-white text-black"
              {...register("refundPolicy")}
            />
          </div>
        </div>
        {/* END ADDITIONAL INFORMATION */}

        <AdminButton
          disabled={updateEventDetailsPending}
          variant="ghost"
          className="font-medium flex items-center gap-x-2 px-6 mt-12"
        >
          <FaSave />
          {updateEventDetailsPending ? (
            <span>Updating details..</span>
          ) : (
            <span>Update and save</span>
          )}
        </AdminButton>
      </form>
    </div>
  );
}
