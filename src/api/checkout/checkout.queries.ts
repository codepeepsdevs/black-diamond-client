import { useMutation } from "@tanstack/react-query";
import { checkoutRequest, createPaymentIntent } from "./checkout.apis";
import { AxiosError, AxiosResponse } from "axios";
import {
  CheckoutData,
  CheckoutResponse,
  CreateIntentResponse,
} from "./checkout.types";
import { ErrorResponse } from "@/constants/types";

export const useCheckout = (
  onError: (error: AxiosError<ErrorResponse>) => void,
  onSuccess: (data: AxiosResponse<CheckoutResponse>) => void
) => {
  return useMutation<AxiosResponse<CheckoutResponse>, any, CheckoutData>({
    mutationFn: checkoutRequest,
    onError,
    onSuccess,
  });
};

export const useCreateIntent = (
  onError: (error: any) => void,
  onSuccess: (data: AxiosResponse<CreateIntentResponse>) => void
) => {
  return useMutation<AxiosResponse<CreateIntentResponse>, any, CheckoutData>({
    mutationFn: createPaymentIntent,
    onError,
    onSuccess,
  });
};
