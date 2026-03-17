"use client";

import { usePosStore } from "@/lib/stores/pos-store";
import { tables, tableAreas } from "@/lib/data/tables";

export default function TableSelector() {
  const selectedTable = usePosStore((s) => s.selectedTable);
  const setSelectedTable = usePosStore((s) => s.setSelectedTable);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tableId = e.target.value;
    if (!tableId) {
      setSelectedTable(null);
      return;
    }
    const table = tables.find((t) => t.id === tableId) ?? null;
    setSelectedTable(table);
  };

  return (
    <select
      value={selectedTable?.id ?? ""}
      onChange={handleChange}
      className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400">
      <option value="">Select table...</option>
      {tableAreas
        .filter((a) => a.isActive)
        .map((area) => {
          const areaTables = tables.filter(
            (t) =>
              t.areaId === area.id && t.isActive && t.status === "available",
          );
          if (areaTables.length === 0) return null;
          return (
            <optgroup key={area.id} label={area.name}>
              {areaTables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.capacity} pax)
                </option>
              ))}
            </optgroup>
          );
        })}
    </select>
  );
}
