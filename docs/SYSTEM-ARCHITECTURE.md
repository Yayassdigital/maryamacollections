# System Architecture

MARYAMA TURBANS uses a React + Vite frontend, an Express backend API, and MongoDB for persistence.

## Main layers
- Client: product browsing, cart, checkout, account, admin views
- API: authentication, product management, orders, coupons, analytics
- Database: users, products, orders, coupons
- Upload storage: product gallery images saved under `server/uploads`

## Request flow
1. User interacts with the frontend.
2. Frontend sends HTTP requests to the Express API.
3. The API validates the request and checks JWT auth when needed.
4. MongoDB stores and returns the required data.
5. The frontend renders the result back to the user or admin.
