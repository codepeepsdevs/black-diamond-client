import * as Yup from "yup";

export const contactFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Please provide more details"),
  attachment: Yup.mixed<File>().optional(),
});
