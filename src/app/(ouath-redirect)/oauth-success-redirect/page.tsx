"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/shared/Loader/Loader";

const OAuthSuccessRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use this to get query params

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (accessToken) {
      Cookies.set("accessToken", accessToken, { expires: 7 });
      router.push("/tickets");
    }
  }, [searchParams, router]);

  return (
    <div className="h-screen">
      <Loader />
    </div>
  );
};

export default OAuthSuccessRedirect;
