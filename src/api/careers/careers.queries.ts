import { useMutation } from "@tanstack/react-query";
import { careersRequest } from "./careers.apis";

export const useCareers = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: careersRequest,
    onError,
    onSuccess,
  });
};
