import { request } from "@/utils/axios-utils";
import { CheckoutData, CreateIntentResponse } from "./checkout.types";
import { AxiosResponse } from "axios";

export const checkoutRequest = async ({
  paymentMethod,
  eventUpdates,
  promotionalEmails,
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
  promotionalEmails,
  ...formdata
}: CheckoutData) => {
  console.log(formdata);
  const response = await request({
    url: "/stripe/create-payment-intent",
    method: "post",
    data: formdata,
  });
  console.log(response);
  return response as AxiosResponse<CreateIntentResponse>;
};
