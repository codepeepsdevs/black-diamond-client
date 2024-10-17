"use client";

import React, { useState } from "react";
import classNames from "classnames";

interface GenderSectionProps {
  selectedGender: string;
  setSelectedGender: (value: string) => void;
}

const GenderSection: React.FC<GenderSectionProps> = ({
  selectedGender,
  setSelectedGender,
}) => {
  return (
    <div className="flex flex-col gap-5 text-white opacity-60">
      <h2>Gender</h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="male"
            value="male"
            onChange={() => setSelectedGender("Male")}
            checked={selectedGender === "Male"}
            className="hidden"
          />
          <label
            htmlFor="male"
            className={classNames({
              "w-5 h-5 rounded-full border-2 cursor-pointer border-[#757575] bg-black":
                true,
              "bg-white": selectedGender === "Male",
            })}
          ></label>
          <span>Male</span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="female"
            value="female"
            onChange={() => setSelectedGender("Female")}
            checked={selectedGender === "Female"}
            className="hidden"
          />
          <label
            htmlFor="female"
            className={classNames({
              "w-5 h-5 rounded-full border-2 cursor-pointer border-[#757575] bg-black":
                true,
              "bg-white": selectedGender === "Female",
            })}
          ></label>
          <span>Female</span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="other"
            value="other"
            onChange={() => setSelectedGender("Other")}
            checked={selectedGender === "Other"}
            className="hidden"
          />
          <label
            htmlFor="other"
            className={classNames({
              "w-5 h-5 rounded-full border-2 cursor-pointer border-[#757575] bg-black":
                true,
              "bg-white": selectedGender === "Other",
            })}
          ></label>
          <span>Other</span>
        </div>
      </div>
    </div>
  );
};

export default GenderSection;
