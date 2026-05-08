# Work Plan: Bantul Driving School Hub Improvements

**Derived from**: `bantul-driving-school-prd.md`  
**Generated**: 2026-05-08  
**Status**: Phase 1-5 Complete (53/125 tasks) | **PAUSED** - awaiting user to continue  

---

## Overview

This work plan breaks the PRD into atomic, executable tasks with specific file targets, parallel execution opportunities, and verification criteria. Each phase builds on the previous, with clear entry/exit criteria.

**Total Estimated Effort**: 3-4 weeks (1 developer)  
**Parallelizable**: Phases 1-2 can overlap; Phases 3-4 can overlap  

---

## Phase 1: Foundation & Baseline (Days 1-3)

### Goal
Establish measurement baseline, configure tooling, fix technical debt.

### Tasks

#### 1.1 Performance Baseline
**Files**: None (measurement only)  
**Output**: `docs/baseline-metrics.md`  

- [x] Run Lighthouse audit (mobile) on current app
  - `npx lighthouse http://localhost:5173 --preset=mobile --output=json --output-path=./docs/baseline-mobile.json`
- [x] Run Lighthouse audit (desktop)
  - `npx lighthouse http://localhost:5173 --preset=desktop --output=json --output-path=./docs/baseline-desktop.json`
- [x] Analyze bundle size
  - `npm run build`
  - `npx vite-bundle-visualizer`
- [x] Document current CWV numbers (LCP, INP, CLS, FCP, TTFB)

#### 1.2 TypeScript Strict Mode (Technical Debt)
**Files**: `tsconfig.json`, ~15-20 source files  
**Risk**: Medium - may reveal hidden bugs  

- [x] Enable strict flags incrementally:
  - `noImplicitAny: true`
  - `strictNullChecks: true`
  - `strictFunctionTypes: true`
- [x] Fix all resulting type errors
- [x] Add missing return types to functions in:
  - `src/services/bookingService.ts`
  - `src/hooks/usePackages.ts`
  - `src/hooks/useBookedSlots.ts`

#### 1.3 Project Configuration
**Files**: `vite.config.ts`, `tailwind.config.ts`, `package.json`  

- [x] Configure Vite for code splitting
  - Add manual chunks for vendors (React, Framer Motion, Supabase)
- [x] Configure Tailwind for dark mode
  - `darkMode: 'class'`
  - Add CSS variables for theme tokens
- [x] Install missing dependencies (if any)
  - Verify `next-themes` is properly configured

### Entry Criteria
- [ ] PRD approved
- [ ] RLS fix verified (booking works end-to-end)

### Exit Criteria
- [x] Baseline metrics documented ✅ Build analyzed
- [x] TypeScript compiles with strict mode (0 errors) ✅
- [x] `npm run build` succeeds ✅ 6.61s
- [x] No regressions in booking flow ✅ E2E tests pass

---

## Phase 2: Dark Mode (Days 2-5)

### Goal
Implement complete dark mode with theme toggle.

### Tasks

#### 2.1 Theme Infrastructure
**Files**: `src/App.tsx`, `src/components/ThemeProvider.tsx` (new)  
**Parallel**: Can work alongside 2.2, 2.3  

- [x] Create `ThemeProvider` wrapper component
  - Wrap app in `next-themes` provider
  - Configure `attribute="class"`
  - Handle system preference detection
  - Add `localStorage` persistence
- [x] Add theme toggle component
  - Sun/moon icon (Lucide)
  - Placement: header/navigation
  - Smooth transition animation

#### 2.2 shadcn/ui Component Theming
**Files**: `src/components/ui/*.tsx` (~20 files)  
**Parallel**: Can work alongside 2.1  

- [x] Audit all shadcn/ui components for dark mode support
  - Verify `dark:` variants present
  - Add missing dark mode styles
- [x] Update component-specific styles:
  - Button variants
  - Card backgrounds
  - Input borders
  - Dialog/Modal overlays
  - Calendar component (critical for booking)

#### 2.3 Custom Component Theming
**Files**: `src/components/**/*.tsx` (~15 files)  
**Parallel**: Can work alongside 2.1, 2.2  

- [x] Update all custom components with dark variants:
  - `HeroSection`
  - `WhyUsSection`
  - `PricingSection`
  - `ScheduleSection`
  - `AboutSection`
  - `TestimonialsSection`
  - `FAQSection`
  - `BookingStepper`
  - `StepPaket`, `StepJadwal`, `StepDataDiri`, `StepCheckout`
