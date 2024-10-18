"use client";
import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col gap-[1.2rem] items-center justify-center bg-[#040404] z-50 min-h-screen">
      <video
        className="w-[70%] xs:w-[60%] sm:w-[50%] md:w-[40%] lg:w-[30%] object-cover"
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/loader.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
