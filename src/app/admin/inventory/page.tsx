"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  AlertTriangle,
  Package,
  Edit,
  Trash2,
  ArrowUpDown,
  X,
} from "lucide-react";
import { mockStockItems } from "@/lib/data/mock";
import { STOCK_CATEGORIES } from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { StockItem, StockCategory, StockUnit } from "@/lib/types";

type SortField = "name" | "sku" | "category" | "currentStock" | "lastRestocked";
type SortDir = "asc" | "desc";

const STOCK_UNITS: StockUnit[] = [
  "gram",
  "kg",
  "ml",
  "liter",
  "pcs",
  "pack",
  "bottle",
  "box",
];

interface FormData {
  name: string;
  sku: string;
  category: StockCategory;
  unit: StockUnit;
  currentStock: string;
  minimumStock: string;
  price: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  sku: "",
  category: "beans",
  unit: "gram",
  currentStock: "",
  minimumStock: "",
  price: "",
};

export default function InventoryPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  const lowStockCount = stockItems.filter((i) => i.isLowStock).length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filteredItems = useMemo(() => {
    let items = [...stockItems];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q),
      );
    }

    if (categoryFilter !== "all") {
      items = items.filter((i) => i.category === categoryFilter);
    }

    items.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "sku":
          cmp = a.sku.localeCompare(b.sku);
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "currentStock":
          cmp = a.currentStock - b.currentStock;
          break;
        case "lastRestocked":
          cmp = (a.lastRestocked ?? "").localeCompare(b.lastRestocked ?? "");
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return items;
  }, [stockItems, search, categoryFilter, sortField, sortDir]);

  const getCategoryLabel = (value: string) =>
    STOCK_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  const getStockPercentage = (current: number, minimum: number) => {
    const ratio = (current / (minimum * 2)) * 100;
    return Math.min(ratio, 100);
  };

  // ----- Modal handlers -----

  const openAddModal = useCallback(() => {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((item: StockItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category,
      unit: item.unit,
      currentStock: String(item.currentStock),
      minimumStock: String(item.minimumStock),
      price: String(item.price),
    });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(EMPTY_FORM);
  }, []);

  const handleFormChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    // Basic validation
    if (!formData.name.trim() || !formData.sku.trim()) return;
    const currentStock = Number(formData.currentStock);
    const minimumStock = Number(formData.minimumStock);
    const price = Number(formData.price);
    if (isNaN(currentStock) || isNaN(minimumStock) || isNaN(price)) return;

    const isLowStock = currentStock < minimumStock;

    if (editingItem) {
      // Edit existing item
      setStockItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formData.name.trim(),
                sku: formData.sku.trim(),
                category: formData.category,
                unit: formData.unit,
                currentStock,
                minimumStock,
                price,
                isLowStock,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
    } else {
      // Add new item
      const newItem: StockItem = {
        id: "stock-" + Date.now(),
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category,
        unit: formData.unit,
        currentStock,
        minimumStock,
        price,
        isLowStock,
        lastRestocked: undefined,
        updatedAt: new Date().toISOString(),
      };
      setStockItems((prev) => [...prev, newItem]);
    }

    closeModal();
  }, [formData, editingItem, closeModal]);

  // ----- Delete handler -----

  const handleDelete = useCallback((item: StockItem) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setStockItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  }, []);

  // ----- Shared input class -----
  const inputClass = cn(
    "w-full rounded-lg border border-cream-300 bg-white px-3 py-2.5 text-sm text-charcoal-900",
    "placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-400/20",
  );

  const labelClass = "block text-sm font-medium text-charcoal-700 mb-1";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-charcoal-700/60">
            Manage stock items, track levels, and monitor inventory movements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory/movements"
            className="inline-flex items-center gap-2 rounded-lg border border-coffee-200 bg-white px-4 py-2.5 text-sm font-medium text-coffee-600 transition-colors hover:bg-cream-50">
            <ArrowUpDown className="h-4 w-4" />
            Movements
          </Link>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-coffee-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-coffee-600">
            <Plus className="h-4 w-4" />
            Add Stock Item
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Low Stock Alert
            </p>
            <p className="text-sm text-amber-700">
              {lowStockCount} item{lowStockCount !== 1 ? "s" : ""} below minimum
              stock level. Restock soon to avoid disruptions.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-700/40" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-cream-300 bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal-900 placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-400/20"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-sm text-charcoal-900 focus:border-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-400/20">
          <option value="all">All Categories</option>
          {STOCK_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-cream-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-50/70">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  <button
                    onClick={() => handleSort("sku")}
                    className="inline-flex items-center gap-1 hover:text-coffee-600">
                    SKU
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  <button
                    onClick={() => handleSort("name")}
                    className="inline-flex items-center gap-1 hover:text-coffee-600">
                    Name
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  <button
                    onClick={() => handleSort("category")}
                    className="inline-flex items-center gap-1 hover:text-coffee-600">
                    Category
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  <button
                    onClick={() => handleSort("currentStock")}
                    className="inline-flex items-center gap-1 hover:text-coffee-600">
                    Stock Level
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  Min Stock
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  Unit
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700">
                  <button
                    onClick={() => handleSort("lastRestocked")}
                    className="inline-flex items-center gap-1 hover:text-coffee-600">
                    Last Restocked
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-charcoal-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredItems.map((item) => {
                const pct = getStockPercentage(
                  item.currentStock,
                  item.minimumStock,
                );
                const barColor = item.isLowStock
                  ? "bg-red-500"
                  : pct < 60
                    ? "bg-amber-400"
                    : "bg-emerald-500";

                return (
                  <tr
                    key={item.id}
                    className={
                      item.isLowStock
                        ? "bg-red-50/50 hover:bg-red-50"
                        : "hover:bg-cream-50/50"
                    }>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-charcoal-700/70">
                      {item.sku}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-coffee-400" />
                        <span className="font-medium text-charcoal-900">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-charcoal-700">
                      {getCategoryLabel(item.category)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="min-w-[40px] font-semibold text-charcoal-900">
                          {item.currentStock}
                        </span>
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-cream-200">
                          <div
                            className={`h-full rounded-full transition-all ${barColor}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-charcoal-700">
                      {item.minimumStock}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-charcoal-700 capitalize">
                      {item.unit}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {item.isLowStock ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                          <AlertTriangle className="h-3 w-3" />
                          Low
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-charcoal-700">
                      {item.lastRestocked
                        ? formatDate(item.lastRestocked)
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-lg p-2 text-charcoal-700/60 transition-colors hover:bg-cream-100 hover:text-coffee-600"
                          title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="rounded-lg p-2 text-charcoal-700/60 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <Package className="mx-auto h-10 w-10 text-cream-300" />
                    <p className="mt-2 text-sm font-medium text-charcoal-700/60">
                      No stock items found
                    </p>
                    <p className="text-xs text-charcoal-700/40">
                      Try adjusting your search or filter criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between border-t border-cream-200 bg-cream-50/50 px-4 py-3">
          <p className="text-sm text-charcoal-700/60">
            Showing{" "}
            <span className="font-medium text-charcoal-900">
              {filteredItems.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-charcoal-900">
              {stockItems.length}
            </span>{" "}
            items
          </p>
          <p className="text-sm text-charcoal-700/60">
            Total Value:{" "}
            <span className="font-semibold text-charcoal-900">
              {formatCurrency(
                filteredItems.reduce(
                  (sum, i) => sum + i.price * i.currentStock,
                  0,
                ),
              )}
            </span>
          </p>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}>
          <div className="w-full max-w-lg rounded-xl border border-cream-200 bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-cream-200 px-6 py-4">
              <h2 className="text-lg font-bold text-charcoal-900">
                {editingItem ? "Edit Stock Item" : "Add Stock Item"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-charcoal-700/60 transition-colors hover:bg-cream-100 hover:text-charcoal-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 px-6 py-5">
              {/* Name */}
              <div>
                <label htmlFor="modal-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="modal-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="e.g. Arabica Coffee Beans"
                  className={inputClass}
                />
              </div>

              {/* SKU */}
              <div>
                <label htmlFor="modal-sku" className={labelClass}>
                  SKU
                </label>
                <input
                  id="modal-sku"
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleFormChange("sku", e.target.value)}
                  placeholder="e.g. BN-001"
                  className={inputClass}
                />
              </div>

              {/* Category + Unit row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-category" className={labelClass}>
                    Category
                  </label>
                  <select
                    id="modal-category"
                    value={formData.category}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    className={inputClass}>
                    {STOCK_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="modal-unit" className={labelClass}>
                    Unit
                  </label>
                  <select
                    id="modal-unit"
                    value={formData.unit}
                    onChange={(e) => handleFormChange("unit", e.target.value)}
                    className={inputClass}>
                    {STOCK_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Stock + Minimum Stock row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-currentStock" className={labelClass}>
                    Current Stock
                  </label>
                  <input
                    id="modal-currentStock"
                    type="number"
                    min="0"
                    value={formData.currentStock}
                    onChange={(e) =>
                      handleFormChange("currentStock", e.target.value)
                    }
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="modal-minimumStock" className={labelClass}>
                    Minimum Stock
                  </label>
                  <input
                    id="modal-minimumStock"
                    type="number"
                    min="0"
                    value={formData.minimumStock}
                    onChange={(e) =>
                      handleFormChange("minimumStock", e.target.value)
                    }
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="modal-price" className={labelClass}>
                  Price (IDR)
                </label>
                <input
                  id="modal-price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleFormChange("price", e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-cream-200 px-6 py-4">
              <button
                onClick={closeModal}
                className={cn(
                  "rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-sm font-medium text-charcoal-700",
                  "transition-colors hover:bg-cream-50",
                )}>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.sku.trim()}
                className={cn(
                  "rounded-lg bg-coffee-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm",
                  "transition-colors hover:bg-coffee-600",
                  "disabled:cursor-not-allowed disabled:opacity-50",
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
