"use client";

import { Store, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePosStore } from "@/lib/stores/pos-store";

export default function OrderTypeToggle() {
  const orderType = usePosStore((s) => s.orderType);
  const setOrderType = usePosStore((s) => s.setOrderType);

  return (
    <div className="flex rounded-lg border border-cream-200 bg-cream-50 p-1">
      <button
        type="button"
        onClick={() => setOrderType("dine-in")}
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          orderType === "dine-in"
            ? "bg-coffee-500 text-white shadow-sm"
            : "text-charcoal-700 hover:bg-cream-100",
        )}>
        <Store className="h-4 w-4" aria-hidden="true" />
        Dine-in
      </button>
      <button
        type="button"
        onClick={() => setOrderType("takeaway")}
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          orderType === "takeaway"
            ? "bg-coffee-500 text-white shadow-sm"
            : "text-charcoal-700 hover:bg-cream-100",
        )}>
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
        Take Away
      </button>
    </div>
  );
}
