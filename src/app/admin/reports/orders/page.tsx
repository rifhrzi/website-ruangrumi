"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Calendar, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  mockRevenueData,
  mockCategorySales,
  mockTopSelling,
  mockOrders,
} from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";

const PIE_COLORS = [
  "#96734A",
  "#B08D62",
  "#C4A882",
  "#D4B896",
  "#6B4423",
  "#D4AF37",
  "#C9A96E",
];

const orderTypeData = [
  {
    type: "Dine-in",
    count: mockOrders.filter((o) => o.type === "dine-in").length,
  },
  {
    type: "Takeaway",
    count: mockOrders.filter((o) => o.type === "takeaway").length,
  },
  {
    type: "Delivery",
    count: mockOrders.filter((o) => o.type === "delivery").length,
  },
];

export default function OrderReportsPage() {
  const [dateFrom, setDateFrom] = useState("2026-03-07");
  const [dateTo, setDateTo] = useState("2026-03-13");

  const totalOrders = mockRevenueData.reduce((sum, d) => sum + d.orders, 0);
  const totalRevenue = mockRevenueData.reduce((sum, d) => sum + d.revenue, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const cancelledOrders = mockOrders.filter(
    (o) => o.status === "cancelled",
  ).length;
  const cancellationRate =
    mockOrders.length > 0
      ? ((cancelledOrders / mockOrders.length) * 100).toFixed(1)
      : "0";

  const kpiCards = [
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString("id-ID"),
      icon: <TrendingUp className="h-5 w-5 text-coffee-500" />,
      change: "+12.5%",
      changeColor: "text-emerald-600",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: <TrendingUp className="h-5 w-5 text-coffee-500" />,
      change: "+8.3%",
      changeColor: "text-emerald-600",
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(Math.round(avgOrderValue)),
      icon: <TrendingUp className="h-5 w-5 text-coffee-500" />,
      change: "-2.1%",
      changeColor: "text-red-600",
    },
    {
      label: "Cancellation Rate",
      value: `${cancellationRate}%`,
      icon: <TrendingUp className="h-5 w-5 text-coffee-500" />,
      change: "-0.5%",
      changeColor: "text-emerald-600",
    },
  ];

  const formatRevenueLabel = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const formatDateShort = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">
            Order Reports
          </h1>
          <p className="mt-1 text-sm text-charcoal-700/60">
            View sales performance, revenue trends, and order analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/reports/stock"
            className="inline-flex items-center gap-2 rounded-lg border border-coffee-200 bg-white px-4 py-2.5 text-sm font-medium text-coffee-600 transition-colors hover:bg-cream-50">
            Stock Reports
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-coffee-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-coffee-600">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-cream-200 bg-white p-4">
        <Calendar className="h-4 w-4 text-charcoal-700/50" />
        <span className="text-sm font-medium text-charcoal-700">
          Date Range:
        </span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-400/20"
        />
        <span className="text-sm text-charcoal-700/50">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-400/20"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-charcoal-700/70">{card.label}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream-100">
                {card.icon}
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-charcoal-900">
              {card.value}
            </p>
            <p className={`mt-1 text-xs font-medium ${card.changeColor}`}>
              {card.change} vs last period
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-charcoal-900">
          Revenue Trend
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE5DB" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateShort}
                stroke="#3D3D3D"
                fontSize={12}
              />
              <YAxis
                tickFormatter={formatRevenueLabel}
                stroke="#3D3D3D"
                fontSize={12}
              />
              <Tooltip
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Revenue",
                ]}
                labelFormatter={(label: string) => formatDateShort(label)}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #EDE5DB",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#96734A"
                strokeWidth={2.5}
                dot={{ fill: "#96734A", r: 4 }}
                activeDot={{ r: 6, fill: "#6B4423" }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#D4AF37"
                strokeWidth={2}
                dot={{ fill: "#D4AF37", r: 3 }}
                yAxisId={0}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Pie Chart */}
        <div className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-charcoal-900">
            Orders by Category
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="total"
                  nameKey="category"
                  label={({ category, percentage }) =>
                    `${category} ${percentage}%`
                  }
                  labelLine={false}>
                  {mockCategorySales.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={PIE_COLORS[idx % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #EDE5DB",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Type Bar Chart */}
        <div className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-charcoal-900">
            Orders by Type
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE5DB" />
                <XAxis dataKey="type" stroke="#3D3D3D" fontSize={12} />
                <YAxis stroke="#3D3D3D" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #EDE5DB",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#96734A"
                  radius={[6, 6, 0, 0]}
                  name="Orders">
                  {orderTypeData.map((_, idx) => (
                    <Cell
                      key={`bar-${idx}`}
                      fill={["#6B4423", "#96734A", "#D4AF37"][idx]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="rounded-xl border border-cream-200 bg-white shadow-sm">
        <div className="border-b border-cream-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-charcoal-900">
            Top Selling Items
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-50/70">
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-charcoal-700">
                  #
                </th>
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-charcoal-700">
                  Item
                </th>
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-charcoal-700 text-right">
                  Total Orders
                </th>
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-charcoal-700 text-right">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {mockTopSelling.map((item, idx) => (
                <tr key={item.menuItemId} className="hover:bg-cream-50/50">
                  <td className="whitespace-nowrap px-6 py-3">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        idx === 0
                          ? "bg-gold-400 text-white"
                          : idx === 1
                            ? "bg-cream-300 text-charcoal-700"
                            : idx === 2
                              ? "bg-coffee-200 text-coffee-600"
                              : "bg-cream-100 text-charcoal-700"
                      }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 font-medium text-charcoal-900">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right text-charcoal-700">
                    {item.totalOrders.toLocaleString("id-ID")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right font-semibold text-charcoal-900">
                    {formatCurrency(item.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
