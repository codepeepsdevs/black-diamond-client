import { PageData, User } from "@/constants/types";
import { request } from "@/utils/axios-utils";
import { AxiosResponse } from "axios";
import {
  AdminUsersStats,
  DownloadUsersData,
  GetUserData,
  IUpdateUser,
  NewUsersTodayStats,
  UsersStatsData,
  UsersStatsResponse,
} from "./user.types";

export const getUser = () => {
  return request({ url: `/users/get-user` }) as Promise<AxiosResponse<User>>;
};

export const getUsers = (options?: PageData & { search: string }) => {
  const page = options?.page;
  const limit = options?.limit;
  const search = options?.search;
  return request<GetUserData>({
    url: `/users/get-users?page=${page || ""}&limit=${limit || ""}&search=${search || ""}`,
  });
};

export const updateUserRequest = async (formdata: IUpdateUser) => {
  return request({
    url: "/users/updateUser",
    method: "post",
    data: formdata,
  });
};

export const usersStats = async (range?: UsersStatsData) => {
  return request<UsersStatsResponse>({
    url: `/users/users-stats?startDate=${range?.startDate?.toISOString() || ""}&endDate=${range?.endDate?.toISOString() || ""}`,
    method: "get",
  });
};

export const newUsersTodayStats = async () => {
  return request<NewUsersTodayStats>({
    url: "/users/new-users-today-stats",
    method: "get",
  });
};

export const adminUsersStats = async () => {
  return request<AdminUsersStats>({
    url: "/users/admin-users-stats",
    method: "get",
  });
};

export const downloadUsers = async () => {
  const response = await request({
    url: "/users/export-to-excel",
    method: "get",
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    responseType: "blob",
  });

  // Step 1: Create a blob from the response
  const blob = new Blob([response.data], { type: response.data.type });

  // Step 2: Create a download URL for the blob
  const downloadUrl = window.URL.createObjectURL(blob);

  // Step 3: Create a temporary link element
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "User_Details.xlsx";

  // Step 4: Trigger the download
  document.body.appendChild(link);
  link.click();

  // Step 5: Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
