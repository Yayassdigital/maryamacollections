FROM node:20.12.2-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config delete proxy || true \
 && npm config delete https-proxy || true \
 && npm config set registry https://registry.npmjs.org/ \
 && npm ci --omit=dev --no-audit --no-fund

COPY . .

ENV NODE_ENV=production

EXPOSE 10000

CMD ["node", "src/server.js"]