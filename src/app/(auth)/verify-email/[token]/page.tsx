"use client";
import { useConfirmEmail } from "@/api/auth/auth.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const VerifyEmail = () => {
  const params = useParams<{ token: string }>();
  const router = useRouter();

  const { data, refetch, status, error } = useConfirmEmail(params.token);

  useEffect(() => {
    console.log(error);
    const verify = async () => {
      await refetch();
      if (error) {
        ErrorToast({
          title: "Verification Failed",
          descriptions: [
            error?.message || "Error verifying email, please try again",
          ],
        });
        router.replace("/login");
      } else {
        router.replace("/login");
        SuccessToast({
          title: "Email successfully confirmed",
          description: "Login to explore more",
        });
      }
    };

    verify();
  }, [error]);

  return (
    <div className="fixed inset-0 flex flex-col gap-[1.2rem] items-center justify-center bg-black z-50 min-h-screen">
      <video
        className="w-[30%] object-cover"
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/loader.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VerifyEmail;
