# Consulta Dietetica - Frontend

Frontend en React + Vite + TypeScript usando Material UI (MUI) para consumir la API de Consulta Dietetica.

## Requisitos
- Node.js 18+
- Backend corriendo en `http://localhost:3000` (o la URL configurada en `VITE_API_URL`)

## Instalacion
```bash
npm install
```

## Configuracion de entorno
Crear `.env` en la raiz:

```bash
VITE_API_URL=http://localhost:3000
```

## Comandos
```bash
npm run dev
npm run build
npm run preview
```

## Credenciales de demo (placeholder)
- admin@demo.com / Admin123*

## Endpoints usados
- POST /auth/login
- GET /categories, GET /categories/:id, POST/PUT/DELETE /categories
- GET /products, GET /products/:id, POST/PUT/DELETE /products

## Roles
- admin: todo
- empleado: crear/editar (sin eliminar)
- cliente: solo publico

