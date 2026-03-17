"use client";

import { formatCurrency } from "@/lib/utils";
import { usePosStore } from "@/lib/stores/pos-store";

export default function PriceSummary() {
  const subtotal = usePosStore((s) => s.getSubtotal());
  const tax = usePosStore((s) => s.getTax());
  const serviceCharge = usePosStore((s) => s.getServiceCharge());
  const total = usePosStore((s) => s.getTotal());
  const orderType = usePosStore((s) => s.orderType);

  return (
    <div className="space-y-1.5 text-sm">
      <div className="flex justify-between text-charcoal-700/70">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-charcoal-700/70">
        <span>Tax (11%)</span>
        <span>{formatCurrency(tax)}</span>
      </div>
      {orderType === "dine-in" && (
        <div className="flex justify-between text-charcoal-700/70">
          <span>Service (5%)</span>
          <span>{formatCurrency(serviceCharge)}</span>
        </div>
      )}
      <div className="border-t border-cream-200 pt-2 flex justify-between font-bold text-brown-900 text-base">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
