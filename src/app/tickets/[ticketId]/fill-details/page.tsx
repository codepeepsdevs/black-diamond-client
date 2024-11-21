/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import React, { ComponentProps, useEffect, useState } from "react";
import {
  Checkbox,
  FormError,
  Input,
  RadioButton,
  SubmitButton,
} from "@/components";
import * as Yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { FiCheck, FiUpload } from "react-icons/fi";
// import { formatEventDate } from "@/utils/date-formatter";
import {
  useCheckPaymentStatus,
  useFillTicketDetails,
  useOrderDetails,
} from "@/api/order/order.queries";
import { useParams, useRouter } from "next/navigation";
import ErrorToast from "@/components/toast/ErrorToast";
import { loadStripe } from "@stripe/stripe-js";
import Loading from "@/app/loading";
import {
  getApiErrorMessage,
  getTimeZoneDateRange,
} from "@/utils/utilityFunctions";
import { useQueryClient } from "@tanstack/react-query";

const ticketFormSchema = Yup.object().shape({
  tickets: Yup.array().of(
    Yup.object().shape({
      ticketId: Yup.string().required(),
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .email("Email is invalid")
        .required("Email is required"),
      phone: Yup.string()
        .required("Phone Number is required")
        .matches(/^[0-9]+$/, "Phone number is not valid"),
      gender: Yup.string().required("Gender is required"),
    })
  ),
});

