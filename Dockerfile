# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS runner
WORKDIR /app/backend

# Set environment to production
ENV NODE_ENV=production

# Copy package files and install only production dependencies
COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled backend code
COPY --from=backend-builder /app/backend/dist ./dist

# Copy compiled frontend code to the expected location
# server.ts uses path.join(__dirname, '../../frontend/dist')
# With backend at /app/backend/dist, ../../frontend/dist resolves to /app/frontend/dist
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose port
EXPOSE 3001
ENV PORT=3001

# Run the application (using node directly instead of npm for better signal handling)
CMD ["node", "dist/server.js"]
