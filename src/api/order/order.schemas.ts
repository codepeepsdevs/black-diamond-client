import * as Yup from "yup";

export const paymentMethods = ["creditCard", "applePay", "paypal"] as const;

export const checkoutFormSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  paymentMethod: Yup.string()
    .oneOf(paymentMethods, "Invalid payment method")
    .required("Payment method is required")
    .default("creditCard"),
  //   contactFirstname: Yup.string().required("First name is required"),
  //   contactLastname: Yup.string().required("Last name is required"),
  //   contactEmail: Yup.string().required("Contact email is required"),
  //   contactPhone: Yup.string().required("Contact phone is required"),

  eventUpdates: Yup.boolean(),
  promotionalEmails: Yup.boolean(),
});
