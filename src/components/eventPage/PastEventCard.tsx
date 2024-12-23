"use client";

import React from "react";
import Image from "next/image";
import { Add, Minus } from "../../../public/icons";

const PastEventCard = () => {
  return (
    <div className="md:w-[300px] lg:w-[378px] bg-[#151515] border-2 border-[#333333] text-[#A3A7AA]">
      <div className="p-2 border-[#333333] border-b-2">
        <div className="flex justify-between items-center">
          <h3 className="text-white text-lg">Diamond</h3>
          {/* <div className="flex items-center gap-1">
            <Image className="cursor-pointer" src={Minus} alt="minus" />
            <h1>1</h1>
            <Image className="cursor-pointer" src={Add} alt="add" />
          </div> */}
        </div>
        <p className="text-sm">Sale ended</p>
      </div>
      <div className="p-2">
        <div className="flex justify-between items-center">
          <h3 className="text-white text-lg">General</h3>
          {/* <div className="flex items-center gap-2">
            <Image className="cursor-pointer" src={Minus} alt="minus" />
            <h1>1</h1>
            <Image className="cursor-pointer" src={Add} alt="add" />
          </div> */}
        </div>
        <p className="text-sm">Sale ended</p>
      </div>
    </div>
  );
};

export default PastEventCard;
