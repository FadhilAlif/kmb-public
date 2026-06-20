# PRD — KMB Public

## Kursus Mobil Bantul Marketing Site & Booking Intake

* **Version:** 1.3 Implemented MVP Alignment
* **Date:** 2026-06-20
* **Product Phase:** Public MVP — Marketing Site + Booking Request Intake
* **Primary Language:** Indonesian
* **Primary Market:** Bantul dan sekitar Yogyakarta
* **Owner:** KMB / Kursus Mobil Bantul
* **Related Future Product:** KMB Admin Hub

---

## 0. Current Implementation Status

This repository currently implements KMB Public as a Vite React SPA with Vercel-compatible API handlers under `api/`.

Implemented:

* Landing page sections, SEO metadata, LocalBusiness JSON-LD, FAQ JSON-LD, package cards, and WhatsApp CTAs.
* Booking wizard with package selection, first-session preference, customer data, payment proof upload, and success state.
* Server-side `/api/availability` and `/api/booking` handlers.
* Local Vite development middleware for `/api/availability` and `/api/booking`.
* Server-side Zod validation, honeypot validation, file validation, normalized WhatsApp, package/date/slot validation, booking code generation, private payment proof upload, and one tentative first session.
* PRD.New status semantics: `pending_verification`, `confirmed`, `tentative`, `scheduled`, `completed`, `canceled`.
* Light-mode-only UI and no TanStack Query.

Implemented with MVP caveats:

* IP rate limiting uses the `booking_rate_limits` Supabase table with an in-memory fallback if the table is unavailable.
* WhatsApp automation is optional through `BOOKING_NOTIFY_WEBHOOK_URL`; manual WhatsApp CTA is implemented.
* Full atomic booking transaction is still deferred to Phase 2.

Not implemented:

* Next.js App Router migration.
* Admin Hub.
* Staff authentication.
* Full WAHA/GOWA bot workflow.

---

## 1. Background & Context

KMB, atau Kursus Mobil Bantul, adalah bisnis kursus mengemudi lokal yang saat ini dijalankan oleh satu orang, yaitu pemilik sekaligus instruktur utama. Aktivitas marketing saat ini masih dilakukan secara manual melalui WhatsApp, rekomendasi dari mulut ke mulut, dan komunikasi langsung dengan calon siswa.

Aplikasi KMB Public dibuat untuk membantu memperluas jangkauan marketing secara digital, meningkatkan kepercayaan calon siswa, menampilkan informasi paket secara lebih rapi, dan menyediakan funnel booking awal yang lebih terstruktur.

Pada fase MVP, aplikasi ini bukan sistem operasional penuh. Aplikasi publik hanya bertugas menerima booking request dari customer. Verifikasi pembayaran, konfirmasi jadwal final, pengelolaan sesi lanjutan, dan operasional harian tetap dilakukan secara manual oleh pemilik/admin melalui WhatsApp dan nantinya melalui Admin Hub.

Admin Hub akan dibuat sebagai repo terpisah setelah MVP publik selesai dan stabil.

---

## 2. Product Positioning

KMB Public adalah:

> Marketing website dan booking request funnel untuk membantu calon siswa menemukan informasi Kursus Mobil Bantul, memilih paket, memilih preferensi jadwal pertama, mengirim data diri, mengupload bukti pembayaran, dan mendapatkan kode booking yang mudah dibaca.

KMB Public bukan:

> Full scheduling system, admin dashboard, multi-instructor platform, payment gateway system, atau sistem operasional kursus mobil yang kompleks.

---

## 3. Goals

* Mengubah pengunjung lokal menjadi lead booking kursus yang qualified.
* Menampilkan informasi paket, harga, tipe mobil, benefit, dan jadwal dengan jelas.
* Memungkinkan customer melakukan booking request tanpa membuat akun.
* Menangkap data yang cukup agar pemilik/admin dapat melakukan konfirmasi via WhatsApp.
* Mewajibkan customer mengupload bukti pembayaran sebelum submit booking.
* Memberikan human-readable booking ID kepada customer.
* Mengirim atau menyiapkan follow-up WhatsApp setelah booking berhasil.
* Menjaga aplikasi publik tetap ringan, terpercaya, mobile-first, dan SEO-friendly.
* Menyiapkan struktur data yang bersih untuk Admin Hub di masa depan.

---

## 4. Non-Goals

MVP ini tidak akan:

* Menjadi Admin Dashboard atau staff interface.
* Menyimpan service-role secrets di browser.
* Mengimplementasikan autentikasi staff.
* Menyediakan payment gateway settlement.
* Mendukung multi-instruktur.
* Mengelola operasional instruktur secara penuh.
* Membuat semua sesi kursus sekaligus.
* Mengelola sesi ke-2, ke-3, dan seterusnya dari public app.
* Mendukung dark/light theme toggle.
* Menggunakan TanStack Query.
* Mengimplementasikan WhatsApp bot workflow penuh.
* Membuat customer account/login.

---

## 5. Target Users

### 5.1 Pengguna Publik

Primary users:

* Calon siswa usia 17 tahun ke atas yang ingin belajar mengemudi.
* Orang tua atau anggota keluarga yang booking untuk siswa.
* Pengunjung lokal yang membandingkan paket kursus mobil di Bantul atau Yogyakarta.

### 5.2 Pengguna Internal Tidak Langsung

