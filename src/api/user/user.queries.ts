import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  adminUsersStats,
  downloadUsers,
  getUser,
  getUsers,
  newUsersTodayStats,
  updateUserRequest,
  usersStats,
} from "./user.apis";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse, PageData, User } from "@/constants/types";
import {
  AdminUsersStats,
  DownloadUsersData,
  GetUserData,
  NewUsersTodayStats,
  UsersStatsData,
  UsersStatsResponse,
} from "./user.types";

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
  return useQuery<AxiosResponse<GetUserData>, AxiosError<ErrorResponse>>({
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

export const useNewUsersTodayStats = () => {
  return useQuery<AxiosResponse<NewUsersTodayStats>, AxiosError<ErrorResponse>>(
    {
      queryFn: newUsersTodayStats,
      queryKey: ["new-users-today-stats"],
    }
  );
};

export const useAdminUsersStats = () => {
  return useQuery<AxiosResponse<AdminUsersStats>, AxiosError<ErrorResponse>>({
    queryFn: adminUsersStats,
    queryKey: ["admin-users-stats"],
  });
};

export const useDownloadUsers = (
  onError: (e: AxiosError<ErrorResponse>) => void,
  onSuccess: () => void
) => {
  return useMutation({
    mutationFn: downloadUsers,
    onError,
    onSuccess,
  });
};
