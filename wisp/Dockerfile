# BW Nexus Wisp server — for hosts that deploy from a Dockerfile.
FROM node:20-slim

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY server.mjs ./

ENV NODE_ENV=production
ENV PORT=5001
EXPOSE 5001

CMD ["node", "server.mjs"]
