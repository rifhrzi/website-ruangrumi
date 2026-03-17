"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Minus, Plus } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { usePosStore } from "@/lib/stores/pos-store";
import type { CartItem, MenuItemVariant } from "@/lib/types";

export default function VariantModal() {
  const item = usePosStore((s) => s.variantModalItem);
  const closeVariantModal = usePosStore((s) => s.closeVariantModal);
  const addItem = usePosStore((s) => s.addItem);

  const variants = item?.variants ?? [];
  const addons = item?.addons ?? [];

  // Group variants by type
  const variantGroups = useMemo(() => {
    const groups: Record<string, MenuItemVariant[]> = {};
    for (const v of variants) {
      if (!groups[v.type]) groups[v.type] = [];
      groups[v.type].push(v);
    }
    return groups;
  }, [variants]);

  // Initialize selected variants with defaults
  const [selectedVariants, setSelectedVariants] = useState<
    CartItem["selectedVariants"]
  >([]);
  const [selectedAddons, setSelectedAddons] = useState<
    CartItem["selectedAddons"]
  >([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  // Reset when item changes
  useEffect(() => {
    if (!item) return;
    const defaults = (item.variants ?? [])
      .filter((v) => v.isDefault)
      .map((v) => ({
        variantId: v.id,
        name: v.name,
        type: v.type,
        priceAdjustment: v.priceAdjustment,
      }));
    setSelectedVariants(defaults);
    setSelectedAddons([]);
    setQuantity(1);
    setNotes("");
  }, [item]);

  if (!item) return null;

  const selectVariant = (variant: MenuItemVariant) => {
    setSelectedVariants((prev) => {
      const filtered = prev.filter((v) => v.type !== variant.type);
      return [
        ...filtered,
        {
          variantId: variant.id,
          name: variant.name,
          type: variant.type,
          priceAdjustment: variant.priceAdjustment,
        },
      ];
    });
  };

  const toggleAddon = (addon: (typeof addons)[number]) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.addonId === addon.id);
      if (exists) return prev.filter((a) => a.addonId !== addon.id);
      return [
        ...prev,
        { addonId: addon.id, name: addon.name, price: addon.price },
      ];
    });
  };

  const variantExtra = selectedVariants.reduce(
    (sum, v) => sum + v.priceAdjustment,
    0,
  );
  const addonExtra = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const lineTotal = (item.price + variantExtra + addonExtra) * quantity;

  const handleAdd = () => {
    addItem(
      item,
      quantity,
      selectedVariants,
      selectedAddons,
      notes || undefined,
    );
    closeVariantModal();
  };

  const TYPE_LABELS: Record<string, string> = {
    temperature: "Temperature",
    size: "Size",
    sugar_level: "Sugar Level",
    ice_level: "Ice Level",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-sm"
        onClick={closeVariantModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-xl border border-cream-200 bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label={`Customize ${item.name}`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
            <div>
              <h3 className="text-base font-bold text-brown-900">
                {item.name}
              </h3>
              <p className="text-sm text-charcoal-700/60">
                {formatCurrency(item.price)}
              </p>
            </div>
            <button
              type="button"
              onClick={closeVariantModal}
              className="rounded-full p-1.5 text-charcoal-700/50 transition-colors hover:bg-cream-100 hover:text-charcoal-700"
              aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-5">
            {/* Variant groups */}
            {Object.entries(variantGroups).map(([type, typeVariants]) => (
              <div key={type}>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  {TYPE_LABELS[type] ?? type}
                </label>
                <div className="flex flex-wrap gap-2">
                  {typeVariants.map((v) => {
                    const isSelected = selectedVariants.some(
                      (sv) => sv.variantId === v.id,
                    );
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => selectVariant(v)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                          isSelected
                            ? "border-coffee-500 bg-coffee-500/10 text-coffee-600"
                            : "border-cream-200 bg-cream-50 text-charcoal-700 hover:border-coffee-300",
                        )}>
                        {v.name}
                        {v.priceAdjustment > 0 && (
                          <span className="ml-1 text-xs text-charcoal-700/50">
                            +{formatCurrency(v.priceAdjustment)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Addons */}
            {addons.length > 0 && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Add-ons
                </label>
                <div className="space-y-2">
                  {addons.map((addon) => {
                    const isSelected = selectedAddons.some(
                      (a) => a.addonId === addon.id,
                    );
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        disabled={!addon.isAvailable}
                        onClick={() => toggleAddon(addon)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors",
                          !addon.isAvailable && "opacity-40 cursor-not-allowed",
                          isSelected
                            ? "border-coffee-500 bg-coffee-500/10"
                            : "border-cream-200 bg-cream-50 hover:border-coffee-300",
                        )}>
                        <span
                          className={cn(
                            "font-medium",
                            isSelected
                              ? "text-coffee-600"
                              : "text-charcoal-700",
                          )}>
                          {addon.name}
                        </span>
                        <span className="text-xs text-charcoal-700/60">
                          +{formatCurrency(addon.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., less sugar, extra hot..."
                className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-cream-200 px-5 py-4 space-y-3">
            {/* Quantity */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-charcoal-700/70">
                Quantity
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-cream-200 text-charcoal-700 transition-colors hover:bg-cream-50">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-brown-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-cream-200 text-charcoal-700 transition-colors hover:bg-cream-50">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add button */}
            <button
              type="button"
              onClick={handleAdd}
              className="w-full rounded-lg bg-coffee-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brown-700 active:scale-[0.98]">
              Add to Order &mdash; {formatCurrency(lineTotal)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
