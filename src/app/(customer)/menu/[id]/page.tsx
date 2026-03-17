"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, ShoppingBag, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart-store";
import { menuItems, menuCategories } from "@/lib/data/menu";

export default function MenuDetailPage() {
  const params = useParams();
  const slug = params.id as string;
  const item = menuItems.find((m) => m.slug === slug);
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  // Variant selections
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedTemp, setSelectedTemp] = useState<string | null>(null);
  const [selectedSugar, setSelectedSugar] = useState<string | null>(null);
  const [selectedIce, setSelectedIce] = useState<string | null>(null);

  // Addons
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(
    new Set(),
  );

  // Quantity and notes
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  // Group variants by type
  const variantsByType = useMemo(() => {
    if (!item?.variants) return {};
    const groups: Record<string, typeof item.variants> = {};
    for (const v of item.variants) {
      if (!groups[v.type]) groups[v.type] = [];
      groups[v.type].push(v);
    }
    return groups;
  }, [item]);

  // Initialize default selections
  useMemo(() => {
    if (!item?.variants) return;
    for (const v of item.variants) {
      if (v.isDefault) {
        switch (v.type) {
          case "size":
            setSelectedSize((prev) => prev ?? v.id);
            break;
          case "temperature":
            setSelectedTemp((prev) => prev ?? v.id);
            break;
          case "sugar_level":
            setSelectedSugar((prev) => prev ?? v.id);
            break;
          case "ice_level":
            setSelectedIce((prev) => prev ?? v.id);
            break;
        }
      }
    }
  }, [item]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!item) return 0;
    let base = item.price;

    const allSelectedVariantIds = [
      selectedSize,
      selectedTemp,
      selectedSugar,
      selectedIce,
    ].filter(Boolean) as string[];
    for (const vId of allSelectedVariantIds) {
      const variant = item.variants?.find((v) => v.id === vId);
      if (variant) base += variant.priceAdjustment;
    }

    for (const aId of selectedAddonIds) {
      const addon = item.addons?.find((a) => a.id === aId);
      if (addon) base += addon.price;
    }

    return base * quantity;
  }, [
    item,
    selectedSize,
    selectedTemp,
    selectedSugar,
    selectedIce,
    selectedAddonIds,
    quantity,
  ]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) => {
      const next = new Set(prev);
      if (next.has(addonId)) {
        next.delete(addonId);
      } else {
        next.add(addonId);
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!item || !item.isAvailable) return;

    const allSelectedVariantIds = [
      selectedSize,
      selectedTemp,
      selectedSugar,
      selectedIce,
    ].filter(Boolean) as string[];
    const variants = allSelectedVariantIds
      .map((vId) => {
        const v = item.variants?.find((variant) => variant.id === vId);
        if (!v) return null;
        return {
          variantId: v.id,
          name: v.name,
          type: v.type,
          priceAdjustment: v.priceAdjustment,
        };
      })
      .filter(Boolean) as {
      variantId: string;
      name: string;
      type: string;
      priceAdjustment: number;
    }[];

    const addons = Array.from(selectedAddonIds)
      .map((aId) => {
        const a = item.addons?.find((addon) => addon.id === aId);
        if (!a) return null;
        return { addonId: a.id, name: a.name, price: a.price };
      })
      .filter(Boolean) as { addonId: string; name: string; price: number }[];

    addItem(item, quantity, variants, addons, notes || undefined);
    setCartOpen(true);
  };

  if (!item) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-200">
            <ShoppingBag
              className="h-8 w-8 text-coffee-400"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-brown-900">
            Item Not Found
          </h2>
          <p className="mt-1 text-sm text-brown-700/60">
            The menu item you are looking for does not exist.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-coffee-500 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-brown-700">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const category = menuCategories.find((c) => c.id === item.categoryId);

  const variantTypeLabels: Record<string, string> = {
    size: "Size",
    temperature: "Temperature",
    sugar_level: "Sugar Level",
    ice_level: "Ice Level",
  };

  const getSelectedForType = (type: string): string | null => {
    switch (type) {
      case "size":
        return selectedSize;
      case "temperature":
        return selectedTemp;
      case "sugar_level":
        return selectedSugar;
      case "ice_level":
        return selectedIce;
      default:
        return null;
    }
  };

  const setSelectedForType = (type: string, id: string) => {
    switch (type) {
      case "size":
        setSelectedSize(id);
        break;
      case "temperature":
        setSelectedTemp(id);
        break;
      case "sugar_level":
        setSelectedSugar(id);
        break;
      case "ice_level":
        setSelectedIce(id);
        break;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/menu"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brown-700/70 transition-colors duration-200 hover:text-coffee-500">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Back to Menu
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Image area */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="gradient-coffee flex h-[300px] items-center justify-center sm:h-[400px] lg:h-[500px]">
            <span className="text-lg font-medium text-cream-200/50 tracking-wider uppercase">
              {item.name}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {item.isBestSeller && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-3.5 py-1.5 text-xs font-semibold text-brown-900 shadow-md">
                Best Seller
              </span>
            )}
            {!item.isAvailable && (
              <span className="inline-flex items-center rounded-full bg-red-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          {/* Category tag */}
          {category && (
            <span className="mb-2 text-xs font-medium uppercase tracking-wider text-coffee-500">
              {category.name}
            </span>
          )}

          <h1 className="text-2xl font-bold text-brown-900 sm:text-3xl">
            {item.name}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-brown-700/70">
            {item.description}
          </p>

          {/* Rating and orders */}
          <div className="mt-4 flex items-center gap-4">
            {item.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
                <span className="text-sm font-semibold text-brown-900">
                  {item.rating}
                </span>
              </div>
            )}
            {item.totalOrders != null && (
              <span className="text-sm text-brown-700/60">
                {item.totalOrders.toLocaleString("id-ID")} orders
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mt-4">
            <span className="text-2xl font-bold text-coffee-600">
              {formatCurrency(item.price)}
            </span>
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-cream-200" />

          {/* Variant selectors */}
          {Object.entries(variantsByType).map(([type, variants]) => (
            <div key={type} className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-brown-900">
                {variantTypeLabels[type] ?? type}
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const isSelected = getSelectedForType(type) === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedForType(type, v.id)}
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                        isSelected
                          ? "bg-coffee-500 text-white shadow-sm shadow-coffee-500/20"
                          : "bg-white text-brown-700 ring-1 ring-cream-200 hover:bg-cream-100 hover:text-coffee-500",
                      )}>
                      {v.name}
                      {v.priceAdjustment !== 0 && (
                        <span className="ml-1 text-xs opacity-80">
                          ({v.priceAdjustment > 0 ? "+" : ""}
                          {formatCurrency(v.priceAdjustment)})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Add-on checkboxes */}
          {item.addons && item.addons.length > 0 && (
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-brown-900">
                Add-ons
              </label>
              <div className="flex flex-col gap-2">
                {item.addons.map((addon) => (
                  <label
                    key={addon.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200",
                      selectedAddonIds.has(addon.id)
                        ? "bg-coffee-500/10 ring-1 ring-coffee-400"
                        : "bg-white ring-1 ring-cream-200 hover:bg-cream-50",
                      !addon.isAvailable && "cursor-not-allowed opacity-50",
                    )}>
                    <input
                      type="checkbox"
                      checked={selectedAddonIds.has(addon.id)}
                      disabled={!addon.isAvailable}
                      onChange={() => toggleAddon(addon.id)}
                      className="h-4 w-4 rounded border-cream-300 text-coffee-500 accent-coffee-500 focus:ring-coffee-400"
                    />
                    <span className="flex-1 text-sm font-medium text-brown-900">
                      {addon.name}
                    </span>
                    <span className="text-sm text-coffee-600 font-medium">
                      +{formatCurrency(addon.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-brown-900">
              Quantity
            </label>
            <div className="inline-flex items-center rounded-lg bg-white ring-1 ring-cream-200">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-l-lg text-brown-700 transition-colors duration-200 hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Decrease quantity">
                <Minus className="h-4 w-4" strokeWidth={2} />
              </button>
              <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-brown-900 border-x border-cream-200">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                disabled={quantity >= 99}
                className="flex h-10 w-10 items-center justify-center rounded-r-lg text-brown-700 transition-colors duration-200 hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Increase quantity">
                <Plus className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-brown-900">
              Special Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests? e.g., less sugar, extra hot..."
              rows={3}
              className={cn(
                "w-full resize-none rounded-xl border-0 bg-white p-3 text-sm text-brown-900",
                "ring-1 ring-cream-200 placeholder:text-brown-700/40",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-coffee-400",
              )}
            />
          </div>

          {/* Total and Add to Cart */}
          <div className="mt-auto flex flex-col gap-4 rounded-xl bg-cream-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="block text-xs font-medium uppercase tracking-wider text-brown-700/60">
                Total Price
              </span>
              <span className="text-2xl font-bold text-coffee-600">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-semibold transition-all duration-200",
                item.isAvailable
                  ? "bg-coffee-500 text-white shadow-md shadow-coffee-500/20 hover:bg-brown-700 active:scale-95"
                  : "bg-cream-200 text-brown-700/40 cursor-not-allowed",
              )}>
              <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
