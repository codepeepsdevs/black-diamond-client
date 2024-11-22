import PartiesEvents from "./Parties.png";
import FashionEvents from "./fashion.jpg";
import LivePerformanceEvents from "./live-performance.png";
import { StaticImageData } from "next/image";

interface LangingPageEventProps {
  name: string;
  image: StaticImageData;
  path: string;
}

export const landingPageEvents: LangingPageEventProps[] = [
  {
    name: "Parties",
    image: PartiesEvents,
    path: "parties",
  },
  {
    name: "Fashion",
    image: FashionEvents,
    path: "fashion",
  },
  {
    name: "Live Performances",
    image: LivePerformanceEvents,
    path: "livePerformances",
  },
];
