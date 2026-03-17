"use client";

import { useState } from "react";
import { mockOrders } from "@/lib/data/mock";
import { getStatusColor, formatCurrency, formatDate } from "@/lib/utils";
import { ShoppingBag, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { OrderStatus } from "@/lib/types";

const statusOptions: { value: string; label: string }[] = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function MyOrdersPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered =
    filterStatus === "all"
      ? mockOrders
      : mockOrders.filter((o) => o.status === filterStatus);

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-coffee-100 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-coffee-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brown-900">My Orders</h1>
            <p className="text-sm text-coffee-500">
              Track and view your order history
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-coffee-400 shrink-0" />
          {statusOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterStatus === s.value
                  ? "bg-coffee-500 text-white"
                  : "bg-white text-coffee-600 hover:bg-coffee-100 border border-cream-300"
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <ShoppingBag className="w-12 h-12 text-cream-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brown-900 mb-1">
              No orders found
            </h3>
            <p className="text-coffee-400">
              You don&apos;t have any orders with this status yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm shadow-brown-900/5 overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id,
                    )
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-cream-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-brown-900 text-left">
                        {order.orderCode}
                      </p>
                      <p className="text-sm text-coffee-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    <span className="font-semibold text-brown-900 hidden sm:block">
                      {formatCurrency(order.total)}
                    </span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-5 h-5 text-coffee-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-coffee-400" />
                    )}
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <div className="px-6 pb-5 border-t border-cream-200">
                    <div className="pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-coffee-400">Type</span>
                        <span className="font-medium text-brown-800 capitalize">
                          {order.type}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-coffee-400">Payment</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </div>

                      <div className="border-t border-cream-200 pt-3 mt-3">
                        <p className="text-sm font-medium text-brown-900 mb-2">
                          Items
                        </p>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm py-1">
                            <span className="text-coffee-600">
                              {item.quantity}x {item.menuItemName}
                              {item.variants.length > 0 && (
                                <span className="text-coffee-400 text-xs ml-1">
                                  ({item.variants.join(", ")})
                                </span>
                              )}
                            </span>
                            <span className="text-brown-800">
                              {formatCurrency(item.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-cream-200 pt-3 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-coffee-400">Subtotal</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-coffee-400">Tax</span>
                          <span>{formatCurrency(order.tax)}</span>
                        </div>
                        {order.serviceCharge > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-coffee-400">Service</span>
                            <span>{formatCurrency(order.serviceCharge)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-bold text-brown-900 pt-1">
                          <span>Total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
