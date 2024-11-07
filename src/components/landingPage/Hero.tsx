"use client";
import { textVariant } from "@/utils/hoc/motion";
import { motion } from "framer-motion";
import React, { useState } from "react";

const Hero = () => {
  const [videoCanPlay, setVideoCanPlay] = useState(false);

  const handleVideoCanPlay: React.ReactEventHandler<HTMLVideoElement> = () => {
    setVideoCanPlay(true);
  };
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
        // poster={"/videos/heroVideoPoster.jpg"}
      >
        <source src="videos/heroVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Hero;
