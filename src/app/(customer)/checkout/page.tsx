"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  ShoppingBag,
  Truck,
  Banknote,
  QrCode,
  Building2,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, generateOrderCode } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart-store";

type OrderTypeOption = "dine-in" | "takeaway" | "delivery";
type PaymentMethodOption = "cash" | "qris" | "transfer" | "e-wallet";

const ORDER_TYPES: {
  value: OrderTypeOption;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    value: "dine-in",
    label: "Dine-in",
    icon: Store,
    description: "Enjoy your meal at our cafe",
  },
  {
    value: "takeaway",
    label: "Takeaway",
    icon: ShoppingBag,
    description: "Pack and take it with you",
  },
  {
    value: "delivery",
    label: "Delivery",
    icon: Truck,
    description: "Delivered to your doorstep",
  },
];

const PAYMENT_METHODS: {
  value: PaymentMethodOption;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "qris", label: "QRIS", icon: QrCode },
  { value: "transfer", label: "Bank Transfer", icon: Building2 },
  { value: "e-wallet", label: "E-Wallet", icon: Smartphone },
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [orderType, setOrderType] = useState<OrderTypeOption>("dine-in");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodOption>("qris");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotal();
  const taxRate = 0.11;
  const serviceChargeRate = orderType === "dine-in" ? 0.05 : 0;
  const tax = Math.round(subtotal * taxRate);
  const serviceCharge = Math.round(subtotal * serviceChargeRate);
  const total = subtotal + tax + serviceCharge;

  const canSubmit =
    customerName.trim().length > 0 &&
    customerPhone.trim().length > 0 &&
    items.length > 0;

  const handlePlaceOrder = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);

    const orderCode = generateOrderCode();

    // Simulate a brief delay for order processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    clearCart();
    router.push(`/order-success?code=${orderCode}`);
  };

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
            No items to checkout
          </h2>
          <p className="mt-2 text-base text-brown-700/60 max-w-sm">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-coffee-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-coffee-500/20 transition-all duration-200 hover:bg-brown-700">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brown-700/70 transition-colors duration-200 hover:text-coffee-500">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Back to Cart
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-brown-900 sm:text-3xl">
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <section className="rounded-xl bg-white p-6 ring-1 ring-cream-200">
            <h2 className="mb-5 text-lg font-bold text-brown-900">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-brown-900">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  className={cn(
                    "w-full rounded-xl border-0 bg-cream-50 px-4 py-2.5 text-sm text-brown-900",
                    "ring-1 ring-cream-200 placeholder:text-brown-700/40",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-coffee-400",
                  )}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-brown-900">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className={cn(
                    "w-full rounded-xl border-0 bg-cream-50 px-4 py-2.5 text-sm text-brown-900",
                    "ring-1 ring-cream-200 placeholder:text-brown-700/40",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-coffee-400",
                  )}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-brown-900">
                  Email{" "}
                  <span className="text-xs text-brown-700/40">(optional)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full rounded-xl border-0 bg-cream-50 px-4 py-2.5 text-sm text-brown-900",
                    "ring-1 ring-cream-200 placeholder:text-brown-700/40",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-coffee-400",
                  )}
                />
              </div>
            </div>
          </section>

          {/* Order Type */}
          <section className="rounded-xl bg-white p-6 ring-1 ring-cream-200">
            <h2 className="mb-5 text-lg font-bold text-brown-900">
              Order Type
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ORDER_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = orderType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setOrderType(type.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all duration-200",
                      isSelected
                        ? "bg-coffee-500/10 ring-2 ring-coffee-500 shadow-sm"
                        : "bg-cream-50 ring-1 ring-cream-200 hover:bg-cream-100 hover:ring-cream-300",
                    )}>
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        isSelected
                          ? "bg-coffee-500 text-white"
                          : "bg-cream-200 text-brown-700",
                      )}>
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isSelected ? "text-coffee-600" : "text-brown-900",
                      )}>
                      {type.label}
                    </span>
                    <span className="text-xs text-brown-700/60">
                      {type.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Payment Method */}
          <section className="rounded-xl bg-white p-6 ring-1 ring-cream-200">
            <h2 className="mb-5 text-lg font-bold text-brown-900">
              Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.value;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl p-4 transition-all duration-200",
                      isSelected
                        ? "bg-coffee-500/10 ring-2 ring-coffee-500 shadow-sm"
                        : "bg-cream-50 ring-1 ring-cream-200 hover:bg-cream-100 hover:ring-cream-300",
                    )}>
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        isSelected ? "text-coffee-500" : "text-brown-700/60",
                      )}
                      strokeWidth={1.8}
                    />
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isSelected ? "text-coffee-600" : "text-brown-900",
                      )}>
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-xl bg-white p-6 ring-1 ring-cream-200">
            <h2 className="mb-5 text-lg font-bold text-brown-900">
              Order Notes
            </h2>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Any special instructions for your order..."
              rows={3}
              className={cn(
                "w-full resize-none rounded-xl border-0 bg-cream-50 p-4 text-sm text-brown-900",
                "ring-1 ring-cream-200 placeholder:text-brown-700/40",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-coffee-400",
              )}
            />
          </section>
        </div>

        {/* Right column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl bg-white p-6 ring-1 ring-cream-200 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-brown-900">
              Order Summary
            </h2>

            {/* Items list */}
            <ul className="mb-5 flex flex-col gap-3">
              {items.map((cartItem) => (
                <li
                  key={cartItem.id}
                  className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-brown-900">
                      {cartItem.menuItem.name}
                    </p>
                    <p className="text-xs text-brown-700/60">
                      x{cartItem.quantity}
                      {cartItem.selectedVariants.length > 0 && (
                        <>
                          {" "}
                          &middot;{" "}
                          {cartItem.selectedVariants
                            .map((v) => v.name)
                            .join(", ")}
                        </>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-brown-900">
                    {formatCurrency(cartItem.subtotal)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="h-px bg-cream-200 mb-4" />

            {/* Totals */}
            <div className="flex flex-col gap-2.5">
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
              {serviceCharge > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brown-700/70">Service Charge (5%)</span>
                  <span className="font-medium text-brown-900">
                    {formatCurrency(serviceCharge)}
                  </span>
                </div>
              )}

              <div className="my-1 h-px bg-cream-200" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-brown-900">
                  Total
                </span>
                <span className="text-xl font-bold text-coffee-600">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Place Order button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={!canSubmit || isSubmitting}
              className={cn(
                "mt-6 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200",
                canSubmit && !isSubmitting
                  ? "bg-coffee-500 text-white shadow-md shadow-coffee-500/20 hover:bg-brown-700 active:scale-[0.98]"
                  : "bg-cream-200 text-brown-700/40 cursor-not-allowed",
              )}>
              {isSubmitting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>

            {!canSubmit && items.length > 0 && (
              <p className="mt-2 text-center text-xs text-brown-700/50">
                Please fill in your name and phone number.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
