"use client";

import Image from "next/image";
import { ExploreNext, Forward } from "../../public/icons";
import { carouselImages, landingPageEvents } from "../../public/images";
import { useWindowsize } from "@/hooks";
import {
  CustomButton,
  Socials,
  Hero,
  RenderCarousel,
  HighLights,
} from "@/components";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import EventCard from "@/components/shared/EventCard";
import Link from "next/link";
import { motion } from "framer-motion";
import TypeWriter from "typewriter-effect";
import { useRouter } from "next/navigation";
import { useNewsletterSubscribe } from "@/api/newsletter/newsletter.queries";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import LoadingSvg from "@/components/shared/Loader/LoadingSvg";
import { scaleVariants } from "@/utils/hoc/motion";
import { useGetEvents } from "@/api/events/events.queries";
import LoadingSkeleton from "@/components/shared/Loader/LoadingSkeleton";
import { useState } from "react";
// Import Swiper React componentssss

import { Swiper, SwiperSlide } from "swiper/react";
import LoadingScreen from "@/app/loading";
import "swiper/css";
import SuccessToast from "@/components/toast/SuccessToast";
import ErrorToast from "@/components/toast/ErrorToast";
import { getApiErrorMessage } from "@/utils/utilityFunctions";

export default function LandingPage() {
  const width = useWindowsize();
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const router = useRouter();

  const upcomingEvents = useGetEvents({
    eventStatus: "upcoming",
    search: "",
  });

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const form = useForm<ISubscribe>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState, watch, reset } = form;
  const { errors } = formState;
  const watchedEmail = watch("email");

  const onNewsletterSuccess = (data: any) => {
    SuccessToast({
      title: "Success",
      description: "Subscribed to newsletter",
    });
  };

  const onNewsletterError = (error: any) => {
    const descriptions = getApiErrorMessage(
      error,
      "Error Subscribing to newsletter"
    );
    ErrorToast({
      title: "Error",
      descriptions,
    });
  };

  const {
    mutate: subscribe,
    isPending: newsletterPending,
    isError: newsletterError,
  } = useNewsletterSubscribe(onNewsletterSuccess, onNewsletterError);

  function handleVideoCanPlay() {
    setVideoCanPlay(true);
  }

  return (
    <>
      {!videoCanPlay && <LoadingScreen />}
      <main className="flex flex-col gap-10">
        <Hero handleVideoCanPlay={handleVideoCanPlay} />

        <motion.div
          whileInView={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, type: "tween" }}
          className="w-full sm:grid sm:grid-cols-2 gap-x-4 px-4 lg:px-6 h-full"
        >
          <div className="flex flex-col md:col-span-1 gap-2 text-text-color overflow-hidden">
            <div className="relative w-full bg-[#000000] overflow-hidden">
              <div className="absolute inset-0">
                <video
                  className="w-full h-full object-cover"
                  // className="absolute top-0 left-0 w-full h-[165px] md:h-[130px] lg:h-[200px] object-cover"
                  preload="auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onCanPlay={handleVideoCanPlay}
                  onPlaying={handleVideoCanPlay}
                >
                  <source src="videos/exploreEvents.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="flex flex-col gap-2 -ml-1 text-white bg-black mix-blend-multiply">
                <h1 className="text-5xl md:text-3xl lg:text-6xl font-extrabold">
                  ELEVATE
                </h1>
                <h1 className="text-5xl md:text-3xl ml-1 lg:text-6xl font-extrabold">
                  YOUR
                </h1>
                <h1 className="text-5xl md:text-3xl lg:text-6xl font-extrabold">
                  EXPERIENCE
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-full lg:w-[95%] text-sm sm:text-base lg:text-lg leading-6 flex flex-col text-white">
                <span>
                  Welcome! Here, every event is a unique experience, designed to
                  unite, delight, and leave a lasting impression{" "}
                </span>
                <TypeWriter
                  options={{
                    autoStart: true,
                    loop: true,
                    delay: 40,
                    strings: [
                      "Dance the night away...",
                      "Experience entertainment...",
                      "Make memories that last a lifetime...",
                    ],
                  }}
                />
              </div>

              <Socials />

              <CustomButton
                className="py-2.5 lg:py-3.5 text-center px-6 w-fit font-bold"
                onClick={() => {
                  router.push(`/events`);
                }}
                content="EXPLORE EVENTS"
              />
            </div>
          </div>

          {width > 640 ? (
            <RenderCarousel
              properties={{
                showArrows: false,
              }}
              carouselImages={carouselImages}
              imageStyles="h-[340px] md:h-[360px] lg:h-[420px]"
            />
          ) : null}
        </motion.div>

        <HighLights />

        {upcomingEvents.isError ? null : (
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, type: "tween" }}
            className="w-full flex flex-col gap-4 pl-4 lg:pl-6"
          >
            <h2 className="text-base md:text-xl text-white font-semibold">
              Upcoming Events
            </h2>

            <Swiper autoplay={true} draggable={true} className="w-full">
              {upcomingEvents.isPending && !upcomingEvents.isError ? (
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
              slidesPerView={1.1}
              breakpoints={{
                480: {
                  slidesPerView: 1.8,
                },
                768: {
                  slidesPerView: 2.2,
                },
                1024: {
                  slidesPerView: 2.6,
                },
              }}
            >
              {upcomingEvents.data?.data.map((event, index) => {
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

            {/* <div className="md:hidden">
            <ScrollMenu>
              <div className="flex items-center gap-4 sm:gap-2.5">
                {upcomingEvents.data?.data.map((event, index) => {
                  return (
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
                    />
                  );
                })}
              </div>
            </ScrollMenu>
          </div> */}
          </motion.div>
        )}

        <motion.div
          whileInView={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, type: "tween" }}
          className="w-full flex flex-col gap-4"
        >
          <h2 className="text-base md:text-xl text-white px-4 lg:px-6 font-semibold">
            Explore Events
          </h2>

          <div className="w-full flex flex-col md:flex-row items-center gap-2.5 sm:gap-3 px-4 lg:px-6">
            {landingPageEvents.map((tab, index) => (
              <motion.div
                variants={scaleVariants}
                whileInView={scaleVariants.whileInView}
                onClick={() => {
                  router.push(`/events?category=${tab.path}`);
                }}
                key={index}
                className="cursor-pointer hover:opacity-80 w-full relative bg-black"
              >
                <Image className="w-full" src={tab.image} alt={tab.name} />

                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between text-white">
                  <div className="flex flex-col gap-1">
                    <div className="border-[1px] w-[40%]" />
                    <h2>{tab.name}</h2>
                  </div>
                  <Image
                    className="cursor-pointer"
                    src={ExploreNext}
                    alt="explore next"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          whileInView={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, type: "tween" }}
          className="py-10 pb-20 flex flex-col items-center gap-8 text-white text-center text-sm"
        >
          <div className="w-[75%] md:w-[35%] lg:w-[25%] flex flex-col gap-2 leading-6">
            <Link href="" className="underline font-normal">
              SUBSCRIBE
            </Link>
            <p>Subscribe to join our Black Diamond Newsletter</p>
          </div>

          <div className="w-[80%] md:w-[50%] lg:w-[40%]">
            <div className="flex justify-between pb-2 items-center text-[#BDBDBD]">
              <div className="w-[90%]">
                <input
                  placeholder="Email"
                  className="bg-black border-none outline-none w-full placeholder:text-[#BDBDBD]"
                  type="text w-full"
                  {...register("email")}
                />
              </div>

              {newsletterPending && !newsletterError ? (
                <LoadingSvg />
              ) : (
                <Image
                  className="hover:opacity-80 cursor-pointer w-[24px] h-[24px]"
                  src={Forward}
                  alt="forward"
                  onClick={() => {
                    subscribe({
                      email: watchedEmail,
                    });
                  }}
                />
              )}
            </div>

            <div className="border-[1px] border-[#C0C0C0]" />
            <p className="flex self-start text-red-500 text-xs mt-0.5">
              {errors.email?.message}
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
}