export type FillTicketDetailsData = Yup.InferType<typeof ticketFormSchema> & {
  orderId: string;
};
export default function FillTicketDetailsPage() {
  // const [orderCompleteDialogOpen, setOrderCompleteDialogOpen] = useState(false);
  const router = useRouter();
  const params = useParams<{ ticketId: string }>();
  const {
    data: paymentStatus,
    isPending: checkPaymentStatusPending,
    isFetched: checkPaymentStatusFetched,
  } = useCheckPaymentStatus(params.ticketId);
  const {
    data,
    isPending: orderDetailsIsPending,
    error: orderDetailsFetchError,
    isFetched: orderDetailsisFetched,
  } = useOrderDetails(params.ticketId);
  const [useBuyersInfo, setUseBuyersInfo] = useState<boolean[]>([]);

  const orderDetails = data?.data;
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Yup.InferType<typeof ticketFormSchema>>({
    resolver: yupResolver(ticketFormSchema),
    defaultValues: {
      tickets: orderDetails?.tickets.map((ticket) => {
        return {
          ticketId: ticket.id,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          gender: "",
        };
      }),
    },
  });

  const {
    mutate: fillTicketDetails,
    isPending: fillTicketDetailsPending,
    isError: fillTicketDetailsError,
  } = useFillTicketDetails(
    (e) => {
      const errorMessage = getApiErrorMessage(
        e,
        "An error occurred while filling ticket details"
      );
      ErrorToast({
        title: "Error",
        descriptions: errorMessage,
      });
    },
    (data) => {
      // setOrderCompleteDialogOpen(true);
    }
  );

  // Filling in the details if it has been filled before
  useEffect(() => {
    if (orderDetails && orderDetailsisFetched) {
      const defaultValues = orderDetails.tickets.map((ticket) => {
        return {
          ticketId: ticket.id!,
          firstName: ticket.firstName || "",
          lastName: ticket.lastName || "",
          email: ticket.email || "",
          phone: ticket.phone || "",
          gender: ticket.gender || "",
        };
      });

      setValue("tickets", defaultValues);
    }
  }, [orderDetailsisFetched, orderDetails]);

  const { fields } = useFieldArray({
    control: control,
    name: "tickets",
  });

  function onSubmit(values: Yup.InferType<typeof ticketFormSchema>) {
    fillTicketDetails({ ...values, orderId: params.ticketId });
  }

  // useEffect(() => {
  //   // If order details have been fetched and there is no data, show error and redirect
  //   if (orderDetailsisFetched && !orderDetails) {
  //     ErrorToast({
  //       title: "Error",
  //       descriptions: ["Could not fetch order details"],
  //     });
  //     router.push("/tickets");
  //   }
  // }, [orderDetailsisFetched, orderDetails]);

  const handleRedirect: () =>
    | { redirect: false }
    | { redirect: true; to: string } = () => {
    // if order details is empty of payment status is not fetched, don't do anything
    if (!orderDetails || !checkPaymentStatusFetched) {
      return { redirect: false };
    }
    // const stripe = await stripePromise;
    // cannot edit ticket details if event is in the past so just show an error and redirect the user
    if (orderDetails.event.eventStatus === "PAST") {
      ErrorToast({
        title: "Error",
        descriptions: [
          "Event is in the past, cannot fill ticket details for a past event",
        ],
      });
      return { redirect: true, to: "/tickets" };
    }

    // if order has been paid for or the user has cancelled the order, this section runs
    // if(orderDetails.status === "PENDING") {
    //     return {redirect: true, to: `/tickets/${orderDetails.id}/fill-details`};
    // } else
    if (orderDetails.status === "COMPLETED") {
      return {
        redirect: true,
        to: `/tickets/${orderDetails.id}/view-details`,
      };
    } else if (orderDetails.status === "CANCELLED") {
      ErrorToast({
        title: "Error",
        descriptions: ["This order has been cancelled"],
      });
      return { redirect: true, to: `/tickets` };
    } else {
      // if the order is pending i.e ticket details has not been filled
      return { redirect: false };
    }
  };

  function toggleCopyBuyersInfo(index: number) {
    const toggleHandler: React.MouseEventHandler<HTMLInputElement> = (e) => {
      const checked = useBuyersInfo[index];

      if (!checked) {
        // if checked is previously false, i.e !checked is true, the next state would be true hence set the values
        setValue(`tickets.${index}.firstName`, orderDetails?.firstName || "");
        setValue(`tickets.${index}.lastName`, orderDetails?.lastName || "");
        setValue(`tickets.${index}.email`, orderDetails?.email || "");
        setValue(`tickets.${index}.phone`, orderDetails?.phone || "");
      } else {
        setValue(`tickets.${index}.firstName`, "");
        setValue(`tickets.${index}.lastName`, "");
        setValue(`tickets.${index}.email`, "");
        setValue(`tickets.${index}.phone`, "");
      }

      setUseBuyersInfo((prevState) => {
        prevState[index] = !checked;
        return [...prevState];
      });
    };

    return toggleHandler;
  }

  const shouldRedirect = handleRedirect();

  if (orderDetailsIsPending || checkPaymentStatusPending || !orderDetails) {
    return <Loading />;
  } // If order details have been fetched and there is no data, show error and redirect
  else if (orderDetailsisFetched && !orderDetails) {
    ErrorToast({
      title: "Error",
      descriptions: ["Could not fetch order details"],
    });
    router.push("/tickets");
    return;
  } else if (shouldRedirect.redirect) {
    return router.push(shouldRedirect.to);
  }

  return (
    <section className="">
      <div className="container">
        <h1 className="text-2xl lg:text-4xl text-white font-medium mb-4 lg:mb-9">
          {orderDetails?.event.name}
        </h1>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* EVENT POSTER */}
          <div>
            <Image
              src={orderDetails?.event.coverImage || ""}
              alt="Event cover photo"
              width={365}
              height={413}
              className="object-cover"
            />
            <p className="text-[#A3A7AA] mt-5">
              {getTimeZoneDateRange(
                new Date(orderDetails?.event.startTime!),
                new Date(orderDetails?.event.endTime!)
              )}
            </p>
          </div>
          {/* END EVENT POSTER */}

          {/* TICKET DETAIL FORMS */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-16 mb-6">
              {/* {["Diamond", "General"].map((item, index) => ( */}
              {fields.map((field, index) => {
                const ticket = orderDetails?.tickets.find(
                  (ticket) => ticket.id === field.ticketId
                );
                return (
                  <div key={field.id}>
                    <div className="text-2xl text-white">
                      Ticket {index + 1}{" "}
                      <span className="capitalize">
                        [{ticket?.ticketType?.name}]
                      </span>
                    </div>

                    <div className="my-4 font-medium text-white">
                      Contact Information
                    </div>

                    <div className="flex items-center gap-x-4 mb-6">
                      <Checkbox
                        checked={useBuyersInfo[index]}
                        name={`${field.ticketId}`}
                        onClick={toggleCopyBuyersInfo(index)}
                      />
                      <p className="text-input-color">
                        Copy buyer's information
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      {/* FIRST NAME INPUT */}
                      <div>
                        <Input
                          placeholder="First Name*"
                          {...register(`tickets.${index}.firstName`)}
                        />
                        <FormError error={errors.tickets?.[index]?.firstName} />
                      </div>
                      {/* END FIRST NAME INPUT */}

                      {/* LAST NAME INPUT */}
                      <div>
                        <Input
                          placeholder="Last Name*"
                          {...register(`tickets.${index}.lastName`)}
                        />
                        <FormError error={errors.tickets?.[index]?.lastName} />
                      </div>
                      {/* END LAST NAME INPUT */}

                      {/* EMAIL ADDRESS INPUT */}
                      <div className="col-span-2">
                        <Input
                          placeholder="Email Address*"
                          {...register(`tickets.${index}.email`)}
                        />
                        <FormError error={errors.tickets?.[index]?.email} />
                      </div>
                      {/* END EMAIL ADDRESS INPUT */}

                      {/* PHONE NUMBER INPUT */}
                      <div className="col-span-2">
                        <Input
                          placeholder="Phone Number*"
                          {...register(`tickets.${index}.phone`)}
                        />
                        <FormError error={errors.tickets?.[index]?.phone} />
                      </div>
                      {/* END PHONE NUMBER INPUT */}

                      {/* GENDER INPUT */}
                      <div>
                        <div className="my-4 text-white font-medium">
                          Gender
                        </div>
                        <div className="flex items-center gap-x-6">
                          {["Male", "Female", "Other"].map((gender) => (
                            <div
                              className="flex items-center gap-x-4"
                              key={gender}
                            >
                              <RadioButton
                                value={gender}
                                selected={
                                  watch(`tickets.${index}.gender`) === gender
                                }
                                onSelect={() =>
                                  setValue(`tickets.${index}.gender`, gender)
                                }
                              />
                              <div className="text-input-color">{gender}</div>
                            </div>
                          ))}
                        </div>
                        <FormError error={errors.tickets?.[index]?.gender} />
                      </div>
                      {/* END GENDER INPUT */}
                    </div>
                  </div>
                );
              })}
            </div>
            <SubmitButton type="submit" disabled={fillTicketDetailsPending}>
              {fillTicketDetailsPending ? "SUBMITTING.." : "COMPLETE ORDER"}
            </SubmitButton>
          </form>
          {/* END TICKET DETAIL FORMS */}
        </div>
      </div>

      {/* <OrderCompleteDialog
        open={orderCompleteDialogOpen}
        onOpenChange={setOrderCompleteDialogOpen}
      /> */}
    </section>
  );
}

