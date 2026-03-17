"use client";

import { useEffect, useRef } from "react";
import {
  X,
  Users,
  MapPin,
  DollarSign,
  Circle,
  Square,
  RectangleHorizontal,
  Sofa,
} from "lucide-react";
import { Table } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";

interface TableDetailPopupProps {
  table: Table;
  areaName: string;
  areaType: string;
  pax: number;
  onSelect: (table: Table) => void;
  onClose: () => void;
}

const shapeIcons: Record<string, React.ElementType> = {
  round: Circle,
  square: Square,
  rectangle: RectangleHorizontal,
  sofa: Sofa,
};

const areaTypeLabels: Record<string, string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  vip: "VIP",
  smoking: "Smoking",
  "non-smoking": "Non-Smoking",
};

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  occupied: "bg-red-100 text-red-700",
  reserved: "bg-yellow-100 text-yellow-700",
  unavailable: "bg-gray-100 text-gray-500",
};

const statusLabels: Record<string, string> = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  unavailable: "Unavailable",
};

export default function TableDetailPopup({
  table,
  areaName,
  areaType,
  pax,
  onSelect,
  onClose,
}: TableDetailPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Use setTimeout so the click that opened the popup doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const ShapeIcon = shapeIcons[table.shape] || Square;
  const canSelect = table.status === "available" && table.capacity >= pax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={popupRef}
        className={cn(
          "relative w-full max-w-sm bg-cream-50 rounded-2xl shadow-2xl",
          "border border-cream-300",
          "animate-in zoom-in-95 slide-in-from-bottom-4 duration-300",
        )}
        role="dialog"
        aria-modal="true"
        aria-label={`Details for ${table.name}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coffee-100">
              <ShapeIcon
                className="h-5 w-5 text-coffee-500"
                strokeWidth={1.8}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brown-900">{table.name}</h3>
              <p className="text-sm text-coffee-400">Table #{table.number}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-brown-700 transition-colors hover:bg-cream-200 hover:text-brown-900"
            aria-label="Close details">
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Status badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-brown-700 font-medium">Status</span>
            <span
              className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                statusColors[table.status],
              )}>
              {statusLabels[table.status]}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Capacity */}
            <div className="flex items-center gap-2.5 rounded-xl bg-cream-100 px-3 py-3">
              <Users
                className="h-4 w-4 text-coffee-500 shrink-0"
                strokeWidth={1.8}
              />
              <div>
                <p className="text-xs text-coffee-400">Capacity</p>
                <p className="text-sm font-semibold text-brown-900">
                  {table.capacity} {table.capacity === 1 ? "seat" : "seats"}
                </p>
              </div>
            </div>

            {/* Area */}
            <div className="flex items-center gap-2.5 rounded-xl bg-cream-100 px-3 py-3">
              <MapPin
                className="h-4 w-4 text-coffee-500 shrink-0"
                strokeWidth={1.8}
              />
              <div>
                <p className="text-xs text-coffee-400">Area</p>
                <p className="text-sm font-semibold text-brown-900">
                  {areaName}
                </p>
              </div>
            </div>

            {/* Shape */}
            <div className="flex items-center gap-2.5 rounded-xl bg-cream-100 px-3 py-3">
              <ShapeIcon
                className="h-4 w-4 text-coffee-500 shrink-0"
                strokeWidth={1.8}
              />
              <div>
                <p className="text-xs text-coffee-400">Shape</p>
                <p className="text-sm font-semibold text-brown-900 capitalize">
                  {table.shape}
                </p>
              </div>
            </div>

            {/* Area Type */}
            <div className="flex items-center gap-2.5 rounded-xl bg-cream-100 px-3 py-3">
              <MapPin
                className="h-4 w-4 text-coffee-500 shrink-0"
                strokeWidth={1.8}
              />
              <div>
                <p className="text-xs text-coffee-400">Type</p>
                <p className="text-sm font-semibold text-brown-900">
                  {areaTypeLabels[areaType] || areaType}
                </p>
              </div>
            </div>
          </div>

          {/* Minimum order */}
          {table.minimumOrder && (
            <div className="flex items-center gap-3 rounded-xl bg-gold-400/10 border border-gold-400/20 px-4 py-3">
              <DollarSign
                className="h-4 w-4 text-gold-500 shrink-0"
                strokeWidth={2}
              />
              <div>
                <p className="text-xs text-coffee-400">Minimum Order</p>
                <p className="text-sm font-bold text-brown-900">
                  {formatCurrency(table.minimumOrder)}
                </p>
              </div>
            </div>
          )}

          {/* Capacity warning */}
          {table.status === "available" && table.capacity < pax && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-xs text-red-600">
                This table only fits {table.capacity}{" "}
                {table.capacity === 1 ? "person" : "people"}. You need seating
                for {pax}.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              "border border-cream-300 text-brown-700",
              "hover:bg-cream-200 hover:text-brown-900",
            )}>
            Close
          </button>
          {canSelect && (
            <button
              type="button"
              onClick={() => onSelect(table)}
              className={cn(
                "flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                "bg-coffee-500 text-white",
                "hover:bg-brown-700 active:scale-[0.98]",
                "shadow-lg shadow-coffee-500/20",
              )}>
              Select This Table
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
