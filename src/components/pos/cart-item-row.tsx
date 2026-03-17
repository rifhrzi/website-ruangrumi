"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { usePosStore } from "@/lib/stores/pos-store";
import type { CartItem } from "@/lib/types";

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = usePosStore((s) => s.updateQuantity);
  const removeItem = usePosStore((s) => s.removeItem);
  const updateItemNotes = usePosStore((s) => s.updateItemNotes);

  const variantSummary = item.selectedVariants.map((v) => v.name).join(", ");
  const addonSummary = item.selectedAddons.map((a) => a.name).join(", ");
  const extras = [variantSummary, addonSummary].filter(Boolean).join(" + ");

  return (
    <div className="group rounded-lg border border-cream-200 bg-white p-3">
      {/* Name + Remove */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-brown-900 truncate">
            {item.menuItem.name}
          </p>
          {extras && (
            <p className="mt-0.5 text-xs text-charcoal-700/60 truncate">
              {extras}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="shrink-0 rounded-md p-1 text-charcoal-700/40 transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label={`Remove ${item.menuItem.name}`}>
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Notes */}
      {item.notes && (
        <p className="mt-1 text-xs italic text-charcoal-700/50 truncate">
          Note: {item.notes}
        </p>
      )}

      {/* Qty + Price */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md border text-sm transition-colors",
              item.quantity <= 1
                ? "border-red-200 text-red-400 hover:bg-red-50"
                : "border-cream-200 text-charcoal-700 hover:bg-cream-50",
            )}
            aria-label="Decrease quantity">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-semibold text-brown-900">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-cream-200 text-charcoal-700 transition-colors hover:bg-cream-50"
            aria-label="Increase quantity">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className="text-sm font-bold text-coffee-600">
          {formatCurrency(item.subtotal)}
        </span>
      </div>
    </div>
  );
}
