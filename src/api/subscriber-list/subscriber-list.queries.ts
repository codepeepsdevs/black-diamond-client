import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  addMultipleDetailToList,
  addSingleDetailToList,
  createSubscriberList,
  getSubscriberList,
  getSubscriberLists,
  uploadListByCSV,
} from "./subscriber-list.apis";
import toast from "react-hot-toast";
import {
  AddSubscriberResponse,
  SubscriberList,
  UploadByCSVResponse,
} from "./subscriber-list.types";
import { AxiosError, AxiosResponse } from "axios";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

export const useCreateSubscriberList = (
  onSuccess: (data: AxiosResponse<SubscriberList>) => void
) => {
  return useMutation({
    mutationFn: createSubscriberList,
    onError: (e: AxiosError<Error>) => {
      const errorMessage = getApiErrorMessage(
        e,
        "An error occurred while creating the subscriber list"
      );
      ErrorToast({
        title: "Error",
        descriptions: errorMessage,
      });
    },
    onSuccess,
  });
};

export const useAddSingleDetailToList = (
  onSuccess: (data: AxiosResponse<AddSubscriberResponse>) => void
) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: addSingleDetailToList,
    onError: (e: AxiosError<Error>) => {
      const errorMessage = getApiErrorMessage(
        e,
        "An error occurred while adding subscriber to list"
      );
      ErrorToast({
        title: "Error",
        descriptions: errorMessage,
      });
    },
    onSuccess: (data: AxiosResponse<AddSubscriberResponse>) => {
      queryClient.invalidateQueries({
        queryKey: ["subscriber-list", data.data.listId],
      });

      onSuccess(data);
    },
  });
};

export const useAddMultipleDetailToList = (
  onSuccess: (data: AxiosResponse<AddSubscriberResponse>) => void
) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: addMultipleDetailToList,
    onError: (e: AxiosError<Error>) => {
      const errorMessage = getApiErrorMessage(
        e,
        "An error occurred while adding subscribers to list"
      );
      ErrorToast({
        title: "Error",
        descriptions: errorMessage,
      });
    },
    onSuccess: (data: AxiosResponse<AddSubscriberResponse>) => {
      queryClient.invalidateQueries({
        queryKey: ["subscriber-list", data.data.listId],
      });

      onSuccess(data);
    },
  });
};

export const useGetSubscriberLists = () => {
  return useQuery({
    queryKey: ["subscriber-lists"],
    queryFn: getSubscriberLists,
  });
};

export const useGetSubscriberList = (listId: string) => {
  return useQuery({
    queryKey: ["subscriber-list", listId],
    queryFn: () => getSubscriberList(listId),
  });
};

export const useUploadListByCSV = (
  onError?: (error: AxiosError<Error>) => void,
  onSuccess?: (data: AxiosResponse<UploadByCSVResponse>) => void
) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: uploadListByCSV,
    onError,
    onSuccess: (data: AxiosResponse<UploadByCSVResponse>) => {
      SuccessToast({
        title: "Upload success",
        description: "List uploaded successfully",
      });

      queryClient.invalidateQueries({
        queryKey: ["subscriber-list", data.data.listId],
      });

      onSuccess?.(data);
    },
  });
};
