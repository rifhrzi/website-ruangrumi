"use client";

import { useState, useCallback } from "react";
import {
  Store,
  Clock,
  Receipt,
  CreditCard,
  CalendarCog,
  Save,
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Cafe Profile", icon: Store },
  { id: "hours", label: "Operating Hours", icon: Clock },
  { id: "tax", label: "Tax & Charges", icon: Receipt },
  { id: "payment", label: "Payment Methods", icon: CreditCard },
  { id: "reservation", label: "Reservation Policy", icon: CalendarCog },
] as const;

type TabId = (typeof tabs)[number]["id"];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface HoursEntry {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

interface PaymentMethod {
  id: string;
  label: string;
  enabled: boolean;
}

interface ReservationPolicy {
  minDuration: number;
  maxDuration: number;
  maxPax: number;
  advanceBookingDays: number;
  allowTableMerge: boolean;
  autoConfirm: boolean;
}

interface Settings {
  cafeName: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  hours: HoursEntry[];
  taxRate: number;
  serviceCharge: number;
  currency: string;
  paymentMethods: PaymentMethod[];
  reservationPolicy: ReservationPolicy;
}

const initialSettings: Settings = {
  cafeName: "Ruang Rumi",
  address: "Jl. Raya Cafe No. 123, Jakarta Selatan 12345",
  phone: "021-1234567",
  email: "hello@ruangrumi.id",
  description:
    "Premium cafe experience with artisan coffee, curated menu, and cozy ambience. Where every sip tells a story.",
  hours: days.map((d) => ({
    day: d,
    open: d === "Saturday" || d === "Sunday" ? "09:00" : "08:00",
    close: d === "Saturday" || d === "Sunday" ? "23:00" : "22:00",
    isClosed: false,
  })),
  taxRate: 11,
  serviceCharge: 5,
  currency: "IDR",
  paymentMethods: [
    { id: "cash", label: "Cash", enabled: true },
    { id: "qris", label: "QRIS", enabled: true },
    { id: "transfer", label: "Bank Transfer", enabled: true },
    { id: "e-wallet", label: "E-Wallet (GoPay, OVO, Dana)", enabled: true },
    { id: "debit", label: "Debit Card", enabled: false },
    { id: "credit", label: "Credit Card", enabled: false },
  ],
  reservationPolicy: {
    minDuration: 60,
    maxDuration: 180,
    maxPax: 20,
    advanceBookingDays: 30,
    allowTableMerge: true,
    autoConfirm: false,
  },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [saved, setSaved] = useState(false);

  // Generic field updater for top-level string/number fields
  const updateField = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Hours updater
  const updateHours = useCallback(
    (index: number, field: keyof HoursEntry, value: string | boolean) => {
      setSettings((prev) => {
        const next = [...prev.hours];
        next[index] = { ...next[index], [field]: value };
        return { ...prev, hours: next };
      });
    },
    [],
  );

  // Payment method toggle
  const togglePaymentMethod = useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((pm) =>
        pm.id === id ? { ...pm, enabled: !pm.enabled } : pm,
      ),
    }));
  }, []);

  // Reservation policy updater
  const updateReservation = useCallback(
    <K extends keyof ReservationPolicy>(
      key: K,
      value: ReservationPolicy[K],
    ) => {
      setSettings((prev) => ({
        ...prev,
        reservationPolicy: { ...prev.reservationPolicy, [key]: value },
      }));
    },
    [],
  );

  // Save handler with temporary "Saved!" feedback
  const handleSave = useCallback(() => {
    // In a real app you would POST settings to an API here
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brown-900">Settings</h1>
        <p className="text-coffee-400 text-sm mt-1">
          Manage cafe configuration and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-56 shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors w-full text-left ${
                  activeTab === tab.id
                    ? "bg-coffee-500 text-white"
                    : "text-coffee-600 hover:bg-cream-100"
                }`}>
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm shadow-brown-900/5 p-6 md:p-8">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-brown-900">
                Cafe Profile
              </h2>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                  Cafe Name
                </label>
                <input
                  type="text"
                  value={settings.cafeName}
                  onChange={(e) => updateField("cafeName", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                  Address
                </label>
                <textarea
                  value={settings.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                  Description
                </label>
                <textarea
                  value={settings.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                  Logo
                </label>
                <div className="border-2 border-dashed border-cream-300 rounded-xl p-8 text-center hover:border-coffee-400 transition-colors cursor-pointer">
                  <Store className="w-8 h-8 text-cream-400 mx-auto mb-2" />
                  <p className="text-sm text-coffee-400">
                    Click to upload logo
                  </p>
                  <p className="text-xs text-cream-400 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "hours" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-brown-900">
                Operating Hours
              </h2>
              <div className="space-y-3">
                {settings.hours.map((h, i) => (
                  <div
                    key={h.day}
                    className="flex items-center gap-4 p-3 bg-cream-50 rounded-xl">
                    <span className="w-24 text-sm font-medium text-brown-900">
                      {h.day}
                    </span>
                    <input
                      type="time"
                      value={h.open}
                      onChange={(e) => updateHours(i, "open", e.target.value)}
                      disabled={h.isClosed}
                      className="px-3 py-1.5 rounded-lg border border-cream-300 bg-white text-sm text-brown-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-coffee-400 text-sm">to</span>
                    <input
                      type="time"
                      value={h.close}
                      onChange={(e) => updateHours(i, "close", e.target.value)}
                      disabled={h.isClosed}
                      className="px-3 py-1.5 rounded-lg border border-cream-300 bg-white text-sm text-brown-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <label className="flex items-center gap-2 ml-auto text-sm">
                      <input
                        type="checkbox"
                        checked={h.isClosed}
                        onChange={(e) =>
                          updateHours(i, "isClosed", e.target.checked)
                        }
                        className="rounded border-cream-300 text-coffee-500 focus:ring-coffee-400"
                      />
                      <span className="text-coffee-400">Closed</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tax" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-brown-900">
                Tax & Service Charges
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) =>
                      updateField("taxRate", parseFloat(e.target.value) || 0)
                    }
                    min={0}
                    max={100}
                    step={0.5}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                  />
                  <p className="text-xs text-coffee-400 mt-1">
                    PPN applied to all orders
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                    Service Charge (%)
                  </label>
                  <input
                    type="number"
                    value={settings.serviceCharge}
                    onChange={(e) =>
                      updateField(
                        "serviceCharge",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    min={0}
                    max={100}
                    step={0.5}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                  />
                  <p className="text-xs text-coffee-400 mt-1">
                    Applied to dine-in orders only
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => updateField("currency", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400">
                  <option value="IDR">IDR - Indonesian Rupiah</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-brown-900">
                Payment Methods
              </h2>
              <p className="text-sm text-coffee-400">
                Enable or disable payment methods for your cafe.
              </p>
              <div className="space-y-3">
                {settings.paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="flex items-center justify-between p-4 bg-cream-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-coffee-500" />
                      <span className="text-sm font-medium text-brown-900">
                        {pm.label}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePaymentMethod(pm.id)}
                      className={`relative w-10 h-6 rounded-full cursor-pointer transition-colors ${
                        pm.enabled ? "bg-green-500" : "bg-gray-300"
                      }`}
                      aria-label={`Toggle ${pm.label}`}
                      aria-checked={pm.enabled}
                      role="switch">
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          pm.enabled ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reservation" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-brown-900">
                Reservation Policy
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                    Min Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.reservationPolicy.minDuration}
                    onChange={(e) =>
                      updateReservation(
                        "minDuration",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    min={30}
                    step={30}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                    Max Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.reservationPolicy.maxDuration}
                    onChange={(e) =>
                      updateReservation(
                        "maxDuration",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    min={60}
                    step={30}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                    Max Pax per Reservation
                  </label>
                  <input
                    type="number"
                    value={settings.reservationPolicy.maxPax}
                    onChange={(e) =>
                      updateReservation("maxPax", parseInt(e.target.value) || 0)
                    }
                    min={1}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-1.5">
                    Advance Booking (days)
                  </label>
                  <input
                    type="number"
                    value={settings.reservationPolicy.advanceBookingDays}
                    onChange={(e) =>
                      updateReservation(
                        "advanceBookingDays",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    min={1}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-4 bg-cream-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-brown-900">
                      Allow Table Merge
                    </p>
                    <p className="text-xs text-coffee-400">
                      Allow combining tables for larger groups
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateReservation(
                        "allowTableMerge",
                        !settings.reservationPolicy.allowTableMerge,
                      )
                    }
                    className={`relative w-10 h-6 rounded-full cursor-pointer transition-colors ${
                      settings.reservationPolicy.allowTableMerge
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                    aria-label="Toggle Allow Table Merge"
                    aria-checked={settings.reservationPolicy.allowTableMerge}
                    role="switch">
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.reservationPolicy.allowTableMerge
                          ? "translate-x-5"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-cream-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-brown-900">
                      Auto Confirm
                    </p>
                    <p className="text-xs text-coffee-400">
                      Automatically confirm new reservations
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateReservation(
                        "autoConfirm",
                        !settings.reservationPolicy.autoConfirm,
                      )
                    }
                    className={`relative w-10 h-6 rounded-full cursor-pointer transition-colors ${
                      settings.reservationPolicy.autoConfirm
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                    aria-label="Toggle Auto Confirm"
                    aria-checked={settings.reservationPolicy.autoConfirm}
                    role="switch">
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.reservationPolicy.autoConfirm
                          ? "translate-x-5"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-cream-200">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-coffee-500 text-white rounded-xl font-medium hover:bg-coffee-600 transition-colors">
                <Save className="w-4 h-4" /> Save Settings
              </button>
              {saved && (
                <span className="text-sm font-medium text-green-600 animate-pulse">
                  Saved!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
