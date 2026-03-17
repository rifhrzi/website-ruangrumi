"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  Clock,
  Star,
  ShoppingBag,
  CalendarDays,
} from "lucide-react";
import { mockRevenueData, mockCategorySales } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";
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
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#96734A",
  "#C4A882",
  "#D4B896",
  "#6B4423",
  "#C9A96E",
  "#4A3728",
  "#B08D62",
];

const hourlyData = [
  { hour: "8AM", orders: 5 },
  { hour: "9AM", orders: 12 },
  { hour: "10AM", orders: 18 },
  { hour: "11AM", orders: 25 },
  { hour: "12PM", orders: 42 },
  { hour: "1PM", orders: 38 },
  { hour: "2PM", orders: 30 },
  { hour: "3PM", orders: 35 },
  { hour: "4PM", orders: 28 },
  { hour: "5PM", orders: 22 },
  { hour: "6PM", orders: 32 },
  { hour: "7PM", orders: 40 },
  { hour: "8PM", orders: 35 },
  { hour: "9PM", orders: 20 },
];

const occupancyData = [
  { day: "Mon", rate: 65 },
  { day: "Tue", rate: 72 },
  { day: "Wed", rate: 68 },
  { day: "Thu", rate: 78 },
  { day: "Fri", rate: 92 },
  { day: "Sat", rate: 95 },
  { day: "Sun", rate: 88 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("7d");

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">Analytics</h1>
          <p className="text-coffee-400 text-sm mt-1">
            Comprehensive business insights
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { v: "7d", l: "7 Days" },
            { v: "30d", l: "30 Days" },
            { v: "90d", l: "90 Days" },
          ].map((p) => (
            <button
              key={p.v}
              onClick={() => setPeriod(p.v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p.v
                  ? "bg-coffee-500 text-white"
                  : "bg-white text-coffee-600 border border-cream-300 hover:bg-cream-50"
              }`}>
              {p.l}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: TrendingUp,
            label: "Avg. Order Value",
            value: formatCurrency(179000),
            color: "text-green-600",
          },
          {
            icon: Users,
            label: "Repeat Rate",
            value: "68%",
            color: "text-blue-600",
          },
          {
            icon: Star,
            label: "Avg. Rating",
            value: "4.8 / 5",
            color: "text-amber-600",
          },
          {
            icon: CalendarDays,
            label: "Reservation Rate",
            value: "85%",
            color: "text-purple-600",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-brown-900">{stat.value}</p>
            <p className="text-xs text-coffee-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-2xl shadow-sm shadow-brown-900/5 p-6 mb-6">
        <h2 className="text-lg font-semibold text-brown-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-coffee-500" /> Revenue Trend
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e0db" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Revenue",
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#96734A"
                strokeWidth={3}
                dot={{ fill: "#96734A", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Peak Hours */}
        <div className="bg-white rounded-2xl shadow-sm shadow-brown-900/5 p-6">
          <h2 className="text-lg font-semibold text-brown-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-coffee-500" /> Peak Hours
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e0db" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#C4A882" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white rounded-2xl shadow-sm shadow-brown-900/5 p-6">
          <h2 className="text-lg font-semibold text-brown-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-coffee-500" /> Weekly Occupancy
            Rate
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e0db" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Occupancy"]} />
                <Bar dataKey="rate" fill="#6B4423" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sales by Category */}
      <div className="bg-white rounded-2xl shadow-sm shadow-brown-900/5 p-6">
        <h2 className="text-lg font-semibold text-brown-900 mb-4">
          Sales by Category
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategorySales}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}>
                  {mockCategorySales.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            {mockCategorySales.map((cat, i) => (
              <div key={cat.category} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <div>
                  <p className="text-sm font-medium text-brown-900">
                    {cat.category}
                  </p>
                  <p className="text-xs text-coffee-400">
                    {cat.percentage}% &middot; {formatCurrency(cat.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
