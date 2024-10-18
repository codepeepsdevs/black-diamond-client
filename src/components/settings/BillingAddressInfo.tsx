import { accountFormSchema } from "@/api/settings/settings.schema";
import React from "react";
import { UseFormRegister, UseFormReturn } from "react-hook-form";
import * as Yup from "yup";
import { FormError } from "../shared/FormError";

interface BillingAddressInfoProps {
  form: UseFormReturn<Yup.InferType<typeof accountFormSchema>>;
}

const BillingAddressInfo: React.FC<BillingAddressInfoProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium text-sm md:text-base">Billing Address</h2>
      <div className="text-[#BDBDBD] flex flex-col gap-2">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <h3>Address1</h3>
            <input
              {...register("billingAddress.address1")}
              className="w-full bg-input-bg border-2 py-4 p-3 border-none outline-none border-input-border"
            />
            <FormError error={errors.billingAddress?.address1} />
          </div>
          <div className="flex flex-col gap-1">
            Address2
            <input
              {...register("billingAddress.address2")}
              className="w-full bg-input-bg border-2 py-4 p-3  border-none outline-none border-input-border"
            />
            <FormError error={errors.billingAddress?.address2} />
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <h3>City</h3>
            <input
              {...register("billingAddress.city")}
              className="bg-input-bg border-2 py-4 p-3  border-none outline-none border-input-border"
            />
            <FormError error={errors.billingAddress?.city} />
          </div>
          <div className="flex flex-col gap-1">
            <h3>Country</h3>
            <input
              {...register("billingAddress.country")}
              className="bg-input-bg border-2 py-4 p-3  border-none outline-none border-input-border"
            />
            <FormError error={errors.billingAddress?.country} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <h3>Zip/Postal Code</h3>
            <input
              {...register("billingAddress.zipCode")}
              className="bg-input-bg border-2 py-4 p-3  border-none outline-none border-input-border"
            />
            <FormError error={errors.billingAddress?.zipCode} />
          </div>
          <div className="flex flex-col gap-1">
            <h3>State</h3>
            <input
              {...register("billingAddress.state")}
              className="bg-input-bg border-2 py-4 p-3  border-none outline-none border-input-border"
            />
            <FormError error={errors.billingAddress?.state} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingAddressInfo;
