import { settings } from "@/constants/react-slick";
import Image from "next/image";
import React from "react";
import Slider from "react-slick";
import {
  CareersIntroSlide1,
  CareersIntroSlide2,
  CareersIntroSlide3,
  CareersIntroSlide4,
  CareersIntroSlide5,
  CareersIntroSlide6,
} from "../../../public/images/careersPages";

export default function CareersIntro() {
  return (
    <Slider {...settings}>
      <Image
        className="max-h-[calc(100vh_-_120px)]"
        src={CareersIntroSlide1}
        alt="Careers Intro Image"
        priority
        objectFit="cover"
        quality={100}
      />
      <Image
        className="max-h-[calc(100vh_-_120px)]"
        src={CareersIntroSlide2}
        alt="Careers Intro Image"
        priority
        objectFit="cover"
        quality={100}
      />
      <Image
        className="max-h-[calc(100vh_-_120px)]"
        src={CareersIntroSlide3}
        alt="Careers Intro Image"
        priority
        objectFit="cover"
        quality={100}
      />
      <Image
        className="max-h-[calc(100vh_-_120px)]"
        src={CareersIntroSlide4}
        alt="Careers Intro Image"
        priority
        objectFit="cover"
        quality={100}
      />
      <Image
        className="max-h-[calc(100vh_-_120px)]"
        src={CareersIntroSlide5}
        alt="Careers Intro Image"
        priority
        objectFit="cover"
        quality={100}
      />
      <Image
        className="max-h-[calc(100vh_-_120px)]"
        src={CareersIntroSlide6}
        alt="Careers Intro Image"
        priority
        objectFit="cover"
        quality={100}
      />
    </Slider>
  );
}
