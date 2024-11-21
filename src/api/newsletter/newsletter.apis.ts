import { request } from "@/utils/axios-utils";
import { ISubscribe, NewsletterSubscriptionResponse } from "./newsletter.types";

// export const getUser = () => {
//   return request({ url: `/` });
// };

export const subscribeRequest = async (formdata: ISubscribe) => {
  return request<NewsletterSubscriptionResponse>({
    url: "/newsletter/subscribe",
    method: "post",
    data: formdata,
  });
};
