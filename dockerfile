FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
# This is crucial so the build step has the client ready
RUN npx prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the entire public directory
COPY --from=builder /app/public ./public

# Copy the built .next folder (Standard mode requires the whole thing)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy node_modules (Dependencies are needed for npm start)
# Note: For strict optimization, you could use a separate 'production-deps' stage here,
# but copying from builder is safer for consistency in standard mode.
COPY --from=builder /app/node_modules ./node_modules

# Copy package.json and Prisma schema (for migrations inside container)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
