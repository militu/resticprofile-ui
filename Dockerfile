# Use the official Node.js 20 image as a parent image
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# Install dependencies
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
COPY .env .env
# Generate Prisma client
RUN npx prisma generate
# Build the Next.js app
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown node:node .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Copy Prisma schema and migrations
COPY --from=builder /app/prisma ./prisma

# Install production dependencies including Prisma
RUN npm install --production
RUN npm install prisma @prisma/client

# Generate Prisma client
RUN npx prisma generate

# Add prisma CLI to PATH
ENV PATH=/app/node_modules/.bin:$PATH

USER node

EXPOSE 3000

ENV PORT=3000
ENV DATABASE_URL=file:/app/data/dev.db

# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# Use the custom script from package.json
CMD ["npm", "run", "start:migrate:prod"]