"use client";

import {
  AdminButton,
  Checkbox,
  CustomButton,
  FormError,
  Input,
  RadioButton,
  SubmitButton,
} from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { ComponentProps, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { ApplePay, CreditCard, Paypal } from "../../../public/icons";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { OrderImage } from "../../../public/images";
import { HiInformationCircle } from "react-icons/hi2";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiCheck, FiX } from "react-icons/fi";
import * as Dialog from "@radix-ui/react-dialog";
import { useWindowsize } from "@/hooks";
import { useRouter } from "next/navigation";
import {
  useCheckout,
  // useCreateIntent
} from "@/api/checkout/checkout.queries";
import toast from "react-hot-toast";
import { Order } from "@/constants/types";
import { OrderStates, useOrderStore } from "@/store/order.store";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import {
  CheckoutResponse,
  CreateIntentResponse,
} from "@/api/checkout/checkout.types";
import {
  checkoutFormSchema,
  paymentMethods,
} from "@/api/events/events.schemas";
import {
  CardCvcElement,
  CardCvcElementProps,
  CardExpiryElement,
  CardExpiryElementProps,
  CardNumberElement,
  CardNumberElementProps,
  Elements,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, PaymentRequest } from "@stripe/stripe-js";
import Cookies from "js-cookie";
import { MdGppBad } from "react-icons/md";
import { getPDTDate } from "@/utils/utilityFunctions";

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
  const setOrderId = useOrderStore((state) => state.setOrderId);
  const [paymentPending, setPaymentPending] = useState(false);
  const [paymentRequestAvailable, setPaymentRequestAvailable] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );
  const [creditCardErrors, setCreditCardErrors] = useState<{
    cardNumber: string | undefined;
    cardExpiry: string | undefined;
    cardCvv: string | undefined;
  }>({
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [guestInfoDialogOpen, setGuestInfoDialogOpen] =
    useState<boolean>(false);

  const stripe = useStripe();
  const elements = useElements();

  // For apple pay button
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Total",
          amount: 5000, // Amount in cents ($50.00)
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check if the PaymentRequest is available (Apple Pay or other methods)
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
          setPaymentRequestAvailable(true);
        }
      });
    }
  }, [stripe]);

  useEffect(() => {
    // check if the user is logged in..
    const token = Cookies.get("accessToken");
    if (!token) {
      // Tell the user that they're not logged in and inform them to use their real email as their contact details..
      setGuestInfoDialogOpen(true);
    }
  }, []);

  if (!order.event?.id) {
    router.push("/events");
    return;
  }
  const total = order.ticketOrders
    ?.map((ticketOrder) => {
      const ticketType = order.event?.ticketTypes.find(
        (ticketType) => ticketType.id === ticketOrder.ticketTypeId
      );
      const total = ticketOrder.quantity * ticketType?.price!;
      return total;
    })
    .reduce((prev, curr) => {
      return prev + curr;
    }, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Yup.InferType<typeof checkoutFormSchema>>({
    resolver: yupResolver(checkoutFormSchema),
    defaultValues: {
      paymentMethod: "creditCard",
      promotionalEmails: false,
      eventUpdates: false,
    },
  });

  // const onCheckoutSuccess = async ({
  //   data,
  // }: AxiosResponse<CheckoutResponse>) => {
  //   // After order has been successfully placed on server, try charging the coient otherwise mark the ticket as unpaid and prevent further actions..
  //   // first step create payment intent
  //   // createPaymentIntent();

  //   setOrderId(data.data.id);
  //   order.setClientSecret(data.clientSecret);
  //   handlePayment(data.clientSecret);
  // };

  const onCheckoutError = (e: AxiosError<{ message: string }>) => {
    if (isAxiosError(e)) {
      toast.error(e.response?.data.message || "Error placing order");
    } else {
      toast.error("Error placing order");
    }
  };

  const handlePayment = async (clientSecret: string) => {
    setPaymentPending(true);
    // show success dialog after successful payment
    // Collect card details from individual elements
    if (!elements || !stripe) {
      toast.error(
        "An error occurred while processing payment. Please try again later.."
      );
      return;
    }
    const cardNumber = elements.getElement(CardNumberElement);

    if (!cardNumber) {
      throw new Error("An error occurred whle processing payment");
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
        },
      });

      if (result.error) {
        toast.error(
          result.error.message || "An error occurred while processing payment"
        );
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment succeeded!");
        setSuccessDialogOpen(true);
        order.clearOrder();
        reset();
      }
    } catch (e) {
      toast.error("An error occurred whlile processing payment!");
    } finally {
      setPaymentPending(false);
    }
  };

  // const {
  //   mutate: checkout,
  //   isPending: checkoutPending,
  //   isError: checkoutError,
  // } = useCheckout(onCheckoutError, onCheckoutSuccess);

  function onCheckout(values: Yup.InferType<typeof checkoutFormSchema>) {
    if (
      creditCardErrors.cardCvv ||
      creditCardErrors.cardExpiry ||
      creditCardErrors.cardNumber
    ) {
      toast.error("Invalid credit card details.. please recheck");
      return;
    }

    if (!order.event || !order.ticketOrders) {
      return;
    }

    // checkout({
    //   ...values,
    //   eventId: order.event?.id,
    //   ticketOrders: order.ticketOrders.map((ticketOrder) => {
    //     const { quantity, ticketTypeId } = ticketOrder;
    //     return {
    //       quantity,
    //       ticketTypeId,
    //     };
    //   }),
    //   addonOrders:
    //     order.addonOrders
    //       ?.filter((addonOrder) => {
    //         return addonOrder.quantity > 0;
    //       })
    //       .map((addonOrder) => {
    //         return {
    //           addonId: addonOrder.addonId,
    //           quantity: addonOrder.quantity,
    //         };
    //       }) || null,
    // });
  }

  return (
    <section className="my-sm sm:my-lg">
      <div className="container ">
        <h1 className="text-white text-4xl font-medium mb-7">Checkout</h1>

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
                <FormError error={errors.email} />
              </div>
              {/* END PHONE NUMBER INPUT */}
            </div>

            <div className="text-sm space-y-4 my-8">
              {/* UPDATES CHECK */}
              <div className="flex items-center gap-x-5">
                <Checkbox />
                <p className="text-input-color">
                  Keep me updated on more events and news from Black Diamond
                  Entertainment.
                </p>
              </div>
              {/* END UPDATES CHECK */}

              {/* PROMO EMAIL CHECK */}
              <div className="flex items-center gap-x-5">
                <Checkbox />
                <p className="text-input-color">
                  Send me emails about the upcoming events and other promotional
                  contents.
                </p>
              </div>
              {/* END PROMO EMAIL CHECK */}
            </div>

            <h3 className="text-white font-medium mb-4">Payment Information</h3>
            <Collapse>
              <CollapseItem value="creditCard" className="flex">
                <div>
                  <CollapseTrigger>
                    <div className="text-input-color text-xs lg:text-base font-medium">
                      Credit or debit card
                    </div>
                    <Image
                      src={CreditCard}
                      alt=""
                      width={30}
                      height={21}
                      className="lg:w-5 lg:h-4"
                    />
                  </CollapseTrigger>
                  <CollapseContent>
                    <label
                      htmlFor="card-number"
                      className="text-white text-sm lg:text-base block mb-4 font-medium"
                    >
                      Card Number
                    </label>
                    <CardNumberElement
                      onChange={(e) => {
                        if (e.error) {
                          setCreditCardErrors((prevState) => {
                            return {
                              ...prevState,
                              cardNumber: e.error?.message,
                            };
                          });
                        } else {
                          setCreditCardErrors((prevState) => {
                            return {
                              ...prevState,
                              cardNumber: undefined,
                            };
                          });
                        }
                      }}
                      className="bg-white border-[#ACACAC] w-full text-input-color text-xs lg:text-base p-4 border"
                      id="card-number"
                    />
                    <p className={cn("text-sm font-medium text-red-400")}>
                      {creditCardErrors.cardNumber}
                    </p>
                    {/* <Input
                      {...register("creditCardDetails.cardNumber")}
                      placeholder="1234 5678 9101 1121"
                      className="bg-white border-[#ACACAC]"
                    />
                    <FormError error={errors.creditCardDetails?.cardNumber} /> */}

                    <div className="flex gap-x-4 mt-6">
                      <div className="flex-1">
                        <label
                          htmlFor="expiration-date"
                          className="text-white text-sm lg:text-base block mb-4 font-medium"
                        >
                          Expiration Date
                        </label>
                        <CardExpiryElement
                          onChange={(e) => {
                            if (e.error) {
                              setCreditCardErrors((prevState) => {
                                return {
                                  ...prevState,
                                  cardExpiry: e.error?.message,
                                };
                              });
                            } else {
                              setCreditCardErrors((prevState) => {
                                return {
                                  ...prevState,
                                  cardExpiry: undefined,
                                };
                              });
                            }
                          }}
                          className="bg-white border-[#ACACAC] w-full text-input-color text-xs lg:text-base p-4 border"
                          id="card-expiry"
                        />
                        <p className={cn("text-sm font-medium text-red-400")}>
                          {creditCardErrors.cardExpiry}
                        </p>
                        {/* <Input
                          placeholder="MM/YY"
                          className="bg-white border-[#ACACAC]"
                          {...register("creditCardDetails.expiryDate")}
                        />
                        <FormError
                          error={errors.creditCardDetails?.expiryDate}
                        /> */}
                      </div>

                      <div className="flex-1">
                        <label className="text-white text-sm lg:text-base block mb-4 font-medium">
                          CVV
                        </label>
                        <CardCvcElement
                          onChange={(e) => {
                            if (e.error) {
                              setCreditCardErrors((prevState) => {
                                return {
                                  ...prevState,
                                  cardCvv: e.error?.message,
                                };
                              });
                            } else {
                              setCreditCardErrors((prevState) => {
                                return {
                                  ...prevState,
                                  cardCvv: undefined,
                                };
                              });
                            }
                          }}
                          className="bg-white border-[#ACACAC] w-full text-input-color text-xs lg:text-base p-4 border"
                          id="card-cvv"
                        />
                        {/* <Input
                            placeholder="123"
                            className="bg-white border-[#ACACAC]"
                            {...register("creditCardDetails.cvv")}
                          /> */}
                        <p className={cn("text-sm font-medium text-red-400")}>
                          {creditCardErrors.cardCvv}
                        </p>
                      </div>
                    </div>
                  </CollapseContent>
                </div>
              </CollapseItem>
              <CollapseItem value="applePay" className="flex">
                <div>
                  <CollapseTrigger>
                    <div className="text-input-color text-xs lg:text-base font-medium">
                      ApplePay
                    </div>
                    <Image
                      src={ApplePay}
                      alt=""
                      width={56}
                      height={32}
                      className="lg:w-7 lg:h-5"
                    />
                  </CollapseTrigger>
                  <CollapseContent>
                    {paymentRequestAvailable && paymentRequest && (
                      <div style={{ marginBottom: "20px" }}>
                        <PaymentRequestButtonElement
                          options={{ paymentRequest }}
                        />
                      </div>
                    )}
                  </CollapseContent>
                </div>
              </CollapseItem>
              <CollapseItem value="paypal" className="flex">
                <div>
                  <CollapseTrigger>
                    <div className="text-input-color text-xs lg:text-base font-medium">
                      Paypal
                    </div>

                    <Image
                      src={Paypal}
                      alt=""
                      width={56}
                      height={32}
                      className="lg:w-7 lg:h-5"
                    />
                  </CollapseTrigger>
                  <CollapseContent>Content</CollapseContent>
                </div>
              </CollapseItem>
            </Collapse>

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
                  <Dialog.Overlay className="fixed inset-0" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw]  w-[350px]">
                    <div className="bg-[#333333] pl-2 pr-4 pt-4 pb-8 text-[#A3A7AA] text-xs">
                      <div className="text-white font-medium text-base flex justify-between">
                        <span>Order Summary</span>
                        <Dialog.Close>
                          <button type="button">
                            <FiX />
                          </button>
                        </Dialog.Close>
                      </div>
                      <div className="space-y-3 mt-4">
                        <div>{order.event.name}</div>
                        {/* TODO: */}
                        <div>
                          {getPDTDate(
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

                        <div className="flex justify-between font-bold text-white text-base">
                          <span>Total</span>
                          <span className="text-[#DADADA]">${total}</span>
                        </div>
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
                {/* END ORDER DETAILS MODAL */}
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

            {/* <SubmitButton
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
            </SubmitButton> */}
          </form>

          {/* ORDER DETAILS DESKTOP */}
          <div className="w-[365px] text-[#A3A7AA] space-y-5 mb-20 hidden lg:block">
            <Image src={OrderImage} alt="" width={365} height={365} />

            <div className="text-white font-medium text-xl">Order Summary</div>
            <div>{order.event.name}</div>
            <div>Friday, August 16 · 10am - 12pm PDT</div>
            {order.ticketOrders?.map((ticketOrder) => {
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

      <GuestInfoDialog
        open={guestInfoDialogOpen}
        onOpenChange={setGuestInfoDialogOpen}
        defaultOpen
      />
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
        <Dialog.Overlay className="bg-[#333333] bg-opacity-80 fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <Dialog.Content className="relative bg-black text-[#A3A7AA] p-6 mx-auto py-9 max-w-lg">
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

            {/* TODO: Link to edit new ticket details */}
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

function GuestInfoDialog({ ...props }: ComponentProps<typeof Dialog.Root>) {
  return (
    <Dialog.Root {...props} modal={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-[#333333] bg-opacity-80 fixed inset-0 grid place-items-center overflow-y-auto pt-36 pb-20">
          <Dialog.Content className="relative bg-black text-[#A3A7AA] p-6 mx-auto py-9 max-w-lg">
            <div className="bg-red-500 text-white size-24 mx-auto rounded-full grid place-items-center">
              <MdGppBad className="text-4xl" />
            </div>

            <div className="text-white text-2xl lg:text-4xl font-medium text-center mt-16">
              User not logged in
            </div>

            <div className="text-center my-6 space-y-4">
              <p className="text-white text-base lg:text-xl">
                It looks like you’re not logged in.
              </p>
              <p className="text-text-color text-sm lg:text-base">
                If you already have an account, please use the email address
                associated with that account to checkout.
              </p>
              <p className="text-text-color text-sm lg:text-base">
                If you don’t have an account, please provide an email address to
                associate to the checkout and for a new account.
              </p>
            </div>

            <div className="flex justify-center">
              <AdminButton
                variant="outline"
                className=""
                onClick={() => props.onOpenChange?.(false)}
              >
                Continue
              </AdminButton>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
