"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CgSoftwareUpload } from "react-icons/cg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { cn } from "@/utils/cn";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

const EventImagesInputField: React.FC<{
  onSelectFile: (file: File[]) => void;
}> = ({ onSelectFile }) => {
  const [imagesPreview, setImagesPreview] = useState<string[] | null>([]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Handle the dropped files
      const filePreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagesPreview(filePreviews);
      onSelectFile(acceptedFiles);
    },
    [onSelectFile, setImagesPreview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "event-details-file-input bg-[#757575] h-96 text-center cursor-pointer flex justify-center items-center relative"
        // for carousel
        // "[&_.carousel-root>*]:h-full"
      )}
    >
      <input {...getInputProps()} />
      <div className="bg-[#EEEDF2] text-[#3659E3] size-32 rounded-md grid place-items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
        <div className="space-y-4">
          <div className="size-10 rounded-full bg-[#F8F7FA] grid place-items-center mx-auto">
            <CgSoftwareUpload className="text-2xl" />
          </div>
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : imagesPreview ? (
            <p>Change selected photos</p>
          ) : (
            <p>Upload photos</p>
          )}
        </div>
      </div>

      {/* IMAGE PREVIEW */}
      {imagesPreview && (
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            disableOnInteraction: false,
            delay: 1000,
          }}
          loop={true}
          className="absolute inset-0 w-full h-full [&>.swiper-wrapper]:h-full opacity-25"
        >
          {imagesPreview.map((image, index) => (
            <SwiperSlide>
              <Image
                key={index}
                src={image}
                alt=""
                fill
                className="object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* END IMAGE PREVIEW */}
    </div>
  );
};

export default EventImagesInputField;
