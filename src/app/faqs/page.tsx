"use client";

import { cn } from "@/utils/cn";
import React, { useContext, useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

export default function FAQsPage() {
  return (
    <section className="my-sm sm:my-lg">
      <div className="container mt-12 mb-28">
        <h1 className="font-bold text-4xl text-white mb-8 text-center">FAQs</h1>

        <div className="space-y-4 max-w-3xl mx-auto">
          <Faq>
            <FaqHeader>Alcohol + Smoking Policies</FaqHeader>
            <FaqContent>
              Respectful alcohol consumption within legal limits and a
              smoke-free environment are our community priorities.
            </FaqContent>
          </Faq>
          <Faq>
            <FaqHeader>Locations</FaqHeader>
            <FaqContent>
              Discover designated spots upon payment for your convenience.
            </FaqContent>
          </Faq>
          <Faq>
            <FaqHeader>Inflation policies</FaqHeader>
            <FaqContent>
              We proactively manage and navigate inflation challenges through
              strategic cost management and thoughtful pricing adjustments to
              enhance your experience.
            </FaqContent>
          </Faq>
          <Faq>
            <FaqHeader>Transportation</FaqHeader>
            <FaqContent>
              Explore our commitment to efficient and reliable transportation
              services, outlining key measures and procedures for a smooth and
              enjoyable experience.
            </FaqContent>
          </Faq>
          <Faq>
            <FaqHeader>Security</FaqHeader>
            <FaqContent>
              Discover details about our robust security measures, ensuring a
              safe and secure environment for all.
            </FaqContent>
          </Faq>
          <Faq>
            <FaqHeader>Emergency</FaqHeader>
            <FaqContent>
              Discover details about our robust security measures, ensuring a
              safe and secure environment for all.
            </FaqContent>
          </Faq>
          <Faq>
            <FaqHeader>Tickets</FaqHeader>
            <FaqContent>
              Discover details about our robust security measures, ensuring a
              safe and secure environment for all.
            </FaqContent>
          </Faq>
          <p className="text-[#757575] text-center text-sm md:text-base">
            No answers to your question? No worries , you can always reach out.
          </p>
        </div>
      </div>
    </section>
  );
}

const FaqContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({ open: true, setOpen: () => {} });
function Faq({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <FaqContext.Provider value={{ open, setOpen }}>
      <div className="text-white max-w-3xl mx-auto bg-input-bg border border-[#333]">
        {children}
      </div>
    </FaqContext.Provider>
  );
}

function FaqHeader({ children }: { children: string }) {
  const { open, setOpen } = useContext(FaqContext);
  return (
    <div
      className="flex justify-between p-4 cursor-pointer"
      onClick={() => setOpen((v) => !v)}
    >
      <span>{children}</span>
      {open ? <FiMinus /> : <FiPlus />}
    </div>
  );
}

function FaqContent({ children }: { children: React.ReactNode }) {
  const { open } = useContext(FaqContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    contentRef.current?.style.setProperty(
      "--height",
      contentRef.current.clientHeight + "px"
    );
  }, []);
  return (
    <div
      ref={contentRef}
      className={cn(
        "p-4 h-0 hidden border-t border-[#333] text-sm ",
        open && `block h-auto`
      )}
    >
      {children}
    </div>
  );
}
