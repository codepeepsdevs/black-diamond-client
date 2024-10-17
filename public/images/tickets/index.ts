import { StaticImageData } from "next/image";
import Ticket1 from "./ticket1.png";
import Ticket2 from "./ticket2.png";
import Ticket3 from "./ticket3.png";

export interface TickerObjectProps {
  id: number;
  image: StaticImageData;
  title: string;
  subtitle: string;
  calander: string;
  clockTime: string;
  price: string;
  tab: string;
}

const TicketObj1: TickerObjectProps = {
  id: 1,
  image: Ticket1,
  title: "Biggest Sunny Day Party",
  subtitle: "Biggest Sunny Day Party description",
  calander: "Saturday, 27th Jan 2024",
  clockTime: "7:00pm",
  price: "10",
  tab: "past",
};

const TicketObj2: TickerObjectProps = {
  id: 2,
  image: Ticket2,
  title: "Biggest Sunny Day Party",
  subtitle: "Biggest Sunny Day Party description",
  calander: "Saturday, 27th Jan 2024",
  clockTime: "7:00pm",
  price: "10",
  tab: "past",
};
const TicketObj3: TickerObjectProps = {
  id: 3,
  image: Ticket3,
  title: "Biggest Sunny Day Party",
  subtitle: "Biggest Sunny Day Party description",
  calander: "Saturday, 27th Jan 2024",
  clockTime: "7:00pm",
  price: "10",
  tab: "upcoming",
};

const TicketObj4: TickerObjectProps = {
  id: 4,
  image: Ticket1,
  title: "Biggest Sunny Day Party",
  subtitle: "Biggest Sunny Day Party description",
  calander: "Saturday, 27th Jan 2024",
  clockTime: "7:00pm",
  price: "10",
  tab: "upcoming",
};

const TicketObj5: TickerObjectProps = {
  id: 5,
  image: Ticket2,
  title: "Biggest Sunny Day Party",
  subtitle: "Biggest Sunny Day Party description",
  calander: "Saturday, 27th Jan 2024",
  clockTime: "7:00pm",
  price: "10",
  tab: "upcoming",
};

const TicketObj6: TickerObjectProps = {
  id: 6,
  image: Ticket3,
  title: "Biggest Sunny Day Party",
  subtitle: "Biggest Sunny Day Party description",
  calander: "Saturday, 27th Jan 2024",
  clockTime: "7:00pm",
  price: "10",
  tab: "past",
};

const TicketObj7: TickerObjectProps = {
  id: 7,
  image: Ticket2,
  title: "Biggest Sunny Day Party",
  subtitle: "Biggest Sunny Day Party description",
  calander: "Saturday, 27th Jan 2024",
  clockTime: "7:00pm",
  price: "10",
  tab: "upcoming",
};

const TicketObj8: TickerObjectProps = {
  id: 8,
  image: Ticket1,
  title: "Biggest Sunny Day Party",
  subtitle: "Biggest Sunny Day Party description",
  calander: "Saturday, 27th Jan 2024",
  clockTime: "7:00pm",
  price: "10",
  tab: "past",
};

const TicketObj9: TickerObjectProps = {
  id: 9,
  image: Ticket2,
  title: "Biggest Sunny Day Party",
  subtitle: "Biggest Sunny Day Party description",
  calander: "Saturday, 27th Jan 2024",
  clockTime: "7:00pm",
  price: "10",
  tab: "past",
};

const PastTicketObjects: TickerObjectProps[] = [
  TicketObj1,
  TicketObj2,
  TicketObj6,
  TicketObj8,
  TicketObj9,
];

const UpcomingTicketObjects: TickerObjectProps[] = [
  TicketObj3,
  TicketObj4,
  TicketObj5,
];

export { UpcomingTicketObjects, PastTicketObjects };
