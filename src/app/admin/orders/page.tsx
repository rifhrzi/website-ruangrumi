"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { mockOrders } from "@/lib/data/mock";
import { getStatusColor, formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";

const ITEMS_PER_PAGE = 10;

export default function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        !searchQuery ||
        order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesType = typeFilter === "all" || order.type === typeFilter;

      const orderDate = order.createdAt.split("T")[0];
      const matchesDateFrom = !dateFrom || orderDate >= dateFrom;
      const matchesDateTo = !dateTo || orderDate <= dateTo;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [searchQuery, statusFilter, typeFilter, dateFrom, dateTo]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleExport = (format: "csv" | "pdf") => {
    setShowExportMenu(false);
    if (format === "csv") {
      const headers = [
        "Order Code",
        "Customer",
        "Type",
        "Items",
        "Total",
        "Payment",
        "Status",
        "Date",
      ];
      const rows = filteredOrders.map((o) => [
        o.orderCode,
        o.customerName,
        o.type,
        o.items.map((i) => i.menuItemName).join("; "),
        o.total.toString(),
        o.paymentStatus,
        o.status,
        o.createdAt,
      ]);
      const csvContent = [headers, ...rows]
        .map((r) => r.map((c) => `"${c}"`).join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      window.print();
    }
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      "dine-in": "bg-blue-100 text-blue-800",
      takeaway: "bg-orange-100 text-orange-800",
      delivery: "bg-purple-100 text-purple-800",
    };
    return styles[type] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">
            Order Management
          </h1>
          <p className="mt-1 text-sm text-charcoal-700/60">
            Manage and track all customer orders
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="inline-flex items-center gap-2 rounded-lg bg-coffee-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-coffee-600">
            <Download className="h-4 w-4" />
            Export
          </button>
          {showExportMenu && (
            <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-lg border border-cream-200 bg-white py-1 shadow-lg">
              <button
                onClick={() => handleExport("csv")}
                className="block w-full px-4 py-2 text-left text-sm text-charcoal-800 hover:bg-cream-50">
                Export as CSV
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="block w-full px-4 py-2 text-left text-sm text-charcoal-800 hover:bg-cream-50">
                Export as PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-cream-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-charcoal-700">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-700/40" />
            <input
              type="text"
              placeholder="Search order, customer..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-cream-200 bg-cream-50 py-2 pl-10 pr-4 text-sm text-charcoal-800 placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
            />
          </div>

          {/* Date From */}
          <div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
            />
          </div>

          {/* Date To */}
          <div>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400">
              <option value="all">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Dropdown */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400">
              <option value="all">All Types</option>
              <option value="dine-in">Dine-in</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-cream-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Order Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-sm text-charcoal-700/50">
                    No orders found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-cream-50/60">
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-brown-800">
                        {order.orderCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-charcoal-800">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-charcoal-700/50">
                          {order.customerPhone}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getTypeBadge(order.type)}`}>
                        {order.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="max-w-[180px]">
                        <p className="truncate text-sm text-charcoal-800">
                          {order.items.map((i) => i.menuItemName).join(", ")}
                        </p>
                        <p className="text-xs text-charcoal-700/50">
                          {order.items.reduce((sum, i) => sum + i.quantity, 0)}{" "}
                          item(s)
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-charcoal-800">
                        {formatCurrency(order.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-charcoal-700/70">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-cream-200 bg-white px-3 py-1.5 text-xs font-medium text-coffee-500 shadow-sm transition-colors hover:bg-cream-50 hover:text-coffee-600">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-cream-200 bg-cream-50/50 px-4 py-3">
          <p className="text-sm text-charcoal-700/60">
            Showing{" "}
            <span className="font-medium text-charcoal-800">
              {filteredOrders.length === 0
                ? 0
                : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-charcoal-800">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-charcoal-800">
              {filteredOrders.length}
            </span>{" "}
            orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-cream-200 bg-white px-3 py-1.5 text-sm font-medium text-charcoal-700 shadow-sm transition-colors hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-coffee-500 text-white shadow-sm"
                    : "border border-cream-200 bg-white text-charcoal-700 hover:bg-cream-50"
                }`}>
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-cream-200 bg-white px-3 py-1.5 text-sm font-medium text-charcoal-700 shadow-sm transition-colors hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-50">
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
