# Nutrivida - Frontend

Frontend en React + Vite + TypeScript usando Material UI (MUI) para consumir la API REST de Nutrivida (NestJS).

## Requisitos
- Node.js 18+
- Backend corriendo en `http://localhost:3000` o la URL configurada en `VITE_API_URL`

## Instalación
```bash
npm install
```

## Configuración de entorno
Crear `.env` en la raíz del proyecto:

```bash
VITE_API_URL=http://localhost:3000
```

## Comandos
```bash
npm run dev
npm run build
npm run preview
```

## Autenticación
- Selector de login en el botón "Iniciar sesión" (dialog con Cliente/Admin).
- Pantallas de login:
  - `/login/cliente`
  - `/login/admin`
- Guarda token en `localStorage` con key `token` y usuario con key `user`
- Se adjunta el token automáticamente en cada request
- 401 => logout automático y redirección a `/login/admin`

## Roles
Roles desde backend:
- `admin` => **ADMIN** (ver/crear/editar/eliminar)
- `empleado` => **EDITOR** (ver/crear/editar)
- `cliente` => **CLIENTE** (solo público)
- Si existiera `operador` => **OPERADOR** (ver/cambiar estados)

## Guía rápida de navegación
- Público:
  - `/` Inicio
  - `/catalogo` Catálogo público
  - `/catalogo/:id` Detalle público
  - `/contacto` Contacto
  - `/registro` Registro de clientes
- Cliente:
  - `/app` Dashboard
  - `/app/catalogo`
  - `/app/productos/:id`
  - `/app/carrito`
  - `/app/mis-compras`
  - `/app/perfil`
  - `/app/direcciones`
  - `/app/resenas`
  - `/app/planes`
- Admin (requiere login):
  - `/admin/dashboard`
  - `/admin/productos` (listado)
  - `/admin/productos/new` (nuevo)
  - `/admin/productos/:id` (detalle)
  - `/admin/productos/:id/edit` (editar)
  - `/admin/categorias` (listado)
  - `/admin/categorias/new` (nuevo)
  - `/admin/categorias/:id` (detalle)
  - `/admin/categorias/:id/edit` (editar)
  - `/admin/planes`
  - `/admin/ventas`
  - `/admin/inventario`
  - `/admin/cupones`
  - `/admin/proveedores`
  - `/admin/usuarios`
  - `/admin/auth-logs`

## Endpoints consumidos
### Auth
- `POST /auth/login`
- `POST /auth/register`

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

### Planes nutricionales (Home)
- `GET /nutrition-plans`

### Reseñas (Home)
- `GET /reviews`

### Cliente
- `GET /cart`, `POST /cart`, `DELETE /cart/:productId`
- `GET /sales`, `POST /sales`
- `GET /addresses`, `POST /addresses`, `PUT /addresses/:id`, `DELETE /addresses/:id`
- `GET /users/:id`
- `POST /reviews`

### Admin extra
- `GET /sales`, `PUT /sales/:id`
- `GET /inventory/:productId`, `PUT /inventory/:productId`
- `GET /coupons`, `POST/PUT/DELETE /coupons`
- `GET /suppliers`, `POST/PUT/DELETE /suppliers`
- `GET /users`, `POST/PUT/DELETE /users`
- `GET /auth-logs`

## Capturas / guía rápida
- El dashboard muestra totales de productos y categorías.
- Los listados usan DataGrid con acciones según rol.
- Los formularios incluyen validaciones básicas y mensajes con Snackbar.
