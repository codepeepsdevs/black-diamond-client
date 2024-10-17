import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { AccountSettingsResponse } from "./settings.types";
import { getAccountSettings, updateAccountSettings } from "./settings.apis";

export const useGetAccountSettings = () => {
  return useQuery<AxiosResponse<AccountSettingsResponse>, AxiosError<Error>>({
    queryFn: getAccountSettings,
    queryKey: ["account-settings"],
  });
};

export const useUpdateAccountSettings = (
  onError: (e: AxiosError<Error>) => void,
  onSuccess: (data: AxiosResponse<AccountSettingsResponse>) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAccountSettings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-user", "account-settings"],
      });
      onSuccess(data);
    },
    onError,
  });
};
