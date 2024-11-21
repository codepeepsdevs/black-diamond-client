import { request } from "@/utils/axios-utils";
import {
  AddSubscriberResponse,
  MultipleManualEntryData,
  NewListData,
  SingleManualEntryData,
  SubscriberList,
  UploadByCSVData,
  UploadByCSVResponse,
} from "./subscriber-list.types";
import { AxiosResponse } from "axios";

// export const getUser = () => {
//   return request({ url: `/` });
// };

export const createSubscriberList = async (data: NewListData) => {
  return request({
    url: "/subscriber-list/",
    method: "post",
    data,
  });
};

export const getSubscriberLists = async () => {
  return await request<
    (SubscriberList & { _count: { subscribers: number } })[]
  >({
    url: "/subscriber-list/",
    method: "get",
  });
};

export const getSubscriberList = async (listId: string) => {
  return await request<SubscriberList>({
    url: "/subscriber-list/" + listId,
    method: "get",
  });
};

export const uploadListByCSV = async (data: UploadByCSVData) => {
  const formData = new FormData();
  formData.append("listId", data.listId);
  formData.append("csvFile", data.csvFile);

  return await request<UploadByCSVResponse>({
    url: "/subscriber-list/add-from-csv/" + data.listId,
    method: "post",
    data: formData,
  });
};

export const addSingleDetailToList = async ({
  listId,
  ...data
}: SingleManualEntryData & {
  listId: string;
}) => {
  return await request<AddSubscriberResponse>({
    url: "/subscriber-list/add-subscriber-details/" + listId,
    method: "post",
    data,
  });
};

export const addMultipleDetailToList = async ({
  listId,
  ...data
}: MultipleManualEntryData & {
  listId: string;
}) => {
  return await request<AddSubscriberResponse>({
    url: "/subscriber-list/add-subscribers-details/" + listId,
    method: "post",
    data: data,
  });
};
