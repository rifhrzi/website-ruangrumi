"use client";

import { ReceiptText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePosStore } from "@/lib/stores/pos-store";
import OrderTypeToggle from "./order-type-toggle";
import TableSelector from "./table-selector";
import CartItemRow from "./cart-item-row";
import PriceSummary from "./price-summary";
import PaymentMethodSelector from "./payment-method-selector";

interface OrderPanelProps {
  onProcessOrder: () => void;
}

export default function OrderPanel({ onProcessOrder }: OrderPanelProps) {
  const items = usePosStore((s) => s.items);
  const orderType = usePosStore((s) => s.orderType);
  const customerName = usePosStore((s) => s.customerName);
  const setCustomerName = usePosStore((s) => s.setCustomerName);
  const orderNotes = usePosStore((s) => s.orderNotes);
  const setOrderNotes = usePosStore((s) => s.setOrderNotes);
  const clearCart = usePosStore((s) => s.clearCart);
  const isProcessing = usePosStore((s) => s.isProcessing);
  const itemCount = usePosStore((s) => s.getItemCount());

  const canProcess = items.length > 0 && !isProcessing;

  return (
    <div className="flex h-full flex-col border-l border-cream-200 bg-white">
      {/* Header — always pinned at top */}
      <div className="shrink-0 border-b border-cream-200 p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-bold text-brown-900">Order</h2>
          {items.length > 0 && (
            <span className="rounded-full bg-coffee-500 px-2 py-0.5 text-xs font-semibold text-white">
              {itemCount} items
            </span>
          )}
        </div>
        <OrderTypeToggle />
      </div>

      {/* Scrollable body — everything scrolls together */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Table + Customer */}
        <div className="space-y-2 border-b border-cream-200 p-3">
          {orderType === "dine-in" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal-700/70">
                Table
              </label>
              <TableSelector />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal-700/70">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Walk-in Customer"
              className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-1.5 text-sm placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="p-3">
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-100">
                <ReceiptText
                  className="h-6 w-6 text-charcoal-700/30"
                  strokeWidth={1.5}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-brown-900">
                No items yet
              </p>
              <p className="mt-1 text-xs text-charcoal-700/50">
                Tap items from the menu to add them here.
              </p>
            </div>
          )}
        </div>

        {/* Summary + Payment + Actions */}
        {items.length > 0 && (
          <div className="space-y-2.5 border-t border-cream-200 bg-cream-50/50 p-3">
            <PriceSummary />

            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal-700/70">
                Payment Method
              </label>
              <PaymentMethodSelector />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal-700/70">
                Order Notes
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Optional notes..."
                className="w-full rounded-lg border border-cream-200 bg-white px-3 py-1.5 text-sm placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Process button — always pinned at bottom */}
      <div className="shrink-0 border-t border-cream-200 bg-white p-3">
        <div className="flex gap-2">
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="flex items-center gap-1.5 rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onProcessOrder}
            disabled={!canProcess}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
              canProcess
                ? "bg-coffee-500 text-white shadow-sm hover:bg-brown-700 active:scale-[0.98]"
                : "bg-cream-200 text-charcoal-700/40 cursor-not-allowed",
            )}>
            {isProcessing ? "Processing..." : "Process Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
