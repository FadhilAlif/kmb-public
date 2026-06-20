# PRD.md

## Product

KMB Public, also known as Kursus Mobil Bantul or Bantul Driving School Hub, is the public website and booking funnel for a Bantul driving-school business.

The public app helps prospective students understand the service, compare packages, choose a schedule, submit contact and pickup details, upload manual-transfer proof, and receive a booking reference. It is the customer-facing side of a larger system. A separate admin hub repo is planned for staff operations.

## Status

- Version: 1.0
- Date: 2026-06-20
- Product phase: Public MVP plus booking intake
- Repository: `bantul-driving-school-hub`
- Primary language: Indonesian
- Primary market: Bantul and nearby Yogyakarta areas

## Goals

- Convert local visitors into qualified driving-course booking leads.
- Make package prices, car options, benefits, and schedule expectations clear.
- Let customers submit a booking without account creation.
- Capture enough data for the business owner to confirm via WhatsApp.
- Keep the public app lightweight, trustworthy, mobile-first, and SEO-friendly.
- Prepare a clean boundary for a future admin hub repository.

## Non-Goals

- This repo will not become the admin dashboard.
- This repo will not store service-role secrets.
- This repo will not implement staff authentication.
- This repo will not provide payment gateway settlement in the current phase.
- This repo will not manage instructor operations beyond creating initial placeholder sessions.

## Target Users

Primary users:

- New students aged 17 and above who want to learn driving.
- Parents or family members booking for a student.
- Local visitors comparing course packages in Bantul or Yogyakarta.

Internal users indirectly served:

- Business owner or staff who receive booking data and payment proof.
- Future admin hub users who will verify, schedule, and manage bookings.

## Current User Experience

### Landing Page

Route: `/`

The landing page includes:

- Navigation with brand and section links.
- Hero section with primary CTA.
- Trust and benefit sections.
- Dynamic pricing packages from Supabase.
- Schedule CTA.
- About section.
- Testimonials.
- FAQ.
- Footer and floating WhatsApp contact.
- SEO metadata and structured data.
- Theme support through `next-themes`.

### Booking Flow

Route: `/booking`

The booking flow is a four-step wizard:

1. Package selection.
2. Date and time slot selection.
3. Personal data form.
4. Checkout, payment instructions, payment proof upload, and submit.

The booking route supports a `packageId` query parameter. Example:

```text
/booking?packageId={package_id}
```

When valid package data is available, the app preselects that package and moves the customer to the schedule step.

## Functional Requirements

### Landing Page Requirements

- Display KMB/Kursus Mobil Bantul as a local driving-school brand.
- Show clear CTAs to booking and WhatsApp contact.
- Fetch active packages from Supabase and display prices dynamically.
- Let users compare `mobil_kursus` and `mobil_sendiri` package types.
- Route selected package CTAs to `/booking?packageId=...`.
- Preserve SEO title, description, canonical link, and structured data.
- Support light and dark theme rendering.
- Work well on mobile, tablet, and desktop.

### Booking Requirements

- Fetch active packages from Supabase.
- Allow package selection by package ID.
- Allow customers to choose one of the defined time slots:
  - `08:00`
  - `10:00`
  - `13:00`
  - `15:00`
- Prevent choosing dates before tomorrow.
- Query existing scheduled/completed sessions for the selected day.
- Treat sessions from canceled bookings as non-blocking.
- Disable time slots already booked for that date.
- Validate customer data:
  - Name: required, 3 to 100 characters.
  - WhatsApp: required, Indonesian-style number beginning with `08`, `62`, or `+62`.
  - Pickup point: required, 5 to 200 characters.
  - Notes: optional, max 500 characters.
- Require payment proof before final submission.
- Accept `.jpg`, `.jpeg`, `.png`, and `.pdf` payment proof files.
- Reject files larger than 5 MB.
- Show a success state with a short booking ID after submission.

### Booking Submission Requirements

On submit, the app currently performs this sequence:

1. Find an existing student by WhatsApp phone number.
2. Update that student or insert a new student.
3. Insert a booking with status `awaiting_payment`.
4. Upload payment proof to Supabase Storage if provided.
5. Insert a payment with status `pending`.
6. Insert all package sessions as `scheduled`.
7. Return the created booking ID.

Session generation rules:

- First session uses the chosen date and time slot.
- Each later session is generated 7 days after the previous one.
- Each session duration is 90 minutes.
- Future admin hub may reschedule these placeholders.

## Data Requirements

### Tables

`packages`

- Public read of active packages is required.
- Admin hub will later create and update package data.

`students`

- Public booking flow creates or updates by phone number.
- Contains name, phone number, and pickup address.

`bookings`

- Public booking flow creates bookings.
- Future admin hub owns verification and lifecycle management.

