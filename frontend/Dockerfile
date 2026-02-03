# Stage 1: Build
FROM node:20-alpine as build
WORKDIR /app

# Copiar package.json y lock
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Build de Vite (usa variables de entorno VITE_*)
RUN npm run build

# Stage 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración opcional de Nginx para React SPA
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/react.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

