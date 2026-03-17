"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Check,
  X,
  UserCheck,
  Calendar,
  Eye,
} from "lucide-react";
import { mockReservations } from "@/lib/data/mock";
import { tables } from "@/lib/data/tables";
import { getStatusColor, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { RESERVATION_STATUSES } from "@/lib/constants";
import type { ReservationStatus } from "@/lib/types";

export default function ReservationManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [reservations, setReservations] = useState(mockReservations);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch =
        !searchQuery ||
        reservation.bookingCode
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        reservation.customerName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        reservation.customerPhone.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" || reservation.status === statusFilter;
      const matchesDate = !dateFilter || reservation.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reservations, searchQuery, statusFilter, dateFilter]);

  const getTableNames = (tableIds: string[]) => {
    return tableIds
      .map((id) => {
        const table = tables.find((t) => t.id === id);
        return table ? table.name : id;
      })
      .join(", ");
  };

  const handleUpdateStatus = (
    reservationId: string,
    newStatus: ReservationStatus,
  ) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? { ...r, status: newStatus, updatedAt: new Date().toISOString() }
          : r,
      ),
    );
  };

  const renderActions = (reservation: (typeof reservations)[0]) => {
    const actions: React.ReactNode[] = [];

    if (reservation.status === "pending") {
      actions.push(
        <button
          key="confirm"
          onClick={() => handleUpdateStatus(reservation.id, "confirmed")}
          className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100"
          title="Confirm reservation">
          <Check className="h-3.5 w-3.5" />
          Confirm
        </button>,
      );
      actions.push(
        <button
          key="reject"
          onClick={() => handleUpdateStatus(reservation.id, "cancelled")}
          className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
          title="Reject reservation">
          <X className="h-3.5 w-3.5" />
          Reject
        </button>,
      );
    }

    if (reservation.status === "confirmed") {
      actions.push(
        <button
          key="checkin"
          onClick={() => handleUpdateStatus(reservation.id, "seated")}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
          title="Check-in customer">
          <UserCheck className="h-3.5 w-3.5" />
          Check-in
        </button>,
      );
      actions.push(
        <button
          key="cancel"
          onClick={() => handleUpdateStatus(reservation.id, "cancelled")}
          className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
          title="Cancel reservation">
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>,
      );
    }

    if (reservation.status === "seated") {
      actions.push(
        <button
          key="complete"
          onClick={() => handleUpdateStatus(reservation.id, "completed")}
          className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
          title="Mark as completed">
          <Check className="h-3.5 w-3.5" />
          Complete
        </button>,
      );
    }

    if (actions.length === 0) {
      actions.push(
        <span key="no-action" className="text-xs text-charcoal-700/40">
          No actions
        </span>,
      );
    }

    return actions;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">Reservations</h1>
          <p className="mt-1 text-sm text-charcoal-700/60">
            Manage and track all customer reservations
          </p>
        </div>
        <Link
          href="/admin/reservations/calendar"
          className="inline-flex items-center gap-2 rounded-lg bg-coffee-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-coffee-600">
          <Calendar className="h-4 w-4" />
          Calendar View
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-cream-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-charcoal-700">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Date Filter */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-charcoal-800 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400">
              <option value="all">All Statuses</option>
              {RESERVATION_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-700/40" />
            <input
              type="text"
              placeholder="Search booking code, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-cream-200 bg-cream-50 py-2 pl-10 pr-4 text-sm text-charcoal-800 placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
            />
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="overflow-hidden rounded-xl border border-cream-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Booking Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Time Slot
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Pax
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Table(s)
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-700/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-sm text-charcoal-700/50">
                    No reservations found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="transition-colors hover:bg-cream-50/60">
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-brown-800">
                        {reservation.bookingCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-charcoal-800">
                        {reservation.customerName}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-charcoal-700/70">
                        {reservation.customerPhone}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-charcoal-800">
                        {formatDate(reservation.date)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-charcoal-800">
                        {reservation.timeSlot} - {reservation.endTime}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-charcoal-800">
                        {reservation.pax}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-charcoal-700/70">
                        {getTableNames(reservation.tableIds)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                          getStatusColor(reservation.status),
                        )}>
                        {reservation.status === "no-show"
                          ? "No Show"
                          : reservation.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {renderActions(reservation)}
                        <Link
                          href={`/admin/reservations/calendar`}
                          className="inline-flex items-center gap-1 rounded-lg border border-cream-200 bg-white px-2.5 py-1.5 text-xs font-medium text-coffee-500 shadow-sm transition-colors hover:bg-cream-50 hover:text-coffee-600"
                          title="View in calendar">
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between border-t border-cream-200 bg-cream-50/50 px-4 py-3">
          <p className="text-sm text-charcoal-700/60">
            Showing{" "}
            <span className="font-medium text-charcoal-800">
              {filteredReservations.length}
            </span>{" "}
            reservation{filteredReservations.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-xs text-charcoal-700/60">
                {reservations.filter((r) => r.status === "pending").length}{" "}
                Pending
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-xs text-charcoal-700/60">
                {reservations.filter((r) => r.status === "confirmed").length}{" "}
                Confirmed
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-purple-400" />
              <span className="text-xs text-charcoal-700/60">
                {reservations.filter((r) => r.status === "seated").length}{" "}
                Seated
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
