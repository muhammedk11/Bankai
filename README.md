# BANKAI — Anime Merchandise Store

BANKAI is a full-featured front-end e-commerce web app for anime merchandise — figures, posters, clothing, weapons, and accessories from series like *Attack on Titan*, *Demon Slayer*, *Jujutsu Kaisen*, *Bleach*, *Death Note*, *One Piece*, *Naruto*, *Chainsaw Man*, and *Blue Lock*.

Built with **React 19 + Vite**, it implements a complete shopping flow: browsing and filtering products, a persistent cart and wishlist, authenticated checkout with shipping details, order history, and order cancellation with automatic stock restoration. A `json-server` instance acts as a mock REST API during development.

---

## ✨ Features

- **Home page** with animated hero video background
- **Product catalog** — browse all products, view details with multiple product images (front / side / back)
- **Shop by Anime** — filter the catalog by series and by product type
- **Cart** — per-user cart persisted to the backend (quantities, stock-aware)
- **Wishlist** — save products for later, persisted per user
- **Authentication** — register, log in, and log out; protected routes for checkout, orders, and account
- **Checkout** — shipping form with payment method selection (online / cash on delivery)
- **Orders** — order history with statuses (`Placed`, `Cancelled`), cancelling an order restores product stock
- **Account** — view and manage the logged-in profile

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| UI library | [React 19](https://react.dev) |
| Build tool | [Vite 8](https://vite.dev) |
| Routing | [React Router 7](https://reactrouter.com) |
| Server state | [@tanstack/react-query](https://tanstack.com/query) + [Axios](https://axios-http.com) |
| Client state | [Redux Toolkit](https://redux-toolkit.js.org) (auth) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) (via `@tailwindcss/vite` plugin) |
| Mock backend | [json-server](https://github.com/typicode/json-server) backed by `db.json` |
| Linting | ESLint 10 (React Hooks & React Refresh plugins) |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18+ recommended)
- npm (bundled with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Bankai/bankai

# 2. Install dependencies
npm install
```

### Running the App

Two processes are needed: the mock API server and the Vite dev server. Run them in **separate terminals**:

```bash
# Terminal 1 — start the mock REST API on http://localhost:3000
npm run server

# Terminal 2 — start the dev server (usually http://localhost:5173)
npm run dev
```

The front end calls `http://localhost:3000` (the json-server port), so the API must be running before using the app.

### Demo Account

`db.json` ships with seeded users, so you can log in immediately (e.g. `demo@gamil.com` / `qwer4321`) or register a new account from the Register page. Passwords are stored in plain text in `db.json` — this is a mock database for development only, **never** use this pattern in production.

### Production Build

```bash
npm run build    # outputs to dist/
npm run lint     # run ESLint across the project
```

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot module replacement |
| `npm run build` | Build the app for production into `dist/` |
| `npm run lint` | Lint the codebase with ESLint |
| `npm run server` | Start json-server on port **3000** using `db.json` |

## 📁 Project Structure

```
bankai/
├── public/                  # Static assets served as-is
├── src/
│   ├── assets/              # Bundled images and hero videos
│   │   └── videos/          # Hero background videos
│   ├── components/
│   │   └── layout/          # MainLayout, Navbar, Footer
│   ├── hooks/               # Data-layer hooks (React Query)
│   │   ├── useProducts.js   # Fetch & filter products
│   │   ├── useCart.js       # Cart CRUD operations
│   │   └── useWishlist.js   # Wishlist operations
│   ├── pages/               # One component per route
│   │   ├── HomePage.jsx     # Landing page
│   │   ├── Products.jsx     # Full catalog
│   │   ├── ProductDetails.jsx
│   │   ├── ShopByAnime.jsx  # Browse by series
│   │   ├── Cart.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Checkout.jsx
│   │   ├── Orders.jsx
│   │   ├── Account.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── routes/
│   │   └── AuthRoute.jsx    # Route guard (auth required / guest only)
│   ├── services/
│   │   └── api.js           # Axios instance pointed at the API base URL
│   ├── store/               # Redux Toolkit
│   │   ├── store.js         # Store configuration
│   │   └── slices/
│   │       └── authSlice.js # Auth state (setCredentials / logout)
│   ├── App.jsx              # Route table
│   ├── App.css / index.css  # Global styles (Tailwind entry)
│   └── main.jsx             # App bootstrap (providers + router)
├── db.json                  # Mock database (json-server)
├── .env.js                  # API URL config (VITE_API_URL)
├── index.html               # HTML entry point
├── vite.config.js           # Vite config (React + Tailwind plugins)
├── eslint.config.js         # Linting rules
└── package.json
```

## 🗄 Mock API (db.json)

`json-server` exposes the following REST collections from `db.json`:

| Collection | Purpose |
|---|---|
| `users` | Registered accounts (name, email, password) |
| `products` | Catalog items: `name`, `anime`, `type` (figures / posters / clothing / weapons / accessories), `price`, `stock`, `description`, `image`, `images[]` |
| `carts` | One cart per user: `{ userId, items: [{ productId, quantity }] }` |
| `wishlists` | One wishlist per user: `{ userId, productIds[] }` |
| `orders` | Order records: snapshot items, shipping details, total, `status`, `date`, `stockRestored` |

Example endpoints:

```
GET    http://localhost:3000/products
GET    http://localhost:3000/products/1
GET    http://localhost:3000/carts?userId=<id>
POST   http://localhost:3000/orders
PATCH  http://localhost:3000/products/1
```

## 🔐 Routing & Auth Flow

- `AuthRoute` wraps protected pages:
  - **Auth required**: `/checkout`, `/orders`, `/account`
  - **Guest only**: `/login`, `/register`
- On successful login/register, `authSlice.setCredentials` stores the user in the Redux store.
- Logging out dispatches `authSlice.logout` and clears protected state.

### Route Map

| Path | Page | Guard |
|---|---|---|
| `/` | Home | — |
| `/products` | Product catalog | — |
| `/products/:id` | Product details | — |
| `/shop-by-anime` | Browse by series | — |
| `/cart` | Cart | — |
| `/wishlist` | Wishlist | — |
| `/checkout` | Checkout | Auth |
| `/orders` | Order history | Auth |
| `/account` | Account | Auth |
| `/login` | Login | Guest only |
| `/register` | Register | Guest only |

## 🧩 State Management Strategy

- **Server data** (products, cart, wishlist, orders) → React Query hooks in `src/hooks/`, with mutations calling the REST endpoints through the shared Axios instance in `src/services/api.js`.
- **Client state** (current user / auth flag) → Redux Toolkit slice in `src/store/slices/authSlice.js`.

## ⚠️ Known Limitations

- Authentication is mock-level: credentials are checked against the plain-text `users` collection — there is no real session, JWT, or password hashing.
- Orders simulate payment; the `online` payment method does not integrate a real gateway.
- The mock API is for development only and not suitable for production deployment.

## 📄 License

For personal / educational use.
