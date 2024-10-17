import React from "react";
import toast from "react-hot-toast";
import { PiWarningCircleBold } from "react-icons/pi";

const ErrorToast = ({
  title,
  descriptions,
}: {
  title: string;
  descriptions: string[];
}) => {
  toast.custom(
    (t) => (
      <div
        className={`max-w-md w-full bg-[#333333] shadow-lg rounded-lg pointer-events-auto flex flex-col ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <div className="w-full px-3 sm:px-4 py-1 sm:py-2">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <PiWarningCircleBold className="h-4 sm:h-6 w-4 sm:w-6 text-red-500" />
            </div>
            <div className="ml-2 sm:ml-3 ">
              <p className="text-base sm:text-lg font-medium text-red-500">
                {title}
              </p>
              {descriptions.map((description, index) => (
                <p key={index} className="text-sm sm:text-base text-white">
                  {description}{" "}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end px-3 sm:px-4 py-1 sm:py-2 w-full ">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-white text-sm sm:text-base"
          >
            Dismiss
          </button>
        </div>
      </div>
    ),
    { duration: 3000 }
  );
};

export default ErrorToast;
