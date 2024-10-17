import { PageData, User } from "@/constants/types";
import { request } from "@/utils/axios-utils";
import { AxiosResponse } from "axios";
import { IUpdateUser, UsersStatsData, UsersStatsResponse } from "./user.types";

export const getUser = () => {
  return request({ url: `/users/get-user` }) as Promise<AxiosResponse<User>>;
};

export const getUsers = (_page?: PageData) => {
  const page = _page?.page;
  const limit = _page?.limit;
  return request({
    url: `/users/get-users?page=${page || ""}&limit=${limit || ""}`,
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
