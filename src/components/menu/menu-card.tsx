"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart-store";
import type { MenuItem } from "@/lib/types";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [imageError, setImageError] = useState(false);

  const hasImage = !!item.image && !imageError;

  const defaultVariants = (item.variants ?? [])
    .filter((v) => v.isDefault)
    .map((v) => ({
      variantId: v.id,
      name: v.name,
      type: v.type,
      priceAdjustment: v.priceAdjustment,
    }));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!item.isAvailable) return;
    addItem(item, 1, defaultVariants, []);
  };

  return (
    <Link
      href={`/menu/${item.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white",
        "shadow-sm shadow-brown-900/5 ring-1 ring-cream-200/80",
        "transition-all duration-300",
        "hover:shadow-xl hover:shadow-brown-900/8 hover:-translate-y-1.5",
        "hover:ring-cream-300",
        !item.isAvailable && "opacity-75",
      )}>
      {/* Image placeholder */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {hasImage ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 95vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <>
            <div className="absolute inset-0 gradient-coffee transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-cream-200/50 tracking-wider uppercase select-none">
                {item.name}
              </span>
            </div>
          </>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brown-900/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {item.isBestSeller && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-3 py-1 text-xs font-bold text-brown-900 shadow-md shadow-gold-500/20">
              Best Seller
            </span>
          )}
          {!item.isAvailable && (
            <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Rating badge */}
        {item.rating && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 shadow-sm">
            <Star
              className="h-3.5 w-3.5 fill-gold-400 text-gold-400"
              aria-hidden="true"
            />
            <span className="text-xs font-bold text-brown-800">
              {item.rating}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-brown-900 group-hover:text-coffee-500 transition-colors duration-200">
          {item.name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-brown-700/65 line-clamp-2">
          {item.description}
        </p>

        {/* Price and CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-cream-200/60 pt-4">
          <span className="text-lg font-bold text-coffee-600">
            {formatCurrency(item.price)}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              item.isAvailable
                ? "bg-coffee-500 text-white hover:bg-brown-700 active:scale-95 shadow-sm shadow-coffee-500/20"
                : "bg-cream-200 text-brown-700/40 cursor-not-allowed",
            )}
            aria-label={
              item.isAvailable
                ? `Add ${item.name} to cart`
                : `${item.name} is out of stock`
            }>
            <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
