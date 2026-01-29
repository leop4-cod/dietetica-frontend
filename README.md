# Nutrivida - Frontend

Frontend en React + Vite + TypeScript con Material UI (MUI) que consume la API REST de Nutrivida (NestJS).

## Requisitos
- Node.js 18+
- Backend corriendo en la URL configurada en `VITE_API_URL`

## Instalación
```bash
npm install
```

## Configuración de entorno
Crear `.env` en la raíz del proyecto:
```bash
VITE_API_URL=http://localhost:3000
```

## Seed de datos (backend)
Para que el frontend se vea con datos reales, ejecuta el seed del backend:
```bash
cd D:\dietetica-backend
npm install
npm run seed
```

Credenciales de prueba creadas por el seed:
- Admin: `admin@nutrivida.local` / `admin123`
- Cliente: `cliente@nutrivida.local` / `cliente123`

## Comandos
```bash
npm run dev
npm run build
npm run preview
```

## Autenticación
- Login por perfil (cliente/admin) desde el botón "Iniciar sesión".
- Pantallas de login:
  - `/login/cliente`
  - `/login/admin`
- El token se guarda en `localStorage` (`token`) y el usuario en `user`.
- Interceptor Axios agrega `Authorization: Bearer <token>`.
- 401 => logout automático y redirección a `/login/admin` o `/login/cliente` según la ruta.
- Si el login no trae rol, el frontend consulta `GET /users/:id` para completar el perfil.

## Roles (backend real)
- `admin` => **ADMIN** (ver/crear/editar/eliminar)
- `empleado` => **EMPLEADO** (ver/crear/editar/cambiar estado)
- `cliente` => **CLIENTE** (acceso a compras, reseñas y planes)

## Rutas principales
### Público
- `/` Inicio
- `/catalogo` Catálogo público
- `/producto/:id` Detalle público
- `/contacto` Contacto
- `/registro` Registro de clientes

### Cliente
- `/app/cliente` Dashboard
- `/app/cliente/catalogo`
- `/app/cliente/producto/:id`
- `/app/cliente/carrito`
- `/app/cliente/mis-compras`
- `/app/cliente/perfil`
- `/app/cliente/direcciones`
- `/app/cliente/resenas`
- `/app/cliente/planes`
- `/app/cliente/citas`

### Admin
- `/app/admin/dashboard`
- `/app/admin/productos` (listado)
- `/app/admin/productos/new` (nuevo)
- `/app/admin/productos/:id` (detalle)
- `/app/admin/productos/:id/edit` (editar)
- `/app/admin/categorias` (listado)
- `/app/admin/categorias/new` (nuevo)
- `/app/admin/categorias/:id` (detalle)
- `/app/admin/categorias/:id/edit` (editar)
- `/app/admin/planes`
- `/app/admin/ventas`
- `/app/admin/inventario`
- `/app/admin/cupones`
- `/app/admin/proveedores`
- `/app/admin/usuarios`
- `/app/admin/auth-logs`

## Endpoints consumidos (backend real)
### Auth
- `POST /auth/login`
- `POST /auth/register`

### Usuarios
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

### Categorías
- `GET /categories`
- `GET /categories/:id`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

### Productos
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

### Planes nutricionales
- `GET /nutrition-plans` (requiere JWT)

### Reseñas
- `GET /reviews`
- `POST /reviews` (requiere JWT)

### Cliente / Ventas
- `GET /cart`, `POST /cart`, `DELETE /cart/:productId`
- `GET /sales`, `POST /sales`, `PUT /sales/:id`
- `GET /history/appointments`, `POST /history/appointments`

### Admin extra
- `GET /inventory/:productId`, `PUT /inventory/:productId`
- `GET /coupons`, `POST/PUT/DELETE /coupons`
- `GET /suppliers`, `POST/PUT/DELETE /suppliers`
- `GET /auth-logs`

## Notas de integración
- El backend actual **no expone campos de imagen** en `products` ni `categories`.
  Por eso las cards muestran un placeholder con el texto "Imagen no disponible en la API".
- `nutrition-plans` requiere JWT incluso para `GET`, por eso el Home muestra CTA a login
  cuando no hay sesión.
- Si el endpoint no existe o no responde, el frontend muestra "No disponible en API".

## Evidencia (UI)
- Secciones con `EmptyState` + CTA en Home y Catálogo cuando no hay datos.
- Cards modernas con placeholders para imágenes reales.
- Sidebar y rutas protegidas con `RequireAuth` + `RequireRole`.
