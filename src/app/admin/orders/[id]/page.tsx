"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer, CheckCircle } from "lucide-react";
import { mockOrders } from "@/lib/data/mock";
import { tables } from "@/lib/data/tables";
import { getStatusColor, formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatus } from "@/lib/types";

const STATUS_FLOW: { label: string; status: OrderStatus; color: string }[] = [
  {
    label: "Confirm",
    status: "confirmed",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    label: "Prepare",
    status: "preparing",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  { label: "Ready", status: "ready", color: "bg-green-500 hover:bg-green-600" },
  {
    label: "Complete",
    status: "completed",
    color: "bg-gray-600 hover:bg-gray-700",
  },
];

interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  note: string;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = mockOrders.find((o) => o.id === id) ?? mockOrders[0];
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([
    {
      status: "pending",
      timestamp: order.createdAt,
      note: "Order placed by customer",
    },
    {
      status: "confirmed",
      timestamp: "2026-03-13T09:35:00",
      note: "Order confirmed by admin",
    },
    {
      status: "preparing",
      timestamp: "2026-03-13T09:40:00",
      note: "Kitchen started preparing",
    },
    {
      status: "ready",
      timestamp: "2026-03-13T10:05:00",
      note: "Order is ready for pickup",
    },
    {
      status: "completed",
      timestamp: "2026-03-13T10:15:00",
      note: "Order completed",
    },
  ]);

  const orderTable = order.tableId
    ? tables.find((t) => t.id === order.tableId)
    : null;

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    setStatusHistory((prev) => [
      ...prev,
      {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: `Status updated to ${newStatus}`,
      },
    ]);
  };

  const handleCancel = () => {
    setCurrentStatus("cancelled");
    setStatusHistory((prev) => [
      ...prev,
      {
        status: "cancelled",
        timestamp: new Date().toISOString(),
        note: "Order cancelled by admin",
      },
    ]);
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimelineStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      confirmed: "bg-blue-500",
      preparing: "bg-orange-500",
      ready: "bg-green-500",
      completed: "bg-gray-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm font-medium text-charcoal-700 shadow-sm transition-colors hover:bg-cream-50">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-brown-900">
                {order.orderCode}
              </h1>
              <span
                className={`inline-flex rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${getStatusColor(currentStatus)}`}>
                {currentStatus}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-charcoal-700/60">
              Order placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg border border-cream-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal-700 shadow-sm transition-colors hover:bg-cream-50">
          <Printer className="h-4 w-4" />
          Print Receipt
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal-700/60">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-charcoal-700/50">Name</p>
                <p className="mt-0.5 text-sm font-medium text-charcoal-800">
                  {order.customerName}
                </p>
              </div>
              <div>
                <p className="text-xs text-charcoal-700/50">Phone</p>
                <p className="mt-0.5 text-sm font-medium text-charcoal-800">
                  {order.customerPhone}
                </p>
              </div>
              <div>
                <p className="text-xs text-charcoal-700/50">Email</p>
                <p className="mt-0.5 text-sm font-medium text-charcoal-800">
                  {order.customerEmail || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal-700/60">
              Order Information
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-charcoal-700/50">Type</p>
                <p className="mt-0.5 text-sm font-medium capitalize text-charcoal-800">
                  {order.type}
                </p>
              </div>
              {orderTable && (
                <div>
                  <p className="text-xs text-charcoal-700/50">Table</p>
                  <p className="mt-0.5 text-sm font-medium text-charcoal-800">
                    {orderTable.name}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-charcoal-700/50">Date</p>
                <p className="mt-0.5 text-sm font-medium text-charcoal-800">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-charcoal-700/50">Time</p>
                <p className="mt-0.5 text-sm font-medium text-charcoal-800">
                  {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-hidden rounded-xl border border-cream-200 bg-white shadow-sm">
            <div className="px-5 pt-5 pb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal-700/60">
                Order Items
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-y border-cream-200 bg-cream-50">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                      Item
                    </th>
                    <th className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                      Qty
                    </th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                      Price
                    </th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                      Variants / Addons
                    </th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-cream-50/60">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-charcoal-800">
                          {item.menuItemName}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="text-sm text-charcoal-800">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-charcoal-700">
                          {formatCurrency(item.price)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {item.variants.map((v, i) => (
                            <span
                              key={i}
                              className="inline-flex rounded-md bg-cream-100 px-2 py-0.5 text-xs text-charcoal-700">
                              {v}
                            </span>
                          ))}
                          {item.addons.map((a, i) => (
                            <span
                              key={i}
                              className="inline-flex rounded-md bg-coffee-100 px-2 py-0.5 text-xs text-coffee-600">
                              +{a}
                            </span>
                          ))}
                          {item.variants.length === 0 &&
                            item.addons.length === 0 && (
                              <span className="text-xs text-charcoal-700/40">
                                -
                              </span>
                            )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-sm font-semibold text-charcoal-800">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal-700/60">
              Payment Summary
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal-700/70">Subtotal</span>
                <span className="text-charcoal-800">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal-700/70">Tax (11%)</span>
                <span className="text-charcoal-800">
                  {formatCurrency(order.tax)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal-700/70">
                  Service Charge (5%)
                </span>
                <span className="text-charcoal-800">
                  {formatCurrency(order.serviceCharge)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal-700/70">Discount</span>
                  <span className="text-red-600">
                    -{formatCurrency(order.discount)}
                  </span>
                </div>
              )}
              <div className="mt-3 border-t border-cream-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-charcoal-800">
                    Total
                  </span>
                  <span className="text-lg font-bold text-brown-800">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-charcoal-700/70">Payment Status</span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentMethod && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal-700/70">Payment Method</span>
                  <span className="font-medium uppercase text-charcoal-800">
                    {order.paymentMethod}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal-700/60">
              Update Status
            </h2>
            <div className="space-y-2">
              {STATUS_FLOW.map((action) => {
                const statusOrder: OrderStatus[] = [
                  "pending",
                  "confirmed",
                  "preparing",
                  "ready",
                  "completed",
                ];
                const currentIdx = statusOrder.indexOf(currentStatus);
                const actionIdx = statusOrder.indexOf(action.status);
                const isNext = actionIdx === currentIdx + 1;
                const isDone = actionIdx <= currentIdx;
                const isCancelled = currentStatus === "cancelled";

                return (
                  <button
                    key={action.status}
                    onClick={() => handleStatusUpdate(action.status)}
                    disabled={!isNext || isCancelled}
                    className={`flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${action.color}`}>
                    {isDone && !isCancelled ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-white/50" />
                    )}
                    {action.label}
                    {isDone && !isCancelled && (
                      <span className="ml-auto text-xs opacity-75">Done</span>
                    )}
                  </button>
                );
              })}
              <div className="mt-3 border-t border-cream-200 pt-3">
                <button
                  onClick={handleCancel}
                  disabled={
                    currentStatus === "completed" ||
                    currentStatus === "cancelled"
                  }
                  className="w-full rounded-lg border-2 border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">
                  Cancel Order
                </button>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal-700/60">
              Status Timeline
            </h2>
            <div className="relative space-y-0">
              {statusHistory.map((entry, index) => (
                <div key={index} className="relative flex gap-3 pb-6 last:pb-0">
                  {/* Vertical line */}
                  {index < statusHistory.length - 1 && (
                    <div className="absolute left-[9px] top-5 h-full w-0.5 bg-cream-200" />
                  )}
                  {/* Dot */}
                  <div
                    className={`relative z-10 mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border-2 border-white ${getTimelineStatusColor(entry.status)}`}
                  />
                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium capitalize text-charcoal-800">
                      {entry.status}
                    </p>
                    <p className="text-xs text-charcoal-700/50">{entry.note}</p>
                    <p className="mt-0.5 text-xs text-charcoal-700/40">
                      {formatTimestamp(entry.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