`payments`

- Public booking flow creates pending manual-transfer payments.
- Future admin hub verifies or rejects payments.

`sessions`

- Public booking flow creates placeholder scheduled sessions.
- Future admin hub manages rescheduling, completion, cancellation, and notes.

### Storage

`payment-proofs`

- Stores public upload proofs.
- Must have policies that permit safe customer upload and staff/admin read.
- Public access to proof URLs should be reviewed before production because proof images can contain personal financial data.

## Admin Hub Boundary

The next repo should be the staff-facing admin hub. It should consume the same Supabase data contract and own operational workflows.

Expected admin hub MVP:

- Admin login.
- Booking list with filters by status.
- Booking detail with customer data, selected package, payment proof, and sessions.
- Payment verification and rejection.
- Booking status updates.
- Session calendar and rescheduling.
- Package management.
- Basic daily/weekly operational metrics.

Public app responsibilities after admin hub exists:

- Keep generating clean booking intake records.
- Avoid admin UI or staff-only data exposure.
- Keep package display synced with active package records.
- Link to WhatsApp/contact where manual follow-up is still required.

## Technical Requirements

- Keep React + Vite SPA architecture.
- Keep Supabase as backend for current phase.
- Keep `@/*` import alias.
- Keep Tailwind token-based theming.
- Keep shadcn/Radix UI primitives for UI consistency.
- Use TanStack Query for Supabase reads.
- Use React Hook Form and Zod for form validation.
- Keep booking write logic isolated under `src/services`.
- Use generated Supabase types for database contracts.
- Do not add server secrets to the browser app.

## Quality Requirements

- Landing page and booking flow must remain mobile-first.
- Customer-facing copy must remain Indonesian unless explicitly changed.
- Critical CTAs must remain visible and clear.
- Booking submission errors must show actionable messages.
- Loading and error states must exist for package and slot reads.
- Theme changes must not make text unreadable.
- Public routes should remain accessible without login.
- Booking flow should be covered by Playwright smoke tests at minimum.

## Acceptance Criteria

Landing page:

- User can open `/` and see the KMB/Kursus Mobil Bantul brand.
- User can navigate to pricing, schedule/about/contact sections.
- User can see package cards loaded from Supabase.
- User can start a booking from a package CTA.
- User can use the theme toggle.

Booking:

- User can open `/booking`.
- User can select package, date, time, personal data, and payment proof.
- User cannot continue without required data.
- User cannot choose a booked slot.
- Successful submission creates student, booking, payment, and session records.
- Success state shows a booking ID and tells the user they will be contacted via WhatsApp.

Admin hub readiness:

- Public booking writes remain compatible with the documented tables and statuses.
- Package records can be managed externally without changing public code.
- Booking status and payment status semantics are documented.

## Metrics

Primary product metrics:

- Booking CTA click rate.
- Booking form start rate.
- Booking submission completion rate.
- WhatsApp contact click rate.
- Payment proof upload success rate.

Operational metrics for future admin hub:

- New bookings per day/week.
- Pending payment count.
- Payment verification time.
- Active student count.
- Upcoming sessions.
- Canceled or rescheduled sessions.

Technical metrics:

- Lighthouse performance and SEO scores.
- Build success.
- Playwright pass rate.
- Supabase request error rate.
- Booking submission failure rate.

## Risks

- Multi-step client-side booking writes can produce partial data if one step fails.
- Anonymous public writes are sensitive and depend on correct RLS/storage policy configuration.
- Payment proof URLs may expose sensitive information if storage access is too permissive.
- The current tests do not fully submit a booking.
- TypeScript strict mode is disabled.
- Some text encoding in source appears corrupted and should be cleaned before final production polish.
- Business contact data, address, bank numbers, and social links should be verified.

## Recommended Roadmap

### Phase 1: Public MVP Stabilization

- Verify business copy, phone number, bank accounts, address, social links, and structured data.
- Confirm Supabase RLS and storage policies.
- Clean text encoding issues.
- Replace generic README with project-specific setup docs.
- Add a full happy-path booking E2E test using controlled test data.

### Phase 2: Booking Reliability

- Move booking creation into a Supabase RPC or edge function for atomic behavior.
- Normalize phone numbers before matching students.
- Add stronger file type validation.
- Add spam or rate limiting strategy.
- Improve error recovery if payment proof upload fails.

### Phase 3: Admin Hub Repo

- Scaffold the separate admin hub.
- Implement staff authentication.
- Build booking, payment, student, session, and package management.
- Add admin-side status transitions and audit history where needed.

### Phase 4: Growth And Optimization

- Improve SEO landing content after real business details are final.
- Add analytics events for CTA and booking funnel drop-off.
- Improve Core Web Vitals.
- Add testimonials and gallery content from real customers with permission.

