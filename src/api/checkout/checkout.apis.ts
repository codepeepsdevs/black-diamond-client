import { request } from "@/utils/axios-utils";
import { CheckoutData, CreateIntentResponse } from "./checkout.types";
import { AxiosResponse } from "axios";

export const checkoutRequest = async ({
  paymentMethod,
  ...formdata
}: CheckoutData) => {
  return await request({
    url: "/orders/create",
    method: "post",
    data: formdata,
  });
};

export const createPaymentIntent = async ({
  paymentMethod,
  eventUpdates,
  ...formdata
}: CheckoutData) => {
  const response = await request({
    url: "/stripe/create-payment-intent",
    method: "post",
    data: formdata,
  });
  return response as AxiosResponse<CreateIntentResponse>;
};
