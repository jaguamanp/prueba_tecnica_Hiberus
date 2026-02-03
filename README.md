# Prueba técnica

Este proyecto es una aplicación web de ejemplo que combina **Symfony (backend) + React (frontend) + MySQL (base de datos)**.  

- Backend: Symfony 6 + PHP-FPM  
- Frontend: React + Nginx  
- Base de datos: MySQL 8.0  
- Docker Compose para levantar todo el entorno de desarrollo/producción localmente.

---

## Estructura del proyecto

```
├── backend/                # Código fuente de Symfony
│   ├── public/             # Archivos públicos
│   └── nginx/symfony.conf  # Configuración de Nginx para Symfony
├── frontend/               # Código fuente de React
│   └── nginx/react.conf    # Configuración de Nginx para React
├── DB/                     # Scripts de inicialización de MySQL
│   └── init.sql            # Creación de tablas + inserts de productos
├── docker-compose.yml      # Docker Compose para levantar todo
└── README.md
└── coleccion_postman_v1.json
```

---

## Requisitos previos

- Docker >= 20  
- Docker Compose >= 2  
- Acceso a internet para descargar imágenes de Docker Hub  

> Opcional: Symfony CLI si quieres ejecutar comandos locales de Symfony.

---

## Levantar el proyecto con Docker

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/jaguamanp/prueba_tecnica_Hiberus.git
cd prueba_tecnica_Hiberus
```

### 2️⃣ Construir imágenes locales (opcional)

```bash
# Backend Symfony
docker build -t jaguamanp96/symfony_backend:1.0.0 ./backend

# Frontend React
docker build -t jaguamanp96/react_frontend:1.0.0 ./frontend
```

### 3️⃣ Levantar los contenedores

> **Importante:** Si quieres ejecutar los scripts SQL de `DB/init.sql`, elimina primero el volumen de la base de datos:

```bash
docker-compose down -v
docker-compose up -d
```

- `-v` elimina el volumen `db_data` para que MySQL ejecute los scripts de inicialización.  

### 4️⃣ Verificar que los servicios están corriendo

```bash
docker ps
```

Deberías ver:

- `app_mysql` → MySQL
- `symfony_backend` → PHP-FPM
- `nginx_symfony` → Nginx para Symfony
- `react_frontend` → React + Nginx

---

## URLs de acceso

| Servicio               | URL                        |
|------------------------|----------------------------|
| Frontend React         | http://localhost:3000      |
| Backend Symfony + Nginx| http://localhost:8001      |
| MySQL (desde host)     | localhost:3306             |

---

## Acceso a la base de datos

```bash
docker exec -it app_mysql mysql -u app_user -p app_db
# Contraseña: secret
```

- Las tablas `products`, `orders` y `order_items` se crean automáticamente con `DB/init.sql`.  
- También se insertan productos de ejemplo listos para pruebas.

---

## Comandos útiles

- Ver logs de un contenedor:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx_backend
docker-compose logs -f db
```

- Detener todos los contenedores:

```bash
docker-compose down
```

- Reiniciar y reconstruir imágenes (si cambias código):

```bash
docker-compose up -d --build
```

##  Pruebas unitarias (PHPUnit)
Ejecutar pruebas en local
```bash
cd backend
composer install
php bin/phpunit
```


## Colección de Postman

Archivo: coleccion_postman_v1.json

- Abrir Postman → Import → File → coleccion_postman_v1.json

Configurar variable base_url como http://localhost:8001

Endpoints principales:

- GET /products → Listar productos

- GET /products/{id} → Obtener producto por ID

- POST /orders → Crear una orden

- GET /orders/{id} → Consultar orden por ID

---

## Estructura de la base de datos

- **products**: tabla de productos con nombre, descripción, precio, stock, categoría e imagen.  
- **orders**: tabla de pedidos con datos de cliente, subtotal, impuestos, envío y estado.  
- **order_items**: tabla de items de cada pedido, con cantidad y precio unitario.  

---

## Notas

- Para desarrollo, los volúmenes permiten que los cambios en `backend` y `frontend` se reflejen sin reconstruir la imagen.  
- Para producción, se recomienda usar solo las imágenes de Docker Hub y eliminar los volúmenes de código.

---

## Autor

Proyecto creado por **José Guamán P**  
Correo: `arturoguaman95@gmail.com`  
Repositorio Docker Hub: `jaguamanp96/symfony_backend` y `jaguamanp96/react_frontend`

