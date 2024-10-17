import * as Yup from "yup";

export const CareersFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, "Invalid firstName")
    .required("firstName is required")
    .max(50, "firstName must be less than 50 characters"),

  lastName: Yup.string()
    .matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, "Invalid firstName")
    .required("firstName is required")
    .max(50, "firstName must be less than 50 characters"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .max(50, "Email must be less than 50 characters")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
      "Invalid email address"
    ),

  phoneNumber: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .required("Phone number is required"),

  location: Yup.string().required(),
  tiktokHandle: Yup.string().required(),
  instagramHandle: Yup.string().optional(),
  twitterHandle: Yup.string().optional(),
  facebookHandle: Yup.string().optional(),
  description: Yup.string().optional(),
  note: Yup.string().optional(),
});
