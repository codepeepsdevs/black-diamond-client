import { User } from "@/constants/types";
import * as Yup from "yup";
import { signupFormSchema } from "./auth.schema";

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export type LoginResponse = User & {
  accessToken: string;
};

export type CompleteSignupResponse = User & {
  accessToken: string;
};

export type CompleteSignupData = Omit<
  Yup.InferType<typeof signupFormSchema>,
  "confirmPassword"
>;
