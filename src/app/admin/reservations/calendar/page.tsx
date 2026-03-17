"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Clock,
} from "lucide-react";
import { mockReservations } from "@/lib/data/mock";
import { getStatusColor } from "@/lib/utils";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ReservationCalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const reservationsByDate = useMemo(() => {
    const map: Record<string, typeof mockReservations> = {};
    mockReservations.forEach((r) => {
      if (!map[r.date]) map[r.date] = [];
      map[r.date].push(r);
    });
    return map;
  }, []);

  const selectedReservations = selectedDate
    ? reservationsByDate[selectedDate] || []
    : [];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">
            Reservation Calendar
          </h1>
          <p className="text-coffee-400 text-sm mt-1">
            Visual calendar view of all reservations
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm shadow-brown-900/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-cream-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-brown-900" />
            </button>
            <h2 className="text-lg font-semibold text-brown-900">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-cream-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-brown-900" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-coffee-400 py-2">
                {d}
              </div>
            ))}
            {calendarCells.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayReservations = reservationsByDate[dateStr] || [];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative p-2 min-h-[72px] rounded-lg text-left transition-colors border ${
                    isSelected
                      ? "border-coffee-500 bg-coffee-50"
                      : isToday
                        ? "border-coffee-300 bg-cream-100"
                        : "border-transparent hover:bg-cream-50"
                  }`}>
                  <span
                    className={`text-sm font-medium ${isToday ? "text-coffee-600" : "text-brown-900"}`}>
                    {day}
                  </span>
                  {dayReservations.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-0.5">
                      {dayReservations.slice(0, 3).map((r) => (
                        <div
                          key={r.id}
                          className={`w-2 h-2 rounded-full ${
                            r.status === "confirmed"
                              ? "bg-blue-500"
                              : r.status === "pending"
                                ? "bg-yellow-500"
                                : r.status === "seated"
                                  ? "bg-purple-500"
                                  : r.status === "completed"
                                    ? "bg-gray-400"
                                    : "bg-red-500"
                          }`}
                        />
                      ))}
                      {dayReservations.length > 3 && (
                        <span className="text-[10px] text-coffee-400">
                          +{dayReservations.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm shadow-brown-900/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-coffee-500" />
            <h3 className="font-semibold text-brown-900">
              {selectedDate
                ? new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "id-ID",
                    { day: "numeric", month: "long", year: "numeric" },
                  )
                : "Select a date"}
            </h3>
          </div>

          {!selectedDate ? (
            <p className="text-sm text-coffee-400">
              Click on a date to view reservations.
            </p>
          ) : selectedReservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-10 h-10 text-cream-300 mx-auto mb-2" />
              <p className="text-sm text-coffee-400">
                No reservations on this date.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedReservations.map((r) => (
                <div
                  key={r.id}
                  className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-semibold text-brown-900">
                      {r.bookingCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-brown-800">
                    {r.customerName}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-coffee-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {r.timeSlot} - {r.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {r.pax} pax
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
