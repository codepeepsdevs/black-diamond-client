import Link from "next/link";
import { mobileNavItems } from "./data";
import { usePathname } from "next/navigation";
import { TfiClose } from "react-icons/tfi";
import useUserStore from "@/store/user.store";

type MenuModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Menu = ({ isOpen, onClose }: MenuModalProps) => {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

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
      <div className="py-1" role="none">
        {mobileNavItems.map((item, index) => {
          const isActive =
            item.url === "/"
              ? pathname === item.url
              : pathname.startsWith(item.url);

          const isLogin = item.url === "/login";
          const isLogout = item.url === "/logout";
          const isTickets = item.url === "/tickets";

          return (
            <Link
              key={index}
              href={item.url}
              onClick={onClose}
              className={`${isLogin && user ? "hidden" : ""} ${isTickets && !user ? "hidden" : ""} ${isLogout && !user ? "hidden" : ""} hover:opacity-70 block px-4 py-3 text-sm"
              id="menu-item-2 ${isActive ? "text-white" : "text-text-color"}`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
