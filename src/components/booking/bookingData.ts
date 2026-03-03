export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export interface BookingData {
  packageId: string;
  packageName: string;
  useOwnCar: boolean;
  price: number;
  sessions: number;
  date: Date | undefined;
  timeSlot: string;
  nama: string;
  whatsapp: string;
  titikJemput: string;
  catatan: string;
  buktiTransfer: File | null;
}

export const initialBookingData: BookingData = {
  packageId: "",
  packageName: "",
  useOwnCar: false,
  price: 0,
  sessions: 0,
  date: undefined,
  timeSlot: "",
  nama: "",
  whatsapp: "",
  titikJemput: "",
  catatan: "",
  buktiTransfer: null,
};

// Static list of time slots for the scheduling step.
// Availability is determined at runtime by querying the DB (useBookedSlots).
export interface TimeSlot {
  time: string;
  label: string;
}

export const ALL_TIME_SLOTS: TimeSlot[] = [
  { time: "08:00", label: "08:00 - 09:30" },
  { time: "10:00", label: "10:00 - 11:30" },
  { time: "13:00", label: "13:00 - 14:30" },
  { time: "15:00", label: "15:00 - 16:30" },
];