Internal users indirectly served:

* Pemilik bisnis sekaligus instruktur yang menerima booking dan konfirmasi via WhatsApp.
* Admin, yaitu anak pemilik, yang membantu manage booking dan operasional.
* Future Admin Hub user yang akan memverifikasi pembayaran, mengonfirmasi jadwal, dan mengelola sesi.

---

## 6. MVP Principle

Public app creates a booking request, not a final confirmed schedule.

Tanggal dan jam yang dipilih customer pada aplikasi publik adalah preferensi jadwal sesi pertama. Jadwal final hanya valid setelah pemilik/admin memverifikasi bukti pembayaran dan mengonfirmasi jadwal melalui WhatsApp.

Konsep utama:

```text
User submit booking request
→ Admin verifikasi pembayaran
→ Admin konfirmasi jadwal via WhatsApp
→ Booking menjadi confirmed
```

---

## 7. User Experience

## 7.1 Landing Page

* **Route:** `/`
* **Purpose:** membangun trust, menjelaskan layanan, menampilkan paket, dan mengarahkan user ke booking.

### Sections

1. **Navbar**

   * Brand KMB / Kursus Mobil Bantul.
   * Anchor links ke section utama:

     * Paket
     * Jadwal
     * Tentang
     * FAQ
     * Kontak

2. **Hero**

   * Headline utama.
   * Subheadline yang menjelaskan benefit kursus.
   * CTA utama ke `/booking`.
   * CTA sekunder ke WhatsApp.

3. **Trust / Keunggulan**

   * Instruktur berpengalaman.
   * Cocok untuk pemula.
   * Bisa menggunakan mobil kursus atau mobil sendiri.
   * Area layanan Bantul dan sekitar Yogyakarta.
   * Komunikasi mudah via WhatsApp.

4. **Paket Harga**

   * Data paket diambil dari Supabase.
   * Hanya menampilkan paket dengan `is_active = true`.
   * Tipe paket:

     * `mobil_kursus`
     * `mobil_sendiri`
   * Setiap card memiliki CTA ke:

     * `/booking?packageId={package_id}`

5. **Jadwal**

   * Menampilkan slot waktu yang tersedia:

     * `08:00`
     * `10:00`
     * `13:00`
     * `15:00`
   * Menjelaskan bahwa jadwal final akan dikonfirmasi admin via WhatsApp.

6. **Tentang**

   * Profil singkat KMB.
   * Profil singkat instruktur.
   * Penjelasan bahwa saat ini kursus dilayani langsung oleh pemilik/instruktur utama.

7. **Testimoni**

   * Testimoni dari siswa sebelumnya.
   * Untuk MVP bisa menggunakan data statis.

8. **FAQ**

   * Pertanyaan umum seputar:

     * Syarat usia
     * Paket
     * Pembayaran
     * Jadwal
     * Lokasi jemput
     * Penggunaan mobil sendiri

9. **Footer**

   * Nomor WhatsApp.
   * Alamat.
   * Area layanan.
   * Link sosial jika tersedia.

10. **Floating WhatsApp Button**

* Selalu terlihat.
* Mengarah ke nomor resmi bisnis.
* Menggunakan prefilled message sederhana.

11. **SEO**

* Metadata title.
* Metadata description.
* Canonical URL.
* Open Graph.
* LocalBusiness JSON-LD.

---

## 7.2 Booking Flow

* **Route:** `/booking`
* **Purpose:** menerima booking request dari customer.

Booking flow menggunakan wizard empat langkah.

### Step 1 — Pilih Paket

User dapat memilih paket aktif.

Requirements:

* Tampilkan semua paket aktif dari Supabase.
* Jika URL memiliki query param `packageId` yang valid:

  * Paket otomatis terpilih.
  * User diarahkan ke Step 2.
* Jika `packageId` tidak valid:

  * Tampilkan pilihan paket seperti biasa.
  * Berikan pesan error ringan bila perlu.

### Step 2 — Pilih Preferensi Jadwal Pertama

User memilih tanggal dan slot waktu untuk sesi pertama.

Requirements:

* Tanggal minimum adalah besok.
* User tidak dapat memilih hari ini atau tanggal sebelumnya.
* Slot waktu:

  * `08:00`
  * `10:00`
  * `13:00`
  * `15:00`
* Kapasitas per slot adalah 1 student karena instruktur saat ini hanya satu orang.
* Slot akan disabled jika pada tanggal dan jam tersebut sudah ada sesi dengan status:

  * `tentative`
  * `scheduled`
* Sesi dengan status `canceled` tidak memblok slot.
* Sesi dengan status `completed` adalah data historis dan tidak digunakan untuk availability check.

Important copy:

```text
Jadwal yang Anda pilih merupakan preferensi awal. Admin KMB akan menghubungi Anda melalui WhatsApp untuk verifikasi pembayaran dan konfirmasi jadwal final.
```

### Step 3 — Data Diri

User mengisi data customer.

Fields:

* Nama
* Nomor WhatsApp
* Titik jemput
* Catatan tambahan

### Step 4 — Pembayaran & Submit

User melihat instruksi transfer manual dan mengupload bukti pembayaran.

Requirements:

