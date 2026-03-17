"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  FileText,
  Sparkles,
} from "lucide-react";
import { TIME_SLOTS } from "@/lib/constants";
import { useReservationStore } from "@/lib/stores/reservation-store";
import { generateBookingCode, cn, formatCurrency } from "@/lib/utils";
import FloorPlan from "@/components/reservation/floor-plan";

/* ---------- Step indicator ---------- */
const STEPS = [
  { number: 1, title: "Date & Time", icon: Calendar },
  { number: 2, title: "Select Table", icon: MapPin },
  { number: 3, title: "Confirm Booking", icon: Check },
];

export default function ReservationPage() {
  const router = useRouter();
  const store = useReservationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    step,
    setStep,
    date,
    setDate,
    timeSlot,
    setTimeSlot,
    pax,
    setPax,
    selectedTable,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerEmail,
    setCustomerEmail,
    notes,
    setNotes,
    reset,
  } = store;

  /* ---------- Derived ---------- */
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const maxDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  }, []);

  /* ---------- Validation ---------- */
  function validateStep1(): boolean {
    const newErrors: Record<string, string> = {};
    if (!date) newErrors.date = "Please select a date";
    if (!timeSlot) newErrors.timeSlot = "Please select a time slot";
    if (pax < 1) newErrors.pax = "At least 1 person is required";
    if (pax > 20) newErrors.pax = "Maximum 20 people";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep2(): boolean {
    const newErrors: Record<string, string> = {};
    if (!selectedTable) newErrors.table = "Please select a table";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep3(): boolean {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = "Name is required";
    if (!customerPhone.trim())
      newErrors.customerPhone = "Phone number is required";
    else if (!/^[0-9+\-\s()]{8,20}$/.test(customerPhone.trim()))
      newErrors.customerPhone = "Enter a valid phone number";
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))
      newErrors.customerEmail = "Enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /* ---------- Navigation ---------- */
  function goNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) {
      setStep(step + 1);
      setErrors({});
    }
  }

  function goBack() {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  }

  /* ---------- Submit ---------- */
  async function handleSubmit() {
    if (!validateStep3()) return;
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const bookingCode = generateBookingCode();
    reset();
    router.push(
      `/reservation-success?code=${bookingCode}&date=${date}&time=${timeSlot}&pax=${pax}&table=${selectedTable?.name || ""}&tableNum=${selectedTable?.number || ""}`,
    );
  }

  /* ---------- Format date for display ---------- */
  function formatDisplayDate(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero header */}
      <div className="gradient-coffee px-4 pb-12 pt-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-cream-200 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Reserve Your Perfect Spot
          </div>
          <h1 className="text-3xl font-bold text-cream-50 sm:text-4xl">
            Table Reservation
          </h1>
          <p className="mt-2 text-cream-300 text-sm sm:text-base">
            Secure your table at Ruang Rumi and enjoy a premium cafe experience
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 -mt-6 pb-16">
        {/* Step indicator */}
        <div className="mb-8 rounded-2xl bg-white border border-cream-200 px-6 py-5 shadow-lg shadow-brown-900/5 sm:px-10">
          <div className="flex items-center">
            {STEPS.map((s, idx) => {
              const StepIcon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;

              return (
                <div
                  key={s.number}
                  className={cn(
                    "flex items-center",
                    idx < STEPS.length - 1 ? "flex-1" : "",
                  )}>
                  {/* Step circle + label */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-coffee-500 text-white shadow-md shadow-coffee-500/25"
                            : "bg-cream-100 text-brown-700/35 border border-cream-200",
                      )}>
                      {isCompleted ? (
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      ) : (
                        <StepIcon className="h-4 w-4" strokeWidth={1.8} />
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <p
                        className={cn(
                          "text-[10px] font-medium uppercase tracking-wider",
                          isActive
                            ? "text-coffee-400"
                            : isCompleted
                              ? "text-green-500"
                              : "text-brown-700/30",
                        )}>
                        Step {s.number}
                      </p>
                      <p
                        className={cn(
                          "text-sm font-semibold leading-tight",
                          isActive
                            ? "text-brown-900"
                            : isCompleted
                              ? "text-green-700"
                              : "text-brown-700/40",
                        )}>
                        {s.title}
                      </p>
                    </div>
                  </div>
                  {/* Connector line */}
                  {idx < STEPS.length - 1 && (
                    <div className="mx-3 h-px flex-1 bg-cream-200 sm:mx-5">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          step > s.number ? "bg-green-400 w-full" : "w-0",
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-2xl bg-white border border-cream-200 shadow-lg shadow-brown-900/5 overflow-hidden">
          {/* ==================== STEP 1: Date & Time ==================== */}
          {step === 1 && (
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-brown-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-coffee-500" />
                  Choose Date & Time
                </h2>
                <p className="mt-1 text-sm text-brown-700/60">
                  Select your preferred date, time slot, and party size
                </p>
              </div>

              <div className="space-y-8">
                {/* Date picker */}
                <div>
                  <label
                    htmlFor="reservation-date"
                    className="mb-2 block text-sm font-semibold text-brown-800">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coffee-400" />
                    <input
                      id="reservation-date"
                      type="date"
                      value={date}
                      min={tomorrowStr}
                      max={maxDateStr}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setErrors((prev) => ({ ...prev, date: "" }));
                      }}
                      className={cn(
                        "w-full rounded-xl border bg-cream-50 py-3 pl-10 pr-4 text-sm text-brown-900",
                        "transition-all focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                        errors.date ? "border-red-400" : "border-cream-200",
                      )}
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.date}</p>
                  )}
                  {date && (
                    <p className="mt-1.5 text-xs text-coffee-400">
                      {formatDisplayDate(date)}
                    </p>
                  )}
                </div>

                {/* Time slots */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-brown-800">
                    <Clock className="mr-1.5 inline h-4 w-4 text-coffee-400" />
                    Time Slot
                  </label>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-9">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = timeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setTimeSlot(slot);
                            setErrors((prev) => ({ ...prev, timeSlot: "" }));
                          }}
                          className={cn(
                            "rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200",
                            isSelected
                              ? "bg-coffee-500 text-white shadow-md shadow-coffee-500/20 scale-105"
                              : "bg-cream-100 text-brown-700 hover:bg-cream-200 hover:text-brown-900 border border-cream-200",
                          )}
                          aria-pressed={isSelected}>
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  {errors.timeSlot && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.timeSlot}
                    </p>
                  )}
                </div>

                {/* Pax counter */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-brown-800">
                    <Users className="mr-1.5 inline h-4 w-4 text-coffee-400" />
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => pax > 1 && setPax(pax - 1)}
                      disabled={pax <= 1}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold transition-all",
                        pax <= 1
                          ? "bg-cream-100 text-brown-700/30 cursor-not-allowed border border-cream-200"
                          : "bg-cream-100 text-brown-800 hover:bg-cream-200 border border-cream-200 active:scale-95",
                      )}
                      aria-label="Decrease guests">
                      -
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-bold text-brown-900 tabular-nums">
                        {pax}
                      </span>
                      <span className="text-xs text-brown-700/60">
                        {pax === 1 ? "person" : "people"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => pax < 20 && setPax(pax + 1)}
                      disabled={pax >= 20}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold transition-all",
                        pax >= 20
                          ? "bg-cream-100 text-brown-700/30 cursor-not-allowed border border-cream-200"
                          : "bg-coffee-500 text-white hover:bg-brown-700 shadow-lg shadow-coffee-500/20 active:scale-95",
                      )}
                      aria-label="Increase guests">
                      +
                    </button>
                  </div>
                  {errors.pax && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.pax}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== STEP 2: Select Table ==================== */}
          {step === 2 && (
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-brown-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-coffee-500" />
                  Select Your Table
                </h2>
                <p className="mt-1 text-sm text-brown-700/60">
                  Pick a table that suits your group. Green tables are available
                  for your party size.
                </p>
              </div>

              {/* Summary pills */}
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 border border-cream-200 px-3 py-1.5 text-xs font-medium text-brown-700">
                  <Calendar className="h-3 w-3" />
                  {formatDisplayDate(date)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 border border-cream-200 px-3 py-1.5 text-xs font-medium text-brown-700">
                  <Clock className="h-3 w-3" />
                  {timeSlot}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 border border-cream-200 px-3 py-1.5 text-xs font-medium text-brown-700">
                  <Users className="h-3 w-3" />
                  {pax} {pax === 1 ? "person" : "people"}
                </span>
              </div>

              {/* Floor plan */}
              <FloorPlan />

              {errors.table && (
                <p className="mt-3 text-sm text-red-500">{errors.table}</p>
              )}
            </div>
          )}

          {/* ==================== STEP 3: Confirm Booking ==================== */}
          {step === 3 && (
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-brown-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-coffee-500" />
                  Confirm Your Booking
                </h2>
                <p className="mt-1 text-sm text-brown-700/60">
                  Fill in your details and review the booking summary
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Contact form */}
                <div className="space-y-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-brown-800">
                    Contact Information
                  </h3>

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="customer-name"
                      className="mb-1.5 block text-sm font-medium text-brown-800">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setErrors((prev) => ({ ...prev, customerName: "" }));
                      }}
                      placeholder="e.g. John Doe"
                      className={cn(
                        "w-full rounded-xl border bg-cream-50 px-4 py-3 text-sm text-brown-900 placeholder:text-brown-700/30",
                        "transition-all focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                        errors.customerName
                          ? "border-red-400"
                          : "border-cream-200",
                      )}
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="customer-phone"
                      className="mb-1.5 block text-sm font-medium text-brown-800">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="customer-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        setErrors((prev) => ({ ...prev, customerPhone: "" }));
                      }}
                      placeholder="e.g. 081234567890"
                      className={cn(
                        "w-full rounded-xl border bg-cream-50 px-4 py-3 text-sm text-brown-900 placeholder:text-brown-700/30",
                        "transition-all focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                        errors.customerPhone
                          ? "border-red-400"
                          : "border-cream-200",
                      )}
                    />
                    {errors.customerPhone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.customerPhone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="customer-email"
                      className="mb-1.5 block text-sm font-medium text-brown-800">
                      Email{" "}
                      <span className="text-brown-700/40">(optional)</span>
                    </label>
                    <input
                      id="customer-email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, customerEmail: "" }));
                      }}
                      placeholder="e.g. john@email.com"
                      className={cn(
                        "w-full rounded-xl border bg-cream-50 px-4 py-3 text-sm text-brown-900 placeholder:text-brown-700/30",
                        "transition-all focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                        errors.customerEmail
                          ? "border-red-400"
                          : "border-cream-200",
                      )}
                    />
                    {errors.customerEmail && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.customerEmail}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="customer-notes"
                      className="mb-1.5 block text-sm font-medium text-brown-800">
                      Special Requests{" "}
                      <span className="text-brown-700/40">(optional)</span>
                    </label>
                    <textarea
                      id="customer-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Birthday celebration, high chair needed, dietary requirements..."
                      className={cn(
                        "w-full rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-brown-900 placeholder:text-brown-700/30",
                        "transition-all focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500",
                        "resize-none",
                      )}
                    />
                  </div>
                </div>

                {/* Booking summary */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brown-800">
                    Booking Summary
                  </h3>
                  <div className="rounded-2xl border border-cream-200 bg-cream-50 p-5 space-y-4">
                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coffee-100">
                        <Calendar className="h-4 w-4 text-coffee-500" />
                      </div>
                      <div>
                        <p className="text-xs text-coffee-400">Date</p>
                        <p className="text-sm font-semibold text-brown-900">
                          {formatDisplayDate(date)}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coffee-100">
                        <Clock className="h-4 w-4 text-coffee-500" />
                      </div>
                      <div>
                        <p className="text-xs text-coffee-400">Time</p>
                        <p className="text-sm font-semibold text-brown-900">
                          {timeSlot}
                        </p>
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coffee-100">
                        <Users className="h-4 w-4 text-coffee-500" />
                      </div>
                      <div>
                        <p className="text-xs text-coffee-400">Guests</p>
                        <p className="text-sm font-semibold text-brown-900">
                          {pax} {pax === 1 ? "person" : "people"}
                        </p>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coffee-100">
                        <MapPin className="h-4 w-4 text-coffee-500" />
                      </div>
                      <div>
                        <p className="text-xs text-coffee-400">Table</p>
                        <p className="text-sm font-semibold text-brown-900">
                          {selectedTable?.name} (#{selectedTable?.number})
                        </p>
                        <p className="text-xs text-coffee-400">
                          {selectedTable?.capacity} seats,{" "}
                          {selectedTable?.shape} table
                        </p>
                      </div>
                    </div>

                    {/* Minimum order */}
                    {selectedTable?.minimumOrder && (
                      <div className="rounded-xl bg-gold-400/10 border border-gold-400/20 px-4 py-3">
                        <p className="text-xs text-coffee-400">Minimum Order</p>
                        <p className="text-sm font-bold text-brown-900">
                          {formatCurrency(selectedTable.minimumOrder)}
                        </p>
                      </div>
                    )}

                    {/* Notes preview */}
                    {notes && (
                      <div className="border-t border-cream-200 pt-3">
                        <p className="text-xs text-coffee-400">Notes</p>
                        <p className="text-sm text-brown-700">{notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Policies */}
                  <div className="mt-4 rounded-xl bg-cream-100 border border-cream-200 px-4 py-3 space-y-2">
                    <p className="text-xs font-semibold text-brown-800">
                      Reservation Policy
                    </p>
                    <ul className="text-xs text-brown-700/70 space-y-1">
                      <li className="flex items-start gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-coffee-400" />
                        Please arrive within 15 minutes of your reserved time
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-coffee-400" />
                        Reservations are held for a maximum of 2 hours
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-coffee-400" />
                        Cancellations should be made at least 2 hours before
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== Navigation bar ==================== */}
          <div className="flex items-center justify-between border-t border-cream-200 bg-cream-50/50 px-6 py-4 sm:px-8">
            {/* Back */}
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all",
                  "border border-cream-300 text-brown-700",
                  "hover:bg-cream-200 hover:text-brown-900",
                )}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {/* Next / Submit */}
            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all",
                  "bg-coffee-500 text-white",
                  "hover:bg-brown-700 active:scale-[0.98]",
                  "shadow-lg shadow-coffee-500/20",
                )}>
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all",
                  "bg-coffee-500 text-white",
                  "hover:bg-brown-700 active:scale-[0.98]",
                  "shadow-lg shadow-coffee-500/20",
                  "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-coffee-500",
                )}>
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Confirm Reservation
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
