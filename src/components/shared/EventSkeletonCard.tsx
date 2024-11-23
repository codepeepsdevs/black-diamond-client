import React from "react";
import Image from "next/image";
import { Ticket, PastTicket, Calander, Clock } from "../../../public/icons";
import classNames from "classnames";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface EventCardProps {
  variant?: "eventPage" | "landingPage";
  tab: "upcoming" | "past";
}

const EventSkeletonCard: React.FC<EventCardProps> = ({
  variant = "eventPage",
  tab,
}) => {
  return (
    <motion.div>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className={classNames({
          "cursor-pointer flex flex-col": true,
          "min-w-[350px] md:w-full": variant == "landingPage",
        })}
      >
        <Skeleton
          className="h-[70%] md:h-[62%] w-fit rounded-none"
          height={230}
          baseColor="#202020"
          highlightColor="#444"
        />
        <div className="w-full flex flex-col gap-3 bg-[#151515] h-[30%] md:h-[37%] p-4 text-[#C0C0C0]">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <div className="flex flex-col gap-3 sm:gap-4">
              <p className="text-white text-lg font-bold">
                {" "}
                <Skeleton
                  width={150}
                  baseColor="#202020"
                  highlightColor="#444"
                />
              </p>
              {/* <p>{subtitle}</p> */}
              <div className="flex flex-col gap-1.5 font-medium">
                <div className="flex items-center gap-1 md:gap-2 text-xs sm:text-sm">
                  <Image src={Calander} alt="calander" />

                  <Skeleton
                    width={100}
                    baseColor="#202020"
                    highlightColor="#444"
                  />
                </div>

                <div className="flex items-center gap-1 md:gap-2 text-xs sm:text-sm">
                  <Image src={Clock} alt="calander" />
                  <Skeleton
                    width={100}
                    baseColor="#202020"
                    highlightColor="#444"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Image
                className="w-20 md:w-24 flex self-end"
                src={tab == "past" ? PastTicket : Ticket}
                alt="get ticket"
              />{" "}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 md:gap-2 text-end">
                  <Skeleton
                    width={100}
                    baseColor="#202020"
                    highlightColor="#444"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

export default EventSkeletonCard;
