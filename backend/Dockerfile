# Usa una imagen base ligera de Ubuntu para servidores x86_64/amd64
FROM ubuntu:22.04

# Instala dependencias necesarias
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /pb

# Copia el ejecutable de PocketBase
COPY pocketbase .
RUN chmod +x ./pocketbase

# Copia tus datos y migraciones
COPY pb_data ./pb_data
COPY pb_migrations ./pb_migrations

# Expone el puerto por defecto de PocketBase
EXPOSE 8090

# Comando para iniciar PocketBase
ENTRYPOINT ["./pocketbase", "serve", "--http=0.0.0.0:8090", "--dir", "./pb_data"]
