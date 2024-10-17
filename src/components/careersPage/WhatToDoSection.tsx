"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WhatToDo } from "../../../public/images";
import { SuccessMark } from "../../../public/icons";
import CustomButton from "../buttons/CustomButton";

const WhatToDoSection = () => {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col md:flex-row justify-between gap-10 px-4 lg:px-6">
      {/* <Image className="w-[60%] md:w-fit" src={WhatToDo} alt="image" /> */}

      <div className="w-[40%] flex flex-col gap-6 text-white pt-10">
        <h2 className="text-3xl">What You’ll Do</h2>

        <div className="flex items-start gap-4 w-[80%]">
          <Image className="py-2" src={SuccessMark} alt="mark" />
          <p className="text-xs md:text-sm">
            Promote exciting events across social media and other platforms.
          </p>
        </div>
        <div className="flex items-start gap-4 w-[80%]">
          <Image className="py-2" src={SuccessMark} alt="mark" />
          <p className="text-xs md:text-sm">
            Engage with your network and drive ticket sales.
          </p>
        </div>
        <div className="flex items-start gap-4 w-[80%]">
          <Image className="py-2" src={SuccessMark} alt="mark" />
          <p className="text-xs md:text-sm">
            Be part of a vibrant community passionate about nightlife and
            entertainment.
          </p>
        </div>

        <div className="pt-5">
          <CustomButton
            className="text-white px-4 py-3 font-bold w-fit"
            onClick={() => router.push("/careers-form")}
            content="JOIN US"
          />
        </div>
      </div>
    </div>
  );
};

export default WhatToDoSection;
