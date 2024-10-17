import { cn } from "@/utils/cn";
import React, { HTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

export const FormError = ({
  error,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & {
  error: FieldError | undefined;
}) => {
  const body = error ? String(error.message) : children;

  return (
    <p className={cn("text-sm font-medium text-red-400", className)} {...props}>
      {body}
    </p>
  );
};
