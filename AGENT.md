# AGENT.md

## Project Identity

This repository is the public website and booking funnel for KMB Public, also known as Kursus Mobil Bantul or Bantul Driving School Hub.

The product connects prospective driving students in Bantul and nearby Yogyakarta areas to the family driving-school business. The first release is a public landing page plus booking flow. The next phase is a separate admin hub repository that will manage bookings, payments, students, schedules, and package data for this public side.

## Current Codebase Assessment

This is a React 18 + Vite + TypeScript single-page application. It is not only a static landing page. The app already integrates with Supabase to:

- Read active driving-course packages from `packages`.
- Read booked session slots from `sessions` joined to `bookings`.
- Create or update `students`.
- Create `bookings`.
- Upload payment proof files to Supabase Storage bucket `payment-proofs`.
- Create `payments`.
- Create placeholder `sessions` for all package meetings after a booking is submitted.

The project appears to have started from a Lovable/shadcn template and now includes a more custom public funnel. The root README is still generic, so use this file and `PRD.md` as the working onboarding source.

## Product Boundary

This repo owns:

- Public landing page at `/`.
- Public booking flow at `/booking`.
- SEO metadata and local-business structured data.
- Customer-facing package selection, schedule selection, personal data capture, and manual-transfer confirmation.
- Anonymous public Supabase writes needed to submit a booking.

This repo does not own:

- Admin authentication.
- Internal staff dashboard.
- Manual payment verification workflow UI.
- Rescheduling and session management UI.
- Student CRM, reporting, instructor management, or analytics dashboards.

Those admin responsibilities should live in the future admin hub repo. Avoid building admin-only routes into this public app unless the product boundary is explicitly changed.

## Tech Stack

- Framework: React 18
- Build tool: Vite
- Language: TypeScript
- Routing: React Router
- Styling: Tailwind CSS with CSS variables
- UI kit: shadcn/ui style Radix components under `src/components/ui`
- Data fetching: TanStack Query
- Backend: Supabase client SDK
- Forms and validation: React Hook Form + Zod
- Animation: Framer Motion
- SEO: react-helmet-async
- Tests: Playwright E2E
- Package manager: npm is the active workflow; `bun.lockb` is ignored by `.gitignore`

## Key Commands

```sh
npm install
npm run dev
npm run build
npm run lint
npx tsc --noEmit
npx playwright test
```

The Vite dev server is configured for port `8080`. Playwright also expects `http://localhost:8080`.

## Environment

Required variables:

```sh
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Never commit real `.env` values. The client uses the Supabase anon key, so all protection for public writes must be enforced by Supabase RLS and storage policies.

## Repository Map

```text
src/
  App.tsx                         Route setup, providers, lazy-loaded pages
  main.tsx                        React entry point
  index.css                       Theme tokens, Tailwind layers, global styles
  assets/                         Local landing-page images
  pages/
    Index.tsx                     Public landing page and SEO structured data
    BookingPage.tsx               Four-step booking wizard shell
    NotFound.tsx                  Catch-all route
  components/
    booking/                      Booking wizard steps and booking data types
    ui/                           shadcn/Radix primitives
    *.tsx                         Landing-page sections, nav, footer, WhatsApp
  hooks/
    usePackages.ts                Active package query and grouping
    useBookedSlots.ts             Booked slot query for selected date
  integrations/supabase/
    client.ts                     Supabase browser client
    types.ts                      Generated database types
  services/
    bookingService.ts             Booking submission transaction sequence
e2e/
  landing.spec.ts                 Landing smoke tests
  booking.spec.ts                 Booking smoke tests
```

## Public User Journey

1. Visitor lands on `/`.
2. Visitor scans trust, benefits, packages, schedule CTA, about, testimonials, FAQ, and WhatsApp options.
3. Visitor clicks a package CTA.
4. App routes to `/booking?packageId=...` and preselects the package after packages load.
5. Visitor chooses a date and time slot.
6. Visitor enters name, WhatsApp number, pickup address, and optional notes.
7. Visitor reviews checkout, transfers manually, uploads payment proof, and submits.
8. App writes the booking data to Supabase and shows a short booking ID.
9. Business owner or future admin hub verifies payment and manages follow-up.

## Booking Data Contract

Main tables currently represented in `src/integrations/supabase/types.ts`:

- `packages`: package name, car type, price, total sessions, active flag.
- `students`: name, phone number, pickup address.
- `bookings`: student, package, status, total price, student notes.
- `payments`: booking, amount, payment method, proof URL, status, verified time.
- `sessions`: booking, session number, start/end time, status, instructor notes.

Enums:

- `booking_status_enum`: `awaiting_payment`, `pending_verification`, `active`, `completed`, `canceled`
- `car_type_enum`: `mobil_kursus`, `mobil_sendiri`
- `payment_status_enum`: `pending`, `verified`, `rejected`
- `session_status_enum`: `scheduled`, `completed`, `canceled`

Storage:

- Bucket: `payment-proofs`
- Current path pattern: `payment-proofs/{bookingId}.{fileExt}`

## Implementation Notes

- `App.tsx` lazy-loads routes and wraps providers: Helmet, TanStack Query, Theme, Tooltip, toasts, Router.
- `Index.tsx` owns SEO metadata and schema.org JSON-LD for the business and FAQ.
- `PricingSection.tsx` and `StepPaket.tsx` both depend on `useGroupedPackages`.
- `StepJadwal.tsx` uses `useBookedSlots` to disable blocked time slots.
- `StepDataDiri.tsx` validates customer input with Zod.
- `StepCheckout.tsx` handles payment proof selection and calls `submitBooking`.
- `bookingService.ts` is the main integration boundary. Treat changes there as high risk because a partial failure can leave related records out of sync.

## Engineering Guidelines

- Keep this app public-first and mobile-first.
- Keep source of truth for package data in Supabase, not hardcoded cards.
- Use domain names such as `booking`, `student`, `payment`, `session`, and `package`; avoid vague utility modules.
- Prefer small, focused components. The current largest risk areas are long booking and UI components.
- Preserve Indonesian customer-facing copy unless a content change is explicitly requested.
- Use Tailwind theme tokens from `src/index.css` and `tailwind.config.ts`; avoid hardcoded one-off colors.
- Use existing shadcn/Radix UI primitives before adding another UI library.
- Use React Hook Form and Zod for booking form validation.
- Use TanStack Query for Supabase reads.
- Do not put service-role keys or admin-only operations in this browser app.
- Do not silently change booking statuses, payment statuses, or session-generation behavior without updating `PRD.md`.

## Admin Hub Handoff Rules

The future admin hub should share or mirror the Supabase schema contract used here. When changing public booking writes, document the impact for the admin hub.

Expected future admin hub capabilities:

- Staff login.
- Booking list and detail views.
- Payment proof review and status updates.
- Student contact and pickup information management.
- Session calendar, rescheduling, cancellation, and completion tracking.
- Package CRUD for public pricing cards.
- Operational analytics.

This public repo should remain the customer acquisition and booking intake surface.

## Known Risks And Gaps

- `bookingService.ts` performs several Supabase writes from the client. If later writes fail, earlier writes may remain. A Supabase RPC or edge function would be safer for atomic booking creation.
- Public anonymous writes require careful RLS and storage policies. Verify policies before production launch.
- `DEPLOYMENT.md` references `supabase_rls_fix.sql`, but that file is currently deleted in the working tree.
- TypeScript strict mode is disabled in `tsconfig.app.json`.
- Some user-facing strings in source appear mojibaked, for example encoded dashes and celebratory characters. Clean encoding before polishing production copy.
- Root README is still generic Lovable onboarding and should be replaced later.
- E2E tests are smoke-level only and do not cover full successful booking submission.
- Bank account numbers and business contact details in the code appear placeholder-like and should be verified before launch.

## Definition Of Done For Changes

For documentation-only changes:

- Read affected docs for consistency.
- Run no build unless docs affect generated outputs.

For UI or booking-flow changes:

- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Run `npm run build`.
- Run relevant Playwright tests, usually `npx playwright test`.
- Manually verify mobile width, especially landing CTAs and booking steps.

For Supabase contract changes:

- Update `src/integrations/supabase/types.ts`.
- Update this file and `PRD.md`.
- Confirm RLS/storage policy behavior.
- Document admin hub implications.

