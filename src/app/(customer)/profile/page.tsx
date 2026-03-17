"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  ShoppingBag,
  Calendar,
  Edit3,
  Save,
} from "lucide-react";
import { mockOrders, mockReservations } from "@/lib/data/mock";
import { getStatusColor, formatCurrency, formatDate } from "@/lib/utils";

const tabs = ["Profile", "Orders", "Reservations"] as const;
type Tab = (typeof tabs)[number];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Aditya Pratama",
    email: "aditya@email.com",
    phone: "081234567890",
  });

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm shadow-brown-900/5 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-coffee-400 to-brown-700 flex items-center justify-center text-white text-3xl font-bold shrink-0">
              AP
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-brown-900">{form.name}</h1>
              <p className="text-coffee-500">{form.email}</p>
              <p className="text-sm text-coffee-400 mt-1">
                Member since March 2025
              </p>
            </div>
            <div className="flex gap-4 text-center">
              <div className="px-4">
                <p className="text-2xl font-bold text-brown-900">45</p>
                <p className="text-xs text-coffee-400">Orders</p>
              </div>
              <div className="px-4 border-x border-cream-200">
                <p className="text-2xl font-bold text-brown-900">12</p>
                <p className="text-xs text-coffee-400">Reservations</p>
              </div>
              <div className="px-4">
                <p className="text-2xl font-bold text-coffee-500">
                  {formatCurrency(4250000)}
                </p>
                <p className="text-xs text-coffee-400">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-coffee-500 text-white"
                  : "text-coffee-600 hover:bg-cream-100"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Profile" && (
          <div className="bg-white rounded-2xl shadow-sm shadow-brown-900/5 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-brown-900">
                Personal Information
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-coffee-300 text-coffee-600 hover:bg-coffee-50 transition-colors">
                {isEditing ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <Edit3 className="w-4 h-4" />
                )}
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone
                  </span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Change Password
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 focus:outline-none focus:ring-2 focus:ring-coffee-400"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Orders" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <ShoppingBag className="w-6 h-6 text-coffee-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-brown-900">45</p>
                <p className="text-xs text-coffee-400">Total Orders</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-coffee-500 mt-5">
                  {formatCurrency(4250000)}
                </p>
                <p className="text-xs text-coffee-400">Total Spent</p>
              </div>
            </div>
            {mockOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brown-900">
                    {order.orderCode}
                  </p>
                  <p className="text-sm text-coffee-400">
                    {formatDate(order.createdAt)} &middot; {order.items.length}{" "}
                    items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brown-900">
                    {formatCurrency(order.total)}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Reservations" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <Calendar className="w-6 h-6 text-coffee-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-brown-900">12</p>
                <p className="text-xs text-coffee-400">Total Reservations</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-green-600 mt-5">2</p>
                <p className="text-xs text-coffee-400">Upcoming</p>
              </div>
            </div>
            {mockReservations.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brown-900">
                    {res.bookingCode}
                  </p>
                  <p className="text-sm text-coffee-400">
                    {formatDate(res.date)} &middot; {res.timeSlot} &middot;{" "}
                    {res.pax} pax
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(res.status)}`}>
                  {res.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
