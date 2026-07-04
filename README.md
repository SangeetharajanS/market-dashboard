# Zonely — Market Dashboard

A daily dashboard for Indian markets (NIFTY, BANK NIFTY, SENSEX, FII/DII flows,
options OI, levels) and forex/gold (XAUUSD, GBPUSD, NZDUSD, USDJPY, EURUSD,
BTCUSD, high-impact news for NFP/CPI), with secure email + password login.

Everyone can create their own account with their own password — you don't
manage anyone's credentials manually.

**Right now all market data is mock/sample data** so you can test the app,
the login flow, and the design with friends and family immediately. Swapping
in real data sources is the next step (see "Adding real data" below).

---

## 1. Set up Supabase (free, ~5 minutes)

Supabase gives you the database + secure login for free.

1. Go to https://supabase.com and sign up (free tier).
2. Click **New Project**. Pick any name and a database password (save it
   somewhere — you won't need it day-to-day, but keep it safe).
3. Once the project is created, go to **Project Settings → API**.
4. Copy two values:
   - **Project URL**
   - **anon public** key
5. In this project, copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
6. Paste your values into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### Turn on email confirmation (recommended) or turn it off (fastest for testing)

By default, Supabase requires users to click a confirmation link in their
email before they can log in.

- **For a quick test with friends/family**: Supabase Dashboard → Authentication
  → Providers → Email → turn **off** "Confirm email". Now signup logs people
  in immediately.
- **For the real launch**: keep email confirmation on. The app already
  handles the confirmation link (see `app/auth/confirm/route.ts`).

That's it — no other backend setup needed. Supabase handles password
hashing, sessions, and security for you.

---

## 2. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Click **Create account**, sign up with a real
email, log in, and you'll land on the dashboard.

---

## 3. Deploy for free (so friends/family can use it from anywhere)

1. Push this project to a GitHub repository.
2. Go to https://vercel.com, sign up free, click **Add New → Project**, and
   import your GitHub repo.
3. In Vercel's project settings, add the same three environment variables
   from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` — set this to your real Vercel URL, e.g.
     `https://pulse-yourname.vercel.app`
4. Deploy. Share the Vercel URL with friends and family — they can create
   their own accounts with their own passwords right away.

---

## 4. Project structure

```
app/
  page.tsx              Public landing page
  login/                Login page + server action
  signup/                Signup page + server action
  auth/confirm/          Handles the email confirmation link
  dashboard/            Protected dashboard (redirects to /login if signed out)
components/
  TickerStrip.tsx        Scrolling price ticker
  MarketTabs.tsx         Indian Market / Forex & Gold tab switcher
  InstrumentCard.tsx     Price + support/resistance card
  OiCard.tsx              Options OI, PCR, max pain, expiry
  FiiDiiCard.tsx          FII/DII daily flows table
  NewsList.tsx            News list, filtered per market
  EconCalendar.tsx        High-impact events (NFP, CPI, RBI policy)
lib/
  mock-data.ts            ALL sample data lives here, typed
  supabase/               Supabase client setup (browser, server, middleware)
proxy.ts                  Protects /dashboard, redirects logged-in users away from /login
```

Only `/dashboard` requires login. `/`, `/login`, and `/signup` are public.

---

## 5. Adding real data (next step, once the MVP feels right)

Every card currently reads from `lib/mock-data.ts`. To go live, replace the
body of each function in that file with a real fetch — **the UI components
don't need to change at all**, since they just consume the same typed shape.

Suggested order (easiest → hardest):

1. **FII/DII** — NSE/BSE publish this once daily. Fetch and cache it with a
   daily cron job (e.g. a scheduled Vercel Cron or a GitHub Action) rather
   than fetching on every page load.
2. **NIFTY / BANK NIFTY / SENSEX spot price** — Yahoo Finance (unofficial,
   free) or a paid feed (TrueData, Kite Connect) for reliability.
3. **XAUUSD / forex pairs** — Twelve Data or Alpha Vantage free tiers.
4. **Economic calendar (NFP, CPI)** — TradingEconomics free tier, or scrape
   a public calendar.
5. **Options OI / PCR / max pain** — hardest and most fragile; NSE's option
   chain endpoint is unofficial and rate-limits/blocks aggressively. Budget
   for this last, and consider a paid data vendor once you have real users.

**Important**: if you publish specific support/resistance levels or option
strikes as trading recommendations to the public (especially once there's a
paid tier), that can brush up against SEBI's regulations on investment
advice in India. Keep the current framing — levels as reference information,
with the disclaimer already shown on the dashboard — until you've looked
into whether you need to register as a Research Analyst / Investment
Adviser.

---

## 6. What's next (roadmap ideas)

- Shares/stock watchlists (Phase 3, as you mentioned)
- Push/email/Telegram alerts when price crosses a level
- Per-user saved watchlists (Supabase already gives you a `users` table to
  build on)
- Paid tier — Supabase + Stripe is a common, well-documented combination
