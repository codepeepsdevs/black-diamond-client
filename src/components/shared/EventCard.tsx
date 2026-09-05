import React from "react";
import Image from "next/image";
import { Ticket, PastTicket, Calander, Clock } from "../../../public/icons";
import classNames from "classnames";
import { fadeIn } from "@/utils/hoc/motion";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { useRouter } from "next/navigation";
import { Event, TicketType } from "@/constants/types";
import { getEventDateAndTime } from "@/utils/date-formatter";
import { useOrderStore } from "@/store/order.store";
import { getLowestTicket } from "@/utils/utilityFunctions";

interface EventCardProps {
  id: Event["id"];
  index: number;
  image: string;
  tab: string;
  title: string;
  ticketTypes: TicketType[];
  startTime: Date;
  variant?: "eventPage" | "landingPage";
  className?: string;
  eventBriteUrl?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  image,
  title,
  ticketTypes,
  startTime: dateTime,
  index,
  tab,
  variant = "eventPage",
  className,
  eventBriteUrl,
}) => {
  const router = useRouter();
  // finding the lowest priced ticket
  const lowestTicket = getLowestTicket(ticketTypes);

  const { date, time } = getEventDateAndTime(dateTime);

  const TICKETMASTER_OVERRIDES: Record<string, string> = {
    "6a9c1cce98b04268bd5a8770":
      "https://www.ticketmaster.com/a-boogie-wit-da-hoodie-10-buffalo-new-york-09-18-2026/event/000064CA25FBCEE1?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleAUGxZlwZG9mAmZkaWQWUNuyo2C_PtYww-54ZrP-Tv5BdcEiSWV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzEyNDAyNDU3NDI4NzQxNAABp01NUSKW7Aq6iOXOCNTOgEPO2oqR2kyiaQaz-8qBnEzNkTJieX-DzhcZYTfk_aem_zAnEgK22Rfl9kTqmOdohyw",
  };

  const handleClick = (id: Event["id"]) => {
    const externalUrl = TICKETMASTER_OVERRIDES[id];
    if (externalUrl) {
      window.open(externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(`/events/${tab}/${id}`);
  };
  return (
    <motion.div
      onClick={() => {
        handleClick(id);
      }}
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className={className}
    >
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className={classNames({
          "cursor-pointer flex flex-col w-full": true,
          "md:w-full": variant == "landingPage",
        })}
      >
        {/* <div className="relative w-full h-60 md:h-80 overflow-hidden shadow-lg"> */}
        <div className="relative w-full aspect-[4/5] overflow-hidden shadow-lg">
          <Image
            src={image}
            alt={`event image`}
            fill
            className="z-0 w-full object-fill"
          />
        </div>

        <div className="flex flex-col gap-3 bg-[#151515] p-4 text-[#C0C0C0]">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <div className="flex flex-col gap-3 sm:gap-4">
              <p className="text-white text-sm md:text-lg font-bold leading-5 md:leading-5 capitalize">
                {title.toLowerCase()}
              </p>
              {/* <p>{subtitle}</p> */}
              <div className="flex flex-col gap-1.5 font-medium">
                <div className="flex items-center gap-1 md:gap-2 text-xs sm:text-sm">
                  <Image src={Calander} alt="calander" />
                  <p>{date}</p>
                </div>

                <div className="flex items-center gap-1 md:gap-2 text-xs sm:text-sm">
                  <Image src={Clock} alt="calander" />
                  <p>{time}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 min-w-0 shrink-0">
              <Image
                className="w-20 md:w-24 flex self-end"
                src={tab == "past" ? PastTicket : Ticket}
                alt="get ticket"
              />
              {tab === "past" ? null : (
                <div className="flex justify-end items-center">
                  <div className="text-end">
                    <p className="text-xs sm:text-sm">
                      {tab == "past" ? "Started at" : "Starting at:"}
                    </p>
                    <p className="text-sm sm:text-base text-white font-bold">
                      ${lowestTicket?.price.toFixed(2) || "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

export default EventCard;
