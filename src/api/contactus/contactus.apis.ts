import { request } from "@/utils/axios-utils";
import { ContactUsData } from "./contactus.types";

export const contactUsRequest = async (data: ContactUsData) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("message", data.message);
  formData.append("name", data.name);
  formData.append("subject", data.subject);
  if (data.attachment) {
    formData.append("attachment", data.attachment);
  }
  return request({
    url: "/contactus",
    method: "post",
    data: formData,
  });
};
