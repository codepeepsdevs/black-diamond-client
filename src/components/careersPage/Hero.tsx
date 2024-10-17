"use client";

import React from "react";
import Image from "next/image";
import { CareersHero, CareersHero1 } from "../../../public/images";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { settings } from "@/constants/react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Hero = () => {
  const router = useRouter();

  return (
    <div className="h-screen relative">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 z-10"></div>
      <Slider {...settings}>
        <div key={1} className="relative w-full h-screen">
          <Image
            src={CareersHero}
            alt="Hero"
            layout="fill"
            objectFit="cover"
            style={{ objectPosition: "50% 25%" }}
            quality={100}
            className="z-0"
            priority
          />
        </div>

        <div key={2} className="relative w-full h-screen">
          <Image
            src={CareersHero1}
            alt="Hero"
            layout="fill"
            objectFit="cover"
            style={{ objectPosition: "50% 20%" }}
            quality={100}
            className="z-0"
            priority
          />
        </div>
      </Slider>

      <div className="text-white absolute inset-0 flex flex-col items-center justify-center top-10 z-10">
        <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] flex flex-col gap-3 md:gap-4 items-center">
          <p className="font-lora font-bold text-3xl md:text-4xl lg:text-5xl text-center">
            Join our team
          </p>

          <div className="opacity-70">
            <p className="text-sm md:text-base text-center leading-5">
              Join our team of vibrant promoters and help create unforgettable
              nights. Get rewarded while doing what you love connecting people
              and spreading the word about the hottest events in town.
            </p>
          </div>
          <button
            onClick={() => router.push("/careers-form")}
            className="w-fit border-none outline-none py-2 px-4 font-bold button-transform flex bg-button-bg items-center justify-center"
          >
            JOIN US
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
