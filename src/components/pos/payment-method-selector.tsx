"use client";

import {
  Banknote,
  QrCode,
  Building2,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePosStore } from "@/lib/stores/pos-store";
import type { PaymentMethod } from "@/lib/types";

const METHODS: {
  value: PaymentMethod;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "qris", label: "QRIS", icon: QrCode },
  { value: "transfer", label: "Transfer", icon: Building2 },
  { value: "e-wallet", label: "E-Wallet", icon: Smartphone },
  { value: "debit", label: "Debit", icon: CreditCard },
  { value: "credit", label: "Credit", icon: CreditCard },
];

export default function PaymentMethodSelector() {
  const paymentMethod = usePosStore((s) => s.paymentMethod);
  const setPaymentMethod = usePosStore((s) => s.setPaymentMethod);

  return (
    <div className="grid grid-cols-3 gap-2">
      {METHODS.map((m) => {
        const Icon = m.icon;
        const active = paymentMethod === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => setPaymentMethod(m.value)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors",
              active
                ? "border-coffee-500 bg-coffee-500/10 text-coffee-600"
                : "border-cream-200 bg-cream-50 text-charcoal-700 hover:border-coffee-300 hover:bg-cream-100",
            )}>
            <Icon className="h-4 w-4" aria-hidden="true" />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
