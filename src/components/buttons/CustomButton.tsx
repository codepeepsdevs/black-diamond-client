import { cn } from "@/utils/cn";
import React from "react";

const CustomButton: React.FC<{
  className?: string;
  content: any;
  onClick?: () => void;
  styles?: { [key: string]: string };
}> = ({ className = "", content, onClick = () => {}, styles }) => {
  return (
    <button
      className={cn(
        "button-transform flex bg-button-bg text-button-text items-center justify-center text-sm sm:text-base",
        className
      )}
      onClick={onClick}
      style={styles}
    >
      {content}
    </button>
  );
};

export default CustomButton;
