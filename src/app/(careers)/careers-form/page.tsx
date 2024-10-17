"use client";

import { CareersFormSection } from "@/components";
import React from "react";

const CareersForm = () => {
  return (
    <div className="flex container flex-col md:flex-row items-start gap-6  justify-between py-24">
      <div className="w-full md:w-[40%] flex flex-col gap-2 text-white">
        <p className="text-sm opacity-80">JOIN US</p>

        <div>
          <h2 className="text-4xl font-bold">Interested in</h2>
          <h2 className="text-4xl font-bold"> working together?</h2>
        </div>
      </div>

      <div className="w-full md:w-[60%] py-0 md:py-10">
        <CareersFormSection />
      </div>
    </div>
  );
};

export default CareersForm;
