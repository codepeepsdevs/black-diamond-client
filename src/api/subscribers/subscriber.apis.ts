import { request } from "@/utils/axios-utils";
import { CreateSubscriberData, Subscriber } from "./subscriber.types";

// export const getUser = () => {
//   return request({ url: `/` });
// };

export const listSubscribers = async () => {
  return request<Subscriber[]>({
    url: "/subscribers",
    method: "get",
  });
};

export const listUnsubscribed = async () => {
  return request<Subscriber[]>({
    url: "/subscribers/unsuscribed",
    method: "get",
  });
};

export const addSubscribers = async (data: CreateSubscriberData[]) => {
  return request({
    url: "/subscribers/bulk-create",
    method: "post",
    data: {
      subscribers: data,
    },
  });
};
