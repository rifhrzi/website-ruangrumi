import { Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

export default function Logo({
  className,
  variant = "dark",
  size = "md",
}: LogoProps) {
  const sizeClasses = {
    sm: "gap-1.5",
    md: "gap-2",
    lg: "gap-2.5",
  };

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const isDark = variant === "dark";

  return (
    <span className={cn("inline-flex items-center", sizeClasses[size], className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-lg",
          size === "sm" ? "h-7 w-7" : size === "md" ? "h-8 w-8" : "h-9 w-9",
          isDark ? "bg-coffee-500 text-cream-50" : "bg-cream-50/15 text-cream-50"
        )}
      >
        <Coffee className={iconSizes[size]} strokeWidth={2} aria-hidden="true" />
      </span>
      <span
        className={cn(
          "font-bold tracking-tight",
          textSizes[size],
          isDark ? "text-brown-900" : "text-cream-50"
        )}
      >
        Ruang Rumi
      </span>
    </span>
  );
}
