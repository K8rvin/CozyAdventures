FROM node:22-bookworm AS build

WORKDIR /app
COPY game/package.json game/package-lock.json game/
RUN npm ci --prefix game
COPY game/ game/
RUN npm run build --prefix game

FROM node:22-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pil \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY game/package.json game/package-lock.json game/
RUN npm ci --omit=dev --prefix game \
  && npm cache clean --force
COPY . .
COPY --from=build /app/game/bundle.js game/bundle.js

ENV NODE_ENV=production \
    PORT=10000 \
    KNIGHT_CACHE_DIR=/var/data/knight

CMD ["node", "game/tools/knight-server.mjs"]
