# syntax=docker.io/docker/dockerfile:1
# Base image for Node.js
FROM node:18-alpine AS base
WORKDIR /app
# Install dependencies
FROM base AS deps
# Add libc6-compat if needed for compatibility
RUN apk add --no-cache libc6-compat
# Copy only the package.json and lock file for npm
COPY package.json package-lock.json ./
# Install dependencies using npm
RUN npm ci --legacy-peer-deps
# Build the application
FROM base AS builder
WORKDIR /app
# Copy installed dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the project files
COPY . .
# Run the build command
RUN npm run build
# Create a production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Add a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Copy only the necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Set ownership to the non-root user
USER nextjs
# Expose the application port
EXPOSE 3000
ENV PORT=3000
# Start the server
CMD ["node", "server.js"]