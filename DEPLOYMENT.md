# Deployment Guide

## Prerequisites

1. Ensure `.env` has public Supabase credentials for the browser:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Set server-only environment variables in Vercel:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. Optional booking notification webhook:
   ```
   BOOKING_NOTIFY_WEBHOOK_URL=https://your-notification-endpoint
   ```

4. Apply the correct Supabase SQL script:
   - Empty/development database: `src/integrations/supabase/setup-dev-prd-new.sql`
   - Existing old PRD database with tables/data: `src/integrations/supabase/migrate-existing-to-prd-new.sql`

   The `payment-proofs` bucket must be private, and booking writes must go
   through `/api/booking`.

## Deploy to Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

## Deploy to Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod --dir=dist`
3. Set environment variables in Netlify dashboard

## Deploy to Cloudflare Pages

1. Connect GitHub repo to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output: `dist`
4. Add environment variables

## Post-Deploy Verification

1. Check site loads: `https://your-domain.com`
2. Test booking flow end-to-end
3. Run Lighthouse: `npm run lighthouse`
4. Verify success state shows a `KMB-YYYYMMDD-XXX` booking code and WhatsApp CTA

## GitHub Actions CI/CD

CI pipeline configured in `.github/workflows/ci.yml`:
- TypeScript type checking
- Build verification
- Playwright E2E tests
- Artifact upload

## Monitoring (Optional)

### Google Analytics
Add tracking ID to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
```

### Sentry
Install: `npm install @sentry/react`
Initialize in `main.tsx`

### Web Vitals RUM
Install: `npm install web-vitals`
Report metrics to analytics endpoint
