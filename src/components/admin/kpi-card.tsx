import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "up" | "down";
  icon: ReactNode;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "yellow";
}

// ---------------------------------------------------------------------------
// Color presets for the icon background circle
// ---------------------------------------------------------------------------
const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-emerald-100", text: "text-emerald-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
  red: { bg: "bg-red-100", text: "text-red-600" },
  yellow: { bg: "bg-amber-100", text: "text-amber-600" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function KpiCard({
  title,
  value,
  change,
  changeType = "up",
  icon,
  color = "blue",
}: KpiCardProps) {
  const palette = COLOR_MAP[color] ?? COLOR_MAP.blue;

  return (
    <div className="flex items-center justify-between rounded-xl border border-cream-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Left: text content */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-charcoal-700/70">{title}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-brown-900">
          {value}
        </p>

        {change !== undefined && (
          <div className="mt-1.5 flex items-center gap-1">
            {changeType === "up" ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                changeType === "up" ? "text-emerald-600" : "text-red-600",
              )}>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-charcoal-700/50">vs yesterday</span>
          </div>
        )}
      </div>

      {/* Right: icon */}
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          palette.bg,
          palette.text,
        )}>
        {icon}
      </div>
    </div>
  );
}
