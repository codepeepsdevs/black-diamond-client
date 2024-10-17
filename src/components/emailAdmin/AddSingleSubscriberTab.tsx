import React from "react";
import AdminButton from "../buttons/AdminButton";
import Input from "../shared/Input";
import { useForm } from "react-hook-form";
import { SingleManualEntryData } from "@/api/subscriber-list/subscriber-list.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { singleManualEntrySchema } from "@/api/subscriber-list/subscriber-list.schema";
import { FormError } from "../shared/FormError";
import { useAddSingleDetailToList } from "@/api/subscriber-list/subscriber-list.queries";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import SuccessToast from "../toast/SuccessToast";

function AddSingleSubscriberTab({
  openDialog,
}: {
  openDialog?: (state: boolean) => void;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SingleManualEntryData>({
    resolver: yupResolver(singleManualEntrySchema),
  });

  const params = useParams<{ id: string }>();

  const { mutate: addSubscriber, isPending } = useAddSingleDetailToList(() => {
    SuccessToast({
      title: "Create success",
      description: "Subscriber details successfully added to list",
    });
  });

  function onSubmit(data: SingleManualEntryData) {
    addSubscriber({ ...data, listId: params.id });
    reset();
  }

  return (
    <div>
      <div className="text-white font-medium mb-2">
        Add your subscriber's details{" "}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            {...register("email")}
            placeholder="Email address"
            className="bg-white"
          />
          <FormError error={errors.email} />
        </div>
        <div>
          <Input
            {...register("name")}
            placeholder="Full name"
            className="bg-white"
          />
          <FormError error={errors.name} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-x-6 mb-20">
          <AdminButton
            disabled={isPending}
            variant="primary"
            className="flex-1"
          >
            {isPending ? "Adding subscriber.." : "Add subscriber"}
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

export default AddSingleSubscriberTab;
