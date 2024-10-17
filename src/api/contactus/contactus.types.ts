import * as Yup from "yup";
import { contactFormSchema } from "./contactus.schema";

export type ContactUsData = Yup.InferType<typeof contactFormSchema>;
