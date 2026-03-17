"use client";

import { useState } from "react";
import { tables, tableAreas } from "@/lib/data/tables";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Circle,
  Square,
  RectangleHorizontal,
  Sofa,
  MapPin,
  X,
} from "lucide-react";
import type { Table, TableShape, TableStatus } from "@/lib/types";

const shapeIcons: Record<string, React.ReactNode> = {
  round: <Circle className="w-4 h-4" />,
  square: <Square className="w-4 h-4" />,
  rectangle: <RectangleHorizontal className="w-4 h-4" />,
  sofa: <Sofa className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  available: "bg-green-500",
  occupied: "bg-red-500",
  reserved: "bg-yellow-500",
  unavailable: "bg-gray-400",
};

const shapeOptions: TableShape[] = ["round", "square", "rectangle", "sofa"];
const statusOptions: TableStatus[] = [
  "available",
  "occupied",
  "reserved",
  "unavailable",
];

interface TableFormData {
  number: number;
  name: string;
  areaId: string;
  capacity: number;
  shape: TableShape;
  status: TableStatus;
  minimumOrder: number;
  isActive: boolean;
}

const defaultFormData: TableFormData = {
  number: 1,
  name: "",
  areaId: tableAreas[0]?.id ?? "",
  capacity: 2,
  shape: "round",
  status: "available",
  minimumOrder: 0,
  isActive: true,
};

