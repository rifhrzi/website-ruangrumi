"use client";

import Link from "next/link";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { mockStockItems, mockStockMovements } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";
import { STOCK_CATEGORIES } from "@/lib/constants";

export default function StockReportsPage() {
  const totalItems = mockStockItems.length;
  const lowStockCount = mockStockItems.filter((i) => i.isLowStock).length;
  const totalValue = mockStockItems.reduce(
    (sum, i) => sum + i.price * i.currentStock,
    0,
  );

  const lowStockItems = mockStockItems.filter((i) => i.isLowStock);

  const getCategoryLabel = (value: string) =>
    STOCK_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  // Chart data: current stock vs minimum stock per item
  const stockLevelData = mockStockItems.map((item) => ({
    name:
      item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    fullName: item.name,
    current: item.currentStock,
    minimum: item.minimumStock,
  }));

  // Movement summary data: aggregate in vs out by date
  const movementDates = [
    ...new Set(mockStockMovements.map((m) => m.createdAt.split("T")[0])),
  ].sort();

  const movementSummaryData = movementDates.map((date) => {
    const dayMovements = mockStockMovements.filter((m) =>
      m.createdAt.startsWith(date),
    );
    return {
      date: new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
      in: dayMovements
        .filter((m) => m.type === "in")
        .reduce((sum, m) => sum + m.quantity, 0),
      out: dayMovements
        .filter((m) => m.type === "out")
        .reduce((sum, m) => sum + m.quantity, 0),
      waste: dayMovements
        .filter((m) => m.type === "waste")
        .reduce((sum, m) => sum + m.quantity, 0),
    };
  });

  const summaryCards = [
    {
      label: "Total Items",
      value: totalItems.toString(),
      icon: <Package className="h-5 w-5 text-coffee-500" />,
      bg: "bg-cream-100",
    },
    {
      label: "Low Stock Items",
      value: lowStockCount.toString(),
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      label: "Total Inventory Value",
      value: formatCurrency(totalValue),
      icon: <TrendingDown className="h-5 w-5 text-coffee-500" />,
      bg: "bg-cream-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">
            Stock Reports
          </h1>
          <p className="mt-1 text-sm text-charcoal-700/60">
            Inventory analytics, stock levels overview, and movement summaries.
          </p>
        </div>
        <Link
          href="/admin/reports/orders"
          className="inline-flex items-center gap-2 rounded-lg border border-coffee-200 bg-white px-4 py-2.5 text-sm font-medium text-coffee-600 transition-colors hover:bg-cream-50">
          Order Reports
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-4 rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${card.bg}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-charcoal-700/70">{card.label}</p>
              <p className="text-xl font-bold text-charcoal-900">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Level Overview */}
      <div className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-charcoal-900">
          Stock Level Overview
        </h2>
        <p className="mb-4 text-sm text-charcoal-700/60">
          Current stock compared to minimum stock for each item.
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stockLevelData}
              layout="vertical"
              margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE5DB" />
              <XAxis type="number" stroke="#3D3D3D" fontSize={12} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#3D3D3D"
                fontSize={11}
                width={120}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  value,
                  name === "current" ? "Current Stock" : "Minimum Stock",
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #EDE5DB",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Legend />
              <Bar
                dataKey="current"
                fill="#96734A"
                radius={[0, 4, 4, 0]}
                name="Current Stock"
              />
              <Bar
                dataKey="minimum"
                fill="#EDE5DB"
                radius={[0, 4, 4, 0]}
                name="Minimum Stock"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Movement Summary */}
      <div className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-charcoal-900">
          Stock Movement Summary
        </h2>
        <p className="mb-4 text-sm text-charcoal-700/60">
          Daily stock in, out, and waste movements over the period.
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={movementSummaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE5DB" />
              <XAxis dataKey="date" stroke="#3D3D3D" fontSize={12} />
              <YAxis stroke="#3D3D3D" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #EDE5DB",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Legend />
              <Bar
                dataKey="in"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                name="Stock In"
              />
              <Bar
                dataKey="out"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="Stock Out"
              />
              <Bar
                dataKey="waste"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
                name="Waste"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Critical Items Table */}
      <div className="rounded-xl border border-cream-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-cream-200 px-6 py-4">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-charcoal-900">
            Critical Items (Low Stock)
          </h2>
        </div>
        {lowStockItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50/70">
                  <th className="whitespace-nowrap px-6 py-3 font-semibold text-charcoal-700">
                    SKU
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 font-semibold text-charcoal-700">
                    Name
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 font-semibold text-charcoal-700">
                    Category
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 font-semibold text-charcoal-700 text-right">
                    Current
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 font-semibold text-charcoal-700 text-right">
                    Minimum
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 font-semibold text-charcoal-700 text-right">
                    Deficit
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 font-semibold text-charcoal-700">
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="bg-red-50/30 hover:bg-red-50/60">
                    <td className="whitespace-nowrap px-6 py-3 font-mono text-xs text-charcoal-700/70">
                      {item.sku}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-charcoal-900">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-charcoal-700">
                      {getCategoryLabel(item.category)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right font-semibold text-red-600">
                      {item.currentStock}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-charcoal-700">
                      {item.minimumStock}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right font-semibold text-red-600">
                      -{item.minimumStock - item.currentStock}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 capitalize text-charcoal-700">
                      {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Package className="mx-auto h-10 w-10 text-emerald-300" />
            <p className="mt-2 text-sm font-medium text-charcoal-700/60">
              All stock levels are healthy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
