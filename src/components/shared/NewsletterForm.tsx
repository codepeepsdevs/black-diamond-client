"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AxiosError } from "axios";
import {
  ISubscribe,
  NewsletterSubscriptionError,
} from "@/api/newsletter/newsletter.types";
import SuccessToast from "../toast/SuccessToast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import ErrorToast from "../toast/ErrorToast";
import { useNewsletterSubscribe } from "@/api/newsletter/newsletter.queries";
import LoadingSvg from "./Loader/LoadingSvg";
import Image from "next/image";
import { Forward } from "../../../public/icons";
import * as Yup from "yup";

export default function NewsletterForm() {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const form = useForm<ISubscribe>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState, watch, reset } = form;
  const { errors } = formState;
  const watchedEmail = watch("email");

  const onNewsletterSuccess = (data: any) => {
    SuccessToast({
      title: "Success",
      description: "Subscribed to newsletter",
    });
  };

  const onNewsletterError = (
    error: AxiosError<NewsletterSubscriptionError>
  ) => {
    const descriptions = getApiErrorMessage(
      error,
      "Error Subscribing to newsletter"
    );
    ErrorToast({
      title: "Error",
      descriptions,
    });
  };

  const {
    mutate: subscribe,
    isPending: newsletterPending,
    isError: newsletterError,
  } = useNewsletterSubscribe(onNewsletterError, onNewsletterSuccess);
  return (
    <motion.div
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, type: "tween" }}
      className="py-10 pb-20 flex flex-col items-center gap-8 text-white text-center text-sm"
    >
      <div className="w-[75%] md:w-[35%] lg:w-[25%] flex flex-col gap-2 leading-6">
        <div className="underline font-normal">SUBSCRIBE</div>
        <p>Subscribe to join our Black Diamond Newsletter</p>
      </div>

      <div className="w-[80%] md:w-[50%] lg:w-[40%]">
        <div className="flex justify-between pb-2 items-center text-[#BDBDBD]">
          <div className="w-[90%]">
            <input
              placeholder="Email"
              className="bg-black border-none outline-none w-full placeholder:text-[#BDBDBD]"
              type="text w-full"
              {...register("email")}
            />
          </div>

          {newsletterPending && !newsletterError ? (
            <LoadingSvg />
          ) : (
            <Image
              className="hover:opacity-80 cursor-pointer w-[24px] h-[24px]"
              src={Forward}
              alt="forward"
              onClick={() => {
                subscribe({
                  email: watchedEmail,
                });
              }}
            />
          )}
        </div>

        <div className="border-[1px] border-[#C0C0C0]" />
        <p className="flex self-start text-red-500 text-xs mt-0.5">
          {errors.email?.message}
        </p>
      </div>
    </motion.div>
  );
}
