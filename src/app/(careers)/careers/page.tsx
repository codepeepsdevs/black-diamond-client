"use client";

import { CareersHero, PromoterSection } from "@/components";
import CareersIntro from "@/components/careersPage/CareersIntro";
import WhatToDoSection from "@/components/careersPage/WhatToDoSection";
import React, { useState } from "react";

const Careers = () => {
  return (
    <>
      <div className="flex flex-col gap-12 pb-10 mt-24">
        <CareersIntro />
        {/* <CareersHero /> */}

        <div className="relative w-full bg-[#000000] overflow-hidden max-w-fit mx-auto">
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
          <h2 className="font-ibmplexsans uppercase flex flex-col gap-y-1 w-full text-5xl sm:text-6xl font-bold text-white text-center bg-black mix-blend-multiply">
            <span>Become</span>
            <span>a</span>
            <span>promoter</span>
          </h2>
        </div>
        <PromoterSection />
        {/* <WhatToDoSection /> */}
      </div>
    </>
  );
};

export default Careers;
