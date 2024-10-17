import React from "react";
import Image from "next/image";
import { Logo, Message } from "../../../public/icons";
import Socials from "../Socials";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="m-5 lg:mb-10 pt-10 text-xs lg:text-sm flex flex-col gap-12 text-text-color border-t border-[#151515]">
      <div className="flex flex-col gap-10 md:grid md:grid-cols-10">
        <div className="col-span-4 flex items-center gap-4">
          <Image
            className="cursor-pointer w-14 lg:w-16"
            src={Logo}
            alt="Logo"
          />

          <div className="flex flex-col gap-2">
            <h2>Buffalo New York</h2>

            <div className="flex items-center gap-2">
              <Image src={Message} alt="message icon" />
              <p>eventsbyblackdiamond@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="col-span-6 grid grid-cols-2">
          <div className="md:pl-6 lg:p-0 flex flex-col gap-3">
            <h1 className="text-white mb-2 font-semibold">Quick Links</h1>

            <Link href={"/terms"}>Terms & Conditions</Link>
            <Link href={"/privacy-policy"}>Privacy Policy</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-semibold">Social Links</h2>
            <Socials />
          </div>
        </div>
      </div>

      <div className="text-center">© 2024 BLACK DIAMOND</div>
    </div>
  );
};

export default Footer;
