"use client";

import {
  AdminButton,
  Checkbox,
  FormError,
  Input,
  RadioButton,
  SubmitButton,
} from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { ComponentProps, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { OrderImage } from "../../../public/images";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiCheck, FiX } from "react-icons/fi";
import * as Dialog from "@radix-ui/react-dialog";
import { useWindowsize } from "@/hooks";
import { useRouter } from "next/navigation";
import {
  useCheckout,
  // useCreateIntent
} from "@/api/checkout/checkout.queries";
import { useOrderStore } from "@/store/order.store";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { CheckoutData, CheckoutResponse } from "@/api/checkout/checkout.types";
import {
  checkoutFormSchema,
  paymentMethods,
} from "@/api/events/events.schemas";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Cookies from "js-cookie";
import { MdGppBad } from "react-icons/md";
import {
  getApiErrorMessage,
  getTimeZoneDateRange,
} from "@/utils/utilityFunctions";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { ErrorResponse } from "@/constants/types";
import Loading from "../loading";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const width = useWindowsize();
  const router = useRouter();
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const order = useOrderStore();
  // const [guestInfoDialogOpen, setGuestInfoDialogOpen] =
  //   useState<boolean>(false);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // check if the user is logged in..
    // const token = Cookies.get("accessToken");
    // if (!token) {
    //   // Tell the user that they're not logged in and inform them to use their real email as their contact details..
    //   setGuestInfoDialogOpen(true);
    // }

    if (!order.event?.id) {
      router.push("/events");
      return;
    }
  }, []);
  const ticketsTotal =
    order.ticketOrders
      ?.map((ticketOrder) => {
        const ticketType = order.event?.ticketTypes.find(
          (ticketType) => ticketType.id === ticketOrder.ticketTypeId
        );
        const total = ticketOrder.quantity * ticketType?.price!;
        return total;
      })
      .reduce((prev, curr) => {
        return prev + curr;
      }, 0) || 0;
  const addonTotal =
    order.addonOrders?.reduce(
      (accValue, currItem) => accValue + currItem.price * currItem.quantity,
      0
    ) || 0;

  const total = ticketsTotal + addonTotal - (order.totalDiscount || 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Yup.InferType<typeof checkoutFormSchema>>({
    resolver: yupResolver(checkoutFormSchema),
    defaultValues: {
      paymentMethod: "creditCard",
      // promotionalEmails: false,
      eventUpdates: false,
    },
  });

  const onCheckoutSuccess = async ({
    data,
  }: AxiosResponse<CheckoutResponse>) => {
    if (stripe) {
      // setOrderId(data.data.id);
      order.setPromocode(null);
      order.setOrder(null);
      const response = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (response.error) {
        ErrorToast({
          title: "Payment Error",
          descriptions: [
            response.error.message ||
              "Something went wrong while processing payment",
          ],
        });
      }
    } else {
      ErrorToast({
        title: "Error",
        descriptions: ["Something went wrong while setting up payments"],
      });
    }
    SuccessToast({
      title: "Order successful",
      description: "Order placed successfully",
    });
    // window.open(data.sessionUrl, "_blank");
  };

  const onCheckoutError = (e: AxiosError<ErrorResponse>) => {
    const errorMessage = getApiErrorMessage(e, "Error placing order");
    ErrorToast({
      title: "Error",
      descriptions: errorMessage,
    });
  };

  const {
    mutate: checkout,
    isPending: checkoutPending,
    isError: checkoutError,
  } = useCheckout(onCheckoutError, onCheckoutSuccess);

  function onCheckout(values: Yup.InferType<typeof checkoutFormSchema>) {
    if (!order.event?.id || !order.ticketOrders) {
      return ErrorToast({
        title: "Error",
        descriptions: [
          "Unable to complete checkout.. please reload and try again",
        ],
      });
    }
    checkout({
      ...values,
      eventId: order.event.id,
      ticketOrders: order.ticketOrders.map((ticketOrder) => {
        const { quantity, ticketTypeId } = ticketOrder;
        return {
          quantity,
          ticketTypeId,
        };
      }),
      addonOrders:
        order.addonOrders
          ?.filter((addonOrder) => {
            return addonOrder.quantity > 0;
          })
          .map((addonOrder) => {
            return {
              addonId: addonOrder.addonId,
              quantity: addonOrder.quantity,
            };
          }) || null,
      promocodeId: order.promocode?.id,

      successUrl: `${window.location.protocol}//${window.location.host}/tickets`,
      cancelUrl: `${window.location.protocol}//${window.location.host}/events`,
    } satisfies CheckoutData);
  }

  if (!order.event?.id) {
    return <Loading />;
  }

  return (
    <section className="my-lg">
      <div className="container ">
        <h1 className="text-white text-4xl font-bold mb-7">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-x-16">
          <form
            action=""
            className="flex-1"
            onSubmit={handleSubmit(onCheckout)}
          >
            <h3 className="text-white mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-5">
              {/* FIRST NAME INPUT */}
              <div>
                <Input placeholder="First Name*" {...register("firstName")} />
                <FormError error={errors.firstName} />
              </div>
              {/* END FIRST NAME INPUT */}

              {/* LAST NAME INPUT */}
              <div>
                <Input placeholder="Last Name*" {...register("lastName")} />
                <FormError error={errors.lastName} />
              </div>
              {/* END LAST NAME INPUT */}

              {/* EMAIL ADDRESS INPUT */}
              <div className="col-span-2">
                <Input placeholder="Email Address*" {...register("email")} />
                <FormError error={errors.email} />
              </div>
              {/* END EMAIL ADDRESS INPUT */}

              {/* PHONE NUMBER INPUT */}
              <div className="col-span-2">
                <Input placeholder="Phone Number*" {...register("phone")} />
                <FormError error={errors.phone} />
              </div>
              {/* END PHONE NUMBER INPUT */}
            </div>

            <div className="text-sm space-y-4 my-8">
              {/* UPDATES CHECK */}
              <div className="flex items-center gap-x-5">
                <Checkbox {...register("eventUpdates")} />
                <p className="text-input-color">
                  Keep me updated on more events and news from Black Diamond
                  Entertainment.
                </p>
              </div>
              {/* END UPDATES CHECK */}

              {/* PROMO EMAIL CHECK */}
              {/* <div className="flex items-center gap-x-5">
                <Checkbox />
                <p className="text-input-color">
                  Send me emails about the upcoming events and other promotional
                  contents.
                </p>
              </div> */}
              {/* END PROMO EMAIL CHECK */}
            </div>

            {/* --------------------- */}
            {/* --------------------- */}

            {/* ORDER DETAILS MOBILE */}
            {width < 1024 && (
              <Dialog.Root>
                <div className="flex items-center justify-between mt-4 mb-2">
                  <p className="text-[#A3A7AA] text-xs">{order.event.name}</p>
                  <Dialog.Trigger>
                    <AiOutlineInfoCircle className="text-white" />
                  </Dialog.Trigger>
                </div>
                {/* ORDER DETAILS MODAL */}
                <Dialog.Portal>
                  <Dialog.Overlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto ">
                    <Dialog.Content className="relative bg-[#333333] text-[#A3A7AA] p-6 mx-auto max-w-lg">
                      <div className="bg-[#333333] text-[#A3A7AA] text-xs">
                        <div className="text-white font-bold text-base flex justify-between">
                          <span>Order Summary</span>
                          <Dialog.Close>
                            <button type="button">
                              <FiX />
                            </button>
                          </Dialog.Close>
                        </div>
                        <div className="space-y-3 mt-4">
                          <div className="text-white font-medium text-sm">
                            {order.event.name}
                          </div>
                          <div>
                            {getTimeZoneDateRange(
                              new Date(order.event.startTime || Date.now()),
                              new Date(order.event.endTime || Date.now())
                            )}
                          </div>
                          {order.ticketOrders?.map((ticketOrder) => {
                            const ticketType = order.event?.ticketTypes.find(
                              (ticketType) =>
                                ticketType.id === ticketOrder.ticketTypeId
                            );
                            const total =
                              ticketOrder.quantity * ticketType?.price!;
                            return (
                              <div
                                className="flex justify-between"
                                key={ticketOrder.ticketTypeId}
                              >
                                <span>
                                  {ticketOrder.quantity} x {ticketType?.name}
                                </span>
                                <span className="text-[#DADADA]">${total}</span>
                              </div>
                            );
                          })}

                          {order.addonOrders?.length &&
                          order.addonOrders.length > 0 ? (
                            <div className="mt-8 border-t border-t-[#A3A7AA] pt-2 space-y-3">
                              <div className="text-white font-medium text-sm">
                                Addon Orders
                              </div>
                              {order.addonOrders
                                ?.filter(
                                  (addonOrder) => addonOrder.quantity > 0
                                )
                                .map((addonOrder) => {
                                  const total =
                                    addonOrder.quantity * addonOrder?.price!;
                                  return (
                                    <div
                                      className="flex justify-between"
                                      key={addonOrder.addonId}
                                    >
                                      <span>
                                        {addonOrder.quantity} x{" "}
                                        {addonOrder.name}
                                      </span>
                                      <span className="text-[#DADADA]">
                                        ${total}
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                          ) : null}

                          <div className="flex justify-between font-medium text-sm text-white">
                            <span>Discount</span>
                            <span className="text-[#DADADA]">
                              -${order.totalDiscount}
                            </span>
                          </div>

                          <div className="flex justify-between font-medium text-sm text-white">
                            <span>Total</span>
                            <span className="text-[#DADADA]">${total}</span>
                          </div>
                        </div>
                      </div>
                    </Dialog.Content>
                  </Dialog.Overlay>
                </Dialog.Portal>
                {/* END ORDER DETAILS MODAL */}

                <div className="flex justify-between font-bold text-white text-base">
                  <span>Discount</span>
                  <span className="text-[#DADADA]">${order.totalDiscount}</span>
                </div>
                <div className="flex justify-between font-bold text-white text-base">
                  <span>Total</span>
                  <span className="text-[#DADADA]"> ${total}</span>
                </div>
              </Dialog.Root>
            )}
            {/* END ORDER DETAILS MOBILE */}

            <p className="text-input-color my-6">
              By clicking Checkout, I agree to the Black Diamond Terms of
              Service
            </p>

            <SubmitButton
              onClick={handleSubmit(onCheckout)}
              disabled={
                checkoutPending
                // || createIntentPending
              }
            >
              {checkoutPending
                ? // || createIntentPending
                  "Processing.. please wait!"
                : "Checkout"}
            </SubmitButton>
          </form>

          {/* ORDER DETAILS DESKTOP */}
          <div className="w-[365px] text-[#A3A7AA] space-y-5 mb-20 hidden lg:block">
            <Image src={OrderImage} alt="" width={365} height={365} />

            <div className="text-white font-medium text-xl">Order Summary</div>
            <div className="text-white font-medium">{order.event.name}</div>
            <div>
              {getTimeZoneDateRange(
                new Date(order.event.startTime || Date.now()),
                new Date(order.event.endTime || Date.now())
              )}
            </div>

            {order.ticketOrders
              ?.filter((ticketOrder) => ticketOrder.quantity > 0)
              .map((ticketOrder) => {
                const ticketType = order.event?.ticketTypes.find(
                  (ticketType) => ticketType.id === ticketOrder.ticketTypeId
                );
                const total = ticketOrder.quantity * ticketType?.price!;
                return (
                  <div
                    className="flex justify-between"
                    key={ticketOrder.ticketTypeId}
                  >
                    <span>
                      {ticketOrder.quantity} x {ticketOrder.name}
                    </span>
                    <span className="text-[#DADADA]">${total}</span>
                  </div>
                );
              })}

            {order.addonOrders?.length && order.addonOrders.length > 0 ? (
              <div className="mt-8 border-t border-t-[#A7A7AA] pt-6 space-y-6">
                <div className="text-white font-medium">Addon Orders</div>
                {order.addonOrders
                  ?.filter((addonOrder) => addonOrder.quantity > 0)
                  .map((addonOrder) => {
                    const total = addonOrder.quantity * addonOrder?.price!;
                    return (
                      <div
                        className="flex justify-between"
                        key={addonOrder.addonId}
                      >
                        <span>
                          {addonOrder.quantity} x {addonOrder.name}
                        </span>
                        <span className="text-[#DADADA]">${total}</span>
                      </div>
                    );
                  })}
              </div>
            ) : null}

            <div className="flex justify-between font-bold text-white">
              <span>Discount</span>
              <span className="text-[#DADADA]"> ${order.totalDiscount}</span>
            </div>

            <div className="flex justify-between font-bold text-white">
              <span>Total</span>
              <span className="text-[#DADADA]"> ${total}</span>
            </div>
          </div>
          {/* END ORDER DETAILS DESKTOP */}
        </div>
      </div>

      {/* <Payment /> */}

      <CheckoutSuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
      />

      {/* <GuestInfoDialog
        open={guestInfoDialogOpen}
        onOpenChange={setGuestInfoDialogOpen}
        defaultOpen
      /> */}
    </section>
  );
}

const CollapseContext = React.createContext<{
  method: (typeof paymentMethods)[number];
  setMethod: React.Dispatch<
    React.SetStateAction<(typeof paymentMethods)[number]>
  >;
}>({
  method: "creditCard",
  setMethod: () => {},
});

function Collapse({ children }: { children: React.ReactNode }) {
  const [method, setMethod] =
    useState<(typeof paymentMethods)[number]>("creditCard");
  return (
    <CollapseContext.Provider value={{ method, setMethod }}>
      <div className="divide-y border border-[#333]">{children}</div>
    </CollapseContext.Provider>
  );
}

const CollapseItemContext =
  React.createContext<(typeof paymentMethods)[number]>("creditCard");
function CollapseItem({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value: (typeof paymentMethods)[number];
  className?: string;
}) {
  return (
    <CollapseItemContext.Provider value={value}>
      <div className="bg-input-bg px-7 border-[#333]">{children}</div>
    </CollapseItemContext.Provider>
  );
}

function CollapseTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { method, setMethod } = useContext(CollapseContext);
  const value = useContext(CollapseItemContext);

  return (
    <div className="flex items-center gap-x-4 py-8">
      <RadioButton
        value={value}
        selected={method === value}
        onSelect={setMethod}
      />
      <div
        className={cn("flex justify-between items-center w-full", className)}
      >
        {children}
      </div>
    </div>
  );
}

function CollapseContent({ children }: { children: React.ReactNode }) {
  const { method } = useContext(CollapseContext);
  const value = useContext(CollapseItemContext);
  return (
    <div
      className={cn(
        "h-0 collapse-content ml-10 overflow-hidden",
        method === value && "h-auto"
      )}
    >
      <div className="pb-6">{children}</div>
    </div>
  );
}

function CheckoutSuccessDialog({
  ...props
}: ComponentProps<typeof Dialog.Root>) {
  const router = useRouter();
  const orderId = useOrderStore((state) => state.orderId);
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <Dialog.Content className="relative bg-[#333333] text-[#A3A7AA] p-6 mx-auto py-9 max-w-lg">
            <div className="bg-[#4267B2] text-white size-24 mx-auto rounded-full grid place-items-center">
              <FiCheck className="text-4xl" />
            </div>

            <div className="text-white text-2xl lg:text-4xl font-medium text-center mt-16">
              Payment Successful
            </div>

            <div className="text-center my-6 space-y-4">
              <p className="text-white text-base lg:text-xl">
                Please, complete your order!
              </p>
              <p className="text-text-color text-sm lg:text-base">
                Order #{orderId}
              </p>
            </div>

            <div className="flex justify-center">
              <SubmitButton
                className=""
                onClick={() => router.push(`/tickets/${orderId}/fill-details`)}
              >
                GO TO MY TICKET
              </SubmitButton>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// function GuestInfoDialog({ ...props }: ComponentProps<typeof Dialog.Root>) {
//   return (
//     <Dialog.Root {...props} modal={true}>
//       <Dialog.Portal>
//         <Dialog.Overlay className="bg-black bg-opacity-50 backdrop-blur-sm z-[99] fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
//           <Dialog.Content className="relative bg-[#333333] text-[#A3A7AA] p-6 mx-auto py-9 max-w-lg">
//             <div className="bg-red-500 text-white size-24 mx-auto rounded-full grid place-items-center">
//               <MdGppBad className="text-4xl" />
//             </div>

//             <div className="text-white text-2xl lg:text-4xl font-medium text-center mt-16">
//               User not logged in
//             </div>

//             <div className="text-center my-6 space-y-4">
//               <p className="text-white text-base lg:text-xl">
//                 It looks like you’re not logged in.
//               </p>
//               <p className="text-text-color text-sm lg:text-base">
//                 If you already have an account, please use the email address
//                 associated with that account to checkout.
//               </p>
//               <p className="text-text-color text-sm lg:text-base">
//                 If you don’t have an account, please provide an email address to
//                 associate to the checkout and for a new account.
//               </p>
//             </div>

//             <div className="flex justify-center">
//               <AdminButton
//                 variant="outline"
//                 className=""
//                 onClick={() => props.onOpenChange?.(false)}
//               >
//                 Continue
//               </AdminButton>
//             </div>
//           </Dialog.Content>
//         </Dialog.Overlay>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// }
