import * as Yup from "yup";

export const singleManualEntrySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required"),
});

export const multipleManualEntrySchema = Yup.object().shape({
  details: Yup.string().required("Comma seperated details are required"),
});
