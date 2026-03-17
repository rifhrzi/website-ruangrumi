"use client";

import { useState, useMemo } from "react";
import { tables, tableAreas } from "@/lib/data/tables";
import { useReservationStore } from "@/lib/stores/reservation-store";
import { Table } from "@/lib/types";
import { cn } from "@/lib/utils";
import TableDetailPopup from "./table-detail-popup";

/* ---------- Color constants ---------- */
const COLORS = {
  available: "#22c55e",
  availableHover: "#16a34a",
  occupied: "#ef4444",
  reserved: "#eab308",
  selected: "#3b82f6",
  selectedGlow: "#60a5fa",
  disabled: "#d1d5db",
  disabledText: "#9ca3af",
};

/* ---------- SVG dimensions ---------- */
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

/* ---------- Area background accents ---------- */
const areaAccents: Record<
  string,
  { bg: string; border: string; icon: string }
> = {
  indoor: { bg: "#FAF7F4", border: "#EDE5DB", icon: "Home" },
  outdoor: { bg: "#f0fdf4", border: "#bbf7d0", icon: "Trees" },
  vip: { bg: "#fefce8", border: "#fde68a", icon: "Crown" },
  smoking: { bg: "#faf5ff", border: "#e9d5ff", icon: "Wind" },
};

/* ---------- Chair rendering (small circles around tables) ---------- */
function renderChairs(
  cx: number,
  cy: number,
  capacity: number,
  shape: string,
  w: number,
  h: number,
  color: string,
) {
  const chairs: React.ReactElement[] = [];
  const chairRadius = 5;
  const gap = 8;

  if (shape === "round") {
    const radius = w / 2 + gap + chairRadius;
    for (let i = 0; i < capacity; i++) {
      const angle = (2 * Math.PI * i) / capacity - Math.PI / 2;
      chairs.push(
        <circle
          key={`chair-${i}`}
          cx={cx + Math.cos(angle) * radius}
          cy={cy + Math.sin(angle) * radius}
          r={chairRadius}
          fill={color}
          opacity={0.4}
        />,
      );
    }
  } else {
    // Distribute chairs around rectangle/square/sofa
    const halfW = w / 2 + gap + chairRadius;
    const halfH = h / 2 + gap + chairRadius;
    const sides = [
      { dir: "top", count: 0 },
      { dir: "bottom", count: 0 },
      { dir: "left", count: 0 },
      { dir: "right", count: 0 },
    ];

    // Distribute chairs across sides
    let remaining = capacity;
    const longSideChairs = Math.ceil(capacity / 2);
    const shortSideChairs = Math.floor(capacity / 2);

    if (shape === "sofa") {
      // Sofa: chairs only on the front (bottom) and sides
      sides[1].count = Math.min(remaining, Math.ceil(capacity * 0.6));
      remaining -= sides[1].count;
      sides[2].count = Math.min(remaining, Math.ceil(remaining / 2));
      remaining -= sides[2].count;
      sides[3].count = remaining;
    } else if (w > h) {
      // Wide rectangle: more chairs on top and bottom
      sides[0].count = Math.ceil(longSideChairs / 2);
      sides[1].count = longSideChairs - sides[0].count;
      remaining -= longSideChairs;
      sides[2].count = Math.ceil(remaining / 2);
      sides[3].count = remaining - sides[2].count;
    } else {
      sides[0].count = Math.ceil(capacity / 4);
      sides[1].count = Math.ceil(capacity / 4);
      remaining = capacity - sides[0].count - sides[1].count;
      sides[2].count = Math.ceil(remaining / 2);
      sides[3].count = remaining - sides[2].count;
    }

    let idx = 0;
    sides.forEach(({ dir, count }) => {
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        let x = cx;
        let y = cy;

        switch (dir) {
          case "top":
            x = cx - w / 2 + w * t;
            y = cy - halfH;
            break;
          case "bottom":
            x = cx - w / 2 + w * t;
            y = cy + halfH;
            break;
          case "left":
            x = cx - halfW;
            y = cy - h / 2 + h * t;
            break;
          case "right":
            x = cx + halfW;
            y = cy - h / 2 + h * t;
            break;
        }

        chairs.push(
          <circle
            key={`chair-${idx}`}
            cx={x}
            cy={y}
            r={chairRadius}
            fill={color}
            opacity={0.4}
          />,
        );
        idx++;
      }
    });
  }

  return chairs;
}

