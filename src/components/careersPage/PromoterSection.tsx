"use client";
import React from "react";
import Image from "next/image";
import { PromoterImage } from "../../../public/images/careersPages";
import {
  CareersEarn,
  CareersExclusive,
  CareersGrow,
  SuccessMark,
} from "../../../public/icons";
import CustomButton from "../buttons/CustomButton";
import { useRouter } from "next/navigation";

const PromoterSection = () => {
  const router = useRouter();

  return (
    <div className="text-white px-4 lg:px-6">
      <div className="w-full flex flex-col-reverse md:flex-row">
        <div className="w-full md:w-[60%] flex flex-col gap-4 pt-6">
          <div className="flex items-start gap-4">
            <Image src={CareersEarn} alt="earn icon" />
            <div className="flex flex-col gap-2">
              <h3 className="text-lg leading-none">Earn commissions</h3>
              <p className="opacity-60 text-xs md:text-sm">
                Get rewards for every ticket sold through your efforts, with
                generous commission rates.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Image src={CareersExclusive} alt="exclusive icon" />
            <div className="flex flex-col gap-2">
              <h3 className="text-lg leading-none">Exclusive event access</h3>
              <p className="opacity-60 text-xs md:text-sm">
                Enjoy VIP access to the hottest parties and events, plus perks
                like free entry and backstage passes.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Image src={CareersGrow} alt="Grow icon" />
            <div className="flex flex-col gap-2">
              <h3 className="text-lg leading-none">Grow your network</h3>
              <p className="opacity-60 text-xs md:text-sm">
                Build valuable connections in the entertainment industry while
                boosting your personal brand and influence.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-white pt-6">
            <h2 className="font-lora text-2xl font-bold">What You’ll Do</h2>

            <div className="flex items-start gap-4">
              <Image className="py-2" src={SuccessMark} alt="mark" />
              <p className="text-sm md:text-lg">
                Promote exciting events across social media and other platforms.
              </p>
            </div>
            <div className="flex items-start gap-4 ">
              <Image className="py-2" src={SuccessMark} alt="mark" />
              <p className="text-sm md:text-lg">
                Engage with your network and drive ticket sales.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Image className="py-2" src={SuccessMark} alt="mark" />
              <p className="text-sm md:text-lg">
                Be part of a vibrant community passionate about nightlife and
                entertainment.
              </p>
            </div>
          </div>

          <div className="pt-5">
            <CustomButton
              className="text-white px-4 py-3 font-bold w-fit"
              onClick={() => router.push("/careers-form")}
              content="JOIN US"
            />
          </div>
        </div>

        <div className="w-full md:w-[40%]">
          <Image className="w-full" src={PromoterImage} alt="promoter image" />
        </div>
      </div>
    </div>
  );
};

export default PromoterSection;
