# Deployment Guide

## Prerequisites

1. Ensure `.env` file has valid Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Verify Supabase RLS policies are configured (see `supabase_rls_fix.sql`)

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
4. Verify dark mode toggle works

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
