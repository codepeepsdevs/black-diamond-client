"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CgSoftwareUpload } from "react-icons/cg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { cn } from "@/utils/cn";
import { Next, Prev } from "../../../public/icons";

const EditEventCoverImageInput: React.FC<{
  onSelectFile: (file: File) => void;
  prevCoverImage?: string;
}> = ({ onSelectFile, prevCoverImage = null }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    prevCoverImage
  );
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Handle the dropped files
      if (acceptedFiles.length > 0) {
        const filePreviews = URL.createObjectURL(acceptedFiles[0]);
        setImagePreview(filePreviews);
        onSelectFile(acceptedFiles[0]);
      }
    },
    [onSelectFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "event-details-file-input bg-[#757575] p-[20px] h-96 text-center cursor-pointer mt-5 flex justify-center items-center relative"
      )}
    >
      <input {...getInputProps()} />
      <div className="bg-[#EEEDF2] text-[#3659E3] size-32 rounded-md grid place-items-center text-sm">
        <div className="space-y-4">
          <div className="size-10 rounded-full bg-[#F8F7FA] grid place-items-center mx-auto">
            <CgSoftwareUpload className="text-2xl" />
          </div>
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : imagePreview ? (
            <p>Change uploaded cover image</p>
          ) : (
            <p>Upload photo</p>
          )}
        </div>
      </div>

      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className="absolute inset-0 opacity-50">
          <Image src={imagePreview} alt="" fill className="object-cover" />
        </div>
      )}
      {/* END IMAGE PREVIEW */}
    </div>
  );
};

export default EditEventCoverImageInput;
