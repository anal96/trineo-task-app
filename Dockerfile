# Multi-stage build for Trineo Tasks App

# Stage 1: Build the React frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Production server
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built frontend from builder
COPY --from=builder /app/dist ./dist

# Copy server files
COPY server ./server

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "server/index.js"]

