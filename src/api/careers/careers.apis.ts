import { request } from "@/utils/axios-utils";

export const careersRequest = async (formdata: ICareers) => {
  return request({
    url: "/promoters",
    method: "post",
    data: formdata,
  });
};