* Tampilkan nama bank.
* Tampilkan nomor rekening.
* Tampilkan nama pemilik rekening.
* Tampilkan nominal pembayaran berdasarkan paket.
* User wajib upload bukti pembayaran.
* Tombol submit hanya aktif jika semua data valid dan bukti pembayaran sudah tersedia.

Setelah submit berhasil:

* Tampilkan success state.
* Tampilkan booking ID.
* Tampilkan pesan bahwa admin akan menghubungi via WhatsApp.
* Tampilkan CTA WhatsApp dengan prefilled message berisi booking ID.

---

## 8. Business Rules

* Public app hanya membuat booking request, bukan jadwal final.
* User wajib mengupload bukti pembayaran sebelum submit.
* Booking baru masuk dengan status `pending_verification`.
* Payment baru masuk dengan status `pending_verification`.
* Sesi pertama dibuat dengan status `tentative`.
* Sesi ke-2 dan seterusnya tidak dibuat oleh public app.
* Admin/owner bertanggung jawab untuk memverifikasi pembayaran.
* Admin/owner bertanggung jawab untuk mengonfirmasi jadwal final via WhatsApp.
* Admin Hub bertanggung jawab untuk membuat dan mengelola sesi lanjutan.
* Slot yang terlihat available tetap membutuhkan konfirmasi akhir dari admin.
* Customer dari luar area layanan utama tetap boleh submit, tetapi admin akan mengonfirmasi ketersediaan manual.

---

## 9. Service Area Rules

Area layanan utama:

* Bantul
* Yogyakarta
* Area sekitar Bantul/Yogyakarta yang masih memungkinkan dijangkau instruktur

Rules:

* Customer wajib mengisi titik jemput.
* Public app tidak otomatis menolak lokasi di luar area utama.
* Jika lokasi terlalu jauh atau di luar jangkauan layanan, admin akan menghubungi customer via WhatsApp untuk konfirmasi.
* Landing page dan booking page harus menampilkan disclaimer bahwa area tertentu membutuhkan konfirmasi admin.

Recommended copy:

```text
Untuk titik jemput di luar area Bantul dan sekitar Yogyakarta, admin akan mengonfirmasi ketersediaan terlebih dahulu melalui WhatsApp.
```

---

## 10. Functional Requirements

## 10.1 Landing Page Requirements

* Menampilkan brand KMB / Kursus Mobil Bantul.
* Menampilkan CTA utama ke halaman booking.
* Menampilkan CTA WhatsApp.
* Menampilkan informasi benefit dan trust.
* Fetch paket aktif dari Supabase.
* Menampilkan harga paket secara dinamis.
* Membedakan tipe paket:

  * `mobil_kursus`
  * `mobil_sendiri`
* CTA paket mengarah ke `/booking?packageId={id}`.
* Menampilkan jadwal/slot yang umum tersedia.
* Menampilkan testimoni.
* Menampilkan FAQ.
* Menampilkan footer dengan kontak dan area layanan.
* Mendukung SEO metadata.
* Mendukung LocalBusiness JSON-LD.
* Responsif di mobile, tablet, dan desktop.

---

## 10.2 Booking Requirements

* Fetch paket aktif dari Supabase.
* Support package preselect via `packageId`.
* User dapat memilih tanggal mulai besok.
* User tidak dapat memilih tanggal hari ini atau sebelumnya.
* User dapat memilih slot:

  * `08:00`
  * `10:00`
  * `13:00`
  * `15:00`
* Query existing sessions pada tanggal yang dipilih.
* Disable slot jika ada sesi dengan status `tentative` atau `scheduled`.
* Kapasitas per slot adalah 1 student.
* User wajib mengisi data diri.
* User wajib upload bukti pembayaran.
* User tidak dapat submit jika data belum valid.
* Success state menampilkan booking ID.
* Success state menampilkan instruksi bahwa admin akan menghubungi via WhatsApp.
* Success state menampilkan CTA WhatsApp manual.

---

## 10.3 Customer Data Validation

| Field          | Rule                                     |
| -------------- | ---------------------------------------- |
| Nama           | Wajib                                    |
| Nama           | Minimal 3 karakter                       |
| Nama           | Maksimal 100 karakter                    |
| Nomor WhatsApp | Wajib                                    |
| Nomor WhatsApp | Format Indonesia: `08`, `62`, atau `+62` |
| Titik Jemput   | Wajib                                    |
| Titik Jemput   | Minimal 5 karakter                       |
| Titik Jemput   | Maksimal 200 karakter                    |
| Catatan        | Opsional                                 |
| Catatan        | Maksimal 500 karakter                    |

Nomor WhatsApp harus dinormalisasi server-side ke format:

```text
62xxxxxxxxxx
```

Contoh:

| Input User      | Normalized     |
| --------------- | -------------- |
| `08123456789`   | `628123456789` |
| `628123456789`  | `628123456789` |
| `+628123456789` | `628123456789` |

---

## 10.4 Payment Proof Validation

Accepted file types:

* `.jpg`
* `.jpeg`
* `.png`
* `.pdf`

Validation:

| Aspect    | Rule                                       |
| --------- | ------------------------------------------ |
| Extension | Must be `.jpg`, `.jpeg`, `.png`, or `.pdf` |
| MIME type | Must match allowed file type               |
| File size | Maximum 5 MB                               |
| Required  | Yes                                        |

MVP validation:

* Client-side validation for better UX.
* Server-side validation before upload.
* Reject empty file.
* Reject file larger than 5 MB.
* Reject invalid MIME type.

Phase 2 improvement:

* Add magic bytes validation for stronger file verification.

---

## 10.5 Anti-Spam & Protection

MVP protection:

* Server-side Zod validation.
* Honeypot field.
* Rate limit by IP.
* Rate limit by normalized WhatsApp number.
* Input trimming.
* Basic sanitization.
* Private storage for payment proof.
* Do not expose public payment proof URL.

Recommended rate limit:

| Scope           | Limit                                  |
| --------------- | -------------------------------------- |
| IP address      | Maximum 5 booking submissions per hour |
| WhatsApp number | Maximum 3 pending bookings per day     |

Current implementation:

* Enforce rate limit in `/api/booking`.
* Store IP submission counters in Supabase table `booking_rate_limits`.
* Enforce normalized WhatsApp limit by counting recent `pending_verification` bookings for the existing student.
* Use an in-memory IP fallback only for local/degraded development if `booking_rate_limits` is unavailable.

If rate limit is exceeded, return actionable error:

```text
Terlalu banyak percobaan booking. Silakan coba lagi beberapa saat nanti atau hubungi admin melalui WhatsApp.
```

---

## 11. Booking Submission

## 11.1 Submission Entry Point

Booking submission is handled by:

```text
POST /api/booking
```

In this repository, this is implemented as a Vercel-compatible API handler:

```text
api/booking.ts
```

During local Vite development, `vite.config.ts` mounts this handler as middleware so `npm run dev` also serves `/api/booking`.

The browser only handles UI, form state, and sending FormData. All critical validation and database writes happen server-side.

---

## 11.2 Submission Flow

On successful submit, the server performs:

1. Validate request payload using Zod.
2. Validate honeypot field.
3. Apply rate limit by IP.
4. Normalize WhatsApp number.
5. Apply rate limit / pending booking check by normalized WhatsApp number.
6. Validate selected package exists and is active.
7. Validate selected date is tomorrow or later.
8. Validate selected time slot is allowed.
9. Check slot availability.
10. Generate unique booking code.
11. Find existing student by normalized WhatsApp number.
12. Update existing student or insert new student.
13. Insert booking with status `pending_verification`.
14. Upload payment proof to private Supabase Storage.
15. Insert payment with status `pending_verification` and `proof_path`.
16. Insert one first-session record with status `tentative`.
17. Trigger WhatsApp notification if integration is active.
18. Return booking code to client.

---

## 11.3 Created Records

Successful submission creates:

### Student

* Created if phone number does not exist.
* Updated if phone number already exists.

### Booking

* Status: `pending_verification`.
* Contains selected package, student, notes, and booking code.

### Payment

* Status: `pending_verification`.
* Contains amount, method, and proof path.

### Session

* Only one first-session record.
* Status: `tentative`.
* Uses customer-selected date and time.
* Duration defaults to package duration or 90 minutes.

---

## 11.4 Partial Failure Handling

MVP does not require full atomic transaction, but failure handling must not be ignored.

Rules:

* If validation fails, no database write should happen.
* If package or slot validation fails, no database write should happen.
* If payment proof upload fails, return error and do not continue to payment/session insert.
* If WhatsApp notification fails, booking remains successful.
* Every server error must be logged with `request_id` or `booking_code` if available.
* Admin Hub may later include a cleanup view for incomplete/orphan data.

Accepted MVP risk:

* Some partial write scenarios may still occur because booking submission involves database writes and storage upload.
* This will be improved in Phase 2 using Supabase RPC or Edge Function with a more atomic flow.

---

## 12. WhatsApp Integration

## 12.1 MVP Rule

WhatsApp automation is non-blocking.

Booking success must not depend on WAHA/GOWA availability.

If WhatsApp automation fails:

* Booking remains successful.
* Error is logged.
* Customer still sees success page.
* Customer still sees manual WhatsApp CTA.

---

## 12.2 MVP Must-Have

* Floating WhatsApp button.
* Success page WhatsApp CTA.
* Prefilled message containing booking code.

Recommended success page WhatsApp message:

```text
Halo Admin KMB, saya sudah melakukan booking kursus mobil dengan kode booking [BOOKING_CODE]. Mohon dibantu konfirmasi jadwal saya.
```

---

## 12.3 MVP Nice-to-Have

If WAHA or GOWA integration is ready, send:

1. Owner alert.
2. Customer auto-reply.

This should be implemented from server-side route only, never from browser.

Recommended route:

```text
POST /api/notify
```

or internal server function called after booking submission.

---

## 12.4 Owner Alert Template

```text
🔔 Booking Baru Masuk!

ID: [BOOKING_CODE]
Nama: [CUSTOMER_NAME]
WA: [CUSTOMER_PHONE]
Paket: [PACKAGE_NAME]
Jadwal Preferensi: [DATE] pukul [TIME]
Titik Jemput: [PICKUP_ADDRESS]
Catatan: [NOTES_OR_DASH]

Silakan verifikasi pembayaran dan konfirmasi jadwal dengan customer.
```

---

## 12.5 Customer Auto-Reply Template

