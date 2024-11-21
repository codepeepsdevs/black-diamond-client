"use client";

import Image from "next/image";
import { ExploreNext, Forward } from "../../public/icons";
import { landingPageEvents } from "../../public/images";
import { Hero, HighLights } from "@/components";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { scaleVariants } from "@/utils/hoc/motion";
import "swiper/css";
import UpcomingEventsList from "@/components/shared/UpcomingEventsList";
import NewsletterForm from "@/components/shared/NewsletterForm";
import { useEffect, useState } from "react";
import Loading from "./loading";
import ElevateYourExperience from "@/components/shared/ElevateYourExperience";

export default function LandingPage() {
  const router = useRouter();

  const [videoCanPlay, setVideoCanPlay] = useState(false);

  const handleVideoCanPlay: React.ReactEventHandler<HTMLVideoElement> = () => {
    window.setTimeout(() => setVideoCanPlay(true), 200);
  };

  useEffect(() => {
    window.setTimeout(() => {
      setVideoCanPlay(true);
    }, 5000);
  }, []);

  return (
    <>
      {!videoCanPlay && <Loading />}
      <main className="flex flex-col gap-10">
        <Hero handleVideoCanPlay={handleVideoCanPlay} />

        <ElevateYourExperience />

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
