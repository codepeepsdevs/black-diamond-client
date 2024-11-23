"use client";

import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingSkeleton from "./Loader/LoadingSkeleton";
import EventCard from "./EventCard";
import { useGetEvents } from "@/api/events/events.queries";
import { cn } from "@/utils/cn";
import UpcomingEventCard from "./UpcomingEventCard";

export default function UpcomingEventsList() {
  const upcomingEventsQuery = useGetEvents({
    eventStatus: "upcoming",
    search: "",
  });
  const upcomingEventsData = upcomingEventsQuery.data?.data;
  const eventsCount = upcomingEventsData?.eventsCount;

  return (
    <>
      {upcomingEventsQuery.isError ? null : (
        <motion.div
          whileInView={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, type: "tween" }}
          className={cn(
            "w-full flex flex-col gap-4 pl-4 lg:pl-6",
            eventsCount === 1 && "px-4"
          )}
        >
          <h2 className="text-base md:text-xl text-white font-semibold">
            Upcoming Events
          </h2>

          <Swiper autoplay={true} draggable={true} className="w-full">
            {upcomingEventsQuery.isPending && !upcomingEventsQuery.isError ? (
              <>
                {new Array(3).fill(0).map((_, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <LoadingSkeleton key={index} className="h-48 sm:h-60" />
                    </SwiperSlide>
                  );
                })}
              </>
            ) : null}
          </Swiper>

          <Swiper
            className="w-full text-white"
            spaceBetween={16}
            autoplay={{
              disableOnInteraction: false,
            }}
            slidesPerView={1}
            breakpoints={{
              480: {
                slidesPerView: 1.5,
              },
              768: {
                slidesPerView: 2.2,
              },
              1024: {
                slidesPerView: 2.6,
              },
            }}
          >
            {upcomingEventsData?.events.map((event, index) => {
              return (
                <SwiperSlide key={event.id}>
                  <EventCard
                    id={event.id}
                    key={event.id}
                    index={index}
                    image={event.coverImage}
                    title={event.name}
                    ticketTypes={event.ticketTypes}
                    startTime={new Date(event.startTime)}
                    tab={"upcoming"}
                    variant="landingPage"
                    className=""
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* <div className="flex">
            {upcomingEventsData?.events.map((event, index) => {
              return (
                <UpcomingEventCard
                  id={event.id}
                  key={event.id}
                  index={index}
                  image={event.coverImage}
                  title={event.name}
                  ticketTypes={event.ticketTypes}
                  startTime={new Date(event.startTime)}
                  tab={"upcoming"}
                  variant="landingPage"
                  className=""
                />
              );
            })}
          </div> */}
        </motion.div>
      )}
    </>
  );
}
