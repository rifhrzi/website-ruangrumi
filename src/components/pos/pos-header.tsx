"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import Logo from "@/components/ui/logo";

export default function PosHeader() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 bg-charcoal-900 px-4">
      <div className="flex items-center gap-3">
        <Logo variant="light" size="sm" />
        <span className="rounded-md bg-coffee-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          POS
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm text-cream-200">
          <Clock className="h-4 w-4 text-cream-200/60" aria-hidden="true" />
          {time}
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-cream-200 transition-colors hover:bg-white/10 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to Admin
        </Link>
      </div>
    </header>
  );
}
