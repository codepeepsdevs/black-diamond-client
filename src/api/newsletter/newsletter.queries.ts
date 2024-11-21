import { useMutation } from "@tanstack/react-query";
import { subscribeRequest } from "./newsletter.apis";
import { AxiosError, AxiosResponse } from "axios";
import {
  NewsletterSubscriptionError,
  NewsletterSubscriptionResponse,
} from "./newsletter.types";

export const useNewsletterSubscribe = (
  onError: (error: AxiosError<NewsletterSubscriptionError>) => void,
  onSuccess: (data: AxiosResponse<NewsletterSubscriptionResponse>) => void
) => {
  return useMutation({
    mutationFn: subscribeRequest,
    onError,
    onSuccess,
  });
};
