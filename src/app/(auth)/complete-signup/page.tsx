"use client";

import {
  PasswordInput,
  AuthSubmitButton,
  Checkbox,
  Input,
  SubmitButton,
} from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { ComponentProps, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import ErrorToast from "@/components/toast/ErrorToast";
import LoadingSvg from "@/components/shared/Loader/LoadingSvg";
import useAuthEmailStore from "@/store/authEmail.store";
import { useRouter, useSearchParams } from "next/navigation";
import { MdFmdBad } from "react-icons/md";
import * as Dialog from "@radix-ui/react-dialog";
import { jwtDecode } from "jwt-decode";
import { signupFormSchema } from "@/api/auth/auth.schema";
import SuccessToast from "@/components/toast/SuccessToast";
import { useCompleteSignup } from "@/api/auth/auth.queries";
import { getApiErrorMessage } from "@/utils/utilityFunctions";

const api = process.env.NEXT_PUBLIC_BACKEND_API as string;

const CompleteSignup = () => {
  const setAuthEmail = useAuthEmailStore((state) => state.setAuthEmail);
  const searchParams = useSearchParams();
  const [tokenInfoDialogOpen, setTokenInfoDialogOpen] = useState(false);

  const router = useRouter();
  const token = searchParams.get("token") || "";

  const form = useForm<Yup.InferType<typeof signupFormSchema>>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      agreeToTerms: false,
    },
    resolver: yupResolver(signupFormSchema),
    mode: "onBlur",
  });

  const { register, handleSubmit, formState, reset, setValue } = form;
  const { errors } = formState;

  const onSignupSuccess = (data: any) => {
    setAuthEmail(data.email);
    SuccessToast({
      title: "Signup success",
      description: "Your account has been successfully created",
    });
    reset();
    router.push("/login");
  };

  const onSignupError = (error: any) => {
    const errorMessage = getApiErrorMessage(
      error,
      "Something went wrong while completing signup"
    );

    ErrorToast({
      title: "Registration Failed",
      descriptions: errorMessage,
    });
  };

  const {
    mutate: signup,
    isPending: signupPending,
    isError: signupError,
  } = useCompleteSignup(onSignupError, onSignupSuccess);

  const onSubmit = async (data: Yup.InferType<typeof signupFormSchema>) => {
    const { agreeToTerms, email, ...rest } = data;
    signup({
      ...rest,
      token,
    });
  };

  useEffect(() => {
    try {
      const decodedToken: { email: string } = jwtDecode(token);
      setValue("email", decodedToken.email);
    } catch (e) {
      setTokenInfoDialogOpen(true); // Invalid or malformed token
    }
  }, []);
  return (
    <>
      <section className="my-sm sm:my-lg">
        <div className="container py-10 mx-auto max-w-xl sm:border border-white">
          <div className="text-center mb-10 sm:mb-14 text-white">
            <div className="uppercase text-xs sm:text-sm">
              COMPLETE YOUR BLACKDIAMOND ACCOUNT CREATION
            </div>
            <h1 className="text-2xl sm:text-4xl mt-2 sm:mt-4">Sign Up</h1>
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
                className="outline-none disabled:opacity-80"
                {...register("email")}
                disabled
                placeholder="Email Address*"
              />
              <p className="text-xs text-red-500">{errors.email?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Input
                variant="white"
                className="outline-none"
                {...register("firstname")}
                placeholder="First Name*"
              />
              <p className="text-xs text-red-500">
                {errors.firstname?.message}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Input
                variant="white"
                className="outline-none"
                {...register("lastname")}
                placeholder="Last Name*"
              />
              <p className="text-xs text-red-500">{errors.lastname?.message}</p>
            </div>
            <div className="flex flex-col gap-2">
              <PasswordInput
                className="outline-none"
                {...register("password")}
                placeholder="Password*"
              />
              <p className="text-xs text-red-500">{errors.password?.message}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 w-full text-white text-sm">
                <Checkbox {...register("agreeToTerms")} />
                <p>
                  I agree to receive marketing material and other event
                  information.
                </p>
              </div>
              <p className="text-xs text-red-500 ">
                {errors.agreeToTerms?.message}
              </p>
            </div>

            <AuthSubmitButton type="submit" className="">
              {signupPending && !signupError ? <LoadingSvg /> : "SIGN UP"}
            </AuthSubmitButton>
          </form>
        </div>
      </section>
      <TokenNotFoundDialog
        defaultOpen
        open={tokenInfoDialogOpen}
        onOpenChange={setTokenInfoDialogOpen}
      />
    </>
  );
};

export default CompleteSignup;

function TokenNotFoundDialog({ ...props }: ComponentProps<typeof Dialog.Root>) {
  const router = useRouter();
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <Dialog.Content className="relative bg-[#333333] text-[#A3A7AA] p-6 max-w-md mx-auto py-9 w-screen">
            <div className="bg-red-500 text-white size-24 mx-auto rounded-full grid place-items-center">
              <MdFmdBad className="text-4xl" />
            </div>

            <div className="text-white text-2xl lg:text-4xl font-medium text-center mt-16">
              Account token not found
            </div>

            <div className="text-center my-6 space-y-4">
              <p className="text-white text-base lg:text-xl">
                The details the account to complete could not be found!
              </p>
              {/* <p className="text-text-color text-sm lg:text-base">
                Order #{orderId}
              </p> */}
            </div>

            {/* TODO: Link to edit new ticket details */}
            <div className="flex justify-center">
              <SubmitButton
                className=""
                onClick={() => router.push(`/signup/`)}
              >
                GO BACK TO SIGNUP
              </SubmitButton>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
