"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart-store";

export default function CartSidebar() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, setCartOpen]);

  const itemCount = getItemCount();
  const subtotal = getTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-brown-900/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col bg-cream-50 shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag
              className="h-5 w-5 text-coffee-500"
              strokeWidth={1.8}
            />
            <h2 className="text-lg font-bold text-brown-900">Your Cart</h2>
            {itemCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-coffee-500 px-1.5 text-xs font-semibold text-white">
                {itemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="rounded-full p-1.5 text-brown-700 transition-colors duration-200 hover:bg-cream-200 hover:text-coffee-500"
            aria-label="Close cart">
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-200">
                <ShoppingBag
                  className="h-8 w-8 text-coffee-400"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-brown-900">
                Your cart is empty
              </h3>
              <p className="mt-1 text-sm text-brown-700/60 text-center">
                Browse our menu and add your favorite items.
              </p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="mt-4 rounded-full bg-coffee-500 px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-brown-700">
                Browse Menu
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((cartItem) => {
                const variantSummary = cartItem.selectedVariants
                  .map((v) => v.name)
                  .join(", ");
                const addonSummary = cartItem.selectedAddons
                  .map((a) => a.name)
                  .join(", ");
                const detailParts = [variantSummary, addonSummary].filter(
                  Boolean,
                );

                return (
                  <li
                    key={cartItem.id}
                    className="flex gap-3 rounded-xl bg-white p-3 ring-1 ring-cream-200">
                    {/* Image placeholder */}
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                      <div className="gradient-coffee h-full w-full" />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col min-w-0">
                      <h4 className="truncate text-sm font-semibold text-brown-900">
                        {cartItem.menuItem.name}
                      </h4>
                      {detailParts.length > 0 && (
                        <p className="mt-0.5 truncate text-xs text-brown-700/60">
                          {detailParts.join(" + ")}
                        </p>
                      )}
                      {cartItem.notes && (
                        <p className="mt-0.5 truncate text-xs italic text-brown-700/40">
                          Note: {cartItem.notes}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Quantity controls */}
                        <div className="inline-flex items-center rounded-md bg-cream-100 ring-1 ring-cream-200">
                          <button
                            type="button"
                            onClick={() =>
                              cartItem.quantity > 1
                                ? updateQuantity(
                                    cartItem.id,
                                    cartItem.quantity - 1,
                                  )
                                : removeItem(cartItem.id)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-l-md text-brown-700 transition-colors duration-150 hover:bg-cream-200"
                            aria-label="Decrease quantity">
                            <Minus className="h-3 w-3" strokeWidth={2} />
                          </button>
                          <span className="flex h-7 w-8 items-center justify-center text-xs font-semibold text-brown-900 border-x border-cream-200">
                            {cartItem.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(cartItem.id, cartItem.quantity + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-r-md text-brown-700 transition-colors duration-150 hover:bg-cream-200"
                            aria-label="Increase quantity">
                            <Plus className="h-3 w-3" strokeWidth={2} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-bold text-coffee-600">
                          {formatCurrency(cartItem.subtotal)}
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeItem(cartItem.id)}
                      className="shrink-0 self-start rounded-full p-1.5 text-brown-700/40 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove ${cartItem.menuItem.name} from cart`}>
                      <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream-200 px-5 py-4">
            {/* Subtotal */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-brown-700/70">
                Subtotal
              </span>
              <span className="text-lg font-bold text-brown-900">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="flex w-full items-center justify-center rounded-full border border-coffee-500 px-4 py-2.5 text-sm font-semibold text-coffee-500 transition-all duration-200 hover:bg-coffee-500 hover:text-white">
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-coffee-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-coffee-500/20 transition-all duration-200 hover:bg-brown-700">
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
