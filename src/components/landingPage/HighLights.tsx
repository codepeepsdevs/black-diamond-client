"use client";

import React from "react";
import RenderCarousel from "../shared/RenderCarousel";
import { carouselImages } from "../../../public/images";
import { useWindowsize } from "@/hooks";
import { motion } from "framer-motion";

const HighLights = () => {
  const width = useWindowsize();

  return (
    <motion.div
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, type: "tween" }}
      className="flex flex-col gap-4 px-4 lg:px-6"
    >
      <h2 className="text-base md:text-xl text-white font-semibold">
        Highlights
      </h2>

      <div className=" text-text-color md:px-2 h-[168px] md:h-[384px]">
        <RenderCarousel
          properties={{
            centerMode: true,
            centerSlidePercentage: width > 768 ? 45 : 70,
          }}
          imageStyles="px-1 md:px-2 w-[249px] md:w-full h-[166px] md:h-[384px]"
          carouselImages={carouselImages}
          variant="highlights"
        />
      </div>
    </motion.div>
  );
};

export default HighLights;
