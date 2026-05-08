# Work Plan: Bantul Driving School Hub Improvements

**Derived from**: `bantul-driving-school-prd.md`  
**Generated**: 2026-05-08  
**Status**: Ready for execution  

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
- [ ] Baseline metrics documented
- [ ] TypeScript compiles with strict mode (0 errors)
- [ ] `npm run build` succeeds
- [ ] No regressions in booking flow

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
- [ ] Phase 1 completed
- [ ] Tailwind configured for `darkMode: 'class'`

### Exit Criteria
- [ ] Theme toggle works (light ↔ dark)
- [ ] System preference respected on first visit
- [ ] Preference persists across reloads
- [ ] No FOUC on page load
- [ ] All sections render correctly in both modes
- [ ] Booking flow works in both modes
- [ ] Contrast ratios pass WCAG AA

---

## Phase 3: Visual & UX Redesign (Days 4-10)

### Goal
Modernize visual design while keeping all functionality.

### Tasks

#### 3.1 Design System Update
**Files**: `tailwind.config.ts`, `src/index.css`  
**Foundation for all redesign work**  

- [ ] Update color palette
  - Primary brand color
  - Secondary colors
  - Semantic colors (success, warning, error)
- [ ] Update typography
  - Font stack (check license)
  - Type scale (headings, body, captions)
  - Line heights and letter spacing
- [ ] Update spacing scale
  - Section padding
  - Component gaps
  - Container max-widths

#### 3.2 Landing Page Sections (Redesign)
**Files**: `src/pages/Index.tsx`, `src/components/*Section.tsx`  
**Can be parallelized per section**  

- [ ] **Hero Section**
  - Full-width design with optimized background image
  - Clear CTA above the fold
  - Mobile-first responsive
  - Add subtle entrance animation

- [ ] **Why Us Section**
  - Card-based layout with icons
  - Hover interactions
  - Clear benefit statements

- [ ] **Pricing Section**
  - Package card redesign
  - Visual hierarchy for prices
  - Car type toggle styling
  - CTA prominence

- [ ] **Schedule CTA**
  - Compelling visual design
  - Direct path to booking

- [ ] **About Section**
  - Trust indicators
  - Clean layout

- [ ] **Testimonials**
  - Quote card design
  - Star ratings
  - Avatar optimization

- [ ] **FAQ**
  - Accordion animation
  - Search/filter (nice-to-have)

#### 3.3 Booking Flow Redesign
**Files**: `src/pages/BookingPage.tsx`, `src/components/booking/*.tsx`  
**Critical path - must not break functionality**  

- [ ] **Stepper Component**
  - Modern progress indicator
  - Mobile-friendly layout
  - Step labels and states

- [ ] **Step 1 - Package Selection**
  - Visual package cards
  - Toggle styling (car type)
  - Clear pricing display

- [ ] **Step 2 - Schedule**
  - Calendar styling (dark mode compatible)
  - Time slot selection UX
  - Availability indicators

- [ ] **Step 3 - Personal Data**
  - Form layout improvements
  - Input validation feedback
  - WhatsApp formatting

- [ ] **Step 4 - Checkout**
  - Summary layout
  - Payment instructions clarity
  - Upload UX improvement
  - Submit CTA prominence

#### 3.4 Global Components
**Files**: `src/components/*.tsx` (shared)  

- [ ] Navigation/Header
  - Sticky behavior
  - Mobile hamburger menu
  - Theme toggle placement
  - Scroll state (reduced height)

- [ ] Footer (if exists)
  - Consistent styling

- [ ] Loading States
  - Skeleton screens for data sections
  - Button loading states
  - Spinner consistency

#### 3.5 Animation & Micro-interactions
**Files**: Various  

- [ ] Scroll-triggered entrance animations
  - Use Framer Motion + Intersection Observer
  - Respect `prefers-reduced-motion`
- [ ] Button hover/active states
- [ ] Form input focus animations
- [ ] Page transitions
- [ ] Toggle switch animation

### Entry Criteria
- [ ] Phase 2 completed (dark mode works)
- [ ] Design tokens finalized

### Exit Criteria
- [ ] All sections match design system
- [ ] Mobile responsive (320px - 1440px)
- [ ] Touch targets >= 44x44px
- [ ] Animations at 60fps
- [ ] No layout shifts
- [ ] Booking flow still works end-to-end
- [ ] Dark mode works on all redesigned components

---

## Phase 4: Performance Optimization (Days 8-12)

### Goal
Achieve CWV targets: LCP < 2.5s, INP < 200ms, CLS < 0.1.

### Tasks

