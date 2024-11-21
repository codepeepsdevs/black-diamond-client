"use client";

import {
  PasswordInput,
  AuthSubmitButton,
  Checkbox,
  Input,
  SubmitButton,
} from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { facebookAuth, googleAuth } from "../../../../public/icons";
import Link from "next/link";
import ErrorToast from "@/components/toast/ErrorToast";
import { useLogin, useRegister } from "@/api/auth/auth.queries";
import LoadingSvg from "@/components/shared/Loader/LoadingSvg";
import VerifyAccountDialog from "@/components/shared/Modals/VerifyAccountDialog";
import useAuthEmailStore from "@/store/authEmail.store";
import { watch } from "fs";

// Schema for form validation
const signupFormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  firstname: Yup.string().required("First Name is required"),
  lastname: Yup.string().required("Last Name is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match") // Ensure that it matches the password field
    .required("Confirm Password is required"),
  agreeToTerms: Yup.boolean().oneOf([true], "You must agree to the terms"),
});

const api = process.env.NEXT_PUBLIC_BACKEND_API as string;

const Signup = () => {
  const setAuthEmail = useAuthEmailStore((state) => state.setAuthEmail);
  const [showDialog, setShowDialog] = useState(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [googleError, setGoogleError] = useState<boolean>(false);
  // const [facebookLoading, setFacebookLoading] = useState<boolean>(false);
  // const [facebookError, setFacebookError] = useState<boolean>(false);

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

  const { register, handleSubmit, formState, reset, watch } = form;
  const { errors } = formState;

  const onSignupSuccess = (data: any) => {
    setAuthEmail(data.email);
    setShowDialog(true);
    reset();
  };

  const onSignupError = (error: any) => {
    const errorMessage = error.response.data.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Registration Failed",
      descriptions,
    });
  };

  const {
    mutate: signup,
    isPending: signupPending,
    isError: signupError,
  } = useRegister(onSignupError, onSignupSuccess);

  const onSubmit = async (data: Yup.InferType<typeof signupFormSchema>) => {
    const { agreeToTerms, confirmPassword, ...rest } = data;
    signup(rest);
  };

  const googleLoginAction = async () => {
    try {
      const googleLoginUrl = `${api}/auth/google`;
      window.open(googleLoginUrl, "_self");
    } catch (err) {
      setGoogleError(true);
      setGoogleLoading(false);
    }
  };

  const watchedEmail = watch("email");

  // const facebookLoginAction = async () => {
  //   try {
  //     const facebookLoginUrl = `${api}/auth/facebook`;
  //     window.open(facebookLoginUrl, "_self");
  //   } catch (err) {
  //     setFacebookError(true);
  //     setFacebookLoading(false);
  //   }
  // };

  return (
    <>
      <section className="my-sm sm:my-lg">
        <div className="container py-10 mx-auto max-w-xl sm:border border-white">
          <div className="text-center mb-10 sm:mb-14 text-white">
            <div className="uppercase text-xs sm:text-sm">
              CREATE YOUR BLACK DIAMOND ACCOUNT
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
                className="outline-none"
                {...register("email")}
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

            <div className="flex justify-center items-center w-full">
              <p className="w-full text-[#C0C0C0] text-sm text-center">or</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setGoogleLoading(true);
                setGoogleError(false);
                googleLoginAction();
              }}
              className="flex items-center gap-2 justify-center w-full text-white px-8 py-3 text-sm  bg-[#151515] border border-[#333333] "
            >
              {googleLoading && !googleError ? (
                <>
                  <LoadingSvg />
                  Loading...
                </>
              ) : (
                <>
                  <Image alt="google" src={googleAuth} /> Sign up with Google{" "}
                </>
              )}
            </button>

            {/* <button
              type="button"
              onClick={() => {
                setFacebookLoading(true);
                setFacebookError(false);
                facebookLoginAction();
              }}
              className="flex items-center gap-2 justify-center w-full text-white px-8 py-3 text-sm bg-[#151515] border border-[#333333] "
            >
              {facebookLoading && !facebookError ? (
                <>
                  <LoadingSvg />
                  Loading...
                </>
              ) : (
                <>
                  <Image alt="facebook" src={facebookAuth} /> Sign in with
                  Facebook{" "}
                </>
              )}
            </button> */}

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
        email={watchedEmail}
        open={showDialog}
        // defaultOpen={true}
        onOpenChange={() => {
          setShowDialog(false);
        }}
      />
    </>
  );
};

export default Signup;
