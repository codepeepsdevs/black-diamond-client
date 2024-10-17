import * as Yup from "yup";

export const accountFormSchema = Yup.object().shape({
  // Contact Information section
  contactInfo: Yup.object({
    firstName: Yup.string().required("First Name is required"), // required field
    lastName: Yup.string().required("Last Name is required"), // required field
    email: Yup.string().email("Invalid email"),
    //   .required("Email Address is required"), // required field
    phoneNumber: Yup.string().required("Phone Number is required"), // required field
  }),

  // Address section
  address: Yup.object().shape({
    address1: Yup.string().required("Address 1 is required"), // required field
    address2: Yup.string().optional(), // optional field
    city: Yup.string().required("City is required"), // required field
    country: Yup.string().required("Country is required"), // required field
    zipCode: Yup.string().required("Zip/Postal Code is required"), // required field
    state: Yup.string().required("State is required"), // required field
  }),

  // Billing Address section
  billingAddress: Yup.object().shape({
    address1: Yup.string().required("Address 1 is required"), // required field
    address2: Yup.string().optional(), // optional field
    city: Yup.string().required("City is required"), // required field
    country: Yup.string().required("Country is required"), // required field
    zipCode: Yup.string().required("Zip/Postal Code is required"), // required field
    state: Yup.string().required("State is required"), // required field
  }),
});
