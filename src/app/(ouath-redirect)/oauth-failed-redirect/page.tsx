"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthSubmitButton } from "@/components";
import { Logo } from "../../../../public/icons";

const OAuthFailedRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorMessage =
    searchParams.get("errorMessage") ||
    "Authentication failed. Please try again.";

  return (
    <div className="relative flex gap-1 xs:gap-4 flex-col justify-center items-center w-full h-screen py-12 xs:py-20 bg-primary ">
      <Link href="/">
        <Image className="cursor-pointer w-14 lg:w-16" alt="logo" src={Logo} />
      </Link>{" "}
      <div className="flex justify-center items-center w-[90%] xs:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] bg-black text-white rounded-lg xs:border xs:border-bg-700">
        <div className="w-full xs:w-[80%] py-4 xs:py-16 flex flex-col justify-center items-center gap-2.5">
          <div className=" flex flex-col gap-1.5 xl:gap-2 text-center">
            <h2 className="text-xl lg:text-2xl font-bold ">
              Authentication Failed
            </h2>
            <p className=" text-base lg:text-lg">{errorMessage}</p>
          </div>

          <div className="mt-8 w-full sm:w-[90%] flex flex-col justify-center items-center gap-4">
            <AuthSubmitButton
              onClick={() => {
                router.push("/login");
              }}
              type="button"
            >
              BACK TO LOGIN
            </AuthSubmitButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthFailedRedirect;
