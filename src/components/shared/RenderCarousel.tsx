"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { Next, Prev } from "../../../public/icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import classNames from "classnames";
import { cn } from "@/utils/cn";

interface RenderCarouselProps {
  carouselImages: string[] | StaticImageData[];
  properties?: {};
  imageStyles?: string;
  variant?: string;
  containerClassName?: string;
}

const RenderCarousel: React.FC<RenderCarouselProps> = ({
  imageStyles = "",
  carouselImages,
  properties,
  variant = "default",
  containerClassName,
}) => {
  return (
    <div className={cn("h-[168px] md:h-[384px]", containerClassName)}>
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        autoFocus
        showStatus={false}
        interval={5000}
        transitionTime={5000}
        showIndicators={false}
        renderArrowNext={(clickHandler, hasNext) =>
          hasNext && (
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer w-8 lg:w-10"
              onClick={clickHandler}
            >
              <Image className="h-full " src={Next} alt="next" />
            </div>
          )
        }
        renderArrowPrev={(clickHandler, hasPrev) =>
          hasPrev && (
            <div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer w-8 lg:w-10"
              onClick={clickHandler}
            >
              <Image className="h-full " src={Prev} alt="prev" />
            </div>
          )
        }
        {...properties}
      >
        {carouselImages.map((image, index) => (
          <Image
            key={index}
            className={classNames(imageStyles, "col-span-1 object-cover")}
            src={image}
            alt="explore events"
            width={1146}
            height={400}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default RenderCarousel;
