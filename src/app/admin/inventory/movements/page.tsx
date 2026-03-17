"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Trash2,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { mockStockMovements, mockStockItems } from "@/lib/data/mock";
import { formatDate } from "@/lib/utils";
import type { StockMovementType } from "@/lib/types";

export default function StockMovementsPage() {
  const [typeFilter, setTypeFilter] = useState<StockMovementType | "all">(
    "all",
  );
  const [itemFilter, setItemFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const getItemName = (stockItemId: string) =>
    mockStockItems.find((i) => i.id === stockItemId)?.name ?? stockItemId;

  const filteredMovements = useMemo(() => {
    let movements = [...mockStockMovements];

    if (typeFilter !== "all") {
      movements = movements.filter((m) => m.type === typeFilter);
    }

    if (itemFilter !== "all") {
      movements = movements.filter((m) => m.stockItemId === itemFilter);
    }

    if (dateFrom) {
      movements = movements.filter(
        (m) => new Date(m.createdAt) >= new Date(dateFrom),
      );
    }

    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      movements = movements.filter((m) => new Date(m.createdAt) < endDate);
    }

    movements.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return movements;
  }, [typeFilter, itemFilter, dateFrom, dateTo]);

  const summaryIn = mockStockMovements
    .filter((m) => m.type === "in")
    .reduce((sum, m) => sum + m.quantity, 0);

  const summaryOut = mockStockMovements
    .filter((m) => m.type === "out")
    .reduce((sum, m) => sum + m.quantity, 0);

  const summaryWaste = mockStockMovements
    .filter((m) => m.type === "waste")
    .reduce((sum, m) => sum + m.quantity, 0);

  const getTypeBadge = (type: StockMovementType) => {
    const map: Record<
      StockMovementType,
      { bg: string; text: string; icon: React.ReactNode; label: string }
    > = {
      in: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        icon: <ArrowDown className="h-3 w-3" />,
        label: "Stock In",
      },
      out: {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: <ArrowUp className="h-3 w-3" />,
        label: "Stock Out",
      },
      adjustment: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: <RefreshCw className="h-3 w-3" />,
        label: "Adjustment",
      },
      waste: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        icon: <Trash2 className="h-3 w-3" />,
        label: "Waste",
      },
    };
    const cfg = map[type];
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
        {cfg.icon}
        {cfg.label}
      </span>
    );
  };

  const summaryCards = [
    {
      label: "Total In",
      value: summaryIn,
      icon: <ArrowDown className="h-5 w-5 text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      valueColor: "text-emerald-700",
    },
    {
      label: "Total Out",
      value: summaryOut,
      icon: <ArrowUp className="h-5 w-5 text-red-600" />,
      bg: "bg-red-50",
      border: "border-red-200",
      valueColor: "text-red-700",
    },
    {
      label: "Total Waste",
      value: summaryWaste,
      icon: <Trash2 className="h-5 w-5 text-orange-600" />,
      bg: "bg-orange-50",
      border: "border-orange-200",
      valueColor: "text-orange-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory"
            className="rounded-lg border border-cream-200 bg-white p-2 text-charcoal-700/60 transition-colors hover:bg-cream-50 hover:text-coffee-600">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-charcoal-900">
              Stock Movements
            </h1>
            <p className="mt-1 text-sm text-charcoal-700/60">
              Track all inventory changes: restocks, usage, adjustments, and
              waste.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`flex items-center gap-4 rounded-xl border ${card.border} ${card.bg} p-4`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-charcoal-700/70">{card.label}</p>
              <p className={`text-xl font-bold ${card.valueColor}`}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-cream-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex items-center gap-2 text-sm font-medium text-charcoal-700">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <select
            value={itemFilter}
            onChange={(e) => setItemFilter(e.target.value)}
            className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-400/20">
            <option value="all">All Items</option>
            {mockStockItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as StockMovementType | "all")
            }
            className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-400/20">
            <option value="all">All Types</option>
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
            <option value="adjustment">Adjustment</option>
            <option value="waste">Waste</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-400/20"
            placeholder="From"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-400/20"
            placeholder="To"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-cream-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-50/70">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  Date
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  Item
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  Type
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  Quantity
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  Previous Stock
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  New Stock
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  Notes
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  Created By
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredMovements.map((mov) => (
                <tr key={mov.id} className="hover:bg-cream-50/50">
                  <td className="whitespace-nowrap px-4 py-3 text-charcoal-700">
                    {formatDate(mov.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-charcoal-900">
                    {getItemName(mov.stockItemId)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {getTypeBadge(mov.type)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`font-semibold ${
                        mov.type === "in"
                          ? "text-emerald-600"
                          : mov.type === "out" || mov.type === "waste"
                            ? "text-red-600"
                            : "text-blue-600"
                      }`}>
                      {mov.type === "in" ? "+" : "-"}
                      {mov.quantity}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-charcoal-700">
                    {mov.previousStock}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-charcoal-700">
                    {mov.newStock}
                  </td>
                  <td className="px-4 py-3 text-charcoal-700/70 max-w-[200px] truncate">
                    {mov.notes ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-charcoal-700">
                    {mov.createdBy}
                  </td>
                </tr>
              ))}

              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <RefreshCw className="mx-auto h-10 w-10 text-cream-300" />
                    <p className="mt-2 text-sm font-medium text-charcoal-700/60">
                      No movements found
                    </p>
                    <p className="text-xs text-charcoal-700/40">
                      Try adjusting your filter criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-cream-200 bg-cream-50/50 px-4 py-3">
          <p className="text-sm text-charcoal-700/60">
            Showing{" "}
            <span className="font-medium text-charcoal-900">
              {filteredMovements.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-charcoal-900">
              {mockStockMovements.length}
            </span>{" "}
            movements
          </p>
        </div>
      </div>
    </div>
  );
}
