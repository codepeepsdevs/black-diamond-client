import { useMutation } from "@tanstack/react-query";
import { subscribeRequest } from "./newsletter.apis";

export const useNewsletterSubscribe = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: subscribeRequest,
    onError,
    onSuccess,
  });
};
