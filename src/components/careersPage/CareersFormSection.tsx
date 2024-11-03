"use client";

import React, { useState } from "react";
import Image from "next/image";
import GenderSection from "./GenderSection";
import { useForm } from "react-hook-form";
import {
  FacebookHandle,
  InstagramHandle,
  TiktokHandle,
  twitterHandle,
} from "../../../public/icons";
import Checkbox from "../shared/Checkbox";
import { FaXTwitter } from "react-icons/fa6";
import { yupResolver } from "@hookform/resolvers/yup";
import { CareersFormSchema } from "./careersForm/yupSchema";
import { ErrorMessage } from "@hookform/error-message";
import { useCareers } from "@/api/careers/careers.queries";
import LoadingSvg from "../shared/Loader/LoadingSvg";
import classNames from "classnames";
import ErrorToast from "../toast/ErrorToast";
import SuccessToast from "../toast/SuccessToast";
import CustomButton from "../buttons/CustomButton";
import AuthSubmitButton from "../buttons/AuthSubmitButton";

const CareersFormSection = () => {
  const [selectedGender, setSelectedGender] = useState("");
  const [isNotifyMe, setIsNotifyMe] = useState<boolean>(false);

  const form = useForm({
    resolver: yupResolver(CareersFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      // gender: "",
      location: "",
      tiktokHandle: "",
      instagramHandle: "",
      twitterHandle: "",
      facebookHandle: "",
      description: "",
      note: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted, isValid },
  } = form;

  const onSuccess = (data: any) => {
    SuccessToast({
      title: "Request Successful",
      description: "You have successfully join us as a promoter",
    });
    reset();
  };

  const onError = (error: any) => {
    const errorMessage = error.response.data.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Adding Promoter Failed",
      descriptions,
    });
  };

  const { mutate, isPending } = useCareers(onError, onSuccess);

  const handleSetGender = (gender: string) => {
    setSelectedGender(gender);
  };

  const onSubmit = (data: any) => {
    const promoterData = {
      ...data,
      gender: selectedGender,
    };
    mutate(promoterData);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="w-full flex flex-col gap-1">
            <input
              {...register("firstName", {
                required: true,
              })}
              placeholder="First Name*"
              className=" w-full text-black placeholder:text-[#C0C0C0] text-base bg-white p-4 border border-white  outline-none"
              name="firstName"
            />

            <ErrorMessage
              errors={errors}
              name="firstName"
              render={({ message }) => (
                <p className="text-error-message font-light text-[9px] md:text-xs">
                  {message}
                </p>
              )}
            />
          </div>

          <div className="w-full flex flex-col gap-1">
            <input
              {...register("lastName", {
                required: true,
              })}
              placeholder="Last Name*"
              className="w-full text-black placeholder:text-[#C0C0C0] text-base bg-white p-4 border border-white outline-none"
              name="lastName"
            />

            <ErrorMessage
              errors={errors}
              name="lastName"
              render={({ message }) => (
                <p className="text-error-message font-light text-[9px] md:text-xs">
                  {message}
                </p>
              )}
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          <input
            {...register("email", {
              required: true,
            })}
            placeholder="Email Address*"
            className="w-full text-black placeholder:text-[#C0C0C0] text-base bg-white p-4 border border-white  outline-none"
            name="email"
          />

          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <p className="text-error-message font-light text-[9px] md:text-xs">
                {message}
              </p>
            )}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <input
            {...register("phoneNumber", {
              required: true,
            })}
            placeholder="Phone Number*"
            className="w-full text-black placeholder:text-[#C0C0C0] text-base bg-white p-4 border border-white  outline-none"
            name="phoneNumber"
          />

          <ErrorMessage
            errors={errors}
            name="phoneNumber"
            render={({ message }) => (
              <p className="text-error-message font-light text-[9px] md:text-xs">
                {message}
              </p>
            )}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <GenderSection
            selectedGender={selectedGender}
            setSelectedGender={handleSetGender}
          />

          {isSubmitted && !selectedGender ? (
            <p className="text-error-message font-light text-[9px] md:text-xs">
              select a gender
            </p>
          ) : null}
        </div>

        <div className="w-full flex flex-col gap-1">
          <input
            {...register("location", {
              required: true,
            })}
            placeholder="Whare are you based?*"
            className="w-full text-black placeholder:text-[#C0C0C0] text-base bg-white p-4 border border-white  outline-none"
            name="location"
          />

          <ErrorMessage
            errors={errors}
            name="location"
            render={({ message }) => (
              <p className="text-error-message font-light text-[9px] md:text-xs">
                {message}
              </p>
            )}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <div className="relative w-full">
            <Image
              className="absolute left-5 top-1/2 transform -translate-y-1/2"
              src={TiktokHandle}
              alt="tiktokHandle"
            />
            <input
              {...register("tiktokHandle", {
                required: true,
              })}
              placeholder="Tiktok Handle*"
              className="w-full text-black placeholder:text-[#C0C0C0] text-base bg-white p-4 border border-white  outline-none px-12"
              name="tiktokHandle"
            />
          </div>

          <ErrorMessage
            errors={errors}
            name="tiktokHandle"
            render={({ message }) => (
              <p className="text-error-message font-light text-[9px] md:text-xs">
                {message}
              </p>
            )}
          />
        </div>

        <div className="relative w-full">
          <Image
            className="absolute left-5 top-1/2 transform -translate-y-1/2"
            src={InstagramHandle}
            alt="instagramHandle"
          />
          <input
            {...register("instagramHandle")}
            placeholder="Instagram Handle"
            className="w-full text-black placeholder:text-[#C0C0C0] text-base bg-white p-4 border border-white  outline-none px-12"
            name="instagramHandle"
          />
        </div>

        {/* <div className="relative w-full">
        <FaXTwitter className="absolute left-5 top-1/2 transform -translate-y-1/2" />
        <input
          {...register("xHandle")}
          placeholder="X (Twitter) Handle"
          className="w-full text-black placeholder:text-[#C0C0C0] text-xs lg:text-base bg-white p-4 border border-white  outline-none px-12"
          name="xHandle"
        />
      </div> */}

        <div className="relative w-full">
          <Image
            className="absolute left-5 top-1/2 transform -translate-y-1/2"
            src={FacebookHandle}
            alt="instagramHandle"
          />
          <input
            {...register("facebookHandle")}
            placeholder="Facebook Handle"
            className="w-full text-black placeholder:text-[#C0C0C0] text-base bg-white p-4 border border-white  outline-none px-12"
            name="facebookHandle"
          />
        </div>

        <select
          {...register("description", {
            required: true,
          })}
          className="w-full text-black placeholder:text-[#C0C0C0] text-base bg-white p-4 border border-white  outline-none"
          name="description"
        >
          <option value="">What option best describes you?</option>
          <option value="">I’m an an influencer</option>
          <option value="">
            I’m an an artist, or work directly with artists
          </option>
          <option value="">I promote shows</option>
          <option value="">None of the above, I want to help promote</option>
        </select>

        {/* <div className="w-full flex flex-col gap-1">
        <label className="text-white opacity-60">Note (Optional)</label>
        <textarea
          {...register("note")}
          className="p-4 h-[160px]  outline-none"
          placeholder="You can leave a note here"
        />
      </div> */}

        <div className="flex items-center gap-4">
          <label className="checkbox-container">
            <input onClick={() => setIsNotifyMe(!isNotifyMe)} type="checkbox" />
            <span className="checkmark careers-form-checkmark"></span>
          </label>

          <p className="text-white text-xs md:text-sm opacity-70">
            Keep me updated on more events and news from Black Diamond
            Entertainment.
          </p>
        </div>

        <AuthSubmitButton type="submit" disabled={!isValid} className="w-fit">
          {isPending ? <LoadingSvg /> : "SUBMIT"}
        </AuthSubmitButton>
      </form>
    </div>
  );
};

export default CareersFormSection;
