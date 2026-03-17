"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Grid,
  List,
  Edit,
  Trash2,
  Star,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { menuItems, menuCategories } from "@/lib/data/menu";
import { cn, formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/lib/types";
import Image from "next/image";

type ViewMode = "grid" | "table";

interface MenuFormData {
  name: string;
  categoryId: string;
  description: string;
  price: string;
  isAvailable: boolean;
  isBestSeller: boolean;
}

const emptyFormData: MenuFormData = {
  name: "",
  categoryId: menuCategories[0]?.id ?? "",
  description: "",
  price: "",
  isAvailable: true,
  isBestSeller: false,
};

export default function MenuManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [items, setItems] = useState(menuItems);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuFormData>(emptyFormData);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || item.categoryId === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.isAvailable) ||
        (availabilityFilter === "unavailable" && !item.isAvailable);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [items, searchQuery, categoryFilter, availabilityFilter]);

  const getCategoryName = (categoryId: string) => {
    return menuCategories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const hasImage = (item: MenuItem) => {
    return !!item.image && !imageErrors[item.id];
  };

  const markImageError = (id: string) => {
    setImageErrors((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const toggleAvailability = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item,
      ),
    );
  };

  const handleDelete = (itemId: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setEditingItem(null);
    setFormData(emptyFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      categoryId: item.categoryId,
      description: item.description,
      price: item.price.toString(),
      isAvailable: item.isAvailable,
      isBestSeller: item.isBestSeller,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(emptyFormData);
  };

  const handleSave = () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) return;
    if (!formData.categoryId) return;

    const price = Number(formData.price);
    if (isNaN(price) || price < 0) return;

    const slug = trimmedName.toLowerCase().replace(/\s+/g, "-");

    if (editingItem) {
      // Update existing item
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: trimmedName,
                slug,
                categoryId: formData.categoryId,
                description: formData.description.trim(),
                price,
                isAvailable: formData.isAvailable,
                isBestSeller: formData.isBestSeller,
              }
            : item,
        ),
      );
    } else {
      // Create new item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        categoryId: formData.categoryId,
        name: trimmedName,
        slug,
        description: formData.description.trim(),
        image: "",
        price,
        isAvailable: formData.isAvailable,
        isBestSeller: formData.isBestSeller,
        rating: 0,
        totalOrders: 0,
        variants: [],
        addons: [],
      };
      setItems((prev) => [...prev, newItem]);
    }

    closeModal();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">Menu Management</h1>
          <p className="mt-1 text-sm text-charcoal-700/60">
            Manage your cafe menu items and availability
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-coffee-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-coffee-600">
          <Plus className="h-4 w-4" />
          Add New Item
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-cream-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-700/40" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-cream-200 bg-cream-50 py-2 pl-10 pr-4 text-sm text-charcoal-800 placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400">
            <option value="all">All Categories</option>
            {menuCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Availability */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          {/* View Toggle */}
          <div className="flex rounded-lg border border-cream-200 bg-cream-50">
            <button
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1.5 rounded-l-lg px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-coffee-500 text-white"
                  : "text-charcoal-700 hover:bg-cream-100"
              }`}>
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 rounded-r-lg px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-coffee-500 text-white"
                  : "text-charcoal-700 hover:bg-cream-100"
              }`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-charcoal-700/60">
        Showing{" "}
        <span className="font-medium text-charcoal-800">
          {filteredItems.length}
        </span>{" "}
        items
      </p>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-cream-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              {/* Image Placeholder */}
              <div className="relative aspect-[4/3] bg-cream-100">
                {hasImage(item) ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 95vw, (max-width: 1024px) 48vw, 23vw"
                    className="object-cover"
                    onError={() => markImageError(item.id)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-sm text-charcoal-700/30">
                      No Image
                    </span>
                  </div>
                )}
                {item.isBestSeller && (
                  <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-gold-400 px-2.5 py-0.5 text-xs font-semibold text-white shadow">
                    <Star className="h-3 w-3 fill-current" />
                    Best Seller
                  </div>
                )}
                {!item.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-charcoal-900/40">
                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                      Unavailable
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-charcoal-800 line-clamp-1">
                    {item.name}
                  </h3>
                </div>
                <p className="mb-2 text-xs text-charcoal-700/50">
                  {getCategoryName(item.categoryId)}
                </p>
                <p className="text-sm font-bold text-coffee-500">
                  {formatCurrency(item.price)}
                </p>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between border-t border-cream-100 pt-3">
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-700 transition-colors hover:text-coffee-500">
                    {item.isAvailable ? (
                      <>
                        <ToggleRight className="h-5 w-5 text-green-500" />
                        <span>Available</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-5 w-5 text-gray-400" />
                        <span>Unavailable</span>
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="rounded-lg p-1.5 text-charcoal-700/50 transition-colors hover:bg-cream-50 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-1.5 text-charcoal-700/50 transition-colors hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="overflow-hidden rounded-xl border border-cream-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                    Best Seller
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-charcoal-700/50">
                      No menu items found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-cream-50/60">
                      <td className="px-4 py-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-cream-100">
                          {hasImage(item) ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                              onError={() => markImageError(item.id)}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-[8px] text-charcoal-700/30">
                                IMG
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-charcoal-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-charcoal-700/50 line-clamp-1">
                          {item.description}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-medium text-charcoal-700">
                          {getCategoryName(item.categoryId)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-charcoal-800">
                          {formatCurrency(item.price)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleAvailability(item.id)}
                          className="inline-flex items-center gap-1.5">
                          {item.isAvailable ? (
                            <>
                              <ToggleRight className="h-5 w-5 text-green-500" />
                              <span className="text-xs font-medium text-green-700">
                                Available
                              </span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-5 w-5 text-gray-400" />
                              <span className="text-xs font-medium text-gray-500">
                                Unavailable
                              </span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {item.isBestSeller ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/20 px-2.5 py-0.5 text-xs font-medium text-gold-600">
                            <Star className="h-3 w-3 fill-current" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs text-charcoal-700/40">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="rounded-lg p-1.5 text-charcoal-700/50 transition-colors hover:bg-cream-50 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg p-1.5 text-charcoal-700/50 transition-colors hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Panel */}
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-2xl border border-cream-200 bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-cream-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-brown-900">
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-charcoal-700/50 transition-colors hover:bg-cream-100 hover:text-charcoal-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(100vh-16rem)] space-y-4 overflow-y-auto px-6 py-5">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal-800">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Iced Caramel Latte"
                  className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal-800">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400">
                  {menuCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal-800">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Short description of the menu item"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal-800">
                  Price (IDR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="e.g. 35000"
                  className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4">
                {/* Available toggle */}
                <div className="rounded-lg border border-cream-200 bg-cream-50 p-3">
                  <label className="mb-2 block text-sm font-medium text-charcoal-800">
                    Available
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isAvailable: !prev.isAvailable,
                      }))
                    }
                    className="inline-flex items-center gap-2">
                    {formData.isAvailable ? (
                      <ToggleRight className="h-6 w-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        formData.isAvailable
                          ? "text-green-700"
                          : "text-gray-500",
                      )}>
                      {formData.isAvailable ? "Yes" : "No"}
                    </span>
                  </button>
                </div>

                {/* Best Seller toggle */}
                <div className="rounded-lg border border-cream-200 bg-cream-50 p-3">
                  <label className="mb-2 block text-sm font-medium text-charcoal-800">
                    Best Seller
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isBestSeller: !prev.isBestSeller,
                      }))
                    }
                    className="inline-flex items-center gap-2">
                    {formData.isBestSeller ? (
                      <ToggleRight className="h-6 w-6 text-gold-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        formData.isBestSeller
                          ? "text-gold-600"
                          : "text-gray-500",
                      )}>
                      {formData.isBestSeller ? "Yes" : "No"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-cream-200 px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-lg border border-cream-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:bg-cream-50">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name.trim() || !formData.price}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors",
                  formData.name.trim() && formData.price
                    ? "bg-coffee-500 hover:bg-coffee-600"
                    : "cursor-not-allowed bg-coffee-300",
                )}>
                {editingItem ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
