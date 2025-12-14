# -------------------------
# Build stage
# -------------------------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------------------------
# Production stage
# -------------------------
FROM nginx:stable-alpine

# Remove config default do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar build do Vite para o nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Config nginx simples
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]