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
  the party guests can confirm presence, Pix key, WhatsApp number and the InfinitePay handle
  for card payments.
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
generates a single Pix code for it, plus a "Comprar os itens" tab with each product link. Shared
gifts ask for an amount before going into the cart.

When guests confirm a gift they sign it with one or more names and can write a letter to the
couple. Everything is stored in the database and shows up in the admin panel (Presentes and
Cartinhas tabs), so nothing goes through WhatsApp. WhatsApp only appears as a fallback when the
database isn't configured.

Rooms are defined in `src/data/rooms.ts`.

### Card payments

Card payments go through an [InfinitePay](https://www.infinitepay.io) checkout created for the
exact amount of the cart. Set `infinitePayHandle` in `src/config/site.ts` to the account's
InfiniteTag (without `$`) and enable "Checkout externo" in the InfinitePay app. The guest pays on
InfinitePay's page and comes back to the site, which asks for their names and stores the
receipt link with the gift. With the handle empty, the card tab is hidden.

### Receipts

When confirming a Pix, guests can attach the receipt (image or PDF, up to 5 MB). Files go to the
private `receipts` bucket: guests can only upload, and admins open them from the panel.
Pix and card amounts both count towards the progress bar of shared gifts as soon as they are
registered; cancelling a record in the admin panel takes its amount out.

### Presence confirmation

Guests confirm who is coming (one full name per person) until `rsvpDaysBefore` days before
`event.date`, so the list can go to the doorman. The page remembers on each device that the
guest already confirmed.

## Database and admin panel

Gifts and presence confirmations are stored in [Supabase](https://supabase.com) (free plan).
Guests only call database functions (`register_gift`, `add_gift_letter` and `register_rsvp`) and
upload receipts. The admin panel has no login: it opens with a private link that carries a secret
key, `https://<user>.github.io/<repo>/#/admin?chave=<key>`. The database keeps only a hash of the
key and every admin function checks it. The device remembers the key, so `#/admin` alone works
there afterwards.

Without the Supabase variables the invitation still works, it just doesn't store anything.

### Setup

1. Create a project at supabase.com.
2. In **SQL Editor**, run every file in `supabase/migrations`, in name order.
3. Pick a long random key and run `supabase/make-admin-link.sql` with it. Keep the admin link
   private.
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
