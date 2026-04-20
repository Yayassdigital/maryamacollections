FROM node:20.12.2-slim

WORKDIR /app

COPY server/package*.json ./

RUN npm config delete proxy || true \
 && npm config delete https-proxy || true \
 && npm config set registry https://registry.npmjs.org/ \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm install --omit=dev --no-audit --no-fund

COPY server/ ./

ENV NODE_ENV=production
EXPOSE 10000

CMD ["node", "src/server.js"]