"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Users,
  Hash,
  Filter,
  Plus,
  ChevronRight,
  FileText,
  MapPin,
} from "lucide-react";
import { mockReservations } from "@/lib/data/mock";
import { tables } from "@/lib/data/tables";
import { getStatusColor, formatDate, cn } from "@/lib/utils";
import { ReservationStatus } from "@/lib/types";

const STATUS_FILTERS: { value: ReservationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "seated", label: "Seated" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no-show", label: "No Show" },
];

const statusIcons: Record<string, string> = {
  pending: "Awaiting confirmation",
  confirmed: "Your reservation is confirmed",
  seated: "You are currently seated",
  completed: "Thank you for visiting",
  cancelled: "This reservation was cancelled",
  "no-show": "Missed reservation",
};

export default function MyReservationsPage() {
  const [activeFilter, setActiveFilter] = useState<ReservationStatus | "all">(
    "all",
  );

  const filteredReservations = useMemo(() => {
    if (activeFilter === "all") return mockReservations;
    return mockReservations.filter((r) => r.status === activeFilter);
  }, [activeFilter]);

  function getTableNames(tableIds: string[]): string {
    return tableIds
      .map((id) => {
        const table = tables.find((t) => t.id === id);
        return table ? `${table.name} (#${table.number})` : id;
      })
      .join(", ");
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="gradient-coffee px-4 pb-12 pt-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-cream-50 sm:text-4xl">
            My Reservations
          </h1>
          <p className="mt-2 text-cream-300 text-sm sm:text-base">
            View and manage all your table reservations
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 -mt-6 pb-16">
        {/* Top bar: filter + new reservation */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Filter className="h-4 w-4 text-brown-700/40 shrink-0" />
            {STATUS_FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;
              const count =
                filter.value === "all"
                  ? mockReservations.length
                  : mockReservations.filter((r) => r.status === filter.value)
                      .length;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                    isActive
                      ? "bg-coffee-500 text-white shadow-md shadow-coffee-500/20"
                      : "bg-white text-brown-700 border border-cream-200 hover:bg-cream-100",
                  )}
                  aria-pressed={isActive}>
                  {filter.label}
                  <span
                    className={cn(
                      "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-cream-100 text-brown-700",
                    )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* New reservation button */}
          <Link
            href="/reservation"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shrink-0",
              "bg-coffee-500 text-white",
              "hover:bg-brown-700 active:scale-[0.98]",
              "shadow-lg shadow-coffee-500/20",
            )}>
            <Plus className="h-4 w-4" />
            New Reservation
          </Link>
        </div>

        {/* Reservation cards */}
        {filteredReservations.length === 0 ? (
          <div className="rounded-2xl bg-white border border-cream-200 shadow-lg shadow-brown-900/5 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-100">
              <FileText className="h-8 w-8 text-brown-700/30" />
            </div>
            <h3 className="text-lg font-semibold text-brown-900">
              No reservations found
            </h3>
            <p className="mt-1 text-sm text-brown-700/60">
              {activeFilter === "all"
                ? "You haven't made any reservations yet."
                : `No ${activeFilter} reservations found.`}
            </p>
            <Link
              href="/reservation"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-coffee-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brown-700 transition-colors shadow-lg shadow-coffee-500/20">
              <Plus className="h-4 w-4" />
              Make a Reservation
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className={cn(
                  "rounded-2xl bg-white border border-cream-200 shadow-lg shadow-brown-900/5",
                  "overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-cream-300",
                )}>
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-cream-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coffee-100">
                      <Hash className="h-5 w-5 text-coffee-500" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-brown-900 font-mono tracking-wider">
                        {reservation.bookingCode}
                      </p>
                      <p className="text-xs text-brown-700/50">
                        Booked {formatDate(reservation.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize",
                      getStatusColor(reservation.status),
                    )}>
                    {reservation.status === "no-show"
                      ? "No Show"
                      : reservation.status}
                  </span>
                </div>

                {/* Card body */}
                <div className="px-5 py-4">
                  {/* Status message */}
                  <p className="mb-4 text-xs text-brown-700/50 italic">
                    {statusIcons[reservation.status]}
                  </p>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {/* Date */}
                    <div className="flex items-center gap-2.5 rounded-xl bg-cream-50 px-3 py-2.5 border border-cream-100">
                      <CalendarDays className="h-4 w-4 text-coffee-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-coffee-400 uppercase tracking-wider">
                          Date
                        </p>
                        <p className="text-xs font-semibold text-brown-900">
                          {formatDate(reservation.date)}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2.5 rounded-xl bg-cream-50 px-3 py-2.5 border border-cream-100">
                      <Clock className="h-4 w-4 text-coffee-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-coffee-400 uppercase tracking-wider">
                          Time
                        </p>
                        <p className="text-xs font-semibold text-brown-900">
                          {reservation.timeSlot} - {reservation.endTime}
                        </p>
                      </div>
                    </div>

                    {/* Pax */}
                    <div className="flex items-center gap-2.5 rounded-xl bg-cream-50 px-3 py-2.5 border border-cream-100">
                      <Users className="h-4 w-4 text-coffee-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-coffee-400 uppercase tracking-wider">
                          Guests
                        </p>
                        <p className="text-xs font-semibold text-brown-900">
                          {reservation.pax}{" "}
                          {reservation.pax === 1 ? "person" : "people"}
                        </p>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="flex items-center gap-2.5 rounded-xl bg-cream-50 px-3 py-2.5 border border-cream-100">
                      <MapPin className="h-4 w-4 text-coffee-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-coffee-400 uppercase tracking-wider">
                          Table
                        </p>
                        <p className="text-xs font-semibold text-brown-900">
                          {getTableNames(reservation.tableIds)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {reservation.notes && (
                    <div className="mt-3 rounded-xl bg-gold-400/5 border border-gold-400/10 px-4 py-2.5">
                      <p className="text-xs text-brown-700">
                        <span className="font-semibold">Notes:</span>{" "}
                        {reservation.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between border-t border-cream-100 px-5 py-3 bg-cream-50/50">
                  <p className="text-xs text-brown-700/40">
                    Duration: {reservation.estimatedDuration} min
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-medium text-coffee-500 hover:text-brown-700 transition-colors">
                    View Details
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
