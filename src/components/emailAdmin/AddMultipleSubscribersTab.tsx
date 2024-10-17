import React from "react";
import AdminButton from "../buttons/AdminButton";
import { useForm } from "react-hook-form";
import { MultipleManualEntryData } from "@/api/subscriber-list/subscriber-list.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { multipleManualEntrySchema } from "@/api/subscriber-list/subscriber-list.schema";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useAddMultipleDetailToList } from "@/api/subscriber-list/subscriber-list.queries";
import { FormError } from "../shared/FormError";

export default function AddMultipleSubscribersTab({
  openDialog,
}: {
  openDialog?: (state: boolean) => void;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<MultipleManualEntryData>({
    resolver: yupResolver(multipleManualEntrySchema),
  });

  const params = useParams<{ id: string }>();

  const { mutate: addSubscribers, isPending } = useAddMultipleDetailToList(
    () => {
      toast.success("Subscriber details successfully added to list");
      reset();
    }
  );

  function onSubmit(data: MultipleManualEntryData) {
    addSubscribers({ ...data, listId: params.id });
  }

  return (
    <div>
      <div className="text-white font-medium mb-2">
        Paste a list of subscribers
      </div>
      <p className="text-xs">
        Use commas or line breaks to separate email addresses
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          placeholder="name1,email1@example.com name2,email2@example.com"
          rows={8}
          {...register("details")}
          className={
            "w-full bg-white outline-none  text-base  p-4 border border-input-border mt-2"
          }
        />
        <FormError error={errors.details} />

        <div className="mt-4 flex items-center justify-between gap-x-6 mb-20">
          <AdminButton variant="primary" className="flex-1">
            Add subscribers
          </AdminButton>
          <AdminButton
            type="button"
            onClick={() => openDialog?.(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
