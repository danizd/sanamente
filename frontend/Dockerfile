# --- Etapa de Construcción ---
FROM --platform=linux/arm64 node:20-alpine as builder

WORKDIR /app

# Copia package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Asegura permisos de ejecución para Vite
RUN chmod +x /app/node_modules/.bin/vite

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build

# --- Etapa de Ejecución ---
FROM --platform=linux/arm64 nginx:stable-alpine

# Copia la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos construidos desde la etapa 'builder'
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
