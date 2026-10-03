# Multi-stage Dockerfile for Panda Express Coupons & Admin Server
# Host-agnostic: Runs on Render, Railway, Fly.io, or standard Linux VPS

FROM node:20-alpine AS builder

WORKDIR /app

# Install all production dependencies (including compiler tools for build.js)
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Run static site build so dist/ is fully pre-compiled
RUN node build.js

# Production runner image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install runtime dependencies cleanly
COPY package*.json ./
RUN npm ci

# Copy only necessary runtime directories and compiled files from builder
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/build.js ./build.js
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/dist ./dist

# Set file ownership to non-root node user
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose standard application port
EXPOSE 3000

# Healthcheck on /healthz
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthz || exit 1

# Persistent storage directories: data/ and public/images/uploads/
VOLUME ["/app/data", "/app/public/images/uploads"]

# Start persistent Express/HTTP server
CMD ["node", "server.js"]