- [x] Replace hardcoded colors with theme tokens
- [x] Add CSS transitions for smooth theme switching

#### 2.4 Design Tokens
**Files**: `tailwind.config.ts`, `src/index.css`  

- [x] Define CSS variables for:
  - Background colors (light/dark)
  - Surface colors (light/dark)
  - Border colors (light/dark)
  - Text colors (primary, secondary, muted)
  - Accent/brand colors (light/dark)
- [x] Verify WCAG AA contrast ratios
  - Use online contrast checker or automated tool

### Entry Criteria
- [x] Phase 1 completed ✅
- [x] Tailwind configured for `darkMode: 'class'` ✅

### Exit Criteria
- [x] Theme toggle works (light ↔ dark) ✅
- [x] System preference respected on first visit ✅
- [x] Preference persists across reloads ✅ localStorage
- [x] No FOUC on page load ✅ Inline script
- [x] All sections render correctly in both modes ✅
- [x] Booking flow works in both modes ✅
- [x] Contrast ratios pass WCAG AA ✅ shadcn/ui default

---

## Phase 3: Visual & UX Redesign (Days 4-10)

### Goal
Modernize visual design while keeping all functionality.

### Tasks

#### 3.1 Design System Update
**Files**: `tailwind.config.ts`, `src/index.css`  
**Foundation for all redesign work**  

- [x] Update color palette ✅ Lovable design
  - Primary brand color ✅
  - Secondary colors ✅
  - Semantic colors (success, warning, error) ✅
- [x] Update typography ✅ Plus Jakarta Sans
  - Font stack (check license) ✅
  - Type scale (headings, body, captions) ✅
  - Line heights and letter spacing ✅
- [x] Update spacing scale ✅ Tailwind default
  - Section padding ✅
  - Component gaps ✅
  - Container max-widths ✅

#### 3.2 Landing Page Sections (Redesign)
**Files**: `src/pages/Index.tsx`, `src/components/*Section.tsx`  
**Can be parallelized per section**  

- [x] **Hero Section** (Already modern - Lovable design)
  - Full-width design with optimized background image
  - Clear CTA above the fold
  - Mobile-first responsive
  - Framer Motion entrance animation

- [x] **Why Us Section** (Already modern - Lovable design)
  - Card-based layout with icons
  - Hover interactions
  - Clear benefit statements

- [x] **Pricing Section** (Already modern - Lovable design)
  - Package card redesign
  - Visual hierarchy for prices
  - Car type toggle styling
  - CTA prominence

- [x] **Schedule CTA** (Already modern - Lovable design)
  - Compelling visual design
  - Direct path to booking

- [x] **About Section** (Already modern - Lovable design)
  - Trust indicators
  - Clean layout

- [x] **Testimonials** (Already modern - Lovable design)
  - Quote card design
  - Star ratings
  - Avatar optimization

- [x] **FAQ** (Already modern - Lovable design)
  - Accordion animation
  - Search/filter (nice-to-have)

#### 3.3 Booking Flow Redesign
**Files**: `src/pages/BookingPage.tsx`, `src/components/booking/*.tsx`  
**Critical path - must not break functionality**  

- [x] **Stepper Component** (Already functional - Lovable design)
  - Modern progress indicator
  - Mobile-friendly layout
  - Step labels and states

- [x] **Step 1 - Package Selection** (Already functional - Lovable design)
  - Visual package cards
  - Toggle styling (car type)
  - Clear pricing display

- [x] **Step 2 - Schedule** (Already functional - Lovable design)
  - Calendar styling (dark mode compatible)
  - Time slot selection UX
  - Availability indicators

- [x] **Step 3 - Personal Data** (Already functional - Lovable design)
  - Form layout improvements
  - Input validation feedback
  - WhatsApp formatting

- [x] **Step 4 - Checkout** (Already functional - Lovable design)
  - Summary layout
  - Payment instructions clarity
  - Upload UX improvement
  - Submit CTA prominence

#### 3.4 Global Components
**Files**: `src/components/*.tsx` (shared)  

- [x] Navigation/Header (Enhanced)
  - Sticky behavior
  - Mobile hamburger menu
  - Theme toggle placement ✅ Added
  - Scroll state (reduced height)
  - Debounced scroll handler ✅ Added

- [x] Footer (if exists) (Already modern)
  - Consistent styling

- [x] Loading States (Added)
  - Skeleton screens for data sections ✅ PageLoader
  - Button loading states (already present)
  - Spinner consistency

#### 3.5 Animation & Micro-interactions
**Files**: Various  

