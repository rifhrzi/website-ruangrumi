"use client";

import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const subtotal = getTotal();
  const taxRate = 0.11;
  const serviceChargeRate = 0.05;
  const tax = Math.round(subtotal * taxRate);
  const serviceCharge = Math.round(subtotal * serviceChargeRate);
  const total = subtotal + tax + serviceCharge;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-200">
            <ShoppingBag
              className="h-10 w-10 text-coffee-400"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-brown-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-base text-brown-700/60 max-w-sm">
            Looks like you have not added anything to your cart yet. Browse our
            menu to find something you love.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-coffee-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-coffee-500/20 transition-all duration-200 hover:bg-brown-700">
            <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brown-900 sm:text-3xl">
            Your Cart
          </h1>
          <p className="mt-1 text-sm text-brown-700/60">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:border-red-300">
          <Trash2 className="h-4 w-4" strokeWidth={1.8} />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
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
                <div
                  key={cartItem.id}
                  className="flex gap-4 rounded-xl bg-white p-4 ring-1 ring-cream-200 transition-shadow duration-200 hover:shadow-sm">
                  {/* Image placeholder */}
                  <div className="hidden h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:block">
                    <div className="gradient-coffee h-full w-full" />
                  </div>

                  {/* Item details */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-brown-900">
                          {cartItem.menuItem.name}
                        </h3>
                        {detailParts.length > 0 && (
                          <p className="mt-0.5 text-sm text-brown-700/60">
                            {detailParts.join(" + ")}
                          </p>
                        )}
                        {cartItem.notes && (
                          <p className="mt-0.5 text-sm italic text-brown-700/40">
                            Note: {cartItem.notes}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(cartItem.id)}
                        className="shrink-0 rounded-full p-1.5 text-brown-700/40 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${cartItem.menuItem.name}`}>
                        <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      {/* Quantity controls */}
                      <div className="inline-flex items-center rounded-lg bg-cream-50 ring-1 ring-cream-200">
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
                          className="flex h-9 w-9 items-center justify-center rounded-l-lg text-brown-700 transition-colors duration-150 hover:bg-cream-200"
                          aria-label="Decrease quantity">
                          <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                        <span className="flex h-9 w-10 items-center justify-center text-sm font-semibold text-brown-900 border-x border-cream-200">
                          {cartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(cartItem.id, cartItem.quantity + 1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-r-lg text-brown-700 transition-colors duration-150 hover:bg-cream-200"
                          aria-label="Increase quantity">
                          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="text-base font-bold text-coffee-600">
                        {formatCurrency(cartItem.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue shopping link */}
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-coffee-500 transition-colors duration-200 hover:text-brown-700">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl bg-white p-6 ring-1 ring-cream-200 shadow-sm">
            <h2 className="text-lg font-bold text-brown-900 mb-5">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brown-700/70">Subtotal</span>
                <span className="font-medium text-brown-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brown-700/70">Tax (11%)</span>
                <span className="font-medium text-brown-900">
                  {formatCurrency(tax)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brown-700/70">Service Charge (5%)</span>
                <span className="font-medium text-brown-900">
                  {formatCurrency(serviceCharge)}
                </span>
              </div>

              <div className="my-2 h-px bg-cream-200" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-brown-900">
                  Total
                </span>
                <span className="text-xl font-bold text-coffee-600">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-coffee-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-coffee-500/20 transition-all duration-200 hover:bg-brown-700">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