// function TicketForm({ ticketTypes }: { ticketTypes: TicketType[] }) {
//   return (
//     <div>
//       <div className="text-2xl text-white">
//         Ticket {ticket.index + 1}{" "}
//         <span className="capitalize">[{ticket.type}]</span>
//       </div>

//       <div className="my-4 font-medium text-white">Contact Information</div>

//       <div className="flex items-center gap-x-4 mb-6">
//         <Checkbox />
//         {/* eslint-disable-next-line react/no-unescaped-entities */}
//         <p className="text-input-color">Copy buyer's information</p>
//       </div>

//       <div className="grid grid-cols-2 gap-5">
//         {/* FIRST NAME INPUT */}
//         <div>
//           <Input placeholder="First Name*" {...register("firstName")} />
//           <FormError error={errors.firstName} />
//         </div>
//         {/* END FIRST NAME INPUT */}

//         {/* LAST NAME INPUT */}
//         <div>
//           <Input placeholder="Last Name*" {...register("lastName")} />
//           <FormError error={errors.lastName} />
//         </div>
//         {/* END LAST NAME INPUT */}

//         {/* EMAIL ADDRESS INPUT */}
//         <div className="col-span-2">
//           <Input placeholder="Email Address*" {...register("email")} />
//           <FormError error={errors.email} />
//         </div>
//         {/* END EMAIL ADDRESS INPUT */}

//         {/* PHONE NUMBER INPUT */}
//         <div className="col-span-2">
//           <Input placeholder="Phone Number*" {...register("phone")} />
//           <FormError error={errors.email} />
//         </div>
//         {/* END PHONE NUMBER INPUT */}

//         {/* GENDER INPUT */}
//         <div>
//           <div className="my-4 text-white font-medium">Gender</div>
//           <div className="flex items-center gap-x-6">
//             {["Male", "Female", "Other"].map((gender) => (
//               <div className="flex items-center gap-x-4" key={gender}>
//                 <RadioButton
//                   value={gender}
//                   selected={watch("gender") === gender}
//                   onSelect={() => setValue("gender", gender)}
//                 />
//                 <div className="text-input-color">{gender}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//         {/* END GENDER INPUT */}
//       </div>
//     </div>
//   );
// }

// function OrderCompleteDialog({ ...props }: ComponentProps<typeof Dialog.Root>) {
//   const queryClient = useQueryClient();
//   const params = useParams<{ ticketId: string }>();

//   return (
//     <Dialog.Root {...props} modal={true}>
//       <Dialog.Portal>
//         <Dialog.Overlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
//           <Dialog.Content className="relative bg-[#333333] text-[#A3A7AA] p-6 mx-auto py-9 max-w-lg min-w-80">
//             <div className="bg-[#4267B2] text-white size-24 mx-auto rounded-full grid place-items-center">
//               <FiCheck className="text-4xl" />
//             </div>

//             <div className="text-white text-2xl lg:text-4xl font-medium text-center mt-16">
//               Order Complete
//             </div>

//             <p className="text-white text-base text-center lg:text-xl my-6">
//               See you at the event
//             </p>

//             {/* <div className="flex gap-x-6 justify-center mb-6">
//               <button className="bg-[#333333] size-12 rounded-full text-text-color text-xl inline-grid place-items-center">
//                 <FiUpload />
//               </button>
//               <button className="bg-[#333333] size-12 rounded-full text-text-color text-xl inline-grid place-items-center">
//                 <HiMiniCalendar />
//               </button>
//             </div> */}

//             <div className="flex justify-center">
//               <SubmitButton
//                 className=""
//                 onClick={async () => {
//                   await queryClient.invalidateQueries({
//                     queryKey: ["order-details", params.ticketId],
//                   });
//                   // router.push(`/tickets/${params.ticketId}/view-details`)
//                 }}
//               >
//                 VIEW TICKET
//               </SubmitButton>
//             </div>
//           </Dialog.Content>
//         </Dialog.Overlay>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// }