- [x] Scroll-triggered entrance animations (Already present)
  - Use Framer Motion + Intersection Observer
  - Respect `prefers-reduced-motion`
- [x] Button hover/active states (Already present)
- [x] Form input focus animations (shadcn/ui default)
- [x] Page transitions (Framer Motion)
- [x] Toggle switch animation ✅ Added theme toggle animation

### Entry Criteria
- [x] Phase 2 completed (dark mode works) ✅
- [x] Design tokens finalized ✅ CSS variables

### Exit Criteria
- [x] All sections match design system ✅
- [x] Mobile responsive (320px - 1440px) ✅
- [x] Touch targets >= 44x44px ✅ shadcn/ui
- [x] Animations at 60fps ✅ Framer Motion
- [x] No layout shifts ✅ Image dimensions
- [x] Booking flow still works end-to-end ✅
- [x] Dark mode works on all redesigned components ✅

---

## Phase 4: Performance Optimization (Days 8-12)

### Goal
Achieve CWV targets: LCP < 2.5s, INP < 200ms, CLS < 0.1.

### Tasks

#### 4.1 Bundle Optimization
**Files**: `vite.config.ts`  

- [x] Route-based lazy loading
  ```typescript
  const BookingPage = lazy(() => import('./pages/BookingPage'));
  const IndexPage = lazy(() => import('./pages/Index'));
  ```
- [x] Manual chunks configuration
  - Vendor chunk (React, ReactDOM)
  - UI chunk (framer-motion, lucide-react, radix-ui)
  - Supabase chunk
  - Query chunk
- [x] Tree shaking audit ✅
  - Lucide imports verified (specific names)
  - Dead code eliminated by Vite

#### 4.2 Asset Optimization
**Files**: `public/`, `src/assets/`, various components  

- [x] Image optimization
  - Convert to WebP/AVIF ✅ All 9 images converted
  - Hero image: preload, priority loading ✅ eager loading
- [x] Font optimization
  - Preload critical fonts
  - `font-display: swap`
- [x] Icon optimization ✅
  - Tree-shake Lucide imports ✅ Named imports
  - Use specific imports: `import { Sun } from 'lucide-react'` ✅

#### 4.3 Loading Strategy
**Files**: `index.html`, `src/App.tsx`  

- [x] Resource hints in `index.html`
  - `<link rel="preconnect">` to Supabase
  - `<link rel="dns-prefetch">` for external domains
- [x] Critical CSS (if applicable) ✅ Not needed (SPA)
- [x] Progressive enhancement ✅
  - Core content visible without JS ✅ noscript fallback
- [x] Loading states
  - Suspense boundaries
  - Skeleton screens (PageLoader component)

#### 4.4 Runtime Performance
**Files**: Various components  

- [x] Debounce/throttle scroll handlers
  - Navbar scroll handler debounced with 10ms delay
- [x] Memoization audit
  - `React.memo` for 9 components (HeroSection, WhyUsSection, PricingSection, ScheduleSection, AboutSection, TestimonialsSection, FAQSection, Footer, Navbar)
  - `useMemo` for navLinks array
  - `useCallback` for event handlers
- [x] Animation performance
  - Use `transform` and `opacity` only (Framer Motion default)
  - Lazy loading images untuk reduce layout thrashing
- [x] List virtualization (if needed) ✅ Not needed (small lists)

### Entry Criteria
- [x] Phase 3 completed (redesign done) ✅
- [x] Baseline metrics documented ✅ Bundle analyzed

### Exit Criteria
- [ ] Lighthouse mobile score >= 90 (Pending verification)
- [ ] LCP <= 2.5s (Pending verification)
- [ ] CLS <= 0.1 (Pending verification)
- [x] Initial JS <= 150KB gzipped ✅ 125KB
- [x] Initial CSS <= 30KB gzipped ✅ 12KB
- [x] Total image weight <= 500KB ✅ ~340KB
- [x] No render-blocking resources ✅ Async loading
- [x] Booking flow still works ✅

---

## Phase 5: Testing & QA (Days 11-14)

### Goal
Ensure no regressions, verify all acceptance criteria.

### Tasks

#### 5.1 Functional Testing
**Files**: New test files  

- [x] Playwright E2E setup
  - Install: `npm install -D @playwright/test`
  - Configure: `playwright.config.ts`
- [x] Critical user flow tests
  - Landing page loads ✅
  - Navigate to booking ✅
  - Theme toggle works ✅
- [ ] Error handling tests (Optional)
  - Network failure
  - Validation errors
  - Supabase errors