```text
Halo [CUSTOMER_NAME]! 👋

Terima kasih sudah booking di Kursus Mobil Bantul.

Detail booking Anda:
📌 ID Booking: [BOOKING_CODE]
📦 Paket: [PACKAGE_NAME]
📅 Jadwal Preferensi: [DATE] pukul [TIME]
📍 Titik Jemput: [PICKUP_ADDRESS]

Bukti pembayaran Anda sudah kami terima. Admin KMB akan memverifikasi pembayaran dan menghubungi Anda untuk konfirmasi jadwal final.

Terima kasih. 😊
```

---

## 12.6 Future WhatsApp Automation

Future WhatsApp automation may support:

* Auto notification to owner after booking submitted.
* Auto-reply to customer.
* Booking status check by booking code.
* Payment verification reminders.
* Schedule reminders before session.
* Admin command to confirm or cancel booking.
* Integration with Admin Hub.

---

## 13. Status Semantics

## 13.1 Booking Status

| Status                 | Meaning                                                   |
| ---------------------- | --------------------------------------------------------- |
| `pending_verification` | Booking request sudah masuk dan menunggu verifikasi admin |
| `confirmed`            | Pembayaran dan jadwal pertama sudah dikonfirmasi admin    |
| `canceled`             | Booking dibatalkan oleh admin atau customer               |
| `completed`            | Semua sesi kursus sudah selesai                           |

Initial public app status:

```text
pending_verification
```

---

## 13.2 Payment Status

| Status                 | Meaning                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `pending_verification` | Bukti pembayaran sudah diupload dan menunggu verifikasi admin |
| `verified`             | Bukti pembayaran valid                                        |
| `rejected`             | Bukti pembayaran ditolak atau tidak valid                     |

Initial public app status:

```text
pending_verification
```

---

## 13.3 Session Status

| Status      | Meaning                                              |
| ----------- | ---------------------------------------------------- |
| `tentative` | Preferensi jadwal pertama dari customer, belum final |
| `scheduled` | Jadwal sudah dikonfirmasi admin                      |
| `completed` | Sesi selesai                                         |
| `canceled`  | Sesi dibatalkan                                      |

Initial public app status:

```text
tentative
```

---

## 14. Data Requirements

## 14.1 `packages`

| Column              | Type        | Notes                                |
| ------------------- | ----------- | ------------------------------------ |
| `id`                | uuid        | Primary key                          |
| `name`              | varchar     | Nama paket                           |
| `car_type`          | enum        | `mobil_kursus` atau `mobil_sendiri`  |
| `price`             | integer     | Harga paket dalam Rupiah             |
| `total_sessions`    | integer     | Jumlah total sesi dalam paket        |
| `is_active`         | boolean     | Hanya paket aktif yang tampil publik |
| `created_at`        | timestamptz | Timestamp                            |
| `updated_at`        | timestamptz | Timestamp                            |

Public app access:

* Read active packages.

Admin Hub access:

* Full CRUD.

---

## 14.2 `students`

| Column             | Type        | Notes                                    |
| ------------------ | ----------- | ---------------------------------------- |
| `id`               | uuid        | Primary key                              |
| `name`             | varchar     | Nama customer/siswa                      |
| `phone_number`     | varchar     | Nomor WhatsApp normalized `62xxxxxxxxxx`, unique |
| `pickup_address`   | text        | Titik jemput default                     |
| `created_at`       | timestamptz | Timestamp                                |
| `updated_at`       | timestamptz | Timestamp                                |

Rules:

* Public app upsert by `phone_number`.
* `phone_number` stores normalized WhatsApp number and should be unique.

---

## 14.3 `bookings`

| Column         | Type        | Notes                              |
| -------------- | ----------- | ---------------------------------- |
| `id`           | uuid        | Internal primary key               |
| `booking_code` | text        | Human-readable unique booking code |
| `student_id`   | uuid        | FK to `students.id`                |
| `package_id`   | uuid        | FK to `packages.id`                |
| `total_price`  | integer     | Harga paket saat booking dibuat    |
| `status`       | enum        | Booking status                     |
| `notes`        | text        | Catatan dari customer              |
| `created_at`   | timestamptz | Timestamp                          |
| `updated_at`   | timestamptz | Timestamp                          |

Initial status:

```text
pending_verification
```

---

## 14.4 `payments`

| Column            | Type        | Notes                                 |
| ----------------- | ----------- | ------------------------------------- |
| `id`              | uuid        | Primary key                           |
| `booking_id`      | uuid        | FK to `bookings.id`                   |
| `amount`          | numeric     | Nominal transfer                      |
| `method`          | text        | Manual transfer                       |
| `status`          | enum        | Payment status                        |
| `proof_path`      | text        | Path file di private Supabase Storage |
| `created_at`      | timestamptz | Timestamp                             |
| `updated_at`      | timestamptz | Timestamp                             |
| `verified_at`     | timestamptz | Diisi Admin Hub                       |
| `rejected_reason` | text        | Diisi Admin Hub jika ditolak          |

Important:

* Store `proof_path`, not public `proof_url`.
* Admin Hub generates signed URL when staff need to view proof.

Initial status:

```text
pending_verification
```

---

## 14.5 `sessions`