/* ---------- Main FloorPlan component ---------- */
export default function FloorPlan() {
  const { pax, selectedTable, setSelectedTable } = useReservationStore();
  const [activeAreaId, setActiveAreaId] = useState(tableAreas[0].id);
  const [hoveredTableId, setHoveredTableId] = useState<string | null>(null);
  const [popupTable, setPopupTable] = useState<Table | null>(null);

  const activeArea = tableAreas.find((a) => a.id === activeAreaId)!;
  const areaTables = useMemo(
    () => tables.filter((t) => t.areaId === activeAreaId && t.isActive),
    [activeAreaId],
  );

  const accent = areaAccents[activeArea.type] || areaAccents.indoor;

  function getTableColor(table: Table): string {
    if (selectedTable?.id === table.id) return COLORS.selected;
    if (table.capacity < pax) return COLORS.disabled;
    if (table.status === "available") return COLORS.available;
    if (table.status === "occupied") return COLORS.occupied;
    if (table.status === "reserved") return COLORS.reserved;
    return COLORS.disabled;
  }

  function getTableOpacity(table: Table): number {
    if (selectedTable?.id === table.id) return 1;
    if (table.capacity < pax) return 0.35;
    if (table.status !== "available") return 0.7;
    return 1;
  }

  function isClickable(table: Table): boolean {
    return table.status === "available" && table.capacity >= pax;
  }

  function handleTableClick(table: Table) {
    if (!isClickable(table) && selectedTable?.id !== table.id) return;
    setPopupTable(table);
  }

  function handleSelectFromPopup(table: Table) {
    setSelectedTable(table);
    setPopupTable(null);
  }

  /* ---------- Render a single table SVG shape ---------- */
  function renderTableShape(table: Table) {
    const color = getTableColor(table);
    const opacity = getTableOpacity(table);
    const isHovered = hoveredTableId === table.id;
    const isSelected = selectedTable?.id === table.id;
    const clickable = isClickable(table);
    const cx = table.x + table.width / 2;
    const cy = table.y + table.height / 2;

    const hoverScale = isHovered && clickable ? 1.04 : 1;

    return (
      <g
        key={table.id}
        className={cn(
          "transition-all duration-200",
          clickable ? "cursor-pointer" : "cursor-not-allowed",
        )}
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          transform: `scale(${hoverScale})`,
          transition: "transform 0.2s ease",
        }}
        opacity={opacity}
        onMouseEnter={() => setHoveredTableId(table.id)}
        onMouseLeave={() => setHoveredTableId(null)}
        onClick={() => handleTableClick(table)}
        role="button"
        aria-label={`${table.name}, ${table.capacity} seats, ${table.status}${table.capacity < pax ? ", too small" : ""}`}
        tabIndex={clickable ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTableClick(table);
          }
        }}>
        {/* Glow effect for selected */}
        {isSelected && (
          <>
            {table.shape === "round" ? (
              <circle
                cx={cx}
                cy={cy}
                r={table.width / 2 + 6}
                fill="none"
                stroke={COLORS.selectedGlow}
                strokeWidth={3}
                opacity={0.5}>
                <animate
                  attributeName="opacity"
                  values="0.5;0.2;0.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            ) : (
              <rect
                x={table.x - 6}
                y={table.y - 6}
                width={table.width + 12}
                height={table.height + 12}
                rx={table.shape === "sofa" ? 14 : 6}
                fill="none"
                stroke={COLORS.selectedGlow}
                strokeWidth={3}
                opacity={0.5}>
                <animate
                  attributeName="opacity"
                  values="0.5;0.2;0.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </rect>
            )}
          </>
        )}

        {/* Chairs */}
        {renderChairs(
          cx,
          cy,
          table.capacity,
          table.shape,
          table.width,
          table.height,
          color,
        )}

        {/* Table shadow */}
        {table.shape === "round" ? (
          <circle
            cx={cx + 2}
            cy={cy + 2}
            r={table.width / 2}
            fill="black"
            opacity={0.08}
          />
        ) : (
          <rect
            x={table.x + 2}
            y={table.y + 2}
            width={table.width}
            height={table.height}
            rx={table.shape === "sofa" ? 12 : 4}
            fill="black"
            opacity={0.08}
          />
        )}

        {/* Table shape */}
        {table.shape === "round" ? (
          <circle
            cx={cx}
            cy={cy}
            r={table.width / 2}
            fill={color}
            stroke={isHovered && clickable ? "#fff" : color}
            strokeWidth={isHovered && clickable ? 2.5 : 1.5}
            style={{
              filter: isHovered && clickable ? "brightness(1.1)" : undefined,
            }}
          />
        ) : table.shape === "sofa" ? (
          <>
            {/* Sofa backrest */}
            <rect
              x={table.x}
              y={table.y}
              width={table.width}
              height={table.height * 0.35}
              rx={8}
              fill={color}
              opacity={0.7}
              stroke={color}
              strokeWidth={1}
            />
            {/* Sofa seat */}
            <rect
              x={table.x}
              y={table.y}
              width={table.width}
              height={table.height}
              rx={12}
              fill={color}
              stroke={isHovered && clickable ? "#fff" : color}
              strokeWidth={isHovered && clickable ? 2.5 : 1.5}
              style={{
                filter: isHovered && clickable ? "brightness(1.1)" : undefined,
              }}
            />
          </>
        ) : (
          <rect
            x={table.x}
            y={table.y}
            width={table.width}
            height={table.height}
            rx={4}
            fill={color}
            stroke={isHovered && clickable ? "#fff" : color}
            strokeWidth={isHovered && clickable ? 2.5 : 1.5}
            style={{
              filter: isHovered && clickable ? "brightness(1.1)" : undefined,
            }}
          />
        )}

        {/* Table number */}
        <text
          x={cx}
          y={cy - 3}
          textAnchor="middle"
          dominantBaseline="central"
          className="pointer-events-none select-none"
          fill="white"
          fontSize={table.width < 70 ? 12 : 14}
          fontWeight={700}>
          {table.number}
        </text>

        {/* Capacity label below number */}
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          dominantBaseline="central"
          className="pointer-events-none select-none"
          fill="white"
          fontSize={9}
          fontWeight={500}
          opacity={0.85}>
          {table.capacity}p
        </text>

        {/* Hover tooltip */}
        {isHovered && (
          <g className="pointer-events-none">
            <rect
              x={cx - 40}
              y={table.y - 30}
              width={80}
              height={22}
              rx={6}
              fill="#1A1A1A"
              opacity={0.9}
            />
            <text
              x={cx}
              y={table.y - 19}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize={10}
              fontWeight={500}>
              {table.name}
            </text>
          </g>
        )}
      </g>
    );
  }

  return (
    <div className="space-y-5">
      {/* Area tabs */}
      <div className="flex flex-wrap gap-2">
        {tableAreas.map((area) => {
          const isActive = area.id === activeAreaId;
          const areaTableCount = tables.filter(
            (t) => t.areaId === area.id && t.isActive,
          ).length;
          const availableCount = tables.filter(
            (t) =>
              t.areaId === area.id &&
              t.isActive &&
              t.status === "available" &&
              t.capacity >= pax,
          ).length;

          return (
            <button
              key={area.id}
              type="button"
              onClick={() => setActiveAreaId(area.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-coffee-500 text-white shadow-lg shadow-coffee-500/20"
                  : "bg-cream-100 text-brown-700 hover:bg-cream-200 hover:text-brown-900",
                "border",
                isActive ? "border-coffee-600" : "border-cream-200",
              )}
              aria-pressed={isActive}>
              <span>{area.name}</span>
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-cream-200 text-brown-700",
                )}>
                {availableCount}/{areaTableCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pax caption */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-brown-700">
          Showing tables for{" "}
          <span className="font-bold text-coffee-500">
            {pax} {pax === 1 ? "person" : "people"}
          </span>
        </p>
        {selectedTable && (
          <p className="text-sm font-medium text-blue-600">
            Selected: {selectedTable.name} (#{selectedTable.number})
          </p>
        )}
      </div>

      {/* SVG Floor plan */}
      <div
        className="relative rounded-2xl border-2 border-cream-200 overflow-hidden"
        style={{ backgroundColor: accent.bg }}>
        {/* Area header bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{ borderColor: accent.border, backgroundColor: accent.bg }}>
          <div className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  activeArea.type === "outdoor"
                    ? "#22c55e"
                    : activeArea.type === "vip"
                      ? "#eab308"
                      : activeArea.type === "smoking"
                        ? "#a855f7"
                        : "#6b7280",
              }}
            />
            <span className="text-sm font-semibold text-brown-800">
              {activeArea.name}
            </span>
          </div>
          {activeArea.description && (
            <span className="hidden text-xs text-brown-700/60 sm:block">
              {activeArea.description}
            </span>
          )}
        </div>

        {/* Decorative background pattern */}
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Floor plan of ${activeArea.name}`}>
          <defs>
            {/* Grid pattern */}
            <pattern
              id="floor-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={accent.border}
                strokeWidth={0.5}
                opacity={0.5}
              />
            </pattern>
            {/* Drop shadow filter */}
            <filter
              id="table-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#000"
                floodOpacity="0.1"
              />
            </filter>
          </defs>

          {/* Background with grid */}
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill={accent.bg} />
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#floor-grid)" />

          {/* Decorative elements based on area type */}
          {activeArea.type === "outdoor" && (
            <>
              {/* Trees/bushes */}
              <circle cx={540} cy={50} r={25} fill="#86efac" opacity={0.3} />
              <circle cx={550} cy={350} r={30} fill="#86efac" opacity={0.25} />
              <circle cx={30} cy={360} r={20} fill="#86efac" opacity={0.3} />
            </>
          )}
          {activeArea.type === "vip" && (
            <>
              {/* Gold accents */}
              <rect
                x={0}
                y={0}
                width={SVG_WIDTH}
                height={4}
                fill="#D4AF37"
                opacity={0.3}
              />
              <rect
                x={0}
                y={SVG_HEIGHT - 4}
                width={SVG_WIDTH}
                height={4}
                fill="#D4AF37"
                opacity={0.3}
              />
            </>
          )}

          {/* Render all tables */}
          {areaTables.map(renderTableShape)}

          {/* "No tables" message */}
          {areaTables.length === 0 && (
            <text
              x={SVG_WIDTH / 2}
              y={SVG_HEIGHT / 2}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize={16}>
              No tables in this area
            </text>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-cream-100 px-4 py-3 border border-cream-200">
        <span className="text-xs font-semibold text-brown-800 uppercase tracking-wider mr-1">
          Legend:
        </span>
        {[
          { color: COLORS.available, label: "Available" },
          { color: COLORS.occupied, label: "Occupied" },
          { color: COLORS.reserved, label: "Reserved" },
          { color: COLORS.selected, label: "Selected" },
          { color: COLORS.disabled, label: "Too Small" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{
                backgroundColor: color,
                opacity: label === "Too Small" ? 0.4 : 1,
              }}
            />
            <span className="text-xs text-brown-700">{label}</span>
          </div>
        ))}
      </div>

      {/* Table detail popup */}
      {popupTable && (
        <TableDetailPopup
          table={popupTable}
          areaName={activeArea.name}
          areaType={activeArea.type}
          pax={pax}
          onSelect={handleSelectFromPopup}
          onClose={() => setPopupTable(null)}
        />
      )}
    </div>
  );
}
