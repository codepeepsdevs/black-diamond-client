import React from "react";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";

const SuccessToast = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  toast.custom(
    (t) => (
      <div
        className={`max-w-md w-full bg-black border border-[#22c55e] border-l-[6px] pointer-events-auto ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <div className="flex items-start gap-3 px-4 py-4">
          <div className="flex-shrink-0 pt-0.5">
            <FiCheckCircle className="h-6 w-6 text-[#22c55e]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#22c55e] leading-5">{title}</p>
            <p className="text-sm text-[#22c55e] leading-5 mt-1">{description}</p>
          </div>
        </div>
      </div>
    ),
    { duration: 5000 }
  );
};

export default SuccessToast;
