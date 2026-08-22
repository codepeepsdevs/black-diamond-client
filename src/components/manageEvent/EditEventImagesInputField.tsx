"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CgSoftwareUpload } from "react-icons/cg";
import { cn } from "@/utils/cn";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

const EditEventImagesInputField: React.FC<{
  // watchedImages: File[] | null;
  onSelectFile: (file: File[]) => void;
  imagesPreview: string[] | null;
  setImagesPreview: React.Dispatch<React.SetStateAction<string[] | null>>;
  disabled?: boolean;
}> = ({ onSelectFile, imagesPreview, setImagesPreview, disabled = false }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Handle the dropped files
      const newFilePreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagesPreview((prevPreviews) => {
        if (prevPreviews) {
          return [...prevPreviews, ...newFilePreviews];
        } else {
          return newFilePreviews;
        }
      });
      onSelectFile(acceptedFiles);
    },
    [onSelectFile, setImagesPreview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
    disabled,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          "event-details-file-input bg-[#757575] h-96 text-center flex justify-center items-center relative",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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
              <p>Add more photos</p>
            ) : (
              <p>Upload photos</p>
            )}
          </div>
        </div>

        {/* IMAGE PREVIEW */}
        {imagesPreview && (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              disableOnInteraction: false,
              delay: 1000,
            }}
            pagination={{ clickable: true }}
            loop={true}
            className="absolute inset-0 w-full h-full [&>.swiper-wrapper]:h-full opacity-25"
          >
            {imagesPreview.map((image, index) => (
              <SwiperSlide key={image}>
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
    </>
  );
};

export default EditEventImagesInputField;
