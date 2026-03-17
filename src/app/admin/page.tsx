"use client";

import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  CalendarDays,
  Armchair,
  UtensilsCrossed,
  AlertTriangle,
  ArrowRight,
  Clock,
  Trophy,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  mockDashboardStats,
  mockRevenueData,
  mockCategorySales,
  mockOrders,
  mockReservations,
  mockTopSelling,
  mockStockItems,
} from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";

import KpiCard from "@/components/admin/kpi-card";
import StatusBadge from "@/components/admin/status-badge";

// ---------------------------------------------------------------------------
// Chart color palette (coffee tones)
// ---------------------------------------------------------------------------
const PIE_COLORS = [
  "#96734A", // coffee-500
  "#B08D62", // coffee-400
  "#C4A882", // coffee-300
  "#D4B896", // coffee-200
  "#6B4423", // brown-500
  "#D4AF37", // gold-400
  "#4A3728", // brown-700
];

// ---------------------------------------------------------------------------
// Dashboard helpers
// ---------------------------------------------------------------------------
const stats = mockDashboardStats;
const recentOrders = mockOrders.slice(0, 5);
const recentReservations = mockReservations.slice(0, 4);
const lowStockItems = mockStockItems.filter((s) => s.isLowStock);

// Format the date axis label (e.g. "Mar 07" -> "07 Mar")
function formatChartDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

// Format the time display from ISO string
function formatTimeFromISO(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

// ---------------------------------------------------------------------------
// Custom chart tooltip
// ---------------------------------------------------------------------------
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-cream-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-xs font-medium text-charcoal-700/70">{label}</p>
      <p className="mt-1 text-sm font-bold text-brown-800">
        {formatCurrency(payload[0].value)}
      </p>
      <p className="text-xs text-charcoal-700/50">
        {payload[0].payload.orders} orders
      </p>
    </div>
  );
}

function CategoryTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-cream-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-brown-800">{data.category}</p>
      <p className="text-xs text-charcoal-700/70">
        {formatCurrency(data.total)} ({data.percentage}%)
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* ---------- Page header ---------- */}
      <div>
        <h1 className="text-2xl font-bold text-brown-900">Dashboard</h1>
        <p className="mt-1 text-sm text-charcoal-700/60">
          Overview of today&apos;s operations
        </p>
      </div>

      {/* ========== KPI Row 1 ========== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Today's Orders"
          value={stats.todayOrders}
          change={12}
          changeType="up"
          icon={<ShoppingBag className="h-6 w-6" />}
          color="blue"
        />
        <KpiCard
          title="Today's Revenue"
          value={formatCurrency(stats.todayRevenue)}
          change={8.5}
          changeType="up"
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
        />
        <KpiCard
          title="Reservations"
          value={stats.todayReservations}
          change={-3}
          changeType="down"
          icon={<CalendarDays className="h-6 w-6" />}
          color="purple"
        />
        <KpiCard
          title="Table Occupancy"
          value={`${stats.tablesOccupied}/${stats.totalTables}`}
          icon={<Armchair className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* ========== KPI Row 2 ========== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard
          title="Active Menu Items"
          value={stats.activeMenuItems}
          icon={<UtensilsCrossed className="h-6 w-6" />}
          color="blue"
        />
        <KpiCard
          title="Low Stock Alert"
          value={stats.lowStockItems}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* ========== Charts Row ========== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue chart (takes 2 cols) */}
        <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-brown-900">
                Revenue Trend
              </h2>
              <p className="text-xs text-charcoal-700/50">Last 7 days</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockRevenueData.map((d) => ({
                  ...d,
                  label: formatChartDate(d.date),
                }))}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE5DB" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#6B4423" }}
                  axisLine={{ stroke: "#EDE5DB" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6B4423" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#96734A"
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: "#96734A",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#96734A",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category sales pie chart */}
        <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-brown-900">
              Sales by Category
            </h2>
            <p className="text-xs text-charcoal-700/50">Revenue distribution</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="total">
                  {mockCategorySales.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={PIE_COLORS[idx % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CategoryTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {mockCategorySales.map((cat, idx) => (
              <div key={cat.category} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                  }}
                />
                <span className="truncate text-xs text-charcoal-700/70">
                  {cat.category}
                </span>
                <span className="ml-auto text-xs font-medium text-brown-800">
                  {cat.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== Tables Row ========== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-xl border border-cream-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
            <h2 className="text-base font-semibold text-brown-900">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-medium text-coffee-500 hover:text-coffee-600">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-100 bg-cream-50/50">
                  <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-charcoal-700/70">
                    Order Code
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-charcoal-700/70">
                    Customer
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-charcoal-700/70">
                    Type
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-right font-medium text-charcoal-700/70">
                    Items
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-right font-medium text-charcoal-700/70">
                    Total
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-center font-medium text-charcoal-700/70">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-right font-medium text-charcoal-700/70">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-cream-100 last:border-none hover:bg-cream-50/50 transition-colors">
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs font-medium text-brown-800">
                      {order.orderCode}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-brown-800">
                      {order.customerName}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <span className="inline-flex items-center rounded-md bg-cream-100 px-2 py-0.5 text-xs font-medium text-brown-700 capitalize">
                        {order.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right text-charcoal-700">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right font-medium text-brown-800">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right text-xs text-charcoal-700/60">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeFromISO(order.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent reservations */}
        <div className="rounded-xl border border-cream-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
            <h2 className="text-base font-semibold text-brown-900">
              Recent Reservations
            </h2>
            <Link
              href="/admin/reservations"
              className="flex items-center gap-1 text-xs font-medium text-coffee-500 hover:text-coffee-600">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-100 bg-cream-50/50">
                  <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-charcoal-700/70">
                    Code
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-charcoal-700/70">
                    Customer
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-charcoal-700/70">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-charcoal-700/70">
                    Time
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-right font-medium text-charcoal-700/70">
                    Pax
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-center font-medium text-charcoal-700/70">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((res) => (
                  <tr
                    key={res.id}
                    className="border-b border-cream-100 last:border-none hover:bg-cream-50/50 transition-colors">
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs font-medium text-brown-800">
                      {res.bookingCode}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-brown-800">
                      {res.customerName}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-charcoal-700">
                      {new Date(res.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-charcoal-700">
                      {res.timeSlot} - {res.endTime}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right text-charcoal-700">
                      {res.pax}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-center">
                      <StatusBadge status={res.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========== Bottom Row: Top Selling + Low Stock ========== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Top selling items */}
        <div className="rounded-xl border border-cream-200 bg-white shadow-sm">
          <div className="border-b border-cream-200 px-5 py-4">
            <h2 className="text-base font-semibold text-brown-900">
              Top Selling Items
            </h2>
            <p className="text-xs text-charcoal-700/50">
              All-time best sellers
            </p>
          </div>
          <div className="divide-y divide-cream-100">
            {mockTopSelling.map((item, idx) => (
              <div
                key={item.menuItemId}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream-50/50 transition-colors">
                {/* Rank */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100">
                  {idx < 3 ? (
                    <Trophy
                      className={`h-4 w-4 ${
                        idx === 0
                          ? "text-amber-500"
                          : idx === 1
                            ? "text-gray-400"
                            : "text-orange-400"
                      }`}
                    />
                  ) : (
                    <span className="text-xs font-bold text-charcoal-700/50">
                      #{idx + 1}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-brown-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-charcoal-700/50">
                    {item.totalOrders.toLocaleString("id-ID")} orders
                  </p>
                </div>

                {/* Revenue */}
                <p className="shrink-0 text-sm font-semibold text-brown-900">
                  {formatCurrency(item.totalRevenue)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="rounded-xl border border-cream-200 bg-white shadow-sm">
          <div className="border-b border-cream-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h2 className="text-base font-semibold text-brown-900">
                Low Stock Alerts
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-charcoal-700/50">
              Items below minimum stock levels
            </p>
          </div>
          <div className="divide-y divide-cream-100">
            {lowStockItems.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-charcoal-700/50">
                All stock levels are healthy.
              </p>
            ) : (
              lowStockItems.map((item) => {
                // Calculate urgency: how far below minimum
                const deficit = item.minimumStock - item.currentStock;
                const urgencyPct = (deficit / item.minimumStock) * 100;
                const isUrgent = urgencyPct >= 40;

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream-50/50 transition-colors">
                    {/* Urgency indicator */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isUrgent ? "bg-red-100" : "bg-amber-100"
                      }`}>
                      <AlertTriangle
                        className={`h-4 w-4 ${isUrgent ? "text-red-500" : "text-amber-500"}`}
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-brown-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-charcoal-700/50">
                        SKU: {item.sku} &middot; {item.unit}
                      </p>
                    </div>

                    {/* Stock levels */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-brown-900">
                        <span
                          className={
                            isUrgent ? "text-red-600" : "text-amber-600"
                          }>
                          {item.currentStock}
                        </span>
                        <span className="text-charcoal-700/40">
                          {" "}
                          / {item.minimumStock}
                        </span>
                      </p>
                      <p
                        className={`text-[11px] font-medium ${
                          isUrgent ? "text-red-500" : "text-amber-500"
                        }`}>
                        {isUrgent ? "Critical" : "Low"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {lowStockItems.length > 0 && (
            <div className="border-t border-cream-200 px-5 py-3">
              <Link
                href="/admin/inventory"
                className="flex items-center justify-center gap-1 text-xs font-medium text-coffee-500 hover:text-coffee-600">
                Manage Inventory <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
