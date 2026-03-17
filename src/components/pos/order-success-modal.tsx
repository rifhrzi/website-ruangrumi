"use client";

import { CheckCircle, Printer, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SuccessOrder {
  orderCode: string;
  orderType: string;
  tableName: string | null;
  customerName: string;
  itemCount: number;
  total: number;
  paymentMethod: string;
}

interface OrderSuccessModalProps {
  order: SuccessOrder;
  onNewOrder: () => void;
}

export default function OrderSuccessModal({
  order,
  onNewOrder,
}: OrderSuccessModalProps) {
  const typeLabel =
    order.orderType === "dine-in"
      ? `Dine-in${order.tableName ? ` — ${order.tableName}` : ""}`
      : "Take Away";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-brown-900/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm rounded-xl border border-cream-200 bg-white p-6 shadow-2xl text-center"
          role="dialog"
          aria-modal="true"
          aria-label="Order placed successfully">
          {/* Check icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-9 w-9 text-green-600" />
          </div>

          <h3 className="mt-4 text-xl font-bold text-brown-900">
            Order Placed!
          </h3>

          {/* Order details */}
          <div className="mt-5 space-y-2 rounded-lg bg-cream-50 px-4 py-3 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal-700/60">Order Code</span>
              <span className="font-bold text-brown-900 font-mono">
                {order.orderCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-700/60">Type</span>
              <span className="text-brown-900">{typeLabel}</span>
            </div>
            {order.customerName && (
              <div className="flex justify-between">
                <span className="text-charcoal-700/60">Customer</span>
                <span className="text-brown-900">{order.customerName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-charcoal-700/60">Items</span>
              <span className="text-brown-900">{order.itemCount} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-700/60">Payment</span>
              <span className="text-brown-900 capitalize">
                {order.paymentMethod.replace("-", " ")}
              </span>
            </div>
            <div className="border-t border-cream-200 pt-2 flex justify-between font-bold">
              <span className="text-brown-900">Total</span>
              <span className="text-coffee-600">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cream-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal-700 transition-colors hover:bg-cream-50">
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print
            </button>
            <button
              type="button"
              onClick={onNewOrder}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-coffee-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brown-700 active:scale-[0.98]">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              New Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