| Column             | Type        | Notes                    |
| ------------------ | ----------- | ------------------------ |
| `id`               | uuid        | Primary key              |
| `booking_id`       | uuid        | FK to `bookings.id`      |
| `session_number`   | integer     | Nomor sesi dalam paket   |
| `session_date`     | date        | Tanggal sesi             |
| `start_time`       | time        | Waktu mulai              |
| `duration_minutes` | integer     | Default 90               |
| `status`           | enum        | Session status           |
| `notes`            | text        | Catatan instruktur/admin |
| `created_at`       | timestamptz | Timestamp                |
| `updated_at`       | timestamptz | Timestamp                |

Public app creates:

```text
session_number = 1
status = tentative
```

Admin Hub owns:

* Create follow-up sessions.
* Reschedule.
* Confirm session.
* Complete session.
* Cancel session.
* Add instructor notes.

---

## 15. Booking Code Generation

Recommended format:

```text
KMB-YYYYMMDD-XXX
```

Example:

```text
KMB-20260620-A3F
```

Rules:

* Prefix must be `KMB`.
* Date uses booking creation date.
* Suffix is 3-character uppercase alphanumeric random string.
* Must be unique.
* If collision occurs, regenerate suffix.

Reason:

* Easy to read.
* Easy to search in WhatsApp.
* Useful for admin/customer communication.
* More informative than `KMB-XXXX`.

---

## 16. Storage Requirements

## 16.1 Bucket

Bucket name:

```text
payment-proofs
```

Purpose:

* Store manual transfer proof files uploaded by customer.

---

## 16.2 Access Rules

* Bucket must not be public.
* Public URL must not be exposed.
* Customer can upload only through server-side booking route.
* Admin Hub can access proof using signed URL.
* File path is stored in database as `proof_path`.

---

## 16.3 Naming Convention

Recommended path:

```text
{booking_id}/{timestamp}_{safe_filename}
```

Example:

```text
88a2f4d1-xxxx-xxxx-xxxx/20260620T101522_receipt.jpg
```

Requirements:

* Sanitize filename.
* Avoid spaces if possible.
* Prevent path traversal.
* Preserve extension.

---

## 17. Technical Requirements

## 17.1 Stack

| Layer            | Decision                                                    |
| ---------------- | ----------------------------------------------------------- |
| Framework        | Vite React SPA                                              |
| Language         | TypeScript                                                  |
| Type Safety      | Strict mode enabled                                         |
| UI               | Shadcn/UI + Radix UI primitives                             |
| Styling          | Tailwind CSS                                                |
| Form             | React Hook Form                                             |
| Validation       | Zod                                                         |
| Database         | Supabase PostgreSQL                                         |
| Storage          | Supabase Storage                                            |
| Data Fetching    | Supabase client for public package reads; API handlers for availability and booking |
| State Management | Local state only for MVP                                    |
| TanStack Query   | Not used in MVP                                             |
| Theme            | Light mode only                                             |
| Rate Limit       | Supabase `booking_rate_limits` table + pending booking check |
| WhatsApp         | Manual CTA; optional non-blocking webhook via `BOOKING_NOTIFY_WEBHOOK_URL` |
| Testing          | Playwright                                                  |
| Deployment       | Vercel SPA + API functions                                  |

---

## 17.2 Rendering Strategy

### `/`

Landing page.

Implemented strategy:

* Vite React route rendered by React Router.
* Fetch active packages from Supabase anon client.
* SEO metadata generated with `react-helmet-async`.
* Page code is lazy-loaded from `src/pages/Index.tsx`.

### `/booking`

Booking wizard.

Implemented strategy:

* Client-side React wizard for form state and step transitions.
* Fetch active packages from Supabase anon client.
* Slot availability checked via server route.
* Submit booking via `POST /api/booking`.

### `/api/booking`

Vercel-compatible API handler implemented in `api/booking.ts`.

Local development:

* `vite.config.ts` mounts the same handler at `/api/booking` during `npm run dev`.

Responsibilities:

* Validate payload.
* Validate file.
* Rate limit.
* Normalize WhatsApp number.
* Check active package.
* Check slot availability.
* Write to Supabase.
* Upload payment proof.
* Trigger WhatsApp notification if enabled.
* Return booking code.

### `/api/availability`

Vercel-compatible API handler implemented in `api/availability.ts`.

Local development:

* `vite.config.ts` mounts the same handler at `/api/availability` during `npm run dev`.

Responsibilities:

* Receive selected date.
* Return unavailable slots.
* Only consider sessions with status:

  * `tentative`
  * `scheduled`

### Notification Hook

Optional webhook called internally after booking submission when `BOOKING_NOTIFY_WEBHOOK_URL` is configured.

Responsibilities:

* Send owner/customer notification through an external webhook if configured.
* Log delivery failure.
* Never block successful booking when notification fails.

---

## 17.3 Security Requirements

* Never expose Supabase service-role key to browser.
* All privileged writes happen server-side.
* Server-side validation is mandatory.
* RLS must be enabled for all public-facing tables.
* Payment proof bucket must be private.
* Signed URLs should only be generated in Admin Hub or protected server routes.
* Do not trust client-side validation.
* Normalize and validate WhatsApp number server-side.
* Do not expose internal UUIDs unnecessarily in UI.
* Show booking code to customer, not internal database ID.

---

## 18. Quality Requirements

* Mobile-first UI.
* Customer-facing copy must use Bahasa Indonesia.
* CTA must be clear and visible.
* Booking wizard must be easy to use on mobile.
* Loading state must exist for:

  * package loading
  * availability checking
  * booking submission
  * payment proof upload
