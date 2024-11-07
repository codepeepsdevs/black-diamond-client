"use client";

import React, { useState } from "react";

const Hero = ({
  handleVideoCanPlay,
}: {
  handleVideoCanPlay: React.ReactEventHandler<HTMLVideoElement>;
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
        // poster={"/videos/heroVideoPoster.jpg"}
      >
        <source src="videos/heroVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Hero;
