"use client";

import { useState, useMemo } from "react";
import { Coffee } from "lucide-react";
import MenuFilter from "@/components/menu/menu-filter";
import MenuCard from "@/components/menu/menu-card";
import { menuCategories, menuItems } from "@/lib/data/menu";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const filteredItems = useMemo(() => {
    let items = [...menuItems];

    // Filter by category
    if (selectedCategory !== "all") {
      const category = menuCategories.find((c) => c.slug === selectedCategory);
      if (category) {
        items = items.filter((item) => item.categoryId === category.id);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    // Sort
    switch (sortBy) {
      case "popular":
        items.sort((a, b) => (b.totalOrders ?? 0) - (a.totalOrders ?? 0));
        break;
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return items;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-brown-900 sm:text-4xl">
          Our Menu
        </h1>
        <p className="mt-2 text-base text-brown-700/70">
          Discover our carefully curated selection of artisan beverages and
          culinary delights
        </p>
      </div>

      {/* Filter bar */}
      <MenuFilter
        categories={menuCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        sortBy={sortBy}
        onSort={setSortBy}
      />

      {/* Item count */}
      <div className="mt-6 mb-4 text-sm text-brown-700/60">
        Showing{" "}
        <span className="font-semibold text-brown-900">
          {filteredItems.length}
        </span>{" "}
        {filteredItems.length === 1 ? "item" : "items"}
        {selectedCategory !== "all" && (
          <>
            {" "}
            in{" "}
            <span className="font-semibold text-coffee-500 capitalize">
              {selectedCategory.replace("-", " ")}
            </span>
          </>
        )}
      </div>

      {/* Menu grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-cream-300 bg-cream-50 px-6 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-200">
            <Coffee className="h-8 w-8 text-coffee-400" strokeWidth={1.5} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-brown-900">
            No items found
          </h3>
          <p className="mt-1 text-sm text-brown-700/60 text-center max-w-xs">
            Try adjusting your search or filter to find what you are looking
            for.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 rounded-full bg-coffee-500 px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-brown-700">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
