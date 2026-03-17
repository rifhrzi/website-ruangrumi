"use client";

import { useState } from "react";
import { tables, tableAreas } from "@/lib/data/tables";
import { formatCurrency } from "@/lib/utils";
import { Save, Users, MapPin } from "lucide-react";
import { Table } from "@/lib/types";

const statusFill: Record<string, string> = {
  available: "#22c55e",
  occupied: "#ef4444",
  reserved: "#eab308",
  unavailable: "#9ca3af",
};

export default function TableLayoutPage() {
  const [selectedAreaId, setSelectedAreaId] = useState(tableAreas[0]?.id || "");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const areaTables = tables.filter((t) => t.areaId === selectedAreaId);
  const area = tableAreas.find((a) => a.id === selectedAreaId);

  const renderTable = (table: Table) => {
    const isSelected = selectedTable?.id === table.id;
    const fill = isSelected ? "#3b82f6" : statusFill[table.status];
    const stroke = isSelected ? "#1d4ed8" : "#fff";

    const handleClick = () => setSelectedTable(table);

    if (table.shape === "round") {
      return (
        <g
          key={table.id}
          onClick={handleClick}
          className="cursor-pointer"
          role="button"
          tabIndex={0}>
          <circle
            cx={table.x + table.width / 2}
            cy={table.y + table.height / 2}
            r={table.width / 2}
            fill={fill}
            stroke={stroke}
            strokeWidth={2}
            opacity={0.9}
          />
          <text
            x={table.x + table.width / 2}
            y={table.y + table.height / 2 - 4}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold">
            #{table.number}
          </text>
          <text
            x={table.x + table.width / 2}
            y={table.y + table.height / 2 + 10}
            textAnchor="middle"
            fill="white"
            fontSize="9">
            {table.capacity}p
          </text>
        </g>
      );
    }

    const rx = table.shape === "sofa" ? 12 : 4;
    return (
      <g
        key={table.id}
        onClick={handleClick}
        className="cursor-pointer"
        role="button"
        tabIndex={0}>
        <rect
          x={table.x}
          y={table.y}
          width={table.width}
          height={table.height}
          rx={rx}
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
          opacity={0.9}
        />
        {table.shape === "sofa" && (
          <rect
            x={table.x}
            y={table.y + table.height - 8}
            width={table.width}
            height={8}
            rx={4}
            fill={fill}
            stroke={stroke}
            strokeWidth={1}
            opacity={0.7}
          />
        )}
        <text
          x={table.x + table.width / 2}
          y={table.y + table.height / 2 - 4}
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold">
          #{table.number}
        </text>
        <text
          x={table.x + table.width / 2}
          y={table.y + table.height / 2 + 10}
          textAnchor="middle"
          fill="white"
          fontSize="9">
          {table.capacity}p
        </text>
      </g>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">
            Table Layout Builder
          </h1>
          <p className="text-coffee-400 text-sm mt-1">
            Visual editor for cafe table layout
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
          <Save className="w-4 h-4" /> Save Layout
        </button>
      </div>

      {/* Area Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tableAreas.map((a) => (
          <button
            key={a.id}
            onClick={() => {
              setSelectedAreaId(a.id);
              setSelectedTable(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedAreaId === a.id
                ? "bg-coffee-500 text-white"
                : "bg-white text-coffee-600 hover:bg-coffee-100 border border-cream-300"
            }`}>
            {a.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm shadow-brown-900/5 p-4">
          {area && (
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-coffee-500" />
              <span className="font-semibold text-brown-900">{area.name}</span>
              <span className="px-2 py-0.5 bg-cream-100 rounded text-xs font-medium text-coffee-500 capitalize">
                {area.type}
              </span>
              <span className="text-xs text-coffee-400 ml-auto">
                {areaTables.length} tables
              </span>
            </div>
          )}
          <div className="border border-cream-200 rounded-xl overflow-hidden bg-cream-50">
            <svg
              viewBox="0 0 620 380"
              className="w-full h-auto"
              style={{ minHeight: 300 }}>
              {/* Grid */}
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#e5e0db"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="620" height="380" fill="url(#grid)" />
              {areaTables.map(renderTable)}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-green-500" /> Available
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-500" /> Occupied
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-yellow-500" /> Reserved
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gray-400" /> Unavailable
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-500" /> Selected
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm shadow-brown-900/5 p-6">
          <h3 className="font-semibold text-brown-900 mb-4">
            Table Properties
          </h3>
          {!selectedTable ? (
            <p className="text-sm text-coffee-400">
              Click a table on the layout to view and edit its properties.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1">
                  Table Number
                </label>
                <input
                  type="number"
                  defaultValue={selectedTable.number}
                  className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedTable.name}
                  className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1">
                  Capacity
                </label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-coffee-400" />
                  <input
                    type="number"
                    defaultValue={selectedTable.capacity}
                    min={1}
                    max={20}
                    className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-2">
                  Shape
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["round", "square", "rectangle", "sofa"] as const).map(
                    (shape) => (
                      <div
                        key={shape}
                        className={`p-2 rounded-lg border text-center text-xs font-medium cursor-pointer transition-colors capitalize ${
                          selectedTable.shape === shape
                            ? "border-coffee-500 bg-coffee-50 text-coffee-600"
                            : "border-cream-300 text-coffee-400 hover:bg-cream-50"
                        }`}>
                        {shape}
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1">
                  Minimum Order
                </label>
                <input
                  type="number"
                  defaultValue={selectedTable.minimumOrder || 0}
                  className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-1">
                  Status
                </label>
                <select
                  defaultValue={selectedTable.status}
                  className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400">
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-coffee-600">
                  Active
                </span>
                <div
                  className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${selectedTable.isActive ? "bg-green-500" : "bg-gray-300"}`}>
                  <div
                    className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${selectedTable.isActive ? "translate-x-5" : "translate-x-1"}`}
                  />
                </div>
              </div>
              {selectedTable.minimumOrder && (
                <p className="text-xs text-coffee-400">
                  Min. order: {formatCurrency(selectedTable.minimumOrder)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
