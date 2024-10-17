import { accountFormSchema } from "@/api/settings/settings.schema";
import React from "react";
import { UseFormRegister, UseFormReturn } from "react-hook-form";
import * as Yup from "yup";
import { FormError } from "../shared/FormError";

interface AddressInfoProps {
  form: UseFormReturn<Yup.InferType<typeof accountFormSchema>>;
}

const AddressInfo: React.FC<AddressInfoProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium text-sm md:text-base">Address</h2>
      <div className="text-[#BDBDBD] flex flex-col gap-2">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <h3>Address1</h3>
            <input
              {...register("address.address1")}
              className="bg-input-bg border-2 py-4 p-3 text-xs md:text-sm border-none outline-none border-input-border"
            />
            <FormError error={errors.address?.address1} />
          </div>
          <div className="flex flex-col gap-1">
            Address2
            <input
              {...register("address.address2")}
              className="bg-input-bg border-2 py-4 p-3 text-xs md:text-sm border-none outline-none border-input-border"
            />
            <FormError error={errors.address?.address2} />
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <h3>City</h3>
            <input
              {...register("address.city")}
              className="bg-input-bg border-2 py-4 p-3 text-xs md:text-sm border-none outline-none border-input-border"
            />
            <FormError error={errors.address?.city} />
          </div>
          <div className="flex flex-col gap-1">
            <h3>Country</h3>
            <input
              {...register("address.country")}
              className="bg-input-bg border-2 py-4 p-3 text-xs md:text-sm border-none outline-none border-input-border"
            />
            <FormError error={errors.address?.country} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <h3>Zip/Postal Code</h3>
            <input
              {...register("address.zipCode")}
              className="bg-input-bg border-2 py-4 p-3 text-xs md:text-sm border-none outline-none border-input-border"
            />
            <FormError error={errors.address?.zipCode} />
          </div>
          <div className="flex flex-col gap-1">
            <h3>State</h3>
            <input
              {...register("address.state")}
              className="bg-input-bg border-2 py-4 p-3 text-xs md:text-sm border-none outline-none border-input-border"
            />
            <FormError error={errors.address?.state} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;
