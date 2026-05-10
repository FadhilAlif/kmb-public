# Kursus Mobil Bantul

Website **Kursus Mobil Bantul** — platform pemesanan kursus mengemudi terbaik di Bantul & Yogyakarta. Aplikasi ini menyediakan landing page informatif serta sistem booking multi-step yang terintegrasi langsung dengan database Supabase.

---

## ✨ Fitur Utama

- **Landing Page Profesional** — Hero section, keunggulan, harga, jadwal, tentang kami, testimoni, dan FAQ
- **Sistem Booking Multi-Step** — Alur pemesanan: Pilih Paket → Pilih Jadwal → Data Diri → Checkout
- **Integrasi Supabase** — Database realtime untuk data siswa, booking, pembayaran, dan jadwal sesi
- **Upload Bukti Transfer** — Unggah bukti pembayaran langsung ke Supabase Storage
- **SEO Ready** — Meta tags dinamis dengan React Helmet Async
- **WhatsApp Integration** — Tombol floating untuk komunikasi langsung via WhatsApp
- **Responsive Design** — Tampilan optimal di desktop, tablet, dan mobile
- **Animasi Halus** — Transisi dan animasi menggunakan Framer Motion

---

## 🛠️ Teknologi

| Kategori | Teknologi |
|----------|-----------|
| Build Tool | [Vite](https://vitejs.dev/) |
| Framework | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Animasi | [Framer Motion](https://www.framer.com/motion/) |
| Routing | [React Router DOM](https://reactrouter.com/) |
| State & Data | [TanStack Query](https://tanstack.com/query/) |
| Backend | [Supabase](https://supabase.com/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Icons | [Lucide React](https://lucide.dev/) |

---

## 🚀 Cara Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) (disarankan versi LTS)
- [npm](https://www.npmjs.com/) atau [Bun](https://bun.sh/)
- Akun [Supabase](https://supabase.com/) dengan project yang sudah dikonfigurasi

### Langkah Instalasi

1. **Clone repository**

   ```sh
   git clone <URL_REPOSITORY>
   cd bantul-driving-school-hub
   ```

2. **Install dependensi**

   Menggunakan npm:
   ```sh
   npm install
   ```

   Atau menggunakan Bun:
   ```sh
   bun install
   ```

3. **Konfigurasi environment**

   Salin file `.env.example` menjadi `.env`:
   ```sh
   cp .env.example .env
   ```

   Isi variabel berikut di file `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Jalankan server development**

   ```sh
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:5173`

### Script Tersedia

| Script | Perintah | Keterangan |
|--------|----------|------------|
| Development | `npm run dev` | Menjalankan server dev dengan hot reload |
| Build | `npm run build` | Build untuk production |
| Build Dev | `npm run build:dev` | Build dalam mode development |
| Preview | `npm run preview` | Preview build production secara lokal |
| Lint | `npm run lint` | Menjalankan ESLint |
| Lighthouse | `npm run lighthouse` | Audit performa dengan Lighthouse CI |

---

## 📁 Struktur Project

```
.
├── public/                 # Asset statis
├── src/
│   ├── components/         # Komponen React
│   │   ├── ui/            # Komponen shadcn/ui
│   │   ├── booking/       # Komponen form booking (stepper, steps)
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── ...
│   │   └── FloatingWhatsApp.tsx
│   ├── pages/             # Halaman aplikasi
│   │   ├── Index.tsx      # Landing page
│   │   ├── BookingPage.tsx # Halaman booking
│   │   └── NotFound.tsx   # Halaman 404
│   ├── services/          # Logika bisnis & API
│   │   └── bookingService.ts
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Konfigurasi third-party
│   │   └── supabase/
│   ├── lib/               # Utility functions
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── .env.example           # Template environment variables
├── vite.config.ts         # Konfigurasi Vite
├── tailwind.config.ts     # Konfigurasi Tailwind CSS
└── package.json
```

---

## 🗄️ Skema Database (Supabase)

Project ini menggunakan tabel-tabel berikut di Supabase:

- **students** — Data siswa (nama, nomor WhatsApp, alamat penjemputan)
- **packages** — Paket kursus yang tersedia (nama, harga, jumlah sesi, tipe mobil)
- **bookings** — Data pemesanan (siswa, paket, status, catatan)
- **payments** — Data pembayaran (jumlah, metode, bukti transfer, status)
- **sessions** — Jadwal sesi kursus (tanggal, waktu mulai/selesai, status)

> Pastikan bucket/object storage `payment-proofs` sudah dibuat di Supabase Storage untuk fitur upload bukti transfer.

---

## 📦 Deployment

Project ini sudah dikonfigurasi untuk deployment ke [Vercel](https://vercel.com/).

### Deploy ke Vercel

1. Hubungkan repository ke Vercel
2. Tambahkan environment variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
3. Deploy!

---

## 📞 Kontak

Untuk pertanyaan atau informasi lebih lanjut:

- **WhatsApp**: [Hubungi Kami](https://wa.me/6285727304551) 
- **Lokasi**: Bantul, Yogyakarta, Indonesia
