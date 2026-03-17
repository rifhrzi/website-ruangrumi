"use client";

import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/lib/types";

interface CategoryTabsProps {
  categories: MenuCategory[];
  selected: string;
  onSelect: (slug: string) => void;
}

export default function CategoryTabs({
  categories,
  selected,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        type="button"
        onClick={() => onSelect("all")}
        className={cn(
          "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          selected === "all"
            ? "bg-coffee-500 text-white shadow-sm"
            : "bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-50",
        )}>
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.slug)}
          className={cn(
            "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            selected === cat.slug
              ? "bg-coffee-500 text-white shadow-sm"
              : "bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-50",
          )}>
          {cat.name}
        </button>
      ))}
    </div>
  );
}
