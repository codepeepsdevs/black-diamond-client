export interface User {
  id: string;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  imgUrl: string | null;
  emailConfirmed: boolean;
  role: "user" | "admin";
  addressId: string;
  billingInfoId: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
  billingInfo: BillingInfo;
}

interface Address {
  id: string;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  country: string | null;
  zipCode: string | null;
  state: string | null;
  firstname: string;
  lastname: string;
  imgUrl: string | null;
  emailConfirmed: boolean;
  role: string;
  addressId: string;
  billingInfoId: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
  billingInfo: BillingInfo;
}

interface Address {
  id: string;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  country: string | null;
  zipCode: string | null;
  state: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BillingInfo {
  id: string;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  country: string | null;
  zipCode: string | null;
  state: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Order = {
  id: string;
  event: Event;
  user?: User;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  paymentStatus: "PENDING" | "SUCCESSFUL" | "FAILED" | "CANCELLED";
  paymentId?: string;
  amountPaid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tickets: Partial<Ticket>[];
  createdAt: string;
  sessionId?: string;
};
interface BillingInfo {
  id: string;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  country: string | null;
  zipCode: string | null;
  state: string | null;
  createdAt: string;
  updatedAt: string;
}

// export type Event = {
//   id: string;
//   name: string;
//   description: string;
//   highlights: string[];
//   images: string[];
//   coverImage: string;
//   location: string;
//   dateTime: string;
//   summary: string;
//   startDateOfSale: string;
//   endDateOfSale: string;
//   eventStatus: "UPCOMING" | "PAST";

//   ticketTypes: TicketType[];

//   updatedAt: string;
//   createdAt: string;
// };

export type Event = {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  images: string[];
  coverImage: string;
  location: string;
  startTime: string; // ISO string (Date)
  endTime: string; // ISO string (Date)
  summary: string;
  isPublished: boolean;
  eventStatus: "UPCOMING" | "ONGOING" | "PAST"; // Enum-like status
  locationType: "VENUE" | "ONLINE_EVENT" | "TO_BE_ANNOUNCED";
  ticketSalesEndMessage: string | null;
  displayTicketsRemainder: boolean;
  refundPolicy: string;
  createdAt: string; // ISO string (Date)
  updatedAt: string; // ISO string (Date)
  ticketTypes: TicketType[];
};

export type Ticket = ITicketDetail & {
  ticketType: TicketType;
};

// export type TicketType = {
//   id: string;
//   name: string;
//   startDate: string;
//   endDate: string;
//   price: number;
//   quantity: number;
// };

export interface TicketType {
  id: string; // MongoDB ObjectId stored as a string
  name: string; // Ticket type name (e.g., VVIP)
  quantity: number; // Number of tickets available
  startDate: string; // ISO 8601 Date string for ticket sales start
  endDate: string; // ISO 8601 Date string for ticket sales end
  price: number; // Price of the ticket
  eventId: string; // MongoDB ObjectId of the related event
  promoCodeIds: string[]; // Array of promo code IDs associated with this ticket
  createdAt: string; // ISO 8601 Date string for creation date
  updatedAt: string; // ISO 8601 Date string for last update date
  promoCodes: PromoCode[];
}

export interface AddOn {
  id: string; // MongoDB ObjectId stored as a string
  name: string; // Name of the add-on (e.g., Face cap)
  quantity: number; // Total quantity available
  price: number;
  description: string; // Description of the add-on
  image: string; // URL for the add-on image
  minimumQuantityPerOrder: number; // Minimum quantity a user can order
  maximumQuantityPerOrder: number; // Maximum quantity a user can order
  startTime: string; // ISO 8601 Date string for when the sale starts
  endTime: string; // ISO 8601 Date string for when the sale ends
  showSaleAndStatusOnCheckout: boolean; // Whether to show sale status on checkout
  visible: boolean; // Whether the add-on is visible in the UI
  eTicket: boolean; // Whether the add-on includes an e-ticket
  willCall: boolean; // Whether the add-on is available for will-call pickup
  eventId: string;
  event: Event;
}

export interface PromoCode {
  id: string; // MongoDB ObjectId stored as a string
  name: string; // Name of the promo code (e.g., "40% Off all sales")
  key: string; // Promo code key (e.g., "SOFF3")
  limit: number; // Limit on how many times the promo code can be used
  absoluteDiscountAmount: number; // Absolute discount amount in currency
  percentageDiscountAmount: number; // Percentage discount (if applicable)
  promoStartDate: string; // ISO 8601 Date string for promo start date
  promoEndDate: string; // ISO 8601 Date string for promo end date
  ticketTypeIds: string[]; // Array of ticket type IDs associated with this promo code
  ticketTypes: TicketType[]; // Array of ticket types associated with this promo code

  promocodeId: string;
  promocode: PromoCode;
}

export type ITicketDetail = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  checkinCode?: string;
};

export type ErrorResponse = Error;

export type EventAddon = {
  id: string;
  name: string;
  price: string;
  salesEndDate: string;
};

export type AddonOrder = {};

export type SearchQueryState<T = string> = [
  type: T,
  setType: (value: T) => void,
];

export interface OptionProps {
  page?: number;
  limit?: number;
  eventStatus?: "upcoming" | "past" | "all" | undefined;
  search?: string;
}

export interface PageData {
  page?: number;
  limit?: number;
}

export type DateRangeData = {
  startDate?: Date;
  endDate?: Date;
};

export type CalendarEvent = {
  title: string;
  startDate: Date;
  endDate: Date;
  details: string;
  location: string;
};
