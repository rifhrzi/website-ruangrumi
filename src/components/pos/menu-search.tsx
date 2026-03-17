"use client";

import { Search } from "lucide-react";

interface MenuSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export default function MenuSearch({ value, onChange }: MenuSearchProps) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-700/40"
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder="Search menu items..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-cream-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
      />
    </div>
  );
}
