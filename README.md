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

- **`src/config/site.ts`**: couple names, event date and address, Pix key, receiver name and
  city, WhatsApp number and an optional open-amount card payment link.
- **`src/data/gifts.ts`**: the gift list. The current entries are examples.

Amounts are always stored in cents (`18000` = R$ 180,00).

### Gift kinds

- `simple`: guests pay the full value. Add `cardPaymentUrl` with a payment link for that exact
  amount (Mercado Pago, InfinitePay, PagBank...) to enable the card option.
- `pooled`: expensive items funded in parts. `raisedInCents` drives the progress bar. Set
  `reservedBy` when a guest says they'll buy it outright, and it will show as taken.

Rooms are defined in `src/data/rooms.ts`, and their shapes on the hero floor plan in
`src/features/hero/floorPlanLayout.ts`.

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
  features/       Page sections: hero, how-it-works, gifts, payment, free-contribution
  hooks/          Reusable hooks
  lib/            Framework-free helpers (pix, formatting, dates, whatsapp)
  types/          Domain types
```

## Branching

This repo follows git flow: features branch off `develop`, releases are cut into `main` and
tagged.
