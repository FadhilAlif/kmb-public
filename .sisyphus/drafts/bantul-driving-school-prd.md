# Draft: Bantul Driving School Hub - PRD Analysis

## Project Info
- **Name**: Bantul Driving School Hub (KMB - Kursus Mobil Bantul)
- **Status**: Under analysis
- **Date**: 2026-05-08
- **Type**: Landing page + booking SPA

## Tech Stack
- **Framework**: React 18.3.1 + Vite 6.4.1
- **Language**: TypeScript (relaxed config)
- **Styling**: Tailwind CSS 3.4.17 + shadcn/ui
- **Backend**: Supabase (BaaS - no custom backend)
- **State**: TanStack React Query 5.83.0
- **Routing**: React Router DOM 6.30.1
- **Forms**: React Hook Form + Zod
- **Animation**: Framer Motion
- **Theming**: next-themes 0.3.0 (already installed!)
- **Build**: Bun (primary) + npm

## Current Features
### Landing Page (`/src/pages/Index.tsx`)
- Hero section
- Why Us section
- Pricing section (packages by car type: mobil_kursus / mobil_sendiri)
- Schedule CTA section
- About section
- Testimonials section
- FAQ section

### Booking Flow (`/src/pages/BookingPage.tsx`)
- 4-step wizard: Package → Schedule → Personal Data → Checkout
- Stepper navigation
- Calendar date/time selection
- Payment proof upload (manual bank transfer)
- WhatsApp integration for communication

### Database (Supabase)
- Tables: packages, students, bookings, payments, sessions
- No auth implemented (anonymous bookings)
- RLS policies for data protection

## Architecture Patterns
- **Pattern**: Component-based SPA, layered (Presentation → Service → Data Access)
- **State**: Local useState + TanStack Query (no global state lib)
- **Auth**: None (anonymous public booking)
- **API**: REST-like via Supabase SDK (direct DB queries)
- **Components**: shadcn/ui primitives + feature-specific components
- **Quality**: ESLint, TypeScript (relaxed), NO TESTS

## Issues Identified
- No authentication (spam risk)
- No input validation beyond TypeScript
- No lazy loading / code splitting
- No error boundaries
- Relaxed TS config (noImplicitAny: false)
- No test infrastructure
- next-themes installed but may not be fully utilized for dark mode
- No performance optimizations detected

## User Improvement Goals (Confirmed)
1. **Redesign** - Visual refresh
2. **Dark Mode** - Theme toggle
3. **Web Performance** - Speed optimization

## Metis Gap Analysis (Addressed)

### Questions Resolved (with defaults)
- **Redesign scope**: Visual + UX improvements (confirmed by user)
- **Performance focus**: Core Web Vitals (confirmed by user)
- **New features**: None - just improve existing (confirmed by user)
- **Auth**: Keep anonymous booking (no auth added)
- **Framework**: Stay React+Vite SPA (no migration)

### Guardrails Applied
- **Must NOT Have**: No auth, no admin dashboard, no new booking steps, no new payment methods, no framework migration, no backend changes, no content expansion (blog/CMS)
- **Must Have**: Baseline measurement before optimization, theme toggle with persistence, WCAG AA contrast, performance budgets

### Defaults Applied
- **Browser support**: Last 2 versions of Chrome, Firefox, Safari, Edge
- **Accessibility**: WCAG AA minimum
- **Dark mode**: System preference default, manual toggle in header, persisted to localStorage
- **Performance targets**: LCP < 2.5s, INP < 200ms, CLS < 0.1, Lighthouse mobile score >= 90
- **Bundle budget**: Initial JS < 150KB gzipped, CSS < 30KB gzipped
- **Testing**: Playwright smoke tests for booking flow regression

### Assumptions
- next-themes integrates cleanly with existing shadcn/ui + Tailwind
- Supabase schema remains unchanged
- Current copy/content stays the same (visual changes only)
- Images can be optimized without sourcing new ones
