"use client";
import LoadingSvg from "@/components/shared/Loader/LoadingSvg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { removeHeaderToken } from "@/utils/axios-utils";

const Logout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    setLoading(true);
    Cookies.remove("accessToken");
    await Promise.all([queryClient.clear()]);
    removeHeaderToken();
    router.replace("/");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[99]">
      <div className="p-4 sm:p-10 bg-[#151515] rounded-md w-[300px] md:w-[500px] text-center overflow-y-auto z-10 text-white">
        <span className="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-4 border-yellow-50 bg-yellow-100 text-yellow-500">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
          </svg>
        </span>

        <h3 className="mb-2 text-2xl font-bold">Sign out</h3>
        <p className="">
          Are you sure you would like to sign out of your account?
        </p>

        <div className="mt-6 flex justify-center gap-x-4">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-red-500 text-white shadow-sm align-middle hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-sm"
          >
            {loading ? <LoadingSvg /> : "Log out"}
          </button>
          <button
            type="button"
            className="w-full py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-green-500 text-white hover:opacity-90 focus:outline-none focus:ring-2 transition-all text-sm"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
