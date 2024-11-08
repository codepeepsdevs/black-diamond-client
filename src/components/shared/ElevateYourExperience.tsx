import React from "react";
import { motion } from "framer-motion";
import TypeWriter from "typewriter-effect";
import Socials from "../Socials";
import CustomButton from "../buttons/CustomButton";
import { useWindowsize } from "@/hooks";
import { useRouter } from "next/navigation";
import RenderCarousel from "./RenderCarousel";
import { carouselImages } from "../../../public/images";
import Image from "next/image";
import { ElevateExperience } from "../../../public/gif";

export default function ElevateYourExperience() {
  const width = useWindowsize();
  const router = useRouter();

  return (
    <motion.div
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, type: "tween" }}
      className="w-full sm:grid sm:grid-cols-2 gap-x-4 px-4 lg:px-6 h-full"
    >
      <div className="flex flex-col md:col-span-1 gap-2 text-text-color overflow-hidden">
        <div className="relative w-full bg-[#000000] overflow-hidden">
          <div className="absolute inset-0">
            {/* <video
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
            </video> */}
            <Image
              src={ElevateExperience}
              alt=""
              className="w-full h-full object-cover"
            />
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
  );
}
