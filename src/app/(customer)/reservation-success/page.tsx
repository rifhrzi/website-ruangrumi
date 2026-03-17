"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarCheck,
  ArrowRight,
  Info,
  Home,
  ListChecks,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const code = searchParams.get("code") || "RR-XXXXXX";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const pax = searchParams.get("pax") || "";
  const table = searchParams.get("table") || "";
  const tableNum = searchParams.get("tableNum") || "";

  function formatDisplayDate(dateStr: string): string {
    if (!dateStr) return "-";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Success card */}
        <div className="rounded-3xl bg-white border border-cream-200 shadow-xl shadow-brown-900/5 overflow-hidden">
          {/* Top accent */}
          <div className="gradient-coffee px-6 py-10 text-center">
            {/* Animated check icon */}
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-4 ring-white/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30">
                <CalendarCheck className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-cream-50 sm:text-3xl">
              Reservation Confirmed!
            </h1>
            <p className="mt-2 text-sm text-cream-300">
              Your table has been successfully reserved
            </p>
          </div>

          {/* Booking code */}
          <div className="px-6 -mt-5">
            <div className="rounded-2xl bg-cream-50 border-2 border-dashed border-coffee-300 p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-coffee-400 mb-2">
                Booking Code
              </p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-3xl font-extrabold tracking-[0.15em] text-brown-900 font-mono">
                  {code}
                </p>
                <button
                  type="button"
                  onClick={copyCode}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                    copied
                      ? "bg-green-100 text-green-600"
                      : "bg-cream-200 text-brown-700 hover:bg-cream-300",
                  )}
                  aria-label="Copy booking code">
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="mt-1 text-xs text-green-600 font-medium">
                  Copied to clipboard!
                </p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="px-6 pt-6 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brown-800 mb-3">
              Booking Details
            </h3>
            <div className="space-y-3">
              {[
                { label: "Date", value: formatDisplayDate(date) },
                { label: "Time", value: time || "-" },
                {
                  label: "Guests",
                  value: pax
                    ? `${pax} ${Number(pax) === 1 ? "person" : "people"}`
                    : "-",
                },
                {
                  label: "Table",
                  value: table ? `${table} (#${tableNum})` : "-",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl bg-cream-50 px-4 py-3 border border-cream-200">
                  <span className="text-sm text-coffee-400">{item.label}</span>
                  <span className="text-sm font-semibold text-brown-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div className="px-6 py-5">
            <div className="rounded-xl bg-gold-400/10 border border-gold-400/20 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-gold-500 shrink-0" />
                <p className="text-sm font-semibold text-brown-800">
                  Important Reminders
                </p>
              </div>
              <ul className="space-y-2 text-sm text-brown-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  Please arrive on time. Your reservation will be held for 15
                  minutes.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  Show this booking code to our staff upon arrival.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  For cancellations, please notify us at least 2 hours in
                  advance.
                </li>
              </ul>
            </div>
          </div>

          {/* CTAs */}
          <div className="px-6 pb-6 space-y-3">
            <Link
              href="/my-reservations"
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all",
                "bg-coffee-500 text-white",
                "hover:bg-brown-700 active:scale-[0.98]",
                "shadow-lg shadow-coffee-500/20",
              )}>
              <ListChecks className="h-4 w-4" />
              View My Reservations
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all",
                "border border-cream-300 text-brown-700",
                "hover:bg-cream-200 hover:text-brown-900",
              )}>
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReservationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cream-200 border-t-coffee-500" />
        </div>
      }>
      <SuccessContent />
    </Suspense>
  );
}
