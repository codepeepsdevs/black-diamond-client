"use client";

import { useContactUs } from "@/api/contactus/contactus.queries";
import { contactFormSchema } from "@/api/contactus/contactus.schema";
import { ContactUsData } from "@/api/contactus/contactus.types";
import { Input, SubmitButton } from "@/components";
import LoadingSvg from "@/components/shared/Loader/LoadingSvg";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { cn } from "@/utils/cn";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import { HiPaperClip } from "react-icons/hi2";
import * as Yup from "yup";

export default function ContactUsPage() {
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<Yup.InferType<typeof contactFormSchema>>({
    defaultValues: {
      email: "",
      name: "",
      message: "",
      subject: "",
    },
    resolver: yupResolver(contactFormSchema),
    mode: "onChange",
  });
  const { register, handleSubmit, formState, setValue, watch, reset } = form;
  const { errors } = formState;

  const onContactUsSuccess = (data: any) => {
    SuccessToast({
      title: "Success",
      description: "Message sent! We will get back to you shortly",
    });

    // Reset the form
    reset();
    clearAttachment();
  };

  const onContactUsError = (error: any) => {
    ErrorToast({
      title: "Error",
      descriptions: ["Error sending contact message"],
    });
  };

  const {
    mutate: contactus,
    isPending: contactusPending,
    isError: contactusError,
  } = useContactUs(onContactUsError, onContactUsSuccess);

  const onSubmit = (data: ContactUsData) => {
    contactus(data);
  };

  const watchedAttachment = watch("attachment");
  const setAttachment: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue("attachment", e.target.files ? e.target.files[0] : undefined);
  };

  const clearAttachment = () => {
    setValue("attachment", undefined);
    if (attachmentInputRef.current?.value) {
      attachmentInputRef.current.value = "";
    }
  };

  return (
    <section className="my-sm sm:my-lg">
      <div className="container ">
        <div className="text-center mt-20 mb-8">
          <h1 className="text-4xl text-white font-bold">Contact Us</h1>
          <div className="capitalize text-text-color">Get in Touch</div>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto"
        >
          {/* NAME */}
          <div>
            <label
              htmlFor="name"
              className="text-text-color font-medium text-sm block mb-1"
            >
              Name*
            </label>
            <Input
              type="text"
              className="bg-white outline-none text-black"
              {...register("name")}
            />
            <p className="flex self-start text-red-500 text-xs mt-0.5">
              {errors.name?.message}
            </p>
          </div>
          {/* END NAME */}
          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="text-text-color font-medium text-sm block mb-1"
            >
              Email*
            </label>
            <Input
              className="bg-white outline-none text-black"
              type="email"
              {...register("email")}
            />
            <p className="flex self-start text-red-500 text-xs mt-0.5">
              {errors.email?.message}
            </p>
          </div>
          {/* END EMAIL */}
          {/* SUBJECT */}
          <div>
            <label
              htmlFor="subject"
              className="text-text-color font-medium text-sm block mb-1"
            >
              Subject*
            </label>
            <Input
              className="bg-white outline-none text-black"
              type="text"
              {...register("subject")}
            />
            <p className="flex self-start text-red-500 text-xs mt-0.5">
              {errors.subject?.message}
            </p>
          </div>
          {/* END SUBJECT */}
          {/* MORE DETAILS */}
          <div>
            <label
              htmlFor="details"
              className="text-text-color font-medium text-sm block mb-1"
            >
              Details*
            </label>
            <textarea
              className={
                "w-full bg-white outline-none  text-base  p-4 border border-input-border"
              }
              {...register("message")}
            />
            <p className="flex self-start text-red-500 text-xs mt-0.5">
              {errors.message?.message}
            </p>
          </div>
          {/* END MORE DETAILS */}

          {/* ATTACHMENT UPLOAD */}
          {/* ATTACHMENT FILENAME */}
          <div
            className={cn(
              "text-white flex gap-x-2 items-center",
              !watchedAttachment && "hidden"
            )}
          >
            <button
              onClick={clearAttachment}
              type="button"
              className="size-8 grid place-items-center border border-[#333333]"
            >
              <FiX />
            </button>
            <p className="truncate">{watchedAttachment?.name}</p>
          </div>
          {/* END ATTACHMENT FILENAME */}
          <label
            htmlFor="attachments"
            className="text-text-color mt-10 flex items-center gap-x-2 cursor-pointer"
          >
            <input
              ref={attachmentInputRef}
              onChange={setAttachment}
              id="attachments"
              type="file"
              className="opacity-0 w-0 h-0"
              accept="image/*"
            />
            <HiPaperClip className="text-white text-xl" />
            <span>Upload your attachments</span>
          </label>
          {/* END ATTACHMENT UPLOAD */}

          <SubmitButton type="submit">
            {contactusPending && !contactusError ? <LoadingSvg /> : "SUBMIT"}
          </SubmitButton>
        </form>
      </div>
    </section>
  );
}
