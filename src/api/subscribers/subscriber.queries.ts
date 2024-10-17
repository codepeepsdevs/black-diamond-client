import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addSubscribers,
  listSubscribers,
  listUnsubscribed,
} from "./subscriber.apis";
import toast from "react-hot-toast";
import { AxiosError, AxiosResponse } from "axios";
import { Subscriber } from "./subscriber.types";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

export const useListSubscribers = () => {
  return useQuery({
    queryKey: ["list-subscribers"],
    queryFn: listSubscribers,
  });
};

export const useListUnsubscribed = () => {
  return useQuery({
    queryKey: ["list-subscribed"],
    queryFn: listUnsubscribed,
  });
};

export const useAddSubscribers = (
  onSuccess: (data: AxiosResponse<Subscriber[]>) => void
) => {
  return useMutation({
    mutationFn: addSubscribers,
    onError: (e: AxiosError<Error>) => {
      const errorMessage = getApiErrorMessage(
        e,
        "Something went wrong while adding subscribers"
      );
      ErrorToast({
        title: "Error",
        descriptions: errorMessage,
      });
    },
    onSuccess: (data: AxiosResponse<Subscriber[]>) => {
      SuccessToast({
        title: "Success",
        description: "Subscribers successfully added",
      });
      onSuccess(data);
    },
  });
};
