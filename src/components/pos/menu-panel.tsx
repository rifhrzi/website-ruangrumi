"use client";

import { useState, useMemo } from "react";
import { Coffee } from "lucide-react";
import { menuCategories, menuItems } from "@/lib/data/menu";
import CategoryTabs from "./category-tabs";
import MenuSearch from "./menu-search";
import MenuItemCard from "./menu-item-card";

export default function MenuPanel() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    let items = [...menuItems];

    if (selectedCategory !== "all") {
      const category = menuCategories.find((c) => c.slug === selectedCategory);
      if (category) {
        items = items.filter((item) => item.categoryId === category.id);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter((item) => item.name.toLowerCase().includes(q));
    }

    items.sort((a, b) => {
      if (a.isAvailable === b.isAvailable) return 0;
      return a.isAvailable ? -1 : 1;
    });

    return items;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex h-full flex-col bg-cream-50">
      {/* Filters */}
      <div className="shrink-0 space-y-3 border-b border-cream-200 bg-white px-4 py-3">
        <CategoryTabs
          categories={menuCategories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <MenuSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-200">
              <Coffee className="h-7 w-7 text-coffee-400" strokeWidth={1.5} />
            </div>
            <p className="mt-3 text-sm font-medium text-brown-900">
              No items found
            </p>
            <p className="mt-1 text-xs text-charcoal-700/50">
              Try adjusting your search or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