export default function TablesPage() {
  const [selectedArea, setSelectedArea] = useState("all");
  const [localTables, setLocalTables] = useState<Table[]>(tables);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState<TableFormData>(defaultFormData);

  const filtered =
    selectedArea === "all"
      ? localTables
      : localTables.filter((t) => t.areaId === selectedArea);

  const totalTables = localTables.length;
  const occupied = localTables.filter((t) => t.status === "occupied").length;
  const available = localTables.filter((t) => t.status === "available").length;

  function openAddModal() {
    setEditingTable(null);
    setFormData(defaultFormData);
    setModalOpen(true);
  }

  function openEditModal(table: Table) {
    setEditingTable(table);
    setFormData({
      number: table.number,
      name: table.name,
      areaId: table.areaId,
      capacity: table.capacity,
      shape: table.shape,
      status: table.status,
      minimumOrder: table.minimumOrder ?? 0,
      isActive: table.isActive,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTable(null);
  }

  function handleSubmit() {
    if (editingTable) {
      setLocalTables((prev) =>
        prev.map((t) =>
          t.id === editingTable.id
            ? {
                ...t,
                number: formData.number,
                name: formData.name,
                areaId: formData.areaId,
                capacity: formData.capacity,
                shape: formData.shape,
                status: formData.status,
                minimumOrder:
                  formData.minimumOrder > 0 ? formData.minimumOrder : undefined,
                isActive: formData.isActive,
              }
            : t,
        ),
      );
    } else {
      const newTable: Table = {
        id: "t-" + Date.now(),
        number: formData.number,
        name: formData.name,
        areaId: formData.areaId,
        capacity: formData.capacity,
        shape: formData.shape,
        status: formData.status,
        minimumOrder:
          formData.minimumOrder > 0 ? formData.minimumOrder : undefined,
        isActive: true,
        x: 100,
        y: 100,
        width: 60,
        height: 60,
        rotation: 0,
      };
      setLocalTables((prev) => [...prev, newTable]);
    }
    closeModal();
  }

  function handleDelete(table: Table) {
    if (
      confirm(
        `Are you sure you want to delete "${table.name}" (#${table.number})?`,
      )
    ) {
      setLocalTables((prev) => prev.filter((t) => t.id !== table.id));
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">
            Tables Management
          </h1>
          <p className="text-coffee-400 text-sm mt-1">
            Manage cafe tables and seating
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-coffee-500 text-white rounded-xl font-medium hover:bg-coffee-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Table
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-brown-900">{totalTables}</p>
          <p className="text-xs text-coffee-400">Total Tables</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{available}</p>
          <p className="text-xs text-coffee-400">Available</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{occupied}</p>
          <p className="text-xs text-coffee-400">Occupied</p>
        </div>
      </div>

      {/* Area Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <MapPin className="w-4 h-4 text-coffee-400 shrink-0" />
        <button
          onClick={() => setSelectedArea("all")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            selectedArea === "all"
              ? "bg-coffee-500 text-white"
              : "bg-white text-coffee-600 hover:bg-coffee-100 border border-cream-300",
          )}>
          All Areas
        </button>
        {tableAreas.map((area) => (
          <button
            key={area.id}
            onClick={() => setSelectedArea(area.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              selectedArea === area.id
                ? "bg-coffee-500 text-white"
                : "bg-white text-coffee-600 hover:bg-coffee-100 border border-cream-300",
            )}>
            {area.name}
          </button>
        ))}
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((table) => {
          const area = tableAreas.find((a) => a.id === table.areaId);
          return (
            <div
              key={table.id}
              className="bg-white rounded-xl shadow-sm shadow-brown-900/5 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-brown-900">
                    #{table.number}
                  </h3>
                  <p className="text-sm text-coffee-400">{table.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      statusColors[table.status],
                    )}
                  />
                  <span className="text-xs font-medium text-coffee-600 capitalize">
                    {table.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {area && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-coffee-400">Area</span>
                    <span className="px-2 py-0.5 bg-cream-100 rounded text-xs font-medium text-coffee-600">
                      {area.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-coffee-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Capacity
                  </span>
                  <span className="font-medium text-brown-800">
                    {table.capacity} seats
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-coffee-400">Shape</span>
                  <span className="flex items-center gap-1 font-medium text-brown-800 capitalize">
                    {shapeIcons[table.shape]} {table.shape}
                  </span>
                </div>
                {table.minimumOrder && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-coffee-400">Min. Order</span>
                    <span className="font-medium text-brown-800">
                      {formatCurrency(table.minimumOrder)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-cream-200">
                <button
                  onClick={() => openEditModal(table)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-coffee-600 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(table)}
                  className="flex items-center justify-center p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-cream-200">
              <h2 className="text-lg font-bold text-brown-900">
                {editingTable ? "Edit Table" : "Add New Table"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 text-coffee-400 hover:text-brown-900 hover:bg-cream-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Number & Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brown-800 mb-1.5">
                    Table Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        number: parseInt(e.target.value) || 0,
                      })
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border border-cream-300 text-brown-900",
                      "focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                      "placeholder:text-coffee-300",
                    )}
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-800 mb-1.5">
                    Table Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border border-cream-300 text-brown-900",
                      "focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                      "placeholder:text-coffee-300",
                    )}
                    placeholder="Table 1"
                  />
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1.5">
                  Area
                </label>
                <select
                  value={formData.areaId}
                  onChange={(e) =>
                    setFormData({ ...formData, areaId: e.target.value })
                  }
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-cream-300 text-brown-900",
                    "focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                  )}>
                  {tableAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Capacity & Shape row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brown-800 mb-1.5">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 1,
                      })
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border border-cream-300 text-brown-900",
                      "focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                      "placeholder:text-coffee-300",
                    )}
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-800 mb-1.5">
                    Shape
                  </label>
                  <select
                    value={formData.shape}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shape: e.target.value as TableShape,
                      })
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border border-cream-300 text-brown-900",
                      "focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                    )}>
                    {shapeOptions.map((shape) => (
                      <option key={shape} value={shape}>
                        {shape.charAt(0).toUpperCase() + shape.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as TableStatus,
                    })
                  }
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-cream-300 text-brown-900",
                    "focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                  )}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimum Order */}
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1.5">
                  Minimum Order (optional)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.minimumOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-cream-300 text-brown-900",
                    "focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                    "placeholder:text-coffee-300",
                  )}
                  placeholder="0"
                />
                <p className="text-xs text-coffee-400 mt-1">
                  Set to 0 for no minimum order
                </p>
              </div>

              {/* isActive Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-brown-800">
                    Active
                  </label>
                  <p className="text-xs text-coffee-400">
                    Table is visible and bookable
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isActive: !formData.isActive })
                  }
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200",
                    formData.isActive ? "bg-coffee-500" : "bg-cream-300",
                  )}>
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
                      formData.isActive ? "translate-x-5" : "translate-x-0.5",
                      "mt-0.5",
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-cream-200">
              <button
                onClick={closeModal}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  "text-coffee-600 bg-cream-100 hover:bg-cream-200",
                )}>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  "text-white bg-coffee-500 hover:bg-coffee-600",
                )}>
                {editingTable ? "Save Changes" : "Add Table"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
