# Dietetica Frontend

Frontend en React + Vite para consumir la API de Dietetica Backend y gestionar los modulos del sistema.

## Requisitos
- Node.js 18+
- Backend corriendo en `http://localhost:3000` o la URL configurada en `VITE_API_URL`

## Configuracion
Crear un archivo `.env` en la raiz:

```bash
VITE_API_URL=http://localhost:3000
```

## Scripts
```bash
npm install
npm run dev
```

## Autenticacion
- Endpoint: `POST /auth/login`
- Respuesta esperada: `data.access_token` y `data.user`
- El token se guarda en `localStorage` y se envia como `Authorization: Bearer <token>`
- Registro: `POST /auth/register` con `nombre`, `email`, `telefono`, `password`, `rol` y `codigo_secreto` (opcional)

## Roles soportados (segun backend)
- `admin`
- `empleado`
- `cliente`

En el frontend se normalizan a:
- `ADMIN`
- `OPERADOR` (empleado)
- `CLIENTE`

## Modulos y permisos (alineados al backend)
- Usuarios: solo `ADMIN`
- Direcciones: `ADMIN`, `OPERADOR`, `CLIENTE`
- Categorias: `ADMIN`, `OPERADOR` (eliminar solo `ADMIN`)
- Productos: `ADMIN`, `OPERADOR` (eliminar solo `ADMIN`)
- Proveedores: `ADMIN`, `OPERADOR` (eliminar solo `ADMIN`)
- Inventario: `ADMIN`, `OPERADOR` (actualizar stock solo `ADMIN`/`OPERADOR`)
- Cupones: ver `ADMIN`/`OPERADOR`, crear/editar/eliminar solo `ADMIN`
- Ventas: `ADMIN`, `OPERADOR`, `CLIENTE` (editar solo `ADMIN`/`OPERADOR`, eliminar solo `ADMIN`)
- Detalles venta: `ADMIN`, `OPERADOR` (eliminar solo `ADMIN`)
- Resenas: `ADMIN`, `OPERADOR`, `CLIENTE` (eliminar solo `ADMIN`)
- Planes nutricionales: `ADMIN`, `OPERADOR` (eliminar solo `ADMIN`)
- Historial: `ADMIN`, `OPERADOR`, `CLIENTE`
- Auth logs: solo `ADMIN`
- Correo: solo `ADMIN`

## UI de administracion
- Listado con paginacion y busqueda (`page`, `limit`, `search`)
- Formularios de creacion/edicion por modulo
- Acciones de editar/eliminar visibles segun rol
- Registro rapido de pacientes (rol cliente) en `/patients` para ADMIN/OPERADOR

## Pruebas funcionales
Ver `docs/PRUEBAS_FUNCIONALES.md` para el listado de casos de prueba y evidencia.
