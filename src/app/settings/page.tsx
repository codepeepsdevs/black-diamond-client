"use client";

import {
  useGetAccountSettings,
  useUpdateAccountSettings,
} from "@/api/settings/settings.queries";
import { accountFormSchema } from "@/api/settings/settings.schema";
import { AccountSettingsResponse } from "@/api/settings/settings.types";
import { useGetUser } from "@/api/user/user.queries";
import Loading from "@/app/loading";
import { AddressInfo, BillingAddressInfo, ContactInfo } from "@/components";
import SuccessToast from "@/components/toast/SuccessToast";
import useUserStore from "@/store/user.store";
import { getApiErrorMessage } from "@/utils/utilityFunctions";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosResponse } from "axios";
import { watch } from "fs";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const AccountSettingsForm = () => {
  const userQuery = useGetAccountSettings();
  const user = userQuery.data?.data;

  const defaultValues = {
    contactInfo: {
      firstName: user?.firstname,
      lastName: user?.lastname,
      email: user?.email,
      phoneNumber: user?.phone || "",
    },
    address: {
      address1: user?.address?.address1 || "",
      address2: user?.address?.address2 || "",
      city: user?.address?.city || "",
      country: user?.address?.country || "",
      zipCode: user?.address?.zipCode || "",
      state: user?.address?.state || "",
    },
    billingAddress: {
      address1: user?.billingInfo?.address1 || "",
      address2: user?.billingInfo?.address2 || "",
      city: user?.billingInfo?.city || "",
      country: user?.billingInfo?.country || "",
      zipCode: user?.billingInfo?.zipCode || "",
      state: user?.billingInfo?.state || "",
    },
  };

  const form = useForm<Yup.InferType<typeof accountFormSchema>>({
    resolver: yupResolver(accountFormSchema),
    defaultValues,
    shouldUnregister: false,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [user]);
  // const watchedEmail = form.watch("contactInfo.email");
  // useEffect(() => {
  //   console.log(watchedEmail);
  // }, [watchedEmail]);

  function updateSuccess(data: AxiosResponse<AccountSettingsResponse>) {
    SuccessToast({
      title: "Update successful",
      description: "You details have been updated successfully",
    });
  }

  const {
    mutate: updateAccountSettings,
    isPending: updateAccountSettingsPending,
  } = useUpdateAccountSettings(
    (e) =>
      getApiErrorMessage(e, "Something went went wrong while updating details"),
    updateSuccess
  );

  function onSubmit(values: Yup.InferType<typeof accountFormSchema>) {
    console.log("submitting");
    updateAccountSettings({
      address1: values.address.address1,
      address2: values.address.address2,
      billingAddress1: values.billingAddress.address1,
      billingAddress2: values.billingAddress.address2,
      billingCity: values.billingAddress.city,
      billingCountry: values.billingAddress.country,
      billingState: values.billingAddress.state,
      billingZipCode: values.billingAddress.zipCode,
      city: values.address.city,
      country: values.address.country,
      firstname: values.contactInfo.firstName,
      lastname: values.contactInfo.lastName,
      phone: values.contactInfo.phoneNumber,
      state: values.address.state,
      zipCode: values.address.zipCode,
    });
  }

  if (userQuery.isPending) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col px-4 lg:px-6 py-20 gap-6 text-white">
      <h1 className="text-base md:text-lg lg:text-2xl font-bold">
        Account Information
      </h1>
      {userQuery.isError ? (
        <p className="text-red-500">Unable to retrieve account details</p>
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 "
        >
          <ContactInfo form={form} />

          <AddressInfo form={form} />

          <BillingAddressInfo form={form} />

          <button
            disabled={updateAccountSettingsPending}
            type="submit"
            className="w-fit py-4 px-6 font-bold button-transform flex bg-button-bg  items-center justify-center"
          >
            {updateAccountSettingsPending ? "SAVING" : "SAVE"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AccountSettingsForm;