#### 4.1 Bundle Optimization
**Files**: `vite.config.ts`  

- [ ] Route-based lazy loading
  ```typescript
  const BookingPage = lazy(() => import('./pages/BookingPage'));
  const IndexPage = lazy(() => import('./pages/Index'));
  ```
- [ ] Manual chunks configuration
  - Vendor chunk (React, ReactDOM)
  - UI chunk (shadcn components)
  - Animation chunk (Framer Motion)
  - Supabase chunk
- [ ] Tree shaking audit
  - Remove unused imports
  - Verify dead code elimination

#### 4.2 Asset Optimization
**Files**: `public/`, `src/assets/`, various components  

- [ ] Image optimization
  - Convert to WebP/AVIF
  - Add responsive sizes (`srcset`)
  - Lazy loading below fold
  - Hero image: preload, priority loading
- [ ] Font optimization
  - Preload critical fonts
  - `font-display: swap`
  - Subset if possible (Latin characters only)
- [ ] Icon optimization
  - Tree-shake Lucide imports
  - Use specific imports: `import { Sun } from 'lucide-react'`

#### 4.3 Loading Strategy
**Files**: `index.html`, `src/App.tsx`  

- [ ] Resource hints in `index.html`
  - `<link rel="preconnect">` to Supabase
  - `<link rel="preload">` for hero image
  - `<link rel="dns-prefetch">` for external domains
- [ ] Critical CSS (if applicable)
- [ ] Progressive enhancement
  - Core content visible without JS
- [ ] Loading states
  - Suspense boundaries
  - Skeleton screens
  - Progressive image loading

#### 4.4 Runtime Performance
**Files**: Various components  

- [ ] Debounce/throttle scroll handlers
- [ ] Memoization audit
  - `React.memo` for expensive components
  - `useMemo` for calculations
  - `useCallback` for event handlers
- [ ] Animation performance
  - Use `transform` and `opacity` only
  - Avoid layout thrashing
  - Use `will-change` sparingly
- [ ] List virtualization (if needed)
  - Only if testimonials/packages grow large

### Entry Criteria
- [ ] Phase 3 completed (redesign done)
- [ ] Baseline metrics documented

### Exit Criteria
- [ ] Lighthouse mobile score >= 90
- [ ] LCP <= 2.5s
- [ ] CLS <= 0.1
- [ ] Initial JS <= 150KB gzipped
- [ ] Initial CSS <= 30KB gzipped
- [ ] Total image weight <= 500KB
- [ ] No render-blocking resources
- [ ] Booking flow still works

---

## Phase 5: Testing & QA (Days 11-14)

### Goal
Ensure no regressions, verify all acceptance criteria.

### Tasks

#### 5.1 Functional Testing
**Files**: New test files  

- [ ] Playwright E2E setup
  - Install: `npm install -D @playwright/test`
  - Configure: `playwright.config.ts`
- [ ] Critical user flow tests
  - Landing page loads
  - Navigate to booking
  - Complete booking flow
  - Verify Supabase data created
  - Theme toggle works
- [ ] Error handling tests
  - Network failure
  - Validation errors
  - Supabase errors

#### 5.2 Performance Testing
**Files**: CI config, Lighthouse config  

- [ ] Lighthouse CI setup (optional but recommended)
  - `.github/workflows/lighthouse.yml`
  - Budget assertions
- [ ] Manual Lighthouse verification
  - Mobile + desktop
  - All pages (`/`, `/booking`)
- [ ] Bundle analysis
  - `vite-bundle-visualizer`
  - Verify budget compliance

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
- [ ] Phase 4 completed (performance optimized)

### Exit Criteria
- [ ] Playwright tests pass
- [ ] Lighthouse score >= 90 mobile
- [ ] Cross-browser verification complete
- [ ] Accessibility score >= 95
- [ ] No console errors
- [ ] No visual regressions

---

## Phase 6: Deployment (Day 15)

### Goal
Ship to production.

### Tasks

- [ ] Production build verification
  - `npm run build` (no errors)
  - Verify all assets generated
- [ ] Environment check
  - `.env` variables set correctly
  - Supabase URL + anon key valid
- [ ] Deploy to hosting
  - Netlify / Vercel / Cloudflare Pages
- [ ] Post-deploy verification
  - Live site loads
  - Booking flow works on production
  - Lighthouse check on production URL
- [ ] Monitoring setup (optional)
  - Google Analytics
  - Sentry for error tracking
  - Web Vitals RUM

### Exit Criteria
- [ ] Site live and functional
- [ ] Production Lighthouse score matches local
- [ ] Booking end-to-end works on production

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
