import { accountFormSchema } from "@/api/settings/settings.schema";
import React from "react";
import { UseFormRegister, UseFormReturn } from "react-hook-form";
import * as Yup from "yup";
import { FormError } from "../shared/FormError";

interface ContactInfoProps {
  form: UseFormReturn<Yup.InferType<typeof accountFormSchema>>;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium text-sm md:text-base">Contact Information</h2>
      <div className="text-[#BDBDBD] flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <h3>First Name*</h3>
            <input
              {...register("contactInfo.firstName", {
                required: true,
              })}
              className="bg-input-bg border-2 py-4 p-3 text-xs md:text-sm border-none outline-none border-input-border"
            />
            <FormError error={errors.contactInfo?.firstName} />
          </div>
          <div className="flex flex-col gap-1">
            <h3>Last Name*</h3>
            <input
              {...register("contactInfo.lastName", {
                required: true,
              })}
              className="bg-input-bg border-2 py-4 p-3 text-xs md:text-sm border-none outline-none border-input-border"
            />
            <FormError error={errors.contactInfo?.lastName} />
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <h3>Email Address*</h3>
            <input
              {...register("contactInfo.email", {
                // required: true,
                disabled: true,
              })}
              className="w-full bg-input-bg border-2 py-4 p-3 text-xs md:text-sm border-none outline-none border-input-border"
            />
            <FormError error={errors.contactInfo?.email} />
          </div>
          <div className="flex flex-col gap-1">
            <h3>Phone Number*</h3>
            <input
              {...register("contactInfo.phoneNumber", {
                required: true,
              })}
              className="w-full bg-input-bg border-2 py-4 p-3 text-xs md:text-sm border-none outline-none border-input-border"
            />
            <FormError error={errors.contactInfo?.phoneNumber} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
