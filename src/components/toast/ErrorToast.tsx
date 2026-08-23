import React from "react";
import toast from "react-hot-toast";
import { FiAlertCircle, FiXCircle } from "react-icons/fi";

type ToastVariant = "error" | "info";

const ErrorToast = ({
  title,
  descriptions,
  variant = "error",
}: {
  title: string;
  descriptions: string[];
  variant?: ToastVariant;
}) => {
  const isError = variant === "error";
  const borderColor = isError ? "border-[#ff2d55]" : "border-white";
  const accentColor = isError ? "border-l-[#ff2d55]" : "border-l-white";
  const textColor = isError ? "text-[#ff2d55]" : "text-white";
  const Icon = isError ? FiXCircle : FiAlertCircle;

  toast.custom(
    (t) => (
      <div
        className={`max-w-md w-full bg-black border ${borderColor} border-l-[6px] ${accentColor} pointer-events-auto ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <div className="flex items-start gap-3 px-4 py-4">
          <div className="flex-shrink-0 pt-0.5">
            <Icon className={`h-6 w-6 ${textColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${textColor} leading-5`}>{title}</p>
            {descriptions.map((description, index) => (
              <p key={index} className={`text-sm ${textColor} leading-5 mt-1`}>
                {description}
              </p>
            ))}
          </div>
        </div>
      </div>
    ),
    { duration: 6000 }
  );
};

export default ErrorToast;
