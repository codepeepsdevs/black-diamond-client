import { User } from "@/constants/types";

export type AccountSettingsData = {
  firstname?: string;
  lastname?: string;
  imgUrl?: string;
  addressPhone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  phone?: string;
  country?: string;
  zipCode?: string;
  state?: string;
  billingPhone?: string;
  billingAddress1?: string;
  billingAddress2?: string;
  billingCity?: string;
  billingCountry?: string;
  billingZipCode?: string;
  billingState?: string;
};

export type AccountSettingsResponse = User;
