import { ErrorResponse } from "@/constants/types";

export interface ISubscribe {
  email: string;
}

export type NewsletterSubscriptionError = ErrorResponse & {
  message: string;
};

export type NewsletterSubscriptionResponse = {
  message: string;
};
