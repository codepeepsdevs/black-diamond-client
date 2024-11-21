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
import { useLogin } from "@/api/auth/auth.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import LoadingSvg from "@/components/shared/Loader/LoadingSvg";
import SuccessToast from "@/components/toast/SuccessToast";
import VerifyAccountDialog from "@/components/shared/Modals/VerifyAccountDialog";
import useAuthEmailStore from "@/store/authEmail.store";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { AxiosResponse } from "axios";
import { LoginResponse } from "@/api/auth/auth.types";
import { parseAsString, useQueryState } from "nuqs";
import CompleteSignupDialog from "@/components/shared/Modals/CompleteSignupDialog";

const loginFormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});
const api = process.env.NEXT_PUBLIC_BACKEND_API as string;

const Login = () => {
  const setAuthEmail = useAuthEmailStore((state) => state.setAuthEmail);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");
  const [showDialog, setShowDialog] = useState(false);
  const [showCompleteSignupDialog, setShowCompleteSignupDialog] =
    useState(false);
  const router = useRouter();

  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [googleError, setGoogleError] = useState<boolean>(false);
  // const [facebookLoading, setFacebookLoading] = useState<boolean>(false);
  // const [facebookError, setFacebookError] = useState<boolean>(false);

  const form = useForm<Yup.InferType<typeof loginFormSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginFormSchema),
    mode: "onBlur",
  });

  const { register, handleSubmit, formState, watch, reset } = form;
  const { errors } = formState;

  const onLoginSuccess = (data: AxiosResponse<LoginResponse>) => {
    setAuthEmail(data.data.email);

    Cookies.set("accessToken", data.data.accessToken, { expires: 7 }); // expires in 7 days

    SuccessToast({
      title: "Login Successful!",
      description: "Logged in successfully, Welcome back",
    });
    if (redirectUrl) {
      router.replace(decodeURIComponent(redirectUrl));
    } else {
      router.replace("/tickets");
    }
    reset();
  };

  const onLoginError = (error: any) => {
    const errorMessage = error.response.data.message;

    if (errorMessage === "email not verified") {
      setShowDialog(true);
    } else if (errorMessage === "complete signup") {
      setShowCompleteSignupDialog(true);
    } else {
      const descriptions = Array.isArray(errorMessage)
        ? errorMessage
        : [errorMessage];

      ErrorToast({
        title: "Login Failed",
        descriptions,
      });
    }
  };

  const {
    mutate: login,
    isPending: loginPending,
    isError: loginError,
  } = useLogin(onLoginError, onLoginSuccess);

  const onSubmit = async (data: Yup.InferType<typeof loginFormSchema>) => {
    login(data);
  };

  const googleLoginAction = async () => {
    try {
      const googleLoginUrl = `${api}/auth/google?prompt=select_account`;
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
            <h1 className="text-4xl text-white font-bold">Log in</h1>
            <div className="capitalize text-text-color">Welcome Back</div>
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
              <PasswordInput
                className="outline-none"
                {...register("password")}
                placeholder="Password*"
              />
              <p className="text-xs text-red-500">{errors.password?.message}</p>
            </div>
            <div className="flex items-center justify-between w-full text-white text-sm">
              <div className="flex items-center gap-2.5">
                <Checkbox />
                <p>Remember me</p>
              </div>

              <Link href={"/forgot-password"}>Forgot Password?</Link>
            </div>

            <AuthSubmitButton type="submit" className="">
              {loginPending && !loginError ? <LoadingSvg /> : "LOG IN"}
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
                  <Image alt="google" src={googleAuth} /> Log in with Google{" "}
                </>
              )}
            </button>
            {/* 
            <button
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
              <p className="text-[#c0c0c0] text-sm">Don't have an account?</p>
              <Link
                href={"/signup"}
                className="text-[#c0c0c0] font-light text-base capitalize underline"
              >
                CREATE ONE
              </Link>
            </div>
          </form>
        </div>
      </section>
      <VerifyAccountDialog
        email={watchedEmail}
        open={showDialog}
        onOpenChange={() => {
          setShowDialog(false);
        }}
      />
      <CompleteSignupDialog
        email={watchedEmail}
        open={showCompleteSignupDialog}
        onOpenChange={() => setShowCompleteSignupDialog(false)}
      />
    </>
  );
};

export default Login;
