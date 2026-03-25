# Athena Launch Checklist

## Critical (Must fix before launch)

- [x] **Fix checkout price validation** — Server recalculates total from DB product prices instead of trusting client-sent values
- [x] **Add admin auth to API routes** — `/api/admin/*` and `/api/email/*` routes check session and admin role before processing
- [x] **Add webhook idempotency** — Billplz webhook skips processing if order is already `paid`
- [x] **Verify Billplz callback** — `/api/checkout/callback` re-fetches bill status from Billplz API instead of trusting query params
- [x] **Move stock decrement to after payment** — Stock decremented in webhook (after confirmed payment), not at checkout creation

## High Priority (Should fix before launch)

- [x] **Fix checkout race condition** — `decrement_stock` RPC uses `WHERE stock_count >= quantity` for atomic operation
- [x] **Input sanitization** — Email format validation, required field checks on checkout
- [x] **No timeout on external APIs** — Added 10s fetch timeouts on Billplz, EasyParcel, Mailgun calls
- [x] **Silent email failures** — Failed emails now logged to `email_logs` table with status `failed` for admin retry
- [x] **Billplz webhook signature** — Uses `crypto.timingSafeEqual` to prevent timing attacks

## Medium Priority (Fix soon after launch)

- [x] **Billplz sandbox URL hardcoded** — Moved to env variable `BILLPLZ_API_URL` for sandbox/production switch
- [ ] **Hero video too large (38MB)** — Compress to under 15MB or move to CDN (Cloudflare R2, Vercel Blob)
- [x] **Admin table pagination** — Added pagination (20 per page) to products, orders, customers, invoices, email logs
- [x] **Product image upload** — Added image upload in admin product form using Supabase Storage
- [x] **Invoice PDF generation** — Added PDF download using jsPDF with branded invoice template

## Features (Post-launch)

- [x] **Order cancellation / refund flow** — Admin can cancel orders with stock restoration
- [ ] **Abandoned checkout recovery** — Email customers who started checkout but didn't pay
- [x] **Password reset flow** — Added forgot password + reset password pages with Supabase Auth
- [ ] **Rate limiting** — Add rate limiting on checkout and auth endpoints
- [x] **SEO meta tags** — Added dynamic OG meta tags to product detail + shop pages
- [x] **Custom 404 page** — Branded not-found page with back to home CTA
- [x] **Order confirmation page** — `/checkout/success` now fetches and displays actual order details with items and totals

## Integrations Status

| Integration | Status | Notes |
|-------------|--------|-------|
| Supabase (Database) | Done | Connected, schema deployed, RLS policies active |
| Supabase (Auth) | Done | Admin user created via dashboard |
| Supabase (Storage) | Ready | Product image upload configured |
| Billplz (Payment) | Done | Sandbox keys configured, collection created |
| EasyParcel (Shipping) | Not started | Need API key from easyparcel.com |
| Mailgun (Email) | Not started | Need API key and verified domain from mailgun.com |

## Environment Variables

| Variable | Status |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Set |
| `SUPABASE_SERVICE_ROLE_KEY` | Set |
| `BILLPLZ_API_URL` | Set (sandbox) |
| `BILLPLZ_API_KEY` | Set (sandbox) |
| `BILLPLZ_COLLECTION_ID` | Set (sandbox) |
| `BILLPLZ_X_SIGNATURE_KEY` | Set (sandbox) |
| `EASYPARCEL_API_KEY` | Missing |
| `MAILGUN_API_KEY` | Missing |
| `MAILGUN_DOMAIN` | Missing |
| `NEXT_PUBLIC_BASE_URL` | Set (localhost) |

## Pre-Deploy Checklist

- [ ] Switch Billplz from sandbox to production (new API keys + URL)
- [ ] Set `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Configure Mailgun with verified sending domain
- [ ] Configure EasyParcel with production API key
- [ ] Compress hero video to under 15MB
- [ ] Create Supabase Storage bucket `product-images` with public access
- [ ] Set up Vercel project and connect Git repo
- [ ] Add all env variables to Vercel dashboard
- [ ] Test full checkout flow end-to-end on production
- [ ] Set up Billplz webhook URL to production domain
- [ ] Verify SSL certificate on custom domain
