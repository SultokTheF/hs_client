import React from "react";
import { cn } from "@/shared/lib/cn";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-8 w-8 border-3",
} as const;

export const Loader: React.FC<Props> = ({ size = "md", className }) => {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent",
        "text-neon-500 dark:text-neon-500/80",
        sizeMap[size],
        className,
      )}
      style={{ borderTopColor: "transparent" }}
    />
  );
};

export default Loader;
