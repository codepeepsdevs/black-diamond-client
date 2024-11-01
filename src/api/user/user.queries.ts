import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUser, getUsers, updateUserRequest, usersStats } from "./user.apis";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse, PageData, User } from "@/constants/types";
import { UsersStatsData, UsersStatsResponse } from "./user.types";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // refetchInterval: 10000,
  });
};

export const useGetUsers = (page?: PageData) => {
  return useQuery<AxiosResponse<User[]>, AxiosError<ErrorResponse>>({
    queryKey: ["users", page],
    queryFn: () => getUsers(page),
    placeholderData: keepPreviousData,
    // refetchOnWindowFocus: true,
    // refetchOnReconnect: true,
    // refetchInterval: 10000,
  });
};

export const useUpdateUser = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useUsersStats = (range?: UsersStatsData) => {
  return useQuery<AxiosResponse<UsersStatsResponse>, AxiosError<ErrorResponse>>(
    {
      queryFn: () => usersStats(range),
      queryKey: ["users-stats", range],
    }
  );
};
