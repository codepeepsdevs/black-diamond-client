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
}) => {
  const router = useRouter();
  // finding the lowest priced ticket
  const lowestTicket = getLowestTicket(ticketTypes);

  const { date, time } = getEventDateAndTime(dateTime);

  const handleClick = (id: Event["id"]) => {
    router.push(`/events/${tab}/${id}`);
  };
  return (
    <motion.div
      onClick={() => handleClick(id)}
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
        <div className="relative w-full h-60 md:h-80 overflow-hidden shadow-lg">
          <Image
            src={image}
            alt={`event image`}
            fill
            objectFit="cover"
            className="z-0 w-full"
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
              <div className="flex justify-end items-center">
                <div className="text-end">
                  <p className="text-xs sm:text-sm">
                    {tab == "past" ? "Started at:" : "Starting at:"}
                  </p>
                  <p className="text-sm sm:text-base text-white font-bold">
                    ${lowestTicket?.price.toFixed(2) || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

export default EventCard;
