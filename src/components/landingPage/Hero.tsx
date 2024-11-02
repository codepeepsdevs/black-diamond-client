"use client";
import { textVariant } from "@/utils/hoc/motion";
import { motion } from "framer-motion";
import React from "react";
import { FaAngleDown } from "react-icons/fa";

const Hero = ({
  handleVideoCanPlay = () => {},
}: {
  handleVideoCanPlay?: React.ReactEventHandler<HTMLVideoElement>;
}) => {
  return (
    <div className="relative w-full">
      <video
        className="w-full h-screen object-cover border-none outline-none"
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={handleVideoCanPlay}
        onPlaying={handleVideoCanPlay}
        poster={"/videos/heroVideoPoster.jpg"}
      >
        <source src="videos/heroVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <motion.div
        variants={textVariant(0.005)}
        initial="hidden"
        animate="show"
        className="absolute left-2 sm:left-2 bottom-[6rem] sm:bottom-10 md:inset-0 flex flex-col items-center justify-center text-white"
      >
        {/* <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          BLACK DIAMOND
        </h1>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          ENTERTAINMENT
        </h1> */}
      </motion.div>

      {/* <FaAngleDown className="hidden md:block absolute bottom-5 left-[50%] text-white text-3xl cursor-pointer" /> */}
    </div>
  );
};

export default Hero;
