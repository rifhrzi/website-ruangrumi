"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, GripVertical, X } from "lucide-react";
import { menuCategories } from "@/lib/data/menu";
import { menuItems } from "@/lib/data/menu";
import { MenuCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
}

const emptyForm: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  order: 1,
  isActive: true,
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<MenuCategory[]>(menuCategories);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [form, setForm] = useState<CategoryFormData>(emptyForm);
  const [autoSlug, setAutoSlug] = useState(true);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const isEditing = editingCategoryId !== null;

  // Focus name input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      // Small delay to let the modal render before focusing
      const timer = setTimeout(() => nameInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const getItemCount = (categoryId: string) => {
    return menuItems.filter((item) => item.categoryId === categoryId).length;
  };

  const handleDelete = (categoryId: string) => {
    const itemCount = getItemCount(categoryId);
    if (itemCount > 0) {
      alert(
        `Cannot delete category with ${itemCount} item(s). Please reassign items first.`,
      );
      return;
    }
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    }
  };

  const toggleActive = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, isActive: !c.isActive } : c,
      ),
    );
  };

  // --- Modal handlers ---

  const openAddModal = () => {
    setEditingCategoryId(null);
    setForm({
      ...emptyForm,
      order: categories.length + 1,
    });
    setAutoSlug(true);
    setIsModalOpen(true);
  };

  const openEditModal = (category: MenuCategory) => {
    setEditingCategoryId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      order: category.order,
      isActive: category.isActive,
    });
    setAutoSlug(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategoryId(null);
    setForm(emptyForm);
    setAutoSlug(true);
  };

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: autoSlug ? generateSlug(value) : prev.slug,
    }));
  };

  const handleSlugChange = (value: string) => {
    setAutoSlug(false);
    setForm((prev) => ({
      ...prev,
      slug: generateSlug(value),
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (!form.slug.trim()) return;

    if (isEditing) {
      // Update existing category
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategoryId
            ? {
                ...c,
                name: form.name.trim(),
                slug: form.slug.trim(),
                description: form.description.trim() || undefined,
                order: form.order,
                isActive: form.isActive,
              }
            : c,
        ),
      );
    } else {
      // Add new category
      const newCategory: MenuCategory = {
        id: "cat-" + Date.now(),
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        order: form.order,
        isActive: form.isActive,
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    closeModal();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">Menu Categories</h1>
          <p className="mt-1 text-sm text-charcoal-700/60">
            Organize your menu with categories. Drag to reorder.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-coffee-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-coffee-600">
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group flex items-center gap-4 rounded-xl border border-cream-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            {/* Drag Handle */}
            <div className="cursor-grab text-charcoal-700/30 transition-colors hover:text-charcoal-700/60 active:cursor-grabbing">
              <GripVertical className="h-5 w-5" />
            </div>

            {/* Order Number */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cream-100 text-sm font-bold text-coffee-500">
              {category.order}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-charcoal-800">
                  {category.name}
                </h3>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    category.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500",
                  )}>
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-charcoal-700/50">
                Slug: <span className="font-mono">{category.slug}</span>
              </p>
              {category.description && (
                <p className="mt-0.5 text-xs text-charcoal-700/50 line-clamp-1">
                  {category.description}
                </p>
              )}
            </div>

            {/* Item Count */}
            <div className="shrink-0 text-center">
              <p className="text-lg font-bold text-charcoal-800">
                {getItemCount(category.id)}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-charcoal-700/50">
                Items
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => toggleActive(category.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  category.isActive
                    ? "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    : "border border-green-200 text-green-600 hover:bg-green-50",
                )}>
                {category.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => openEditModal(category)}
                className="rounded-lg p-1.5 text-charcoal-700/50 transition-colors hover:bg-cream-50 hover:text-blue-600">
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="rounded-lg p-1.5 text-charcoal-700/50 transition-colors hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="rounded-xl border border-cream-200 bg-white py-16 text-center shadow-sm">
          <p className="text-sm text-charcoal-700/50">
            No categories yet. Add your first category.
          </p>
        </div>
      )}

      {/* Modal Backdrop + Dialog */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-modal-title">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brown-900/40 backdrop-blur-sm animate-fade-in"
            onClick={closeModal}
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-cream-200 bg-white shadow-xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-cream-200 px-6 py-4">
              <h2
                id="category-modal-title"
                className="text-lg font-bold text-brown-900">
                {isEditing ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-charcoal-700/50 transition-colors hover:bg-cream-100 hover:text-charcoal-800"
                aria-label="Close modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 px-6 py-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-1.5 block text-sm font-medium text-charcoal-800">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="category-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Hot Beverages"
                  className={cn(
                    "w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-charcoal-800",
                    "placeholder:text-charcoal-700/40",
                    "outline-none transition-colors",
                    "focus:border-coffee-400 focus:ring-2 focus:ring-coffee-200",
                  )}
                />
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="category-slug"
                  className="mb-1.5 block text-sm font-medium text-charcoal-800">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  id="category-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="auto-generated-from-name"
                  className={cn(
                    "w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 font-mono text-sm text-charcoal-800",
                    "placeholder:text-charcoal-700/40",
                    "outline-none transition-colors",
                    "focus:border-coffee-400 focus:ring-2 focus:ring-coffee-200",
                  )}
                />
                {autoSlug && form.name.length > 0 && (
                  <p className="mt-1 text-xs text-charcoal-700/50">
                    Auto-generated from name
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="category-description"
                  className="mb-1.5 block text-sm font-medium text-charcoal-800">
                  Description
                </label>
                <textarea
                  id="category-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Brief description of this category..."
                  className={cn(
                    "w-full resize-none rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-charcoal-800",
                    "placeholder:text-charcoal-700/40",
                    "outline-none transition-colors",
                    "focus:border-coffee-400 focus:ring-2 focus:ring-coffee-200",
                  )}
                />
              </div>

              {/* Order + Active toggle row */}
              <div className="flex items-end gap-4">
                {/* Order */}
                <div className="flex-1">
                  <label
                    htmlFor="category-order"
                    className="mb-1.5 block text-sm font-medium text-charcoal-800">
                    Order
                  </label>
                  <input
                    id="category-order"
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        order: Math.max(1, parseInt(e.target.value, 10) || 1),
                      }))
                    }
                    className={cn(
                      "w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-charcoal-800",
                      "outline-none transition-colors",
                      "focus:border-coffee-400 focus:ring-2 focus:ring-coffee-200",
                    )}
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-800">
                    Status
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                    }
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors",
                      form.isActive
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-gray-200 bg-gray-50 text-gray-500",
                    )}>
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        form.isActive ? "bg-green-500" : "bg-gray-400",
                      )}
                    />
                    {form.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-cream-200 px-6 py-4">
              <button
                onClick={closeModal}
                className={cn(
                  "rounded-lg border border-cream-300 px-4 py-2.5 text-sm font-medium text-charcoal-700 transition-colors",
                  "hover:bg-cream-100",
                )}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.slug.trim()}
                className={cn(
                  "rounded-lg bg-coffee-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors",
                  "hover:bg-coffee-600",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}>
                {isEditing ? "Save Changes" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
