import * as Yup from "yup";

export const signupFormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  firstname: Yup.string().required("First Name is required"),
  lastname: Yup.string().required("Last Name is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  agreeToTerms: Yup.boolean().oneOf([true], "You must agree to the terms"),
});
