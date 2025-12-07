# Mejoras de Calidad - Pre Sprint 3

Este documento describe las mejoras implementadas antes de comenzar el Sprint 3.

## 📋 Índice

- [Validaciones Robustas](#validaciones-robustas)
- [Manejo de Errores Mejorado](#manejo-de-errores-mejorado)
- [Testing](#testing)
- [Optimizaciones de Rendimiento](#optimizaciones-de-rendimiento)

---

## ✅ Validaciones Robustas

### Schemas de Validación (Zod)

Se implementaron schemas de validación usando **Zod** para garantizar la integridad de los datos:

**Ubicación:** `src/lib/validations/schemas.ts`

### Schemas Implementados:

#### 1. **oficioSchema**
```typescript
- numeroExpediente: Alfanumérico mayúsculas (A-Z, 0-9, -, /)
- nombreSolicitante: Solo letras y espacios (2-100 caracteres)
- apellidoSolicitante: Solo letras y espacios (2-100 caracteres)
- tipoPeritaje: String (1-100 caracteres)
- descripcion: Texto largo (10-2000 caracteres, opcional)
- prioridad: Enum [BAJA, MEDIA, ALTA, URGENTE]
- estado: Enum [PENDIENTE, EN_REVISION, ASIGNADO, EN_PROCESO, COMPLETADO, ARCHIVADO]
- peritoId: UUID válido (opcional)
```

#### 2. **peritoSchema**
```typescript
- nombre: Solo letras (2-100 caracteres)
- apellido: Solo letras (2-100 caracteres)
- especialidad: String (3-100 caracteres)
- telefono: Exactamente 10 dígitos (opcional)
- email: Email válido (opcional)
- estado: Enum [ACTIVO, INACTIVO, SUSPENDIDO]
```

#### 3. **citaSchema**
```typescript
- oficioId: UUID válido (requerido)
- peritoId: UUID válido (requerido)
- fechaHora: Date futura (requerida)
- duracionMinutos: Número entero 15-480 (default: 60)
- lugar: String (5-200 caracteres)
- notas: String (0-1000 caracteres, opcional)
- estado: Enum [PROGRAMADA, CONFIRMADA, EN_CURSO, COMPLETADA, CANCELADA, REAGENDADA]
```

#### 4. **loginSchema**
```typescript
- email: Email válido (requerido)
- password: String (6-100 caracteres)
```

#### 5. **changePasswordSchema**
```typescript
- currentPassword: Requerida
- newPassword: Min 8 caracteres, debe incluir mayúscula, minúscula y número
- confirmPassword: Debe coincidir con newPassword
```

### Hook de Validación

**Ubicación:** `src/hooks/useFormValidation.ts`

```typescript
// Uso con React Hook Form
const { register, handleSubmit, formState: { errors } } = useFormValidation({
  schema: oficioSchema,
  defaultValues: {},
  mode: 'onBlur'
})
```

### Funciones Helper

```typescript
import { validateOficio, validatePerito, validateCita } from '@/lib/validations/schemas'

const result = validateOficio(data)
if (!result.success) {
  console.error(result.error.errors)
}
```

---

## 🛡️ Manejo de Errores Mejorado

### Clases de Error Personalizadas

**Ubicación:** `src/lib/errors/index.ts`

#### Jerarquía de Errores:

```
Error (JavaScript)
  └── AppError
      ├── ValidationError (400)
      ├── AuthenticationError (401)
      ├── NotFoundError (404)
      └── NetworkError (0)
```

### Características:

#### 1. **ErrorBoundary Component**
**Ubicación:** `src/components/ErrorBoundary.tsx`

- Captura errores de React en cualquier parte del árbol de componentes
- Muestra UI de error amigable
- En desarrollo muestra stack trace completo
- Permite reintentar o volver al inicio

**Uso:**
```tsx
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

#### 2. **Retry Logic con Backoff Exponencial**

```typescript
const data = await retryWithBackoff(
  () => fetchData(),
  {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatuses: [500, 502, 503, 504],
    onRetry: (attempt, error) => {
      console.log(`Retry ${attempt}:`, error)
    }
  }
)
```

**Características:**
- Reintentos automáticos para errores de red
- Backoff exponencial (1s, 2s, 4s...)
- Solo reintentar errores específicos (5xx, 408, 429)
- Callback para logging de reintentos

#### 3. **Logger Estructurado**

```typescript
import { logger } from '@/lib/errors'

logger.error('Failed to save', error, { userId: '123', action: 'create' })
logger.warn('Rate limit approaching', { remaining: 5 })
logger.info('User logged in', { userId: '123' })
logger.debug('Cache hit', { key: 'user:123' })
```

#### 4. **API Service Mejorado**

**Ubicación:** `src/services/api.ts`

- Manejo automático de errores HTTP
- Retry logic integrado
- Logging de peticiones
- Redirección automática en 401
- Parsing inteligente de errores

### Mensajes de Error Amigables

```typescript
import { getErrorMessage } from '@/lib/errors'

try {
  await saveData()
} catch (error) {
  const message = getErrorMessage(error)
  toast.error(message) // "Los datos ingresados no son válidos"
}
```

---

## 🧪 Testing

### Configuración

**Herramientas:**
- Jest 30.2.0
- @testing-library/react 16.3.0
- @testing-library/jest-dom 6.9.1
- @testing-library/user-event 14.6.1

**Archivos de configuración:**
- `jest.config.js` - Configuración de Jest
- `jest.setup.js` - Setup de mocks globales

### Scripts de Testing

```bash
pnpm test              # Ejecutar todos los tests
pnpm test:watch        # Modo watch
pnpm test:coverage     # Generar reporte de cobertura
```

### Tests Implementados

#### 1. **Validations Tests**
**Ubicación:** `src/lib/validations/__tests__/schemas.test.ts`

**Cobertura:**
- ✅ Validación de oficios (válidos e inválidos)
- ✅ Validación de peritos (teléfono, email)
- ✅ Validación de citas (fechas futuras, UUIDs)
- ✅ Validación de login

**Ejemplo:**
```typescript
it('should reject invalid numeroExpediente', () => {
  const result = validateOficio({ numeroExpediente: 'exp-2024' })
  expect(result.success).toBe(false)
})
```

#### 2. **Error Handling Tests**
**Ubicación:** `src/lib/errors/__tests__/errors.test.ts`

**Cobertura:**
- ✅ Clases de error personalizadas
- ✅ Parsing de errores de API
- ✅ Mensajes de error amigables
- ✅ Retry logic con backoff

**Ejemplo:**
```typescript
it('should retry on failure and eventually succeed', async () => {
  const fn = jest.fn()
    .mockRejectedValueOnce(new AppError('Fail', 503))
    .mockResolvedValueOnce('success')
  
  const result = await retryWithBackoff(fn, { maxRetries: 2 })
  expect(result).toBe('success')
  expect(fn).toHaveBeenCalledTimes(2)
})
```

### Mocks Configurados

**Global mocks en `jest.setup.js`:**
- ✅ window.matchMedia
- ✅ localStorage
- ✅ fetch

---

## ⚡ Optimizaciones de Rendimiento

### Componentes Optimizados

#### 1. **Pagination Component**
**Ubicación:** `src/components/Pagination.tsx`

**Optimizaciones:**
- ✅ `React.memo` para evitar re-renders innecesarios
- ✅ `useMemo` para cálculo de páginas visibles
- ✅ `useMemo` para rango de items
- ✅ Responsive (mobile/desktop)

**Uso:**
```tsx
<Pagination
  currentPage={1}
  totalPages={10}
  totalItems={100}
  pageSize={10}
  onPageChange={(page) => setPage(page)}
  onPageSizeChange={(size) => setPageSize(size)}
/>
```

#### 2. **LoadingSpinner Components**
**Ubicación:** `src/components/LoadingSpinner.tsx`

**Componentes:**
- ✅ `LoadingSpinner` - Spinner simple con tamaños y colores
- ✅ `LoadingOverlay` - Overlay de carga con blur
- ✅ `LoadingSkeleton` - Skeleton para carga de contenido

**Optimizaciones:**
- ✅ Todos usan `React.memo`
- ✅ Clases CSS pre-calculadas
- ✅ Sin re-renders en props estables

**Uso:**
```tsx
<LoadingSpinner size="lg" color="blue" />
<LoadingOverlay message="Cargando datos..." fullscreen />
<LoadingSkeleton lines={5} />
```

### Base de Datos

#### Índices en Prisma

**Ya implementados en `schema.prisma`:**

```prisma
// Oficios
@@index([estado])
@@index([prioridad])
@@index([peritoId])
@@index([fechaVencimiento])

// Citas
@@index([oficioId])
@@index([peritoId])
@@index([fechaInicio])

// Audit Logs
@@index([accion])
@@index([recurso])
@@index([usuarioId])
@@index([createdAt])

// Notificaciones
@@index([usuarioId])
@@index([leida])
@@index([createdAt])
```

**Mejoras de rendimiento:**
- ✅ Búsquedas por estado/prioridad optimizadas
- ✅ Joins eficientes (oficios-peritos, citas-peritos)
- ✅ Queries de auditoría rápidas
- ✅ Filtrado de notificaciones optimizado

### Hooks Personalizados

#### useDebounce
**Ubicación:** `src/components/OfficiosTable.tsx`

Reduce peticiones de búsqueda con delay de 500ms.

---

## 📦 Dependencias Nuevas

### Frontend

```json
{
  "dependencies": {
    "zod": "^4.1.13",
    "react-hook-form": "^7.67.0",
    "@hookform/resolvers": "^5.2.2"
  },
  "devDependencies": {
    "jest": "^30.2.0",
    "jest-environment-jsdom": "^30.2.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "^30.0.0"
  }
}
```

---

## 🚀 Próximos Pasos

### Integration Tests Pendientes

1. **Flujo de Oficios**
   - Crear oficio → Asignar perito → Crear cita → Completar
   
2. **Autenticación E2E**
   - Login → Dashboard → Logout
   
3. **CRUD Completo**
   - Crear → Leer → Actualizar → Eliminar

### Optimizaciones Pendientes

1. **Lazy Loading**
   - Implementar `React.lazy` para rutas
   - Code splitting por página
   
2. **Más useMemo/useCallback**
   - OfficiosTable optimizations
   - PeritosTable optimizations
   
3. **Virtual Scrolling**
   - Para tablas con muchos registros (>1000 items)

---

## 📚 Recursos

- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [React Performance](https://react.dev/learn/render-and-commit#optimizing-performance)
- [Prisma Indexes](https://www.prisma.io/docs/concepts/components/prisma-schema/indexes)

---

**Última actualización:** 2 de diciembre de 2025
