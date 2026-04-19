# Stage 1: Build the Vite Application
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package dependencies first to leverage Docker cache
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app to generate static files in the /dist folder
RUN npm run build

# Stage 2: Production Server Setup
FROM nginx:alpine

# Copy custom Nginx configuration to enable React Router navigation
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 to the outside
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
