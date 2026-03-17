import { create } from 'zustand';
import { Table } from '@/lib/types';

interface ReservationStore {
  step: number;
  date: string;
  timeSlot: string;
  pax: number;
  selectedTable: Table | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  setStep: (step: number) => void;
  setDate: (date: string) => void;
  setTimeSlot: (time: string) => void;
  setPax: (pax: number) => void;
  setSelectedTable: (table: Table | null) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setCustomerEmail: (email: string) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  step: 1,
  date: '',
  timeSlot: '',
  pax: 2,
  selectedTable: null,
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  notes: '',
  setStep: (step) => set({ step }),
  setDate: (date) => set({ date, selectedTable: null }),
  setTimeSlot: (timeSlot) => set({ timeSlot, selectedTable: null }),
  setPax: (pax) => set({ pax, selectedTable: null }),
  setSelectedTable: (selectedTable) => set({ selectedTable }),
  setCustomerName: (customerName) => set({ customerName }),
  setCustomerPhone: (customerPhone) => set({ customerPhone }),
  setCustomerEmail: (customerEmail) => set({ customerEmail }),
  setNotes: (notes) => set({ notes }),
  reset: () => set({
    step: 1, date: '', timeSlot: '', pax: 2, selectedTable: null,
    customerName: '', customerPhone: '', customerEmail: '', notes: '',
  }),
}));
