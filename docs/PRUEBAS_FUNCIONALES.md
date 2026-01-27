# Pruebas funcionales - Dietetica Frontend

Este documento sirve para registrar la evidencia del consumo de la API desde la interfaz.
Completar la columna "Evidencia" con capturas o grabaciones locales.

## Entorno
- Frontend: `npm run dev`
- Backend: `http://localhost:3000`
- Roles: `admin`, `empleado`, `cliente`

## Casos de prueba

| Caso | Modulo | Rol | Pasos resumidos | Resultado esperado | Evidencia |
| --- | --- | --- | --- | --- | --- |
| 1 | Auth | admin | Iniciar sesion con credenciales validas | Token guardado y redireccion a dashboard | docs/evidencias/login-admin.png |
| 2 | Productos | admin | Crear producto | Producto creado y listado actualizado | docs/evidencias/productos-crear.png |
| 3 | Productos | empleado | Editar producto | Producto actualizado | docs/evidencias/productos-editar.png |
| 4 | Productos | empleado | Eliminar producto | Accion no disponible o error 403 | docs/evidencias/productos-eliminar-restringido.png |
| 5 | Ventas | cliente | Crear venta desde carrito | Venta creada y carrito vacio | docs/evidencias/ventas-crear.png |
| 6 | Cupones | empleado | Ver cupones | Lista visible | docs/evidencias/cupones-listar.png |
| 7 | Cupones | empleado | Crear cupon | Accion no disponible o error 403 | docs/evidencias/cupones-crear-restringido.png |
| 8 | Auth Logs | admin | Ver logs | Tabla con registros | docs/evidencias/auth-logs.png |
| 9 | Inventario | empleado | Actualizar stock | Stock actualizado | docs/evidencias/inventario-actualizar.png |
| 10 | Resenas | cliente | Crear resena | Resena creada | docs/evidencias/resenas-crear.png |
| 11 | Pacientes | empleado | Registrar paciente | Usuario cliente creado | docs/evidencias/pacientes-crear.png |

## Notas
- Si algun modulo devuelve errores de validacion, adjuntar la evidencia en la columna correspondiente.
- Mantener las capturas en `docs/evidencias/` para trazabilidad.
