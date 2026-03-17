"use client";

import { Plus, Flame } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { usePosStore } from "@/lib/stores/pos-store";
import type { MenuItem } from "@/lib/types";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = usePosStore((s) => s.addItem);
  const openVariantModal = usePosStore((s) => s.openVariantModal);

  const hasOptions =
    (item.variants?.length ?? 0) > 0 || (item.addons?.length ?? 0) > 0;

  const handleClick = () => {
    if (!item.isAvailable) return;
    if (hasOptions) {
      openVariantModal(item);
    } else {
      addItem(item, 1, [], []);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!item.isAvailable}
      className={cn(
        "group relative flex flex-col rounded-xl border bg-white p-2.5 text-left transition-all duration-150",
        item.isAvailable
          ? "border-cream-200 shadow-sm hover:shadow-md hover:border-coffee-300 active:scale-[0.97]"
          : "border-cream-200 opacity-50 cursor-not-allowed",
      )}>
      {/* Compact gradient thumbnail */}
      <div className="relative mb-2 h-20 w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 gradient-coffee" />

        {/* Badges */}
        {item.isBestSeller && (
          <div className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-1.5 py-0.5">
            <Flame className="h-2.5 w-2.5 text-brown-900" aria-hidden="true" />
            <span className="text-[9px] font-bold text-brown-900">Best</span>
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-brown-900/50">
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              Sold Out
            </span>
          </div>
        )}

        {/* Add icon overlay */}
        {item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-brown-900/0 transition-colors group-hover:bg-brown-900/20">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-coffee-600 opacity-0 shadow transition-opacity group-hover:opacity-100">
              <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-xs font-semibold leading-tight text-brown-900 line-clamp-2">
        {item.name}
      </h3>

      {/* Price */}
      <p className="mt-auto pt-1 text-xs font-bold text-coffee-600">
        {formatCurrency(item.price)}
      </p>

      {/* Variant hint */}
      {hasOptions && item.isAvailable && (
        <span className="mt-0.5 text-[9px] text-charcoal-700/40">
          Customize
        </span>
      )}
    </button>
  );
}
