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
import { motion } from "framer-motion";
import TypeWriter from "typewriter-effect";
import { useRouter } from "next/navigation";
import { scaleVariants } from "@/utils/hoc/motion";
import "swiper/css";
import UpcomingEventsList from "@/components/shared/UpcomingEventsList";
import NewsletterForm from "@/components/shared/NewsletterForm";
import { useState } from "react";
import Loading from "./loading";

export default function LandingPage() {
  const width = useWindowsize();
  const router = useRouter();

  const [videoCanPlay, setVideoCanPlay] = useState(false);

  const handleVideoCanPlay: React.ReactEventHandler<HTMLVideoElement> = () => {
    setVideoCanPlay(true);
  };

  return (
    <>
      {!videoCanPlay && <Loading />}
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

        <UpcomingEventsList />

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

        <NewsletterForm />
      </main>
    </>
  );
}
