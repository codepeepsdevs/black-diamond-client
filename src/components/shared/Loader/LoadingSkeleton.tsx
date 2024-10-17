import { cn } from "@/utils/cn";
import { ComponentProps } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingSkeleton({
  className,
  ...props
}: ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton
      {...props}
      baseColor="#202020"
      highlightColor="#444"
      className={cn(className)}
    />
  );
}
