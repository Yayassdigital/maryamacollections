# MARYAMA TURBANS

MARYAMA TURBANS is a full-stack e-commerce platform built for premium turban and headwrap retail. It includes a customer storefront, a role-based admin panel, product variants, multi-image galleries, checkout, coupons, analytics, reviews, and defense-ready project documentation.

## Core stack
- React + Vite
- Express
- MongoDB + Mongoose
- JWT authentication
- Multer uploads

## Main customer features
- Browse, search, filter, and sort products
- Product details with variants and gallery switching
- Cart, wishlist, checkout, and order history
- Reviews and ratings
- Coupons and shipping logic
- Saved addresses and profile editing

## Main admin features
- Dashboard summary cards
- Product management with file uploads and multiple images
- Variant management
- Coupon management
- Order status updates and payment confirmation
- Analytics with charts and insights

## Academic / defense extras
- Project overview page in the app: `/project-overview`
- SVG diagrams inside `client/public/diagrams`
- Markdown documentation inside the `docs` folder

## Project structure
- `client` - React frontend
- `server` - Express backend
- `docs` - project explanation files for defense and deployment

## Setup

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Root helper scripts
From the project root you can also run:

```bash
npm run install-all
npm run dev:server
npm run dev:client
```

## Environment files
This project ships with local `.env` files for a run-ready setup. Adjust them only if your machine uses different ports or a different database connection.

## Admin account
The email below becomes admin automatically after signup:

```text
maryamacollections@gmail.com
```

Create the account once with signup, then log in with the same password.

## Included upgrade batches
- Phase 1: product variants, better product media, smart filters/search/sort
- Phase 2: admin dashboard, order management, payment and shipping layer
- Phase 3: reviews, coupons, profile upgrade
- Phase 4: notifications, business pages, UI polish, security hardening
- Phase 5: premium chart visuals, luxury branding polish, project overview diagrams, defense docs
