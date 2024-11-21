import * as Yup from "yup";

export const dateStringSchema = Yup.string().test(
  "is-valid-date",
  "Invalid date format",
  (value: any) => {
    const date = new Date(value);
    return !isNaN(date.getTime()); // Checks if the date is valid
  }
);
