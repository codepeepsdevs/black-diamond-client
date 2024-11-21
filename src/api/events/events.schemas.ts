import * as Yup from "yup";
import { dateStringSchema } from "../utility-schemas/datestring.schema";

export const paymentMethods = ["creditCard", "applePay", "paypal"] as const;

export const checkoutFormSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  paymentMethod: Yup.string()
    .oneOf(paymentMethods, "Invalid payment method")
    .required("Payment method is required")
    .default("creditCard"),
  //   creditCardDetails: Yup.object().shape({
  //     cardNumber: Yup.string().required("Card number is required"),
  //     expiryDate: Yup.string().required("Expiry date is required"),
  //     cvv: Yup.string().required("CVV is required"),
  //   }),
  //   // @ts-expect-error
  // creditCardDetails: Yup.object().when("paymentMethod", {
  //   is: "creditCard",
  //   then: Yup.object().shape({
  //     cardNumber: Yup.string().required("Card number is required"),
  //     expiryDate: Yup.string().required("Expiry date is required"),
  //     cvv: Yup.string().required("CVV is required"),
  //   }),
  // }),
  // // @ts-expect-error
  // applePayDetails: Yup.object().when("paymentMethod", {
  //   is: "applePay",
  //   then: Yup.object().shape({
  //     applePayToken: Yup.string().required("Apple Pay token is required"),
  //   }),
  // }),
  // // @ts-expect-error
  // paypalDetails: Yup.object().when("paymentMethod", {
  //   is: "paypal",
  //   then: Yup.object().shape({
  //     paypalEmail: Yup.string()
  //       .email("Invalid PayPal email")
  //       .required("PayPal email is required"),
  //   }),
  // }),

  eventUpdates: Yup.boolean(),
  promotionalEmails: Yup.boolean(),
});

export const newEventSchema = Yup.object().shape({
  name: Yup.string().required("Event title is required"),
  summary: Yup.string().required("Event summary is required"),
  date: Yup.date().typeError("Please provide a valid date").required(),
  startTime: Yup.string().required(),
  endTime: Yup.string().required(),
  location: Yup.string().required(),
  refundPolicy: Yup.string().required(),
  images: Yup.mixed<File[]>(),
  coverImage: Yup.mixed<File>(),
  locationType: Yup.string()
    .oneOf(["VENUE", "ONLINE_EVENT", "TO_BE_ANNOUNCED"])
    .default("VENUE"),
});

export const editEventDetailsSchema = Yup.object().shape({
  name: Yup.string().required("Event title is required"),
  summary: Yup.string().required("Event summary is required"),
  date: Yup.date().typeError("Please provide a valid date").required(),
  startTime: Yup.string().required(),
  endTime: Yup.string().required(),
  location: Yup.string().required(),
  refundPolicy: Yup.string().required(),
  images: Yup.mixed<File[]>(),
  coverImage: Yup.mixed<File>(),
  locationType: Yup.string()
    .oneOf(["VENUE", "ONLINE_EVENT", "TO_BE_ANNOUNCED"])
    .default("VENUE"),
});

export const newTicketFormSchema = Yup.object().shape({
  name: Yup.string().required("Ticket name is required"),
  quantity: Yup.number().required("Ticket quantity is required"),
  price: Yup.number().required("Ticket price is required"),
  startDate: dateStringSchema.required("Start date is required"),
  startTime: Yup.string().required("Start time is required"),
  endDate: dateStringSchema.required("End date is required"),
  endTime: Yup.string().required(),
});

export const editTicketFormSchema = Yup.object().shape({
  name: Yup.string().required("Ticket name is required"),
  quantity: Yup.number().required("Ticket quantity is required"),
  price: Yup.number().required("Ticket price is required"),
  startDate: Yup.string()
    // .typeError("Please provide a valid date")
    .required("Start date is required"),
  startTime: Yup.string()
    // .typeError("Please provide a valid date")
    .required("Start time is required"),
  endDate: Yup.string().required("End date is required"),
  endTime: Yup.string().required(),
});

