# API Endpoints - Sistema de Gestión de Peritos

## Base URL
```
http://localhost:3001/api
```

## Autenticación

### POST /auth/login
Login de usuario
```json
{
  "email": "admin@peritos.com",
  "password": "password123"
}
```

### POST /auth/register
Registro de nuevo usuario
```json
{
  "email": "nuevo@peritos.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "COORDINADOR"
}
```

### GET /auth/profile
Obtener perfil del usuario autenticado (requiere token)

### POST /auth/logout
Cerrar sesión (requiere token)

---

## Oficios

### GET /oficios
Listar oficios con filtros y paginación
Query params:
- page (default: 1)
- limit (default: 10)
- estado (PENDIENTE | ASIGNADO | EN_PROCESO | COMPLETADO | CANCELADO)
- prioridad (BAJA | MEDIA | ALTA | URGENTE)
- peritoId
- tipoPeritaje
- busqueda

### GET /oficios/:id
Obtener oficio por ID (incluye documentos, comentarios, citas, historial)

### POST /oficios
Crear nuevo oficio
```json
{
  "numeroExpediente": "2024-005",
  "nombreSolicitante": "María",
  "apellidoSolicitante": "López",
  "cedulaSolicitante": "1234567890",
  "telefonoSolicitante": "0998765432",
  "emailSolicitante": "maria@example.com",
  "tipoPeritaje": "Grafología",
  "descripcion": "Análisis de firmas",
  "fechaVencimiento": "2024-12-31T00:00:00.000Z",
  "prioridad": "ALTA"
}
```

### PUT /oficios/:id/perito
Asignar perito a un oficio
```json
{
  "peritoId": "uuid-del-perito"
}
```

### PATCH /oficios/:id/status
Cambiar estado de un oficio
```json
{
  "estado": "EN_PROCESO",
  "observaciones": "Iniciando análisis"
}
```

---

## Peritos

### GET /peritos
Listar peritos con filtros y paginación
Query params:
- page (default: 1)
- limit (default: 10)
- activo (true | false)
- disponible (true | false)
- especialidad
- busqueda

### GET /peritos/:id
Obtener perito por ID (incluye oficios asignados y citas)

### POST /peritos
Crear nuevo perito
```json
{
  "nombre": "Pedro",
  "apellido": "Martínez",
  "cedula": "0987654321",
  "especialidad": "Medicina Legal, Psiquiatría",
  "telefono": "0991234567",
  "email": "pedro@peritos.com"
}
```

### PUT /peritos/:id
Actualizar perito
```json
{
  "nombre": "Pedro",
  "apellido": "Martínez",
  "especialidad": "Medicina Legal",
  "disponible": true
}
```

### PATCH /peritos/:id/disponibilidad
Cambiar disponibilidad de un perito (toggle)

### DELETE /peritos/:id
Eliminar perito (soft delete - marca como inactivo)

---

## Documentos

### POST /documentos/upload
Subir documento (multipart/form-data)
```
file: [archivo PDF, imagen o Word]
oficioId: uuid-del-oficio
tipo: "pdf" | "imagen" | "word"
nombre: "Nombre del documento"
```

### GET /documentos/:id
Obtener información de un documento

### GET /documentos/:id/download
Descargar archivo

### DELETE /documentos/:id
Eliminar documento

### GET /documentos/oficio/:oficioId
Listar todos los documentos de un oficio

---

## Health Check

### GET /health
Verificar estado del servidor
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2024-12-02T..."
}
```

---

## Headers Requeridos

Para rutas protegidas:
```
Authorization: Bearer <token-jwt>
Content-Type: application/json
```

Para upload de archivos:
```
Authorization: Bearer <token-jwt>
Content-Type: multipart/form-data
```

---

## Usuarios de Prueba

```
Admin:
  Email: admin@peritos.com
  Password: password123

Coordinador:
  Email: coordinador@peritos.com
  Password: password123
```

---

## Rate Limiting

- Global: 100 requests / 15 minutos
- Login: 5 intentos / 15 minutos

---

## Tipos de Archivo Permitidos

- PDF: application/pdf
- Imágenes: image/jpeg, image/jpg, image/png
- Word: application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
- Tamaño máximo: 10MB
