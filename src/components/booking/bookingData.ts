export interface PackageInfo {
  name: string;
  description: string;
  sessions: number;
  priceOwn: number;
  priceCourse: number;
  featuresOwn: string[];
  featuresCourse: string[];
  popular?: boolean;
}

export const packages: PackageInfo[] = [
  {
    name: "Paket Dasar",
    description: "Cocok untuk pemula yang baru pertama kali belajar",
    sessions: 5,
    priceCourse: 750000,
    priceOwn: 500000,
    featuresCourse: [
      "5x Pertemuan @ 90 menit",
      "Mobil kursus disediakan",
      "BBM sudah termasuk",
      "Materi dasar mengemudi",
      "Antar-jemput rumah",
    ],
    featuresOwn: [
      "5x Pertemuan @ 90 menit",
      "Pakai mobil pribadi Anda",
      "BBM ditanggung siswa",
      "Materi dasar mengemudi",
      "Instruktur ke lokasi Anda",
    ],
  },
  {
    name: "Paket Lancar",
    description: "Untuk yang sudah bisa tapi ingin lebih lancar",
    sessions: 8,
    priceCourse: 1100000,
    priceOwn: 750000,
    featuresCourse: [
      "8x Pertemuan @ 90 menit",
      "Mobil kursus disediakan",
      "BBM sudah termasuk",
      "Latihan di jalan raya",
      "Parkir & manuver",
      "Antar-jemput rumah",
    ],
    featuresOwn: [
      "8x Pertemuan @ 90 menit",
      "Pakai mobil pribadi Anda",
      "BBM ditanggung siswa",
      "Latihan di jalan raya",
      "Parkir & manuver",
      "Instruktur ke lokasi Anda",
    ],
    popular: true,
  },
  {
    name: "Paket Mahir",
    description: "Sampai mahir & siap ujian SIM",
    sessions: 12,
    priceCourse: 1500000,
    priceOwn: 1000000,
    featuresCourse: [
      "12x Pertemuan @ 90 menit",
      "Mobil kursus disediakan",
      "BBM sudah termasuk",
      "Semua teknik mengemudi",
      "Simulasi ujian SIM",
      "Pendampingan ke Samsat",
      "Garansi sampai bisa",
    ],
    featuresOwn: [
      "12x Pertemuan @ 90 menit",
      "Pakai mobil pribadi Anda",
      "BBM ditanggung siswa",
      "Semua teknik mengemudi",
      "Simulasi ujian SIM",
      "Pendampingan ke Samsat",
      "Garansi sampai bisa",
    ],
  },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export interface BookingData {
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

// Mock time slots
export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

export const getTimeSlotsForDate = (date: Date): TimeSlot[] => {
  const day = date.getDay();
  // Weekends have fewer slots
  const baseSlots: TimeSlot[] = [
    { time: "08:00", label: "08:00 - 09:30", available: true },
    { time: "10:00", label: "10:00 - 11:30", available: true },
    { time: "13:00", label: "13:00 - 14:30", available: true },
    { time: "15:00", label: "15:00 - 16:30", available: true },
  ];

  // Mock: some slots unavailable based on date
  const dateNum = date.getDate();
  if (dateNum % 3 === 0) baseSlots[0].available = false;
  if (dateNum % 4 === 0) baseSlots[2].available = false;
  if (day === 0) {
    // Sunday: only 2 slots
    baseSlots[0].available = false;
    baseSlots[3].available = false;
  }

  return baseSlots;
};