* Error state must be actionable.
* Form validation messages must be clear.
* Public pages must not require login.
* TypeScript strict mode must be enabled.
* Avoid `any` unless justified.
* Encoding must be clean before production.
* No broken layout in common mobile screen sizes.
* SEO metadata must be present.
* LocalBusiness structured data must be valid.

---

## 19. Acceptance Criteria

## 19.1 Landing Page

* [x] User can open `/` and see KMB / Kursus Mobil Bantul brand.
* [x] User can understand the business is a local driving course in Bantul/Yogyakarta.
* [x] User can navigate to pricing, schedule, about, FAQ, and contact sections.
* [x] User can see active package cards loaded from Supabase.
* [x] User can distinguish `mobil_kursus` and `mobil_sendiri` package types.
* [x] User can start booking from package CTA.
* [x] Package CTA redirects to `/booking?packageId={id}`.
* [x] Floating WhatsApp button is visible and uses the correct number.
* [x] Landing page is responsive on mobile, tablet, and desktop.
* [x] SEO title and description are present.
* [x] LocalBusiness JSON-LD is present.
* [ ] Lighthouse SEO score is at least 90 on mobile.

---

## 19.2 Booking Flow

* [x] User can open `/booking`.
* [x] User can select package.
* [x] Valid `packageId` query param preselects package.
* [x] Invalid `packageId` does not break booking flow.
* [x] User can select date starting from tomorrow.
* [x] User cannot select today or past dates.
* [x] User can select one of four slots: `08:00`, `10:00`, `13:00`, `15:00`.
* [x] Slot with existing `tentative` or `scheduled` session is disabled.
* [x] Slot with `canceled` session is not blocked.
* [x] User can fill name, WhatsApp number, pickup point, and notes.
* [x] User cannot proceed if required fields are invalid.
* [x] User must upload payment proof before submit.
* [x] Invalid file type is rejected.
* [x] File larger than 5 MB is rejected.
* [x] Honeypot submission is rejected.
* [x] Rate limit blocks excessive submission.
* [x] Successful submission creates/updates student.
* [x] Successful submission creates booking with status `pending_verification`.
* [x] Successful submission uploads payment proof to private storage.
* [x] Successful submission creates payment with status `pending_verification`.
* [x] Successful submission creates one session with status `tentative`.
* [x] Success state shows booking code.
* [x] Success state explains that admin will verify payment and confirm schedule via WhatsApp.
* [x] Success state shows WhatsApp CTA with prefilled booking code.

---

## 19.3 WhatsApp Integration

* [x] Manual WhatsApp CTA works even when WAHA/GOWA is disabled.
* [ ] If WA automation is enabled, owner receives booking alert.
* [ ] If WA automation is enabled, customer receives auto-reply.
* [x] If WA notification fails, booking remains successful.
* [x] WA failure is logged for debugging.

---

## 19.4 Admin Hub Readiness

* [x] Public app writes are compatible with documented tables.
* [x] Status semantics are documented and consistent.
* [x] Package records can be managed externally.
* [x] Payment proof is stored as private `proof_path`.
* [x] Admin Hub can later verify payment, confirm booking, create sessions, and manage packages.

---

## 20. Metrics

## 20.1 Product Metrics

* Landing page visits.
* Booking CTA click rate.
* Booking form start rate.
* Step 1 to Step 2 conversion.
* Step 2 to Step 3 conversion.
* Step 3 to Step 4 conversion.
* Booking submission completion rate.
* WhatsApp contact click rate.
* Payment proof upload success rate.
* Booking verification rate.
* Booking cancellation rate.

---

## 20.2 Technical Metrics

* Lighthouse Performance score.
* Lighthouse SEO score.
* Lighthouse Accessibility score.
* Playwright smoke test pass rate.
* Supabase request error rate.
* Booking submission failure rate.
* WA notification delivery rate.
* Build success rate on Vercel.
* API error rate for `/api/booking`.
* Rate limit rejection count.

---

## 20.3 Analytics Tools

Recommended tools:

* Vercel Analytics for basic traffic.
* Microsoft Clarity for behavior/session insight.
* Custom event tracking for:

  * package CTA click
  * booking start
  * step completed
  * payment proof uploaded
  * booking submitted
  * WhatsApp CTA clicked

---

## 21. Risks & Mitigations

| Risk                                                   | Severity | Mitigation                                                                             |
| ------------------------------------------------------ | -------: | -------------------------------------------------------------------------------------- |
| Partial write failure during booking submission        |   Medium | Log error with request ID/booking code. Improve with RPC/Edge Function in Phase 2.     |
| Payment proof upload succeeds but later DB write fails |   Medium | Log error and add cleanup strategy in Phase 2.                                         |
| Anonymous/fake submissions                             |   Medium | Honeypot, rate limit by IP, rate limit by phone, server-side validation.               |
| Payment proof privacy leak                             |     High | Private bucket, store `proof_path`, generate signed URL only in protected context.     |
| WAHA/GOWA notification fails                           |      Low | Booking remains successful. Show manual WhatsApp CTA. Log failure.                     |
| Booking code collision                                 | Very Low | Regenerate suffix if collision occurs.                                                 |
| Slot race condition                                    |   Medium | Recheck availability server-side before insert. Improve with DB constraint in Phase 2. |
| Business data incorrect                                |     High | Verify WA number, bank account, address, social links, and schema before go-live.      |
| Over-engineering public app                            |   Medium | Keep Admin Hub separate. Only create one tentative first session.                      |
| Text encoding issue                                    |      Low | Clean source text before production.                                                   |
| TypeScript strict mode issues                          |   Medium | Enable strict mode from project start.                                                 |

