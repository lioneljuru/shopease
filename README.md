# ShopEase

Mobile-first e-commerce demo built from a Figma design. Fast product discovery, a short checkout flow, and clear order tracking — all client-side, ready to deploy on Vercel.

## Features

- Login / register (simulated auth, persisted in the browser)
- Home, category browse, and search with sort
- Product detail with sizes, quantity, and add to cart
- Cart with promo code support (`SHOPEASE10` for 10% off)
- Two-step checkout (address → card or pay on delivery)
- Order confirmation and order history with tracking timeline
- Profile with session user info and logout
- Cart, orders, and session persist across page reloads via `localStorage`

Payment is simulated — no real charges are made.

## Tech stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router
- pnpm

## Getting started

```bash
pnpm install
pnpm dev
```

The app runs on port `8443` by default (or `$PORT` if set).

### Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `pnpm dev`      | Start the Vite dev server |
| `pnpm build`    | Production build → `dist` |
| `pnpm preview`  | Preview the production build |
| `pnpm format`   | Format with oxfmt        |

## Project structure

```
src/
  components/     # Shared UI (BottomNav, ProductCard, StarRating)
  data/           # Mock product catalog
  lib/            # localStorage helpers
  screens/        # Full-page screens
  store/          # ShopContext (cart, orders, session)
  App.tsx         # Routes + phone-frame shell
  main.tsx        # Entry point
  types.ts        # Shared types
```

## Demo tips

1. Create an account or log in with any valid email and a password of at least 6 characters.
2. Browse categories or search, open a product, add it to your bag.
3. Checkout with a shipping address; use card details (any 16-digit number works in demo) or Pay on Delivery.
4. Track the order under **Orders** — it survives a refresh.
5. Optional promo: `SHOPEASE10`.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Use these settings:
   - **Framework preset:** Vite
   - **Build command:** `pnpm build`
   - **Output directory:** `dist`
4. Deploy.

`vercel.json` already rewrites all routes to `index.html` so client-side navigation works on deep links.

## License

Private project — all rights reserved.
