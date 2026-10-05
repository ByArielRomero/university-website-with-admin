# Documentación Técnica Completa: Proyecto Universitario

Esta guía cubre todo lo necesario para entender, desarrollar, desplegar y mantener el sitio web institucional con panel de administración.

---

## 1. Stack Tecnológico

La aplicación está construida sobre una arquitectura moderna y escalable:

### Frontend & Backend (Next.js)

* **Framework:** [Next.js 14+](https://nextjs.org/) (App Router, Server Actions).
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) para tipado estático robusto.
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/) + Animaciones CSS nativas.
* **UI:** Componentes reutilizables, iconos Lucide React.

### Base de Datos & ORM

* **ORM:** [Prisma](https://www.prisma.io/).
* **Motor DB:**
  * *Desarrollo:* SQLite (por defecto para facilidad).
  * *Producción:* MySQL o PostgreSQL (recomendado para VPS).

### Autenticación

* **Librería:** [NextAuth.js v4](https://next-auth.js.org/).
* **Estrategia:** Credenciales (Usuario/Contraseña) con JWT.
* **Seguridad:** Passwords hasheadas con `bcrypt`.

---

## 2. Estructura del Proyecto

```bash
/
├── app/                        # Rutas y Vistas (App Router)
│   ├── admin/                  # Login y Dashboard protegido
│   ├── api/                    # Endpoints Backend (Rest API)
│   ├── globals.css             # Estilos globales y animaciones
│   ├── layout.tsx              # Layout raíz (HTML, SEO base)
│   └── page.tsx                # Landing Page Pública
├── components/                 # Componentes UI reutilizables
├── lib/                        # Lógica de negocio (Auth, DB, Utils)
├── prisma/                     # Esquema de Base de Datos
├── public/                     # Assets estáticos (Imágenes)
├── .env                        # Variables de entorno (Sensible)
├── Dockerfile                  # Configuración para Docker
├── docker-compose.yml          # Orquestación de contenedores
└── next.config.mjs             # Configuración del servidor Next.js
```

---

## 3. Guía de Desarrollo (Local)

### Requisitos

* Node.js 18+
* Git

### Pasos

1. **Instalar dependencias:**

    ```bash
    npm install
    ```

2. **Configurar Entorno:**
    Crea un archivo `.env` en la raíz:

    ```env
    DATABASE_URL="file:./dev.db"  # Para SQLite local
    NEXTAUTH_SECRET="secreto_desarrollo_123"
    NEXTAUTH_URL="http://localhost:3000"
    ```

3. **Iniciar Base de Datos:**

    ```bash
    npx prisma db push
    ```

4. **Correr Servidor:**

    ```bash
    npm run dev
    ```

    Accede a `http://localhost:3000`.

---

## 4. Gestión de Base de Datos

El esquema se encuentra en `prisma/schema.prisma`.

* **Aplicar cambios al esquema:**

    ```bash
    npx prisma db push
    ```

* **Ver/Editar datos visualmente:**

    ```bash
    npx prisma studio
    ```

* **Generar cliente (tras `npm install`):**

    ```bash
    npx prisma generate
    ```

---

## 5. Control de Versiones con Git & GitHub

Para trabajar de manera profesional y colaborativa, sigue este flujo:

### Ramas (Branches)

* **`main`**: Código de producción. **NUNCA** subir cambios directos aquí.
* **`deploy`**: (Opcional) Rama específica que dispara el deploy automático si usas CI/CD.
* **`dev`** o **`develop`**: Rama principal de desarrollo donde se integran las nuevas funciones.
* **`feature/nombre-funcion`**: Ramas temporales para trabajar en algo específico (ej: `feature/nueva-galeria`).

### Flujo de Trabajo

1. **Crear una rama para tu tarea:**

    ```bash
    git checkout -b feature/mi-cambio
    ```

2. **Hacer cambios y guardar:**

    ```bash
    git add .
    git commit -m "feat: agrego nueva seccion de galeria"
    ```

3. **Subir a GitHub:**

    ```bash
    git push origin feature/mi-cambio
    ```

4. **Crear Pull Request (PR):** En GitHub, abre un PR de tu rama hacia `main` (o `develop`). Revisa el código y fusiona (Merge).

---

## 6. Dockerización (Contenedores)

El proyecto incluye configuración lista para Docker, ideal para VPS o despliegues escalables.

### Archivos Clave

* **`Dockerfile`**: Construye una imagen optimizada de producción (Standalone mode).
* **`docker-compose.yml`**: Levanta la App + Base de Datos MySQL automáticamente.

### Cómo usar Docker

1. **Construir y Correr:**

    ```bash
    docker-compose up --build -d
    ```

    Esto levantará la app en el puerto `3000` y una base de datos MySQL en el `3306`.

2. **Ver Logs:**

    ```bash
    docker-compose logs -f
    ```

3. **Detener:**

    ```bash
    docker-compose down
    ```

---

## 7. Despliegue en Producción (VPS - Hostinger/DigitalOcean)

Esta es la guía para llevar tu proyecto "de 10" a un servidor VPS con **Ubuntu 20.04/22.04**.

### Paso 1: Preparar el VPS

Accede por SSH a tu servidor:

```bash
ssh root@tu_ip_vps
```

### Paso 2: Opción A - Despliegue con Node.js & PM2 (Recomendado para rendimiento nativo)

1. **Instalar Node.js 18+:**

    ```bash
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

2. **Instalar PM2 (Gestor de Procesos):**

    ```bash
    sudo npm install -g pm2
    ```

3. **Clonar tu Repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/tu-repo.git
    cd tu-repo
    ```

4. **Configurar Variables:**
    Crea el `.env` de producción:

    ```bash
    nano .env
    ```

    *Contenido ejemplo:*

    ```env
    DATABASE_URL="mysql://usuario:password@localhost:3306/nombre_db" # Usa la DB de tu hosting
    NEXTAUTH_SECRET="clave_super_secreta_prod_2026"
    NEXTAUTH_URL="https://tudominio.com"
    ```

5. **Instalar y Construir:**

    ```bash
    npm install
    npx prisma generate
    npm run build
    ```

6. **Iniciar con PM2:**

    ```bash
    pm2 start npm --name "university-web" -- start
    pm2 save
    pm2 startup
    ```

### Paso 3: Configurar Dominio y HTTPS (Nginx)

1. **Apuntar Dominio:** En tu registrador de dominio (Godaddy, Namecheap, Hostinger), crea un registro **A** que apunte a la **IP de tu VPS**.

2. **Instalar Nginx:**

    ```bash
    sudo apt update
    sudo apt install nginx
    ```

3. **Configurar Proxy Inverso:**
    Edita el sitio default:

    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```

    Reemplaza `location /` con:

    ```nginx
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:3000; # Apunta a tu app Next.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    ```

    Guarda y reinicia Nginx: `sudo systemctl restart nginx`.

4. **Certificado SSL (HTTPS) Gratis:**
    Usa Certbot para activar el candadito seguro automáticamente:

    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d tudominio.com -d www.tudominio.com
    ```

¡Listo! Tu aplicación estará corriendo en `https://tudominio.com` de manera segura y profesional.

---

## 8. Guía de Aprendizaje (Roadmap)

Para dominar este proyecto y poder extenderlo con confianza, te recomendamos estudiar los siguientes temas en orden:

### 1. Fundamentos (HTML, CSS, JS)

* **JavaScript Moderno (ES6+):** Entender `arrow functions`, `destructuring`, `async/await`, `map/filter/reduce` y Módulos (import/export).
* **CSS Flexbox & Grid:** Vital para entender cómo se posicionan los elementos.

### 2. React.js (Librería de UI)

* **Componentes:** Cómo crear y reutilizar piezas de UI.
* **Props:** Cómo pasar datos de un componente padre a un hijo.
* **Hooks:**
  * `useState`: Manejo de estado local (ej: abrir/cerrar menú).
  * `useEffect`: Ejecutar código secundario (ej: fetch de datos, scroll listener).
* **JSX:** La sintaxis que mezcla HTML con JS.

### 3. TypeScript (JS con Tipos)

* **Tipado Básico:** `string`, `number`, `boolean`.
* **Interfaces:** Definir la forma de un objeto (ej: `interface Carrera { id: number, nombre: string }`). Esto evita miles de errores tontos.

### 4. Next.js (El Framework)

* **App Router:** Entender la estructura de carpetas (`app/page.tsx`, `app/admin/page.tsx`).
* **Server Components vs Client Components:**
  * *Server (por defecto):* Se renderizan en el servidor, acceden a BD, no tienen interactividad (clicks).
  * *Client (`"use client"`):* Tienen interactividad (`onClick`, `useState`), se ejecutan en el navegador.

### 5. Backend y Base de Datos

* **Prisma ORM:** Aprender a definir modelos en `schema.prisma` y hacer consultas simples (`findMany`, `create`, `update`, `delete`).
* **API Routes:** Cómo crear endpoints en `app/api/...` para conectar el frontend con la base de datos.
