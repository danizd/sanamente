# Sanamente

![Captura de pantalla 1](screenshots/screenshot1.png)

Sanamente es una aplicación diseñada para ayudarte a cuidar tu salud mental y bienestar emocional. Permite registrar tu estado de ánimo, emociones, calidad del sueño y pensamientos diarios, ofreciendo una visión de tu progreso a lo largo del tiempo.

## Origen del Proyecto

Esta aplicación fue desarrollada utilizando como base el siguiente repositorio boilerplate:

- [Boilerplate Monorepo: React (Vite) + PocketBase](https://github.com/danizd/base-PocketBase-React-Vite)

---

Este es un boilerplate para crear aplicaciones web con un frontend de React (usando Vite) y un backend de PocketBase.

## Requisitos Previos

- Docker y Docker Compose instalados
- Node.js (v18+) y npm (solo para desarrollo)
- Un sistema operativo compatible (Windows, macOS, Linux)

## Estructura del Proyecto

El proyecto está organizado como un monorepo con las siguientes carpetas:

- `/backend`: Contiene la configuración y los datos de PocketBase.
- `/frontend`: Contiene la aplicación de React (Vite).

## Despliegue con Docker

### 1. Configuración Inicial

1. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd sanamente
   ```

2. Asegúrate de tener Docker y Docker Compose instalados en tu sistema.

### 2. Desplegar la Aplicación

1. Ejecuta el siguiente comando en la raíz del proyecto:
   ```bash
   docker-compose up -d --build
   ```

2. Una vez completado, la aplicación estará disponible en:
   - Frontend: http://localhost
   - Backend (PocketBase): http://localhost:8090

### 3. Detener la Aplicación

Para detener los contenedores:
```bash
docker-compose down
```

### 4. Ver Logs

Para ver los logs de los contenedores:
```bash
docker-compose logs -f
```

## Configuración y Ejecución (Desarrollo)

### 1. Backend (PocketBase)

PocketBase es un backend de código abierto en un solo archivo ejecutable.

![Captura de pantalla 4](screenshots/screenshot4.png)


1.  **Descargar PocketBase:**
   - Ve a la [página de descargas de PocketBase](https://pocketbase.io/docs/).
   - Descarga el archivo zip para tu sistema operativo.

2.  **Configurar el Backend:**
   - Crea una carpeta `backend` en la raíz del proyecto.
   - Extrae el contenido del zip descargado dentro de la carpeta `backend`.
   - Deberías tener una estructura similar a:
     ```
     .
     ├── backend/
      │   ├── pocketbase
      │   └── ... (otros archivos de PocketBase)
      └── ...
     ```

3.  **Iniciar el Backend:**
    - Abre una terminal y navega a la carpeta `backend`.
    - Ejecuta el siguiente comando para iniciar el servidor de PocketBase:
     ```bash
     ./pocketbase serve
     ```
    - El servidor se iniciará en `http://127.0.0.1:8090` por defecto.
    - La primera vez, se generará un enlace de instalación que se abrirá automáticamente en el navegador para configurar tu primera cuenta de superusuario (también puedes crearla manualmente mediante ./pocketbase superuser create EMAIL PASS).
    - Credenciales iciales de acceso a pocketbase:
    Usuario: admin@admin.es
    Contraseña: adminadmin

    - Cambia las credenciales predeterminadas de PocketBase inmediatamente después del primer inicio.

4.  **Crear la Colección de Usuarios:**
    - Abre `http://127.0.0.1:8090/_/` en tu navegador para acceder al panel de administración.
    - Crea tu primera cuenta de administrador.
    - Ve a la sección "Collections".
    - La colección `users` ya existe por defecto y está lista para ser usada.

## Copia de Seguridad de Colecciones

Se incluye una copia de seguridad de las colecciones de PocketBase en el directorio `backend/backup_colecciones/`."

### 2. Frontend (React + Vite)

![Captura de pantalla 2](screenshots/screenshot2.png)

![Captura de pantalla 3](screenshots/screenshot3.png)


1.  **Navegar al Frontend:**
   ```bash
   cd frontend
    ```

2.  **Instalar Dependencias:**
    ```bash
   npm install
   ```

3.  **Configurar Variables de Entorno:**
    - Crea un archivo `.env.local` en la raíz de la carpeta `frontend`.
    - Añade la URL de tu backend de PocketBase:
      ```
      VITE_POCKETBASE_URL=http://127.0.0.1:8090
      ```

4.  **Iniciar el Frontend:**
   ```bash
   npm run dev
   ```
    - La aplicación estará disponible en `http://127.0.0.1:5173`.

## Scripts Disponibles

Dentro de la carpeta `frontend`, puedes ejecutar los siguientes scripts:

- `npm run dev`: Inicia el servidor de desarrollo de Vite.
- `npm run build`: Compila la aplicación para producción.
- `npm run preview`: Sirve la aplicación compilada localmente.
- `npm test`: Ejecuta los tests unitarios con Vitest.

## Estructura del Frontend

El frontend sigue una estructura de carpetas por funcionalidad:

- `src/components`: Componentes de React reutilizables.
- `src/contexts`: Contextos de React para el manejo de estado global.
- `src/hooks`: Hooks de React personalizados.
- `src/pages`: Componentes que representan las páginas de la aplicación.
- `src/lib`: Clientes o servicios para interactuar con APIs externas.



