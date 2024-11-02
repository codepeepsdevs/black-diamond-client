"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CgSoftwareUpload } from "react-icons/cg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { cn } from "@/utils/cn";
import { Next, Prev } from "../../../public/icons";

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
        "event-details-file-input bg-[#757575] p-[20px] h-96 text-center cursor-pointer mt-5 flex justify-center items-center relative"
        // for carousel
        // "[&_.carousel-root>*]:h-full"
      )}
    >
      <input {...getInputProps()} />
      <div className="bg-[#EEEDF2] text-[#3659E3] size-32 rounded-md grid place-items-center text-sm">
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
        <div className="absolute inset-0 opacity-25">
          <Carousel
            autoPlay
            infiniteLoop
            autoFocus
            showStatus={false}
            interval={5000}
            transitionTime={5000}
            showIndicators={false}
            renderArrowNext={(clickHandler, hasNext) => {
              return null;
              return (
                hasNext && (
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-[9] cursor-pointer w-8 lg:w-10"
                    onClick={clickHandler}
                  >
                    <Image className="h-full " src={Next} alt="next" />
                  </div>
                )
              );
            }}
            renderArrowPrev={(clickHandler, hasPrev) => {
              return null;
              return (
                hasPrev && (
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-[9] cursor-pointer w-8 lg:w-10"
                    onClick={clickHandler}
                  >
                    <Image className="h-full " src={Prev} alt="prev" />
                  </div>
                )
              );
            }}
          >
            {imagesPreview.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt=""
                fill
                className="object-cover"
              />
            ))}
          </Carousel>
        </div>
      )}
      {/* END IMAGE PREVIEW */}
    </div>
  );
};

export default EventImagesInputField;
