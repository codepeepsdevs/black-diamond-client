"use client";

import { PasswordInput, AuthSubmitButton } from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Link from "next/link";
import { useResetPassword } from "@/api/auth/auth.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import LoadingSvg from "@/components/shared/Loader/LoadingSvg";
import SuccessToast from "@/components/toast/SuccessToast";
import useAuthEmailStore from "@/store/authEmail.store";
import { useParams, useRouter } from "next/navigation";

const changePasswordFormSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});

const ChangePassword = () => {
  const params = useParams<{ token: string }>();

  const setAuthEmail = useAuthEmailStore((state) => state.setAuthEmail);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();
  const form = useForm<Yup.InferType<typeof changePasswordFormSchema>>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(changePasswordFormSchema),
    mode: "onBlur",
  });

  const { register, handleSubmit, formState, watch, reset } = form;
  const { errors } = formState;

  const onChangePasswordSuccess = (data: any) => {
    SuccessToast({
      title: "Password changed",
      description: "Please login with your new password",
    });
    router.replace("/login");
    reset();
  };

  const onChangePasswordError = (error: any) => {
    const errorMessage = error.response.data.message;

    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Password Reset failed",
      descriptions,
    });
  };

  const {
    mutate: resetPassword,
    isPending: forgotPasswordPending,
    isError: forgotPasswordError,
  } = useResetPassword(onChangePasswordError, onChangePasswordSuccess);

  const onSubmit = async (
    data: Yup.InferType<typeof changePasswordFormSchema>
  ) => {
    resetPassword({
      resetToken: params.token,
      ...data,
    });
  };

  return (
    <>
      <section className="my-sm sm:my-lg">
        <div className="container py-10 mx-auto max-w-xl sm:border border-white">
          <div className="text-center mb-10 sm:mb-14 text-white">
            <div className="uppercase text-xs sm:text-sm">
              CHANGE YOUR PASSWORD{" "}
            </div>
            <h1 className="text-2xl sm:text-4xl mt-2 sm:mt-4">
              Reset Password
            </h1>
          </div>

          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8 mx-auto "
          >
            <div className="flex flex-col gap-2">
              <PasswordInput
                className="outline-none"
                {...register("newPassword")}
                placeholder="New Password*"
              />
              <p className="text-xs text-red-500">
                {errors.newPassword?.message}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <PasswordInput
                className="outline-none"
                {...register("confirmPassword")}
                placeholder="Confirm Password*"
              />
              <p className="text-xs text-red-500">
                {errors.confirmPassword?.message}
              </p>
            </div>

            <AuthSubmitButton type="submit" className="">
              {forgotPasswordPending && !forgotPasswordError ? (
                <LoadingSvg />
              ) : (
                "CHANGE PASSWORD"
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
    </>
  );
};

export default ChangePassword;