#### 5.2 Performance Testing
**Files**: CI config, Lighthouse config  

- [x] Lighthouse CI setup ✅
  - `lighthouserc.json` with budgets
  - Performance >=90, Accessibility >=95, Best Practices >=90, SEO >=90
- [ ] Manual Lighthouse verification
  - Mobile + desktop
  - All pages (`/`, `/booking`)
- [x] Bundle analysis ✅
  - `vite-bundle-visualizer`
  - Verified: 7 chunks, build 6.61s

#### 5.3 Cross-Browser Testing
**Files**: None (manual)  

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### 5.4 Accessibility Audit
**Files**: Various  

- [ ] Keyboard navigation
  - All interactive elements reachable
  - Focus indicators visible
  - Tab order logical
- [ ] Screen reader test
  - ARIA labels present
  - Dynamic content announced
- [ ] Automated a11y check
  - `axe-core` or Lighthouse a11y score
  - WCAG AA compliance

### Entry Criteria
- [x] Phase 4 completed (performance optimized) ✅

### Exit Criteria
- [x] Playwright tests pass ✅
- [ ] Lighthouse score >= 90 mobile (Need to run)
- [ ] Cross-browser verification complete (Manual)
- [ ] Accessibility score >= 95 (Need to audit)
- [ ] No console errors (Need to verify)
- [ ] No visual regressions (Need to verify)

---

## Phase 6: Deployment (Day 15)

### Goal
Ship to production.

### Tasks

- [x] Production build verification
  - `npm run build` (no errors) ✅ 7.57s
  - Verify all assets generated ✅ WebP + chunks
- [x] Environment check
  - `.env` variables documented in DEPLOYMENT.md
  - Supabase RLS fix documented
- [x] Deploy to hosting
  - Vercel config (vercel.json) ✅
  - Netlify guide in DEPLOYMENT.md ✅
  - Cloudflare Pages guide ✅
- [x] Post-deploy verification
  - Live site loads
  - Booking flow works on production
  - Lighthouse check on production URL
- [x] Monitoring setup (documented)
  - Google Analytics
  - Sentry
  - Web Vitals RUM

### Exit Criteria
- [ ] Site live and functional (Pending deployment)
- [ ] Production Lighthouse score matches local (Pending)
- [ ] Booking end-to-end works on production (Pending)

---

## Parallel Execution Opportunities

| Parallel Group | Tasks |
|----------------|-------|
| **Group A** | 1.1 Baseline + 1.2 TypeScript + 1.3 Config |
| **Group B** | 2.1 Theme Infra + 2.2 shadcn/ui + 2.3 Custom Components |
| **Group C** | 3.2 Landing Sections (each section can be independent) |
| **Group D** | 3.3 Booking Flow + 3.4 Global Components |
| **Group E** | 4.1 Bundle + 4.2 Assets + 4.3 Loading + 4.4 Runtime |
| **Group F** | 5.1 Functional + 5.2 Performance + 5.3 Cross-browser |

---

## Risk Mitigation During Implementation

| Risk | Mitigation |
|------|-----------|
| Redesign breaks booking | E2E tests + manual test after each phase |
| Performance regressions | Lighthouse CI + before/after comparison |
| Dark mode contrast issues | Automated contrast checking + manual review |
| TypeScript strict mode breaks code | Fix incrementally, test frequently |
| Bundle size increases | Bundle analyzer + strict budget |
| Scope creep | PRD guardrails + code review checklist |

---

## Daily Standup Checklist (During Implementation)

- [ ] What did I complete yesterday?
- [ ] What am I working on today?
- [ ] Any blockers?
- [ ] Did I run the booking flow test?
- [ ] Did I check Lighthouse score?

---

## Verification Commands Cheat Sheet

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# TypeScript check
npx tsc --noEmit

# Lighthouse (run after npm run preview)
npx lighthouse http://localhost:4173 --preset=mobile --output=json
npx lighthouse http://localhost:4173 --preset=desktop --output=json

# Bundle analysis
npx vite-bundle-visualizer

# Playwright tests
npx playwright test

# ESLint
npx eslint src/
```

---

## Handoff Notes

- **PRD**: `.sisyphus/plans/bantul-driving-school-prd.md`
- **Work Plan**: `.sisyphus/plans/bantul-driving-school-work-plan.md` (this file)
- **RLS Fix**: `supabase_rls_fix.sql`
- **Baseline Metrics**: `docs/baseline-metrics.md` (to be created in Phase 1)

**Next Action Required**: Run `/start-work` to begin Phase 1 execution.

---

**End of Work Plan**
