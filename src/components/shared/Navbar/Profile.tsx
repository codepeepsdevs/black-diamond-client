import { useGetUser } from "@/api/user/user.queries";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { TfiClose } from "react-icons/tfi";
import { isAdminOrViewer } from "@/utils/roleHelpers";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Profile = ({ isOpen, onClose }: ProfileModalProps) => {
  const userQuery = useGetUser();
  const userData = userQuery.data?.data;

  return (
    <div
      className={`z-50 xs:z-40 py-8 px-4 fixed top-0 right-0 h-full bg-black w-[80%] xs:w-[70%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] shadow-xl transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div
        onClick={onClose}
        className="flex items-center justify-end gap-2 sm:gap-2.5 mb-4 cursor-pointer"
      >
        <TfiClose className="text-lg sm:text-xl text-white" />
      </div>{" "}
      <div className="py-1 flex flex-col gap-1">
        <p className="relative text-white block px-4 py-2 text-sm">
          Signed in as <span className="">{userData?.email}</span>
          <span
            className={cn(
              "bg-[#333333] py-0.5 px-1 text-xs absolute right-0",
              !isAdminOrViewer(userData?.role || "") && "hidden"
            )}
          >
            {userData?.role}
          </span>
        </p>
      </div>
      <hr className="my-2 bg-[#333] border-0 h-[0.075rem]" />
      <div className="py-1" role="none">
        <Link
          href="/tickets"
          onClick={onClose}
          className="hover:opacity-70 text-white block px-4 py-2 text-sm"
          id="menu-item-3"
        >
          My Tickets{" "}
        </Link>
        <Link
          href="/settings"
          onClick={onClose}
          className="hover:opacity-70 text-white block px-4 py-2 text-sm"
          id="menu-item-2"
        >
          Account Settings
        </Link>
        {isAdminOrViewer(userData?.role || "") && (
          <Link
            href="/admin"
            onClick={onClose}
            className="hover:opacity-70 text-white block px-4 py-2 text-sm"
            id="menu-item-2"
          >
            Admin page
          </Link>
        )}

        <a
          href="mailto:eventsbyblackdiamond@gmail.com"
          onClick={onClose}
          className="hover:opacity-70 text-white block px-4 py-2 text-sm"
          id="menu-item-3"
        >
          Support
        </a>
      </div>
      <hr className="my-2 bg-[#333] border-0 h-[0.075rem]" />
      <div className="py-1">
        <Link
          href="/logout"
          onClick={onClose}
          className="hover:opacity-70 text-white block px-4 py-2 text-sm"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Profile;