// Define the Yup schema
export const newAddOnSchema = Yup.object().shape({
  // Multiple prices checkbox (not required for Yup validation)
  hasMultiplePrices: Yup.boolean(),

  // Name field (required)
  name: Yup.string().required("Name is required"),

  // Total Quantity field (required and must be a positive integer)
  totalQuantity: Yup.number()
    .required("Total Quantity is required")
    .positive("Total Quantity must be a positive number")
    .integer("Total Quantity must be an integer"),

  // Price field (required and must be a positive integer)
  price: Yup.number()
    .required("Item price is required")
    .positive("Item price must be a positive number")
    .integer("Item price must be an integer"),

  // Description field (optional)
  description: Yup.string(),

  // File upload (optional, depending on requirements, you can add validation here)
  image: Yup.mixed(),

  // Add-ons Per Order
  minimumQuantityPerOrder: Yup.number()
    .required("Minimum quantity per order is required")
    .min(1, "Minimum quantity per order must be at least 1")
    .integer("Minimum quantity per order must be an integer"),

  maximumQuantityPerOrder: Yup.number()
    .required("Maximum quantity per order is required")
    .min(1, "Maximum quantity per order must be at least 1")
    .integer("Maximum quantity per order must be an integer")
    .moreThan(
      Yup.ref("minimumQuantityPerOrder"),
      "Maximum quantity per order must be greater than minimum quantity per order"
    ),

  // Start Date and Time (required)
  startDate: dateStringSchema.required("Start Date is required"),

  startTime: Yup.string().required("Start Time is required"),

  // End Date and Time (required and should be after the start date)
  endDate: dateStringSchema
    .required("End Date is required")
    .min(Yup.ref("startDate"), "End Date must be after the Start Date"),

  endTime: Yup.string().required("End Time is required"),

  // Checkbox for sale end dates visibility
  // showSaleStatusOnCheckout: Yup.boolean(),

  // Visibility field (required)
  // visibility: Yup.boolean().required("Visibility is required"),

  // eTicket checkbox
  eTicket: Yup.boolean(),

  // Will Call checkbox
  willCall: Yup.boolean(),
});

export const newPromocodeFormSchema = Yup.object()
  .shape({
    name: Yup.string().required("Ticket name is required"),
    key: Yup.string().required("Code key is required"),
    limit: Yup.number().required("Quantity to apply to is required"),
    absoluteDiscountAmount: Yup.number()
      // .transform((value, originalValue) =>
      //   originalValue.trim() === "" ? null : value
      // )
      .nullable() // TODO: apply logic to prevent the user from submitting both mutually exclusive fields or inform them if they do
      .typeError("Must be a number"),
    percentageDiscountAmount: Yup.number()
      // .transform((value, originalValue) =>
      //   originalValue.trim() === "" ? null : value
      // )
      .nullable()
      .typeError("Must be a number"),
    startDate: dateStringSchema.required("Start date is required"),
    startTime: Yup.string().required("Start time is required"),
    endDate: dateStringSchema.required("End date is required"),
    endTime: Yup.string().required(),
    // applyTo: Yup.string().oneOf(["all-visible", "certain-visible"]),
    applyToTicketIds: Yup.array()
      .of(Yup.string().required("TicketId must be a string"))
      .min(1, "Please select at least one ticket")
      .required("Tickets to apply code to is required"),
  })
  .test(
    "percentage-or-absolute",
    "You must provide either an absolute or a percentage discount amount",
    function (value) {
      return !!(value.absoluteDiscountAmount || value.percentageDiscountAmount);
    }
  );

export const updateEventTicketTypeSchema = Yup.object().shape({
  displayTicketsRemainder: Yup.boolean(),
  showSalesEndMessage: Yup.boolean(),
  ticketSalesEndMessage: Yup.string(),
});
