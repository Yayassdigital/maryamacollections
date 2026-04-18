# Deployment Guide

## Local development
- Run MongoDB locally or use MongoDB Atlas
- Start backend with `npm run dev` inside `server`
- Start frontend with `npm run dev` inside `client`

## Production notes
- Move uploads to cloud object storage for scale
- Replace `.env` values with secure production secrets
- Put the frontend behind a static host or reverse proxy
- Put the backend behind HTTPS and environment-based CORS settings
