

## Plan: Booking Flow dengan Custom Calendar (Mock/Tanpa Backend)

### Overview
Membuat multi-step booking flow lengkap: pilih paket → pilih jadwal → isi data diri → checkout & upload bukti transfer. Data disimpan di state (mock), siap untuk integrasi backend nanti.

### Langkah Implementasi

**1. Buat halaman booking baru (`/booking`)**
- Route baru di `App.tsx`
- Multi-step wizard dengan 4 tahap: Pilih Paket → Pilih Jadwal → Data Diri → Checkout & Upload

**2. Step 1 - Pilih Paket**
- Toggle Mobil Kursus / Mobil Sendiri (reuse logic dari PricingSection)
- 3 kartu paket (Dasar, Lancar, Mahir) dengan harga sesuai toggle
- Klik "Pilih" untuk lanjut ke step berikutnya

**3. Step 2 - Pilih Jadwal (Custom Calendar)**
- Date picker menggunakan shadcn Calendar component
- Mock data slot waktu tersedia (pagi 08:00, 10:00, siang 13:00, 15:00)
- Beberapa slot ditandai "penuh" (mock disabled)
- User pilih tanggal lalu pilih slot waktu

**4. Step 3 - Form Data Diri**
- Input: Nama Lengkap, No WhatsApp, Titik Jemput, Catatan Tambahan
- Validasi dengan zod (nama & WA wajib diisi, format WA valid)
- UI bersih dengan label yang jelas

**5. Step 4 - Checkout & Upload Bukti Transfer**
- Ringkasan booking: paket, jadwal, data diri, total biaya
- Info rekening tujuan transfer (mock: BCA / BRI)
- Upload area untuk screenshot bukti transfer (.jpg, .png, .pdf, max 5MB)
- Preview file yang diupload
- Tombol "Konfirmasi Booking"
- Setelah submit: tampilan sukses dengan nomor booking (random ID)

**6. Update navigasi**
- Tombol "Pilih Paket Ini" di PricingSection → navigate ke `/booking?paket=nama_paket&tipe=kursus/sendiri`
- Ganti section Cal.com (ScheduleSection) dengan CTA menuju booking page
- Update Navbar jika perlu

### File yang akan dibuat/diubah
- **Baru**: `src/pages/BookingPage.tsx` - halaman utama booking
- **Baru**: `src/components/booking/StepPaket.tsx`
- **Baru**: `src/components/booking/StepJadwal.tsx`
- **Baru**: `src/components/booking/StepDataDiri.tsx`
- **Baru**: `src/components/booking/StepCheckout.tsx`
- **Baru**: `src/components/booking/BookingStepper.tsx` - progress indicator
- **Edit**: `src/App.tsx` - tambah route `/booking`
- **Edit**: `src/components/PricingSection.tsx` - tombol navigate ke booking
- **Edit**: `src/components/ScheduleSection.tsx` - ubah jadi CTA ke booking
- **Edit**: `src/components/Navbar.tsx` - update menu item "Cek Jadwal" ke booking

