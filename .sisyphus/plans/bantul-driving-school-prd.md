# Product Requirements Document (PRD)
# Bantul Driving School Hub - Improvement Initiative

**Version**: 1.0  
**Date**: 2026-05-08  
**Status**: Draft  
**Author**: Prometheus (AI Planning Consultant)  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Analysis](#2-current-state-analysis)
3. [Improvement Goals](#3-improvement-goals)
4. [Detailed Requirements](#4-detailed-requirements)
5. [UX Improvements](#5-ux-improvements)
6. [Technical Requirements](#6-technical-requirements)
7. [Success Metrics & Acceptance Criteria](#7-success-metrics--acceptance-criteria)
8. [Scope & Guardrails](#8-scope--guardrails)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Risks & Mitigation](#10-risks--mitigation)

---

## 1. Executive Summary

### 1.1 Product Overview
The Bantul Driving School Hub (KMB - Kursus Mobil Bantul) is a landing page and booking application for a driving school in Bantul, Indonesia. It allows prospective students to learn about services, view pricing packages, and complete a multi-step booking process.

### 1.2 Purpose of This PRD
This document defines the requirements for improving the existing application through three key initiatives:
1. **Visual + UX Redesign** - Modernize the interface and improve user experience
2. **Dark Mode** - Add theme toggle with system preference support
3. **Web Performance** - Optimize Core Web Vitals for better user experience and SEO

### 1.3 Target Audience
- **Primary**: Prospective driving school students (ages 17-40) in Bantul and surrounding areas
- **Secondary**: Parents booking on behalf of their children
- **Devices**: Mobile-first (60%+ traffic expected from mobile), desktop secondary

### 1.4 Success Vision
A fast, accessible, modern landing page that converts visitors into bookings efficiently, with a delightful user experience in both light and dark modes.

---

## 2. Current State Analysis

### 2.1 Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.3.1 |
| Build Tool | Vite | 6.4.1 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4.17 |
| UI Components | shadcn/ui | latest |
| Backend | Supabase | 2.98.0 |
| State Management | TanStack Query | 5.83.0 |
| Routing | React Router DOM | 6.30.1 |
| Animation | Framer Motion | 12.23.26 |
| Theming | next-themes | 0.3.0 |

### 2.2 Current Features
#### Landing Page (`/`)
- Hero section with CTA
- Why Us (value proposition)
- Pricing (packages by car type)
- Schedule CTA
- About section
- Testimonials
- FAQ accordion

#### Booking Flow (`/booking`)
- 4-step wizard: Package → Schedule → Personal Data → Checkout
- Calendar date/time picker
- Personal info form (name, WhatsApp, pickup location)
- Payment proof upload (manual bank transfer)
- Booking confirmation

### 2.3 Current Issues
| Category | Issue | Impact |
|----------|-------|--------|
| **Performance** | No lazy loading or code splitting | Large initial bundle, slow LCP |
| **Performance** | No image optimization | Large asset payloads |
| **Performance** | No font loading strategy | Potential CLS from font swaps |
| **UX** | No dark mode | User preference not supported |
| **UX** | Basic loading states | Perceived performance issues |
| **Quality** | No tests | Regression risk during changes |
| **Quality** | Relaxed TypeScript config | Potential runtime errors |
| **Security** | Anonymous bookings only | Spam risk, no user accounts |
| **Accessibility** | Not formally audited | Potential WCAG violations |

---

## 3. Improvement Goals

### 3.1 Goal 1: Visual + UX Redesign
**Objective**: Modernize the visual design and improve user experience without changing core functionality.

**Key Results**:
- Updated color palette and typography
- Improved spacing and visual hierarchy
- Better mobile responsiveness
- Enhanced micro-interactions and animations
- Consistent component styling across all sections

### 3.2 Goal 2: Dark Mode
**Objective**: Implement a comprehensive dark mode theme that respects user preferences.

**Key Results**:
- System preference detection
- Manual toggle with persistent preference
- All components support both themes
- No FOUC (Flash of Unstyled Content) on load
- WCAG AA contrast compliance in both modes

### 3.3 Goal 3: Core Web Vitals Optimization
**Objective**: Achieve excellent Core Web Vitals scores for better UX and SEO.

**Key Results**:
- LCP (Largest Contentful Paint) < 2.5s
- INP (Interaction to Next Paint) < 200ms
- CLS (Cumulative Layout Shift) < 0.1
- Lighthouse mobile score >= 90
- Lighthouse desktop score >= 95

---

## 4. Detailed Requirements

### 4.1 Redesign Requirements

#### 4.1.1 Visual Design System
**Color Palette**:
- Define primary, secondary, accent colors for both light and dark modes
- Maintain brand identity while modernizing
- Ensure WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI components)

**Typography**:
- Modern font stack with proper fallbacks
- Consistent type scale (headings, body, captions)
- Optimize font loading (font-display: swap, preload critical fonts)

**Spacing & Layout**:
- Consistent spacing scale (4px base unit)
- Improved section padding for breathing room
- Container max-width constraints for readability
- Better grid alignment

#### 4.1.2 Section-Specific Requirements

**Hero Section**:
- Full-width impactful design
- Clear value proposition above the fold
- Prominent CTA button
- Optimized background image (WebP/AVIF, responsive sizes)

**Why Us Section**:
- Icon + text card layout
- Hover interactions
- Clear benefit statements

**Pricing Section**:
- Package cards with clear hierarchy
- Car type toggle (mobil_kursus / mobil_sendiri)
- Price prominently displayed
- CTA to booking per package

**Schedule CTA**:
- Compelling call-to-action
- Direct link to booking flow

**About Section**:
- School story/mission
- Trust indicators

**Testimonials**:
- Customer quote cards
- Star ratings
- Photo avatars (optimized)

**FAQ**:
- Accordion pattern
- Smooth expand/collapse animations
- Search/filter capability (nice-to-have)

#### 4.1.3 Booking Flow Redesign
**Stepper**:
- Clear progress indication
- Step labels visible
- Mobile-friendly layout

**Step 1 - Package Selection**:
- Visual package cards
- Clear pricing and features
- Easy car type toggle

**Step 2 - Schedule**:
- Calendar component (improved styling)
- Time slot selection
- Availability indicators

**Step 3 - Personal Data**:
- Clean form layout
- Input validation feedback
- WhatsApp number formatting

**Step 4 - Checkout**:
- Booking summary
- Payment instructions
- File upload with preview
- Clear submission CTA

### 4.2 Dark Mode Requirements

#### 4.2.1 Theme Strategy
- **Default**: Respect system preference (`prefers-color-scheme`)
- **Toggle**: Manual switch in header/navigation
- **Persistence**: Store preference in `localStorage`
- **Sync**: Update toggle when system preference changes (if no manual override)

#### 4.2.2 Implementation Requirements
- Use `next-themes` with Tailwind CSS `darkMode: 'class'` strategy
- All shadcn/ui components must support dark variants
- Custom components must use CSS variables or Tailwind dark: modifiers
- No hardcoded colors; use theme tokens exclusively

#### 4.2.3 Dark Mode Design Tokens
```
Background: slate-950 / gray-950
Surface: slate-900 / gray-900
Border: slate-800 / gray-800
Text Primary: slate-50 / gray-50
Text Secondary: slate-400 / gray-400
Text Muted: slate-500 / gray-500
Accent: (brand color, adjusted for dark)
```

#### 4.2.4 Edge Cases
- No FOUC on initial load (apply theme before React hydration)
- Smooth transitions between themes (CSS transitions on color changes)
- Images should work in both modes (consider darkening filters if needed)
- Third-party components (calendar, maps) must adapt

### 4.3 Performance Requirements

#### 4.3.1 Core Web Vitals Targets
| Metric | Target | Current (Estimated) |
|--------|--------|---------------------|
| LCP | < 2.5s | ~4-5s |
| INP | < 200ms | ~300-500ms |
| CLS | < 0.1 | ~0.2-0.3 |
| TTFB | < 600ms | ~800ms |
| FCP | < 1.8s | ~2.5s |

#### 4.3.2 Bundle Optimization
- **Initial JS**: < 150KB gzipped
- **Initial CSS**: < 30KB gzipped
- **Code splitting**: Route-based lazy loading
- **Tree shaking**: Eliminate unused code

#### 4.3.3 Asset Optimization
- **Images**: Convert to WebP/AVIF, responsive sizes, lazy loading
- **Fonts**: Preload critical fonts, font-display: swap, subset if possible
- **Icons**: Tree-shake Lucide icons, use SVG sprites where appropriate
- **Animations**: Respect `prefers-reduced-motion`

#### 4.3.4 Loading Strategy
- **Critical CSS**: Inline above-the-fold styles
- **Resource hints**: Preload hero image, preconnect to Supabase
- **Lazy loading**: Images below fold, non-critical components
- **Skeleton screens**: For data-fetching sections
- **Progressive enhancement**: Core content without JS

#### 4.3.5 Runtime Performance
- **Debounce/throttle**: Scroll handlers, resize observers
- **Memoization**: React.memo, useMemo, useCallback for expensive renders
- **Virtualization**: If lists grow large (testimonials, packages)
- **Animation performance**: Use transform/opacity only, avoid layout thrashing

---

## 5. UX Improvements

### 5.1 Interaction Design
- **Hover states**: All interactive elements have clear hover/focus states
- **Active states**: Buttons show active/pressed state
- **Loading states**: Buttons show loading spinner during async actions
- **Error states**: Clear error messages with recovery actions
- **Success states**: Confirmation toasts/messages

### 5.2 Micro-interactions
- Smooth page transitions (Framer Motion)
- Section entrance animations on scroll
- Button press feedback
- Form input focus animations
- Toggle switch animations

### 5.3 Mobile Experience
- Touch-friendly tap targets (min 44x44px)
- Bottom sheet for mobile modals
- Sticky header with reduced height on scroll
- Mobile-optimized booking flow (full-screen steps)
- Viewport height handling (iOS Safari 100vh fix)

### 5.4 Form UX
- Real-time validation (on blur)
- Inline error messages
- Auto-formatting (phone numbers)
- Keyboard navigation (Tab order)
- Input masks where appropriate

### 5.5 Accessibility
- WCAG AA compliance
- Keyboard navigation throughout
- Focus management in modals/wizards
- ARIA labels and roles
- Screen reader announcements for dynamic content
- Color contrast >= 4.5:1 for text

---

## 6. Technical Requirements

### 6.1 Architecture Constraints
- **Framework**: Remain React 18 + Vite SPA
- **No migration**: Do NOT migrate to Next.js or other frameworks
- **No backend changes**: Supabase schema remains unchanged
- **No new state management**: Keep TanStack Query, no Redux/Zustand

### 6.2 Dark Mode Implementation
```typescript
// ThemeProvider setup with next-themes
// Tailwind config: darkMode: 'class'
// CSS variables for custom colors
// Theme toggle component
```

### 6.3 Performance Implementation
```typescript
// Route-based lazy loading
const BookingPage = lazy(() => import('./pages/BookingPage'));

// Image optimization
// - Use Vite image plugin or manual optimization
// - Responsive images with srcset
// - Lazy loading with Intersection Observer

// Code splitting
// - Vendor chunks
// - Route chunks
// - Dynamic imports for heavy components
```

### 6.4 TypeScript Improvements
- Enable strict mode settings gradually:
  - `noImplicitAny: true`
  - `strictNullChecks: true`
  - `strictFunctionTypes: true`
- Fix resulting type errors
- Add types for all props and return values

### 6.5 Testing Requirements
- **Playwright E2E**: Critical user flows
  - Landing page load
  - Booking flow completion
  - Dark mode toggle
- **Performance testing**: Lighthouse CI integration
- **Visual regression**: Optional (nice-to-have)

### 6.6 Build & Deployment
- **Build optimization**: Vite build configuration
  - Rollup manual chunks
  - Minification
  - Asset hashing
- **CI/CD**: Lighthouse CI for performance gates
- **Hosting**: Static hosting (Netlify/Vercel/Cloudflare Pages)

---

## 7. Success Metrics & Acceptance Criteria

### 7.1 Performance Metrics

**Lighthouse Audit (Mobile)**:
```bash
# Command to verify
npm run build
npm run preview &
npx lighthouse http://localhost:4173 --preset=mobile --output=json
```

**Targets**:
- [ ] Performance score >= 90
- [ ] LCP <= 2.5s
- [ ] INP <= 200ms (field data or lab simulation)
- [ ] CLS <= 0.1
- [ ] Accessibility score >= 95
- [ ] Best Practices score >= 95
- [ ] SEO score >= 95

**Bundle Analysis**:
```bash
# Command to verify
npm run build
npx vite-bundle-visualizer
```

**Targets**:
- [ ] Initial JS bundle <= 150KB gzipped
- [ ] Initial CSS <= 30KB gzipped
- [ ] Total image weight on landing <= 500KB
- [ ] No render-blocking resources

### 7.2 Functional Acceptance Criteria

**Dark Mode**:
- [ ] Toggle switches between light/dark
- [ ] System preference respected on first visit
- [ ] Preference persists across sessions
- [ ] No FOUC on page load
- [ ] All components render correctly in both modes
- [ ] WCAG AA contrast verified (automated check)

**Booking Flow**:
- [ ] Complete booking in < 2 minutes
- [ ] All validation works correctly
- [ ] Payment upload succeeds
- [ ] Success confirmation shown
- [ ] Error states handled gracefully

**Responsive Design**:
- [ ] Works on 320px width (small mobile)
- [ ] Works on 768px width (tablet)
- [ ] Works on 1440px width (desktop)
- [ ] Touch targets >= 44x44px

### 7.3 UX Acceptance Criteria

**Visual Design**:
- [ ] Consistent spacing throughout
- [ ] Typography hierarchy is clear
- [ ] Colors match design tokens
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts during load

**Accessibility**:
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color not sole means of conveying info

---

## 8. Scope & Guardrails

### 8.1 In Scope
- Visual redesign of all existing sections
- Dark mode implementation
- Performance optimization (CWV)
- UX improvements (interactions, mobile, forms)
- TypeScript strictness improvements
- Basic test coverage (Playwright smoke tests)
- Accessibility improvements

### 8.2 Out of Scope (Must NOT Have)
- **No new features**: No auth, no accounts, no admin dashboard
- **No new pages**: No blog, no CMS, no additional routes
- **No backend changes**: Supabase schema stays the same
- **No new booking steps**: Keep 4-step flow, no modifications
- **No payment gateway**: Keep manual bank transfer
- **No framework migration**: Stay React+Vite, no Next.js
- **No new state management**: Keep current TanStack Query setup
- **No content expansion**: Keep current copy, no new sections
- **No SEO content strategy**: Keep current meta, no blog/content marketing
- **No internationalization**: Keep Indonesian only

### 8.3 Allowed Changes
- Component styling and layout
- Color tokens and typography
- Animation and interaction patterns
- Image optimization and formats
- Code structure and TypeScript strictness
- Build configuration

### 8.4 Forbidden Changes
- Database schema
- API contracts
- User flows and booking logic
- Routing structure
- State management approach
- Framework or build tool

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Week 1)
1. **Baseline Measurement**
   - Run Lighthouse audits (mobile + desktop)
   - Record current bundle size
   - Document current metrics

2. **Setup & Configuration**
   - Configure next-themes
   - Update Tailwind config for dark mode
   - Setup theme CSS variables
   - Configure Vite for code splitting

3. **TypeScript Improvements**
   - Enable strict flags
   - Fix type errors
   - Add missing types

### Phase 2: Dark Mode (Week 1-2)
1. **Theme System**
   - Implement ThemeProvider
   - Create theme toggle component
   - Add theme persistence

2. **Component Theming**
   - Update shadcn/ui components
   - Update custom components
   - Verify all sections in dark mode
   - Fix contrast issues

### Phase 3: Redesign (Week 2-3)
1. **Design System**
   - Define color tokens
   - Update typography
   - Update spacing scale

2. **Section Redesign**
   - Hero
   - Why Us
   - Pricing
   - Schedule CTA
   - About
   - Testimonials
   - FAQ

3. **Booking Flow Redesign**
   - Stepper
   - All 4 steps
   - Success/error states

### Phase 4: Performance (Week 3-4)
1. **Bundle Optimization**
   - Route lazy loading
   - Vendor chunking
   - Tree shaking audit

2. **Asset Optimization**
   - Image optimization
   - Font optimization
   - Icon optimization

3. **Runtime Optimization**
   - Memoization
   - Debounce/throttle
   - Animation performance
   - Loading strategies

### Phase 5: Testing & QA (Week 4)
1. **Testing**
   - Playwright smoke tests
   - Lighthouse CI setup
   - Cross-browser testing

2. **Final Verification**
   - Performance audit
   - Accessibility audit
   - UX review
   - Mobile testing

### Phase 6: Launch (Week 5)
1. **Deployment**
   - Production build
   - Deploy to hosting
   - Verify in production

2. **Monitoring**
   - Real User Monitoring (RUM)
   - Performance monitoring
   - Error tracking

---

## 10. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Scope creep** (adding features) | High | High | Strict guardrails, PRD sign-off, code review checks |
| **Performance regressions** from redesign | Medium | High | Performance budgets, Lighthouse CI gates, before/after comparison |
| **Dark mode contrast issues** | Medium | Medium | Automated contrast checking, design token system, manual review |
| **Booking flow breakage** | Low | Critical | Playwright E2E tests, manual testing, staged rollout |
| **TypeScript strict mode breakage** | Medium | Medium | Gradual enablement, fix errors incrementally |
| **Browser compatibility** | Low | Medium | Browserlist config, cross-browser testing, progressive enhancement |
| **FOUC with dark mode** | Medium | Medium | next-themes best practices, inline script for initial theme |
| **Bundle size increase** | Medium | High | Bundle analysis, code splitting, tree shaking verification |

---

## Appendix

### A. Current File Structure Reference
```
src/
  assets/           # Static assets
  components/       # Reusable components
    ui/            # shadcn/ui components
    booking/       # Booking flow components
  hooks/           # Custom hooks
  integrations/    # Supabase setup
    supabase/
      client.ts
      types.ts
  lib/             # Utilities
  pages/           # Page components
    Index.tsx
    BookingPage.tsx
    NotFound.tsx
  services/        # API services
    bookingService.ts
  App.tsx          # Root component
```

### B. Key Dependencies
- react, react-dom
- vite
- typescript
- tailwindcss
- @supabase/supabase-js
- @tanstack/react-query
- react-router-dom
- framer-motion
- next-themes
- lucide-react
- recharts
- date-fns

### C. Performance Budget
| Resource | Budget |
|----------|--------|
| Initial JS | 150KB gzipped |
| Initial CSS | 30KB gzipped |
| Images (landing) | 500KB total |
| Fonts | 100KB total |
| Third-party scripts | 50KB total |

### D. Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome for Android (last 2 versions)

---

**End of PRD**
