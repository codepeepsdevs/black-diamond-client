import { request } from "@/utils/axios-utils";

// export const getUser = () => {
//   return request({ url: `/` });
// };

export const subscribeRequest = async (formdata: ISubscribe) => {
  return request({
    url: "/newsletter/subscribe",
    method: "post",
    data: formdata,
  });
};
