"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CgSoftwareUpload } from "react-icons/cg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { cn } from "@/utils/cn";
import { Next, Prev } from "../../../public/icons";
import { FiTrash2 } from "react-icons/fi";

const EditEventCoverImageInput: React.FC<{
  onSelectFile: (file: File | undefined) => void;
  oldCoverImage: string | undefined;
}> = ({ onSelectFile, oldCoverImage }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  const removeImage = () => {
    onSelectFile(undefined);
    setImagePreview("");
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          "event-details-file-input bg-[#757575] p-[20px] h-96 text-center cursor-pointer flex justify-center items-center relative"
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
              <p>Change selected photo</p>
            ) : (
              <p>Upload photo</p>
            )}
          </div>
        </div>

        {/* IMAGE PREVIEW */}
        <div className="absolute inset-0 opacity-25">
          {imagePreview ? (
            <Image src={imagePreview} alt="" fill className="object-cover" />
          ) : (
            oldCoverImage && (
              <Image src={oldCoverImage} alt="" fill className="object-cover" />
            )
          )}
        </div>
        {/* END IMAGE PREVIEW */}
      </div>

      <div className="flex justify-start mt-5 gap-x-2">
        {/* COVER IMAGE PREVIEW */}
        {oldCoverImage && (
          <div className="w-36 h-32 relative">
            <Image
              src={oldCoverImage}
              alt=""
              fill
              quality={100}
              className="object-fill"
            />
          </div>
        )}
        {/* END COVER IMAGE PREVIEW */}
        {/* IMAGE PREVIEW */}
        {imagePreview && (
          <div className="w-36 h-32 relative">
            <Image
              src={imagePreview}
              alt=""
              fill
              quality={100}
              className="object-fill"
            />

            <button
              type="button"
              className="absolute top-2 right-2 bg-black text-red-500 text-lg p-0.5 border border-[#c0c0c0]"
              onClick={() => removeImage()}
            >
              <FiTrash2 />
            </button>
          </div>
        )}
        {/* END IMAGE PREVIEW */}
      </div>
    </>
  );
};

export default EditEventCoverImageInput;
