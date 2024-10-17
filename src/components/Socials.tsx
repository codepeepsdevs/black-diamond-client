import React from "react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const Socials = () => {
  return (
    <div className="flex items-center gap-3 lg:gap-4">
      <a
        target="_blank"
        href="https://www.instagram.com/eventsbyblackdiamond?igsh=MzRlODBiNWFlZA=="
      >
        <FaInstagram
          className="text-white text-lg md:text-xl"
          cursor="pointer"
        />
      </a>
      <a target="_blank" href="">
        <FaXTwitter
          className="text-white text-lg md:text-xl"
          cursor="pointer"
        />
      </a>
    </div>
  );
};

export default Socials;
