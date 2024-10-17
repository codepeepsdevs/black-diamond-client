import React, { ComponentProps, ForwardedRef } from "react";
import { Input } from "..";
import { cn } from "@/utils/cn";

const IconInputField = React.forwardRef(function (
  {
    Icon,
    className,
    ...props
  }: ComponentProps<typeof Input> & { Icon: React.ReactNode },
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div
      className={cn(
        "flex items-center text-black bg-white pl-4 border-[#333333]",
        className,
        props.variant === "black"
          ? "bg-input-bg text-white"
          : "bg-white text-black"
      )}
    >
      {Icon}
      <Input
        ref={ref}
        className="bg-transparent text-black border-none focus:outline-none"
        {...props}
      />
    </div>
  );
});

IconInputField.displayName = "IconInputField";

export default IconInputField;

// export default function IconInputField({
//   Icon,
//   className,
//   ...props
// }: ComponentProps<"input"> & { Icon: React.ReactNode }) {
//   return (
//     <div
//       className={cn(
//         "flex items-center bg-white pl-4 border-[#333333]",
//         className
//       )}
//     >
//       {Icon}
//       <Input
//         {...props}
//         className="bg-transparent text-[#A3A7AA] border-none focus:outline-none"
//       />
//     </div>
//   );
// }
