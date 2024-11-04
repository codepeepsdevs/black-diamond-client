"use client";

import { PasswordInput, AuthSubmitButton, Input } from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Link from "next/link";
import { useForgotPassword } from "@/api/auth/auth.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import LoadingSvg from "@/components/shared/Loader/LoadingSvg";
import SuccessToast from "@/components/toast/SuccessToast";
import VerifyAccountDialog from "@/components/shared/Modals/VerifyAccountDialog";
import useAuthEmailStore from "@/store/authEmail.store";

const forgotPasswordFormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const setAuthEmail = useAuthEmailStore((state) => state.setAuthEmail);
  const [showDialog, setShowDialog] = useState(false);

  const form = useForm<Yup.InferType<typeof forgotPasswordFormSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(forgotPasswordFormSchema),
    mode: "onBlur",
  });

  const { register, handleSubmit, formState, watch, reset } = form;
  const { errors } = formState;

  const onForgotPasswordSuccess = (data: any) => {
    setAuthEmail(data.email);
    SuccessToast({
      title: "Reset Link Successful!",
      description: "Check your email to reset your password",
    });
    reset();
  };

  const onForgotPasswordError = (error: any) => {
    const errorMessage = error.response.data.message;

    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Email sending failed",
      descriptions,
    });
  };

  const {
    mutate: forgotPassword,
    isPending: forgotPasswordPending,
    isError: forgotPasswordError,
  } = useForgotPassword(onForgotPasswordError, onForgotPasswordSuccess);

  const onSubmit = async (
    data: Yup.InferType<typeof forgotPasswordFormSchema>
  ) => {
    forgotPassword(data);
  };

  return (
    <>
      <section className="my-sm sm:my-lg">
        <div className="container py-10 mx-auto max-w-xl sm:border border-white">
          <div className="text-center mb-10 sm:mb-14 text-white">
            <div className="uppercase text-xs sm:text-sm">
              SEND A PASSWORD RESET LINK TO YOUR EMAIL
            </div>
            <h1 className="text-2xl sm:text-4xl mt-2 sm:mt-4">
              Forgot Password
            </h1>
          </div>

          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8 mx-auto "
          >
            <div className="flex flex-col gap-2">
              <Input
                variant="white"
                type="email"
                className="outline-none"
                {...register("email")}
                placeholder="Email Address*"
              />
              <p className="text-xs text-red-500">{errors.email?.message}</p>
            </div>

            <AuthSubmitButton type="submit" className="">
              {forgotPasswordPending && !forgotPasswordError ? (
                <LoadingSvg />
              ) : (
                "SEND LINK"
              )}
            </AuthSubmitButton>

            <div className="flex flex-col gap-4 justify-center items-center">
              <p className="text-[#c0c0c0] text-sm">Already have an account?</p>
              <Link
                href={"/login"}
                className="text-[#c0c0c0] font-light text-base capitalize underline"
              >
                LOG IN
              </Link>
            </div>
          </form>
        </div>
      </section>
      <VerifyAccountDialog
        open={showDialog}
        onOpenChange={() => {
          setShowDialog(false);
        }}
      />
    </>
  );
};

export default ForgotPassword;
