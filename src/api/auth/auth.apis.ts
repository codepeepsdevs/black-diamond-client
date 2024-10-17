import { client, request } from "@/utils/axios-utils";
import Cookies from "js-cookie";
import {
  CompleteSignupData,
  IForgotPassword,
  ILogin,
  IRegister,
  IResetPassword,
  LoginResponse,
} from "./auth.types";

export const loginRequest = async (formdata: ILogin) => {
  const response = await request<LoginResponse>({
    url: "/auth/login",
    method: "post",
    data: formdata,
  });

  const accessToken = response.data.accessToken;
  Cookies.set("accessToken", accessToken);

  client.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  return response;
};

export const registerRequest = async (formdata: IRegister) => {
  return request({ url: "/auth/signup", method: "post", data: formdata });
};

export const completeSignup = async (formdata: CompleteSignupData) => {
  return request({
    url: "/auth/complete-signup",
    method: "post",
    data: formdata,
  });
};

export const forgotPasswordRequest = async (formdata: IForgotPassword) => {
  return request({
    url: "/auth/forgot-password",
    method: "post",
    data: formdata,
  });
};

export const resetPasswordRequest = async (formdata: IResetPassword) => {
  return request({
    url: "/auth/reset-password",
    method: "post",
    data: formdata,
  });
};

export const confirmEmailRequest = (token: string) => {
  return request({ url: `/auth/confirm-email/${token}` });
};
