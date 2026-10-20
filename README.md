# Chá de casa nova

Housewarming gift list where guests contribute with Pix or card instead of buying the items
themselves. No duplicate gifts, and the money for small items helps fund the bigger ones.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Vitest for unit tests
- `qrcode` to render the Pix QR code

## Getting started

```bash
npm install
npm run dev
```

| Script            | What it does                   |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start the dev server           |
| `npm run build`   | Type-check and build to `dist` |
| `npm run preview` | Serve the production build     |
| `npm test`        | Run unit tests                 |
| `npm run lint`    | Lint with oxlint               |
| `npm run format`  | Format with Prettier           |

## Customizing

Everything personal lives in two files:

- **`src/config/site.ts`**: couple names, party date, time and address, how many days before
  the party guests can confirm presence, Pix key, WhatsApp number and an optional open-amount
  card payment link.
- **`src/data/gifts.ts`**: the gift list.
- **`src/data/palette.ts`** and **`src/data/materials.ts`**: the house colors and the materials
  shown in the food-safe note.

Amounts are always stored in cents (`18000` = R$ 180,00).

### Gift kinds

- `simple`: guests pay the full value. Add `cardPaymentUrl` with a payment link for that exact
  amount (Mercado Pago, InfinitePay, PagBank...) to enable the card option.
- `pooled`: expensive items funded in parts. `raisedInCents` drives the progress bar. Set
  `reservedBy` when a guest says they'll buy it outright, and it will show as taken.

Every gift can also have `productUrl` and `imageUrl`.

### Cart

Guests add gifts to a cart (kept in their browser's local storage). The cart shows the total and
generates a single Pix code for it, plus a "Comprar os itens" tab with each product link and a
WhatsApp shortcut so the guest can ask you to mark those items as reserved. Shared gifts ask for
an amount before going into the cart.

Rooms are defined in `src/data/rooms.ts`.

### Presence confirmation

Guests confirm who is coming (one full name per person) until `rsvpDaysBefore` days before
`event.date`, so the list can go to the doorman. The page remembers on each device that the
guest already confirmed.

## Database and admin panel

Gifts and presence confirmations are stored in [Supabase](https://supabase.com) (free plan).
Guests only call two database functions, `register_gift` and `register_rsvp`; reading the data
requires signing in as an admin. The admin panel lives at `#/admin`, e.g.
`https://<user>.github.io/<repo>/#/admin`.

Without the Supabase variables the invitation still works, it just doesn't store anything.

### Setup

1. Create a project at supabase.com.
2. In **SQL Editor**, run every file in `supabase/migrations`, in name order.
3. In **Authentication > Users > Add user**, create your admin user (email and password, with
   "Auto Confirm User" checked). Then run `supabase/make-admin.sql` with that email.
4. Optional but recommended: in **Authentication > Sign In / Providers**, turn off
   "Allow new users to sign up".
5. In **Project Settings > API**, copy the project URL and the anon (or publishable) key.
6. In the GitHub repository, go to **Settings > Secrets and variables > Actions > Variables** and
   create `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with those values.
7. Push to `main`. For local development, copy `.env.example` to `.env.local`.

Free Supabase projects pause after a week without any requests; open the dashboard to resume.

### Database tests

`npm run test:db` runs the migrations and their checks against a throwaway database on a local
Postgres (set `PGHOST`, `PGPORT` and `PGUSER`). CI runs them on every pull request.

## How Pix works here

The Pix "copia e cola" code is generated locally (`src/lib/pix/brCode.ts`) following the BR Code
spec, with the amount and item name already filled in. There is no API, account or fee involved:
the money goes straight to the configured key.

## Project structure

```
src/
  app/            App shell
  components/     Shared UI (Button, Dialog, Container...) and layout
  config/         Site configuration
  data/           Rooms, gifts and selectors
  features/       Page sections: hero, how-it-works, gifts, payment, free-contribution,
                  palette, materials, cart, registry (gift records), rsvp, admin
  hooks/          Reusable hooks
  lib/            Framework-free helpers (pix, formatting, dates, whatsapp)
  types/          Domain types
supabase/
  migrations/     Database schema, access rules and functions
  tests/          Database checks run by `npm run test:db`
```

## Branching

This repo follows git flow: features branch off `develop`, releases are cut into `main` and
tagged.

## Deploy

Pushing to `main` deploys the site to GitHub Pages through `.github/workflows/deploy.yml`.
The first time, enable it in the repository settings: **Settings → Pages → Build and deployment →
Source: GitHub Actions**. The site is then served at `https://<user>.github.io/<repo>/`.
