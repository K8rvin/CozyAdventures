FROM node:22-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pil \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

ENV NODE_ENV=production \
    PORT=10000 \
    KNIGHT_CACHE_DIR=/var/data/knight

CMD ["node", "game/tools/knight-server.mjs"]
