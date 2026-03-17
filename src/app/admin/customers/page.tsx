"use client";

import { useState } from "react";
import { mockCustomers } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Users,
  Crown,
  UserPlus,
  Eye,
  ShoppingBag,
  X,
} from "lucide-react";

const customerData = [
  {
    ...mockCustomers[0],
    name: "Aditya Pratama",
    email: "aditya@email.com",
    phone: "081234567890",
  },
  {
    ...mockCustomers[1],
    name: "Sarah Wijaya",
    email: "sarah@email.com",
    phone: "081298765432",
  },
  {
    ...mockCustomers[2],
    name: "Rina Kartika",
    email: "rina@email.com",
    phone: "081455667788",
  },
  {
    ...mockCustomers[3],
    name: "Budi Santoso",
    email: "budi@email.com",
    phone: "081377889900",
  },
  {
    ...mockCustomers[4],
    name: "Dimas Wicaksono",
    email: "dimas@email.com",
    phone: "081566778899",
  },
];

const segments = ["all", "loyal", "regular", "new", "inactive"] as const;
const segmentColors: Record<string, string> = {
  loyal: "bg-amber-100 text-amber-800",
  regular: "bg-blue-100 text-blue-800",
  new: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-600",
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<
    (typeof customerData)[0] | null
  >(null);

  const filtered = customerData.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchSegment =
      selectedSegment === "all" || c.segment === selectedSegment;
    return matchSearch && matchSegment;
  });

  const loyalCount = customerData.filter((c) => c.segment === "loyal").length;
  const regularCount = customerData.filter(
    (c) => c.segment === "regular",
  ).length;
  const newCount = customerData.filter((c) => c.segment === "new").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brown-900">Customers</h1>
        <p className="text-coffee-400 text-sm mt-1">
          Manage customer data and insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <Users className="w-5 h-5 text-coffee-500 mb-2" />
          <p className="text-2xl font-bold text-brown-900">
            {customerData.length}
          </p>
          <p className="text-xs text-coffee-400">Total Customers</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <Crown className="w-5 h-5 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-brown-900">{loyalCount}</p>
          <p className="text-xs text-coffee-400">Loyal</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <ShoppingBag className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-brown-900">{regularCount}</p>
          <p className="text-xs text-coffee-400">Regular</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <UserPlus className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-brown-900">{newCount}</p>
          <p className="text-xs text-coffee-400">New</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {segments.map((seg) => (
            <button
              key={seg}
              onClick={() => setSelectedSegment(seg)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-colors ${
                selectedSegment === seg
                  ? "bg-coffee-500 text-white"
                  : "bg-white text-coffee-600 hover:bg-coffee-100 border border-cream-300"
              }`}>
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm shadow-brown-900/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-coffee-500 uppercase">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-coffee-500 uppercase hidden md:table-cell">
                  Phone
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-coffee-500 uppercase">
                  Orders
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-coffee-500 uppercase hidden sm:table-cell">
                  Spending
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-coffee-500 uppercase">
                  Segment
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-coffee-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-coffee-400 to-brown-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {c.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-brown-900 text-sm">
                          {c.name}
                        </p>
                        <p className="text-xs text-coffee-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-coffee-600 hidden md:table-cell">
                    {c.phone}
                  </td>
                  <td className="py-3 px-4 text-sm text-brown-900 font-medium text-center">
                    {c.totalOrders}
                  </td>
                  <td className="py-3 px-4 text-sm text-brown-900 font-medium text-right hidden sm:table-cell">
                    {formatCurrency(c.totalSpending)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${segmentColors[c.segment]}`}>
                      {c.segment}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="p-1.5 text-coffee-400 hover:text-coffee-600 hover:bg-cream-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-charcoal-700/60 hover:bg-cream-100 hover:text-charcoal-800 transition-colors"
              aria-label="Close">
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coffee-400 to-brown-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {selectedCustomer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-brown-900">
                  {selectedCustomer.name}
                </h2>
                <span
                  className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${segmentColors[selectedCustomer.segment]}`}>
                  {selectedCustomer.segment}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-coffee-400">Email</span>
                <span className="font-medium text-brown-900">
                  {selectedCustomer.email}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-coffee-400">Phone</span>
                <span className="font-medium text-brown-900">
                  {selectedCustomer.phone}
                </span>
              </div>
              <div className="border-t border-cream-200 my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-coffee-400">Total Orders</span>
                <span className="font-medium text-brown-900">
                  {selectedCustomer.totalOrders}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-coffee-400">Total Spending</span>
                <span className="font-medium text-brown-900">
                  {formatCurrency(selectedCustomer.totalSpending)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
