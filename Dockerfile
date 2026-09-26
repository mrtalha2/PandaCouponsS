# Multi-stage Dockerfile for Panda Express Coupons & Admin Server
# Host-agnostic: Runs on Render, Railway, Fly.io, or standard Linux VPS

FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies required for build.js)
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Run static site build so dist/ is fully pre-compiled
RUN node build.js

# Production runner image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy application and pre-compiled assets from builder
COPY --from=builder /app /app

# Expose standard application port
EXPOSE 3000

# Persistent storage directories: data/ and public/images/uploads/
VOLUME ["/app/data", "/app/public/images/uploads"]

# Start persistent Express/HTTP server
CMD ["node", "server.js"]
