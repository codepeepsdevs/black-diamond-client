import { formatShareUrl } from "@/utils/utilityFunctions";
import React, { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { FiShare } from "react-icons/fi";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tab: string;
  eventId: string;
};

const ShareEventModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  tab,
  eventId,
}) => {
  const [copyState, setCopyState] = useState(false);
  let url = "";
  if (window) {
    url = `${window.location.protocol}//${window.location.host}/events/${tab}/${eventId}`;
  }
  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Black diamond entertainment event - Demini Party",
          text: `Check out this Upcoming Black diamond event`,
          url: url,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      alert("Native sharing is not supported on this browser.");
    }
  };

  const style = {
    borderRadius: 3,
    border: 0,
    width: "100%",
    boxShadow: "11px 10px 20px 5px #00000040",
    color: "black",
    padding: "1rem",
    cursor: "pointer",
  };
  if (!isOpen) return null;

  return (
    <div className="bg-black/70 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[999999] h-full items-center justify-center flex">
      <div className="relative p-4 w-full max-w-md h-auto md:h-auto">
        <div className="relative bg-[#333] text-white shadow">
          <div className="flex items-center justify-between px-5 pt-4">
            <p className="font-semibold text-xl">Share Event</p>
            <button
              type="button"
              onClick={() => {
                onClose();
                setCopyState(false);
              }}
              className=" bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center popup-close"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="#c6c7c7"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                ></path>
              </svg>
              <span className="sr-only">Close popup</span>
            </button>
          </div>

          <div className="p-5 flex flex-col gap-6">
            <div onClick={handleShareClick} className="py-1">
              <div className="flex justify-between items-center w-full">
                <span className="text-white flex gap-2 items-center w-full">
                  <FiShare className="text-white" /> Share Options
                </span>
                <BsChevronRight className="text-white" />
              </div>
            </div>
            <div className="py-1">
              <div className="flex justify-between items-center w-full">
                <span className="flex gap-2 items-center w-full">
                  <p> {formatShareUrl(url)}</p>
                </span>

                {copyState ? (
                  <p>Copied</p>
                ) : (
                  <p
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                      setCopyState(!copyState);
                    }}
                  >
                    Copy
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareEventModal;
