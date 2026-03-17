"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/lib/types";

interface MenuFilterProps {
  categories: MenuCategory[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  sortBy: string;
  onSort: (sort: string) => void;
}

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price Low-High" },
  { value: "price-desc", label: "Price High-Low" },
  { value: "name-asc", label: "Name A-Z" },
];

export default function MenuFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearch,
  sortBy,
  onSort,
}: MenuFilterProps) {
  return (
    <div className="space-y-4">
      {/* Category pills */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0">
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              selectedCategory === "all"
                ? "bg-coffee-500 text-white shadow-sm shadow-coffee-500/20"
                : "bg-white text-brown-700 ring-1 ring-cream-200 hover:bg-cream-100 hover:text-coffee-500",
            )}>
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                selectedCategory === cat.slug
                  ? "bg-coffee-500 text-white shadow-sm shadow-coffee-500/20"
                  : "bg-white text-brown-700 ring-1 ring-cream-200 hover:bg-cream-100 hover:text-coffee-500",
              )}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brown-700/40"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className={cn(
              "w-full rounded-xl border-0 bg-white py-2.5 pl-10 pr-4 text-sm text-brown-900",
              "ring-1 ring-cream-200 placeholder:text-brown-700/40",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-coffee-400",
            )}
            aria-label="Search menu items"
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative flex items-center gap-2">
          <SlidersHorizontal
            className="h-4 w-4 shrink-0 text-brown-700/50"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <select
            value={sortBy}
            onChange={(e) => onSort(e.target.value)}
            className={cn(
              "appearance-none rounded-xl bg-white py-2.5 pl-3 pr-8 text-sm text-brown-900",
              "ring-1 ring-cream-200",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-coffee-400",
              "cursor-pointer",
            )}
            aria-label="Sort menu items">
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
