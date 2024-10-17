import { useMutation } from "@tanstack/react-query";
import { contactUsRequest } from "./contactus.apis";

export const useContactUs = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: contactUsRequest,
    onError,
    onSuccess,
  });
};
