import React, { useState } from "react";
import AdminButton from "../buttons/AdminButton";
import { FaIdBadge, FaMapMarkerAlt, FaSave } from "react-icons/fa";
import PreviewIcon from "./PreviewIcon";
import Input from "../shared/Input";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormError } from "../shared/FormError";
import {
  FaClock,
  FaList,
  FaLocationPin,
  FaPlus,
  FaRegCalendar,
  FaRegClock,
} from "react-icons/fa6";
import OnlineEventIcon from "./OnlineEventIcon";
import IconInputField from "../shared/IconInputField";
import EventImagesInputField from "./EventImagesInputField";
import { newEventSchema } from "@/api/events/events.schemas";
import { useCreateEventDetails } from "@/api/events/events.queries";
import { AxiosError, AxiosResponse } from "axios";
import { CreateEventDetailsResponse } from "@/api/events/events.types";
import { ErrorResponse } from "@/constants/types";
import toast from "react-hot-toast";
// import { useNewEventStore } from "@/store/new-event.store";
import * as dateFns from "date-fns";
import EventCoverImageInput from "./EventCoverImageInput";
import { parseAsString, useQueryState } from "nuqs";
import LoadingMessage from "../shared/Loader/LoadingMessage";
import { fromZonedTime } from "date-fns-tz";
import { newYorkTimeZone } from "@/utils/date-formatter";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import ErrorToast from "../toast/ErrorToast";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import { useRouter } from "next/navigation";
import SuccessToast from "../toast/SuccessToast";
import { cn } from "@/utils/cn";
import Checkbox from "../shared/Checkbox";

