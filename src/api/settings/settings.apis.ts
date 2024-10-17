import { request } from "@/utils/axios-utils";
import { AxiosResponse } from "axios";
import { AccountSettingsData, AccountSettingsResponse } from "./settings.types";

export const getAccountSettings = async () => {
  return (await request({
    url: `/users/get-user`,
    method: "get",
  })) as AxiosResponse<AccountSettingsResponse>;
};

export const updateAccountSettings = async (data: AccountSettingsData) => {
  return (await request({
    url: `/users/update-info`,
    method: "put",
    data,
  })) as AxiosResponse<AccountSettingsResponse>;
};
