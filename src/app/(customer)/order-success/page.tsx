"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Clock, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("code") || "ORD-00000000";

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg shadow-brown-900/5 p-8 md:p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-brown-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-coffee-500 mb-8">
            Thank you for your order. We&apos;re preparing it with love.
          </p>

          <div className="bg-cream-100 rounded-xl p-6 mb-8">
            <p className="text-sm text-coffee-500 mb-1">Order Code</p>
            <p className="text-2xl font-bold text-brown-900 font-mono tracking-wider">
              {orderCode}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 text-sm text-coffee-500 mb-8">
            <Clock className="w-4 h-4" />
            <span>Estimated preparation: 15-25 minutes</span>
          </div>

          <div className="space-y-3">
            <Link
              href="/my-orders"
              className="flex items-center justify-center gap-2 w-full py-3 bg-coffee-500 text-white rounded-xl font-semibold hover:bg-coffee-600 transition-colors">
              <ShoppingBag className="w-4 h-4" />
              Track My Order
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3 border border-coffee-300 text-coffee-600 rounded-xl font-semibold hover:bg-coffee-100 transition-colors">
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <div className="animate-pulse text-coffee-500">Loading...</div>
        </div>
      }>
      <OrderSuccessContent />
    </Suspense>
  );
}