export default function DetailsTab({ isActive }: { isActive: boolean }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<Yup.InferType<typeof newEventSchema>>({
    resolver: yupResolver(newEventSchema),
    defaultValues: {
      locationType: "VENUE",
    },
  });
  const router = useRouter();

  const [currentTab, setCurrentTab] = useQueryState(
    "tab",
    parseAsString.withDefault("details")
  );
  const [imagesPreview, setImagesPreview] = useState<string[] | null>([]);
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(
    null
  );
  const [refundPolicy, setRefundPolicy] = useState(false);

  // const setEventId = useNewEventStore((state) => state.setEventId);
  const [eventId, setEventId] = useQueryState(
    "newEventId",
    parseAsString.withDefault("")
  );

  async function onCreateEventDetailsSuccess(
    data: AxiosResponse<CreateEventDetailsResponse>
  ) {
    SuccessToast({
      title: "Success",
      description: "Event details created successfully",
    });
    await setEventId(data.data.id);
    reset();
    setImagesPreview(null);
    setActivePreviewImage(null);

    router.push(`/admin/events/${data.data.id}?tab=ticket`);
  }

  function onCreateEventDetailsError(error: AxiosError<ErrorResponse>) {
    const descriptions = getApiErrorMessage(
      error,
      "An error occrred while creating event details"
    );
    ErrorToast({
      title: "Error creating event",
      descriptions: descriptions,
    });
  }

  const { mutate: createEventDetails, isPending: createEventDetailsPending } =
    useCreateEventDetails(
      onCreateEventDetailsError,
      onCreateEventDetailsSuccess
    );

  function onSubmit(values: Yup.InferType<typeof newEventSchema>) {
    createEventDetails({
      name: values.name,
      summary: values.summary,
      location: values.location,
      refundPolicy: values.refundPolicy,
      coverImage: values.coverImage,
      images: values.images,
      startDate: new Date(values.startDate).toISOString(),
      startTime: values.startTime,
      endDate: new Date(values.endDate).toISOString(),
      endTime: values.endTime,
      locationType: values.locationType,
    });
  }

  const watchedImages = watch("images");
  const removeImage = (index: number) => {
    const newImages = watchedImages?.filter((_, i) => i !== index);
    setValue("images", newImages);
    setImagesPreview((prevImages) => {
      const images = prevImages?.filter((_, i) => i !== index);
      return images || null;
    });
    setActivePreviewImage(null);
  };

  const watchedLocationType = watch("locationType");

  const toggleRefundPolicy = () => {
    setRefundPolicy((state) => {
      // if refund policy is being disabled, i.e prev state is true and is being toggled to false, empty the input
      if (state === true) {
        setValue("refundPolicy", undefined);
      }
      return !state;
    });
  };

  return (
    <div className={isActive ? "block" : "hidden"}>
      <form
        className="text-[#BDBDBD] space-y-8 mt-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* UPLOAD COVER IMAGES SECTION */}
        <div>
          <label htmlFor="cover-image">Cover image</label>
          <EventCoverImageInput
            onSelectFile={(file) => {
              setValue("coverImage", file);
            }}
          />
          <FormError error={errors.coverImage} />
        </div>
        {/* END UPLOAD COVER IMAGES SECTION */}

        {/* UPLOAD IMAGES SECTION */}
        <div>
          <label htmlFor="image-slides">Event slides</label>
          {activePreviewImage == null || !imagesPreview ? (
            <EventImagesInputField
              onSelectFile={(files) => {
                if (watchedImages && files) {
                  setValue("images", [...watchedImages, ...files]);
                } else {
                  setValue("images", files);
                }
              }}
              imagesPreview={imagesPreview}
              setImagesPreview={setImagesPreview}
            />
          ) : (
            <div className="relative h-96 ">
              <Image
                src={activePreviewImage}
                alt=""
                fill
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <FormError error={errors.images?.[0]} />
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={10}
            className="[&_.swiper-slide]:w-36 [&_.swiper-slide]:h-32 mt-5 border border-[#121212]"
          >
            <SwiperSlide>
              <button
                onClick={() => setActivePreviewImage(null)}
                type="button"
                className="bg-white bg-opacity-50 grid place-items-center h-full w-full"
              >
                <FiPlus className="text-4xl" />
              </button>
            </SwiperSlide>
            {imagesPreview?.map((image, index) => {
              return (
                <SwiperSlide
                  key={image}
                  onClick={() => setActivePreviewImage(image)}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={image}
                      width={150}
                      height={150}
                      alt="Slide Image"
                      sizes=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-black text-red-500 text-lg p-0.5 border border-[#c0c0c0]"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <FiTrash2 />
                    </button>
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
            <Input variant="white" {...register("name")} />
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
            {/* EVENT START DATE */}
            <div className="w-full sm:flex-1">
              <label htmlFor="start-date">Start Date</label>
              <IconInputField
                id="start-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("startDate", { required: true })}
                Icon={<FaRegCalendar className="text-[#14171A]" />}
              />
              <FormError error={errors.startDate} />
            </div>
            {/* END EVENT START DATE */}

            {/* EVENT START TIME */}
            <div className="w-full sm:flex-1">
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
            <div className="w-full sm:flex-1">
              <label htmlFor="end-date">End Date</label>
              <IconInputField
                id="end-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("endDate", { required: true })}
                Icon={<FaRegCalendar className="text-[#14171A]" />}
              />
              <FormError error={errors.endDate} />
            </div>
            {/* END EVENT END DATE */}

            {/* EVENT END TIME */}
            <div className="w-full sm:flex-1">
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
          <div className="flex items-center flex-wrap gap-y-4 gap-x-4 font-semibold">
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

          {/* INPUT FIELD */}
          <div
            className={cn(
              "mt-4",
              watchedLocationType === "TO_BE_ANNOUNCED" && "hidden"
            )}
          >
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
            <div className="flex items-center gap-x-2">
              <Checkbox checked={refundPolicy} onClick={toggleRefundPolicy} />
              <label htmlFor="refund-policy">Refund Policy</label>
            </div>
            <Input
              variant="white"
              className={!refundPolicy ? "hidden" : ""}
              {...register("refundPolicy")}
            />
          </div>
        </div>
        {/* END ADDITIONAL INFORMATION */}

        <AdminButton
          disabled={createEventDetailsPending}
          variant="ghost"
          className="font-medium flex items-center gap-x-2 px-6 mt-12 disabled:opacity-50"
        >
          {createEventDetailsPending ? (
            <LoadingMessage>Creating...</LoadingMessage>
          ) : (
            <>
              <FaSave />
              <span>Save and continue</span>
            </>
          )}
        </AdminButton>
      </form>
    </div>
  );
}
