# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build .
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]