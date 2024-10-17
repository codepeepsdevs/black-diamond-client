import { useMutation, useQuery } from "@tanstack/react-query";
import {
  completeSignup,
  confirmEmailRequest,
  forgotPasswordRequest,
  loginRequest,
  registerRequest,
  resetPasswordRequest,
} from "./auth.apis";
import { AxiosError, AxiosResponse } from "axios";
import { CompleteSignupResponse, IRegister, LoginResponse } from "./auth.types";

export const useLogin = (
  onError: (error: any) => void,
  onSuccess: (data: AxiosResponse<LoginResponse>) => void
) => {
  return useMutation({
    mutationFn: loginRequest,
    onError,
    onSuccess,
  });
};

export const useRegister = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: registerRequest,
    onError,
    onSuccess,
  });
};

export const useCompleteSignup = (
  onError: (error: AxiosError<Error>) => void,
  onSuccess: (data: AxiosResponse<CompleteSignupResponse>) => void
) => {
  return useMutation({
    mutationFn: completeSignup,
    onError,
    onSuccess,
  });
};

export const useForgotPassword = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: forgotPasswordRequest,
    onError,
    onSuccess,
  });
};

export const useResetPassword = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: resetPasswordRequest,
    onError,
    onSuccess,
  });
};

export const useConfirmEmail = (token: string) => {
  return useQuery({
    queryKey: ["confirmEmail", { token }],
    queryFn: () => confirmEmailRequest(token),
    enabled: false,
    refetchInterval: 0,
  });
};
