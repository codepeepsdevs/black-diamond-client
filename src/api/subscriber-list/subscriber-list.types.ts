import { Subscriber } from "../subscribers/subscriber.types";
import * as Yup from "yup";
import {
  multipleManualEntrySchema,
  singleManualEntrySchema,
} from "./subscriber-list.schema";

export type SubscriberList = {
  id: string;
  name: string;
  subscribers: Subscriber[];
  createdAt: string;
  updatedAt: string;
};

export type NewListData = {
  name: string;
};

export type UploadByCSVData = {
  listId: string;
  csvFile: File;
};

export type UploadByCSVResponse = {
  message: string;
  listId: string;
};

export type SingleManualEntryData = Yup.InferType<
  typeof singleManualEntrySchema
>;

export type MultipleManualEntryData = Yup.InferType<
  typeof multipleManualEntrySchema
>;

export type AddSubscriberResponse = {
  message: string;
  listId: string;
};