---

## 22. Admin Hub Boundary

Public app only handles intake. Admin Hub owns operations after booking request is submitted.

| Responsibility                     | Public App | Admin Hub |
| ---------------------------------- | ---------: | --------: |
| Display active packages            |          ✅ |         — |
| Display marketing content          |          ✅ |         — |
| Create booking request             |          ✅ |         — |
| Upload payment proof               |          ✅ |         — |
| Create first tentative session     |          ✅ |         — |
| Verify payment                     |          ❌ |         ✅ |
| Reject payment                     |          ❌ |         ✅ |
| Confirm booking                    |          ❌ |         ✅ |
| Cancel booking                     |          ❌ |         ✅ |
| Create second and later sessions   |          ❌ |         ✅ |
| Reschedule sessions                |          ❌ |         ✅ |
| Mark session completed             |          ❌ |         ✅ |
| Manage package CRUD                |          ❌ |         ✅ |
| View all bookings                  |          ❌ |         ✅ |
| Generate signed URL for proof file |          ❌ |         ✅ |
| Manage WhatsApp follow-up notes    |          ❌ |         ✅ |

---

## 23. Roadmap

## Phase 1 — Public MVP Stabilization

* [x] Build landing page.
* [x] Build booking wizard.
* [x] Setup Supabase schema.
* [x] Setup private payment proof storage.
* [x] Setup package fetching.
* [x] Setup booking submission route.
* [x] Setup server-side validation.
* [x] Setup rate limiting.
* [x] Generate human-readable booking code.
* [x] Create one tentative first session.
* [x] Add WhatsApp CTA.
* Add optional WAHA/GOWA notification if ready.
* Verify business data:

  * WhatsApp number
  * Bank account
  * Account holder name
  * Address
  * Social links
  * Area layanan
* [x] Add Playwright smoke test.
* Replace generic README with project-specific setup docs.

---

## Phase 2 — Booking Reliability

* Move booking submission to Supabase RPC or Edge Function for stronger atomic behavior.
* Add DB-level unique/availability constraint for active sessions.
* Add server-side MIME magic bytes validation.
* Add better cleanup strategy for failed uploads.
* Add admin cleanup view for incomplete data.
* Tighten RLS policies.
* Improve error logging and monitoring.
* Add email/WA retry mechanism if needed.

---

## Phase 3 — Admin Hub

* Build separate Admin Hub repo.
* Add admin authentication.
* View booking requests.
* Verify payment proof.
* Confirm or cancel booking.
* Confirm first session.
* Create follow-up sessions.
* Reschedule sessions.
* Manage packages.
* Manage booking lifecycle.
* Generate signed URLs for payment proof.
* Add admin notes.
* Add customer communication history.

---

## Phase 4 — WhatsApp Automation

* Finalize WAHA or GOWA provider.
* Auto-send owner alert.
* Auto-send customer reply.
* Add schedule reminders.
* Add payment verification reminders.
* Add booking status check by booking code.
* Add Admin Hub integration with WA messages.
* Evaluate WhatsApp AI agent if needed.

---

## Phase 5 — Growth & Optimization

* Improve SEO content.
* Add real testimonials.
* Add Google Business Profile link.
* Add analytics event tracking.
* Improve Core Web Vitals.
* Optimize image loading.
* Add Lighthouse CI.
* Evaluate additional packages.
* Evaluate multi-instructor support only if business grows.

---

## 24. Open Decisions

The following decisions must be finalized before production:

| Topic            | Decision Needed                                            |
| ---------------- | ---------------------------------------------------------- |
| Payment type     | Full payment or DP                                         |
| Bank account     | Final bank name, account number, and account holder        |
| WhatsApp number  | Official business/admin number                             |
| Area layanan     | Exact supported pickup areas                               |
| Package data     | Final package names, prices, session counts, and durations |
| WA automation    | Use WAHA, GOWA, or manual CTA only for MVP                 |
| Hosting          | Final Vercel project and domain                            |
| Admin Hub timing | Start immediately after Public MVP or after initial launch |

---

## 25. Final MVP Definition

KMB Public MVP is considered complete when:

* Customer can open landing page.
* Customer can understand the service and package options.
* Customer can submit booking request without login.
* Customer can upload payment proof.
* System creates student, booking, payment, and one tentative first session.
* Customer receives a human-readable booking code.
* Customer sees clear WhatsApp follow-up instruction.
* Admin/owner can use the submitted data to manually verify and confirm via WhatsApp.
* Public app remains lightweight, mobile-first, SEO-friendly, and ready for future Admin Hub integration.

---

## 26. Final Notes

KMB Public is intentionally designed to be simple.

The current business only has one instructor and manual WhatsApp-based operations. Therefore, the MVP should avoid building a complex scheduling platform too early.

The correct focus is:

```text
Trust → Package clarity → Easy booking request → Payment proof intake → WhatsApp confirmation
```

Admin Hub, full scheduling, payment verification workflow, and WhatsApp automation can be built after the public MVP is stable.
