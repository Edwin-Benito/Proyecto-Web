# 🎨 Mejoras UI/UX - Modal Detalle de Cita

## 📋 Resumen de Mejoras Implementadas

Se ha rediseñado completamente el modal de "Detalle de Cita" con un enfoque visual moderno y organizado, similar al modal de crear cita pero optimizado para visualización de información.

---

## ✨ Mejoras Implementadas

### 1. **Header Dinámico con Gradiente según Estado**

El header ahora cambia de color según el estado de la cita:

| Estado | Gradiente |
|--------|-----------|
| Programada | from-blue-600 to-blue-700 |
| Confirmada | from-green-600 to-green-700 |
| Completada | from-gray-600 to-gray-700 |
| Cancelada | from-red-600 to-red-700 |
| Reprogramada | from-amber-600 to-amber-700 |

#### Características del Header:
- ✅ Icono grande según tipo de cita (backdrop blur)
- ✅ Badge de estado con icono específico
- ✅ Título de la cita en texto grande
- ✅ Fecha formateada en español (Ej: "Viernes, 06 de diciembre del 2025")
- ✅ Botón de cierre con hover effect

### 2. **Organización por Secciones Visuales**

El modal está dividido en 5 secciones claramente diferenciadas:

#### 📅 **1. Fecha y Horario**
- **Tarjeta de Inicio**: Gradiente verde (from-green-50 to-emerald-50)
  - Icono `play_circle` verde
  - Fecha completa
  - Hora en tamaño grande (2xl)
- **Tarjeta de Fin**: Gradiente rojo (from-red-50 to-rose-50)
  - Icono `stop_circle` rojo
  - Fecha completa
  - Hora en tamaño grande (2xl)

#### 👥 **2. Participantes**
- **Tarjeta de Perito**: Gradiente azul (from-blue-50 to-indigo-50)
  - Nombre completo en negrita
  - Especialidad
  - Email con icono `mail`
  - Teléfono con icono `phone`
- **Tarjeta de Oficio**: Gradiente púrpura (from-purple-50 to-violet-50)
  - Número de expediente
  - Nombre del solicitante
  - Tipo de peritaje

#### 📝 **3. Detalles Adicionales**
- **Ubicación**: Tarjeta ámbar (from-amber-50 to-orange-50)
  - Icono `location_on`
- **Descripción**: Tarjeta gris con texto largo

#### 🔔 **4. Recordatorios**
- **Grid 2 columnas** con estados visuales:
  - Activo: bg-blue-50/amber-50 + border-blue-200/amber-200
  - Inactivo: bg-gray-50 + border-gray-200
  - Badge "Enviado" si `notificado24h` o `notificado1h`

#### 🔄 **5. Cambiar Estado**
- **Grid de 5 tarjetas visuales** (similar al tipo de cita en crear)
- Cada estado tiene su icono y color específico
- Estado activo: resaltado con color correspondiente
- Indicador de carga al cambiar estado

### 3. **Iconos Material Symbols por Estado**

Cada estado tiene su icono específico:

```typescript
const ESTADOS = [
  { value: 'PROGRAMADA', icon: 'event_available', color: 'blue' },
  { value: 'CONFIRMADA', icon: 'check_circle', color: 'green' },
  { value: 'COMPLETADA', icon: 'task_alt', color: 'gray' },
  { value: 'CANCELADA', icon: 'cancel', color: 'red' },
  { value: 'REPROGRAMADA', icon: 'update', color: 'amber' },
]
```

### 4. **Iconos por Tipo de Cita**

```typescript
const TIPO_ICONS = {
  'EVALUACION': 'fact_check',
  'AUDIENCIA': 'gavel',
  'ENTREGA_INFORME': 'description',
  'SEGUIMIENTO': 'update',
  'OTRA': 'event',
}
```

### 5. **Tarjetas con Gradientes**

Todas las secciones de información usan gradientes sutiles:

```tsx
{/* Ejemplo: Tarjeta de inicio */}
<div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
  {/* Contenido */}
</div>
```

### 6. **Estados de Cambio Visual**

#### Cambio de Estado:
- ✅ Tarjetas clickeables con hover effect
- ✅ Estado activo resaltado con color y borde
- ✅ Indicador de carga: spinner + mensaje "Actualizando estado..."
- ✅ Estados deshabilitados visualmente (opacity-50)

#### Recordatorios:
- ✅ Icono check_circle (activo) o cancel (inactivo)
- ✅ Badge "Enviado" con icono `done_all`
- ✅ Colores específicos: azul (24h), ámbar (1h)

### 7. **Formato de Fechas Mejorado**

Usando `date-fns` con locale español:

```typescript
// En header
format(new Date(cita.fechaInicio), "EEEE, dd 'de' MMMM 'del' yyyy", { locale: es })
// Resultado: "Viernes, 06 de diciembre del 2025"

// En tarjetas de fecha
format(new Date(cita.fechaInicio), "dd 'de' MMMM, yyyy", { locale: es })
// Resultado: "06 de diciembre, 2025"

// Hora
format(new Date(cita.fechaInicio), 'HH:mm')
// Resultado: "03:51"
```

### 8. **Diseño Responsive**

```tsx
// Grid de 2 columnas para inicio/fin, perito/oficio, recordatorios
<div className="grid grid-cols-2 gap-6">

// Grid de 5 columnas para estados
<div className="grid grid-cols-5 gap-2">

// Scroll optimizado
<div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
```

### 9. **Animaciones y Transiciones**

- ✅ Entrada del modal: `animate-in fade-in slide-in-from-bottom-4 duration-300`
- ✅ Backdrop blur: `bg-black/60 backdrop-blur-sm`
- ✅ Hover en botones: `transition-all`
- ✅ Spinner de carga animado

### 10. **Botones Mejorados**

```tsx
{/* Footer con diseño consistente */}
<div className="px-8 py-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
  <div className="flex gap-3">
    {/* Botón Cerrar */}
    <button className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">
      Cerrar
    </button>
    
    {/* Botón Eliminar con shadow */}
    <button className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/30 flex items-center gap-2">
      <span className="material-symbols-outlined">delete</span>
      Eliminar Cita
    </button>
  </div>
</div>
```

---

## 🎯 Comparación Antes/Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| Header | Título simple + badge | Gradiente dinámico + icono + fecha completa |
| Fechas | Texto plano con iconos | Tarjetas con gradientes verde/rojo |
| Perito/Oficio | Lista simple | Tarjetas con gradientes azul/púrpura |
| Ubicación | Texto con icono | Tarjeta ámbar destacada |
| Recordatorios | Lista de checks | Grid de tarjetas con estados visuales |
| Estados | Pills pequeños | Tarjetas grandes con iconos |
| Cambio de estado | Sin feedback | Indicador de carga visible |
| Scroll | Todo el modal | Solo contenido |
| Animaciones | Básicas | Fade-in + slide + transitions |

---

## 🎨 Paleta de Colores por Sección

### Estados (Header)
```css
Programada:   from-blue-600 to-blue-700
Confirmada:   from-green-600 to-green-700
Completada:   from-gray-600 to-gray-700
Cancelada:    from-red-600 to-red-700
Reprogramada: from-amber-600 to-amber-700
```

### Tarjetas de Fecha
```css
Inicio: from-green-50 to-emerald-50 + border-green-200
Fin:    from-red-50 to-rose-50 + border-red-200
```

### Tarjetas de Participantes
```css
Perito: from-blue-50 to-indigo-50 + border-blue-200
Oficio: from-purple-50 to-violet-50 + border-purple-200
```

### Detalles
```css
Ubicación:   from-amber-50 to-orange-50 + border-amber-200
Descripción: bg-gray-50 + border-gray-200
```

### Recordatorios
```css
Activo 24h:  bg-blue-50 + border-blue-200
Activo 1h:   bg-amber-50 + border-amber-200
Inactivo:    bg-gray-50 + border-gray-200
Badge:       bg-blue-100/amber-100 text-blue-700/amber-700
```

---

## 📊 Secciones del Modal

### Header (Dinámico)
```tsx
- Gradiente según estado de cita
- Icono grande del tipo de cita (12x12)
- Badge del estado actual con icono
- Título de la cita (text-2xl)
- Fecha completa en español
- Botón de cierre
```

### Sección 1: Fecha y Horario
```tsx
- Icono de sección: schedule
- Grid 2 columnas
- Tarjeta inicio (verde) + Tarjeta fin (rojo)
- Cada una con: fecha + hora grande (2xl)
```

### Sección 2: Participantes
```tsx
- Icono de sección: group
- Grid 2 columnas
- Tarjeta perito (azul): nombre, especialidad, email, teléfono
- Tarjeta oficio (púrpura): expediente, solicitante, tipo
```

### Sección 3: Detalles Adicionales
```tsx
- Icono de sección: edit_note
- Condicional (solo si hay ubicación o descripción)
- Tarjeta ubicación (ámbar) con icono location_on
- Tarjeta descripción (gris) con texto largo
```

### Sección 4: Recordatorios
```tsx
- Icono de sección: notifications
- Grid 2 columnas
- Tarjeta 24h (azul si activo)
- Tarjeta 1h (ámbar si activo)
- Badge "Enviado" con icono done_all
```

### Sección 5: Cambiar Estado
```tsx
- Icono de sección: sync_alt
- Grid 5 columnas
- 5 tarjetas con iconos
- Indicador de carga al cambiar
```

### Footer
```tsx
- Fondo gris claro (bg-gray-50)
- Botón Cerrar (flex-1)
- Botón Eliminar (con shadow)
```

---

## 🚀 Características Técnicas

### Hooks y Estado
```typescript
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
const [isDeleting, setIsDeleting] = useState(false)
const [changingStatus, setChangingStatus] = useState(false)

const estadoActual = ESTADOS.find(e => e.value === cita.estado)
```

### Funciones Principales
```typescript
// Cambiar estado con feedback visual
const handleChangeStatus = async (nuevoEstado: Cita['estado']) => {
  setChangingStatus(true)
  // ... llamada API
  toast.success('✅ Estado actualizado exitosamente')
  setChangingStatus(false)
}

// Eliminar con confirmación
const handleDelete = async () => {
  setIsDeleting(true)
  // ... llamada API
  toast.success('✅ Cita eliminada exitosamente')
}
```

### Renderizado Condicional
```tsx
{/* Solo mostrar si hay ubicación o descripción */}
{(cita.ubicacion || cita.descripcion) && (
  <div className="space-y-4">
    {cita.ubicacion && <TarjetaUbicacion />}
    {cita.descripcion && <TarjetaDescripcion />}
  </div>
)}

{/* Badge de notificación enviada */}
{cita.notificado24h && (
  <div className="badge-enviado">Enviado</div>
)}
```

---

## 💡 Mejoras de UX

### 1. **Feedback Visual Inmediato**
- ✅ Spinner al cambiar estado
- ✅ Toast de éxito/error
- ✅ Deshabilitación de botones durante carga

### 2. **Jerarquía Visual Clara**
- ✅ Header llamativo con gradiente
- ✅ Secciones con iconos identificadores
- ✅ Tarjetas de colores para cada tipo de información
- ✅ Hora en tamaño grande (2xl) para visibilidad

### 3. **Información Agrupada Lógicamente**
- ✅ Fechas juntas (inicio/fin)
- ✅ Participantes juntos (perito/oficio)
- ✅ Detalles opcionales agrupados
- ✅ Acciones de estado separadas

### 4. **Accesibilidad**
- ✅ Iconos descriptivos en todos los elementos
- ✅ Contraste de colores adecuado
- ✅ Estados disabled visualmente claros
- ✅ Mensajes de feedback con emojis

---

## 🔄 Flujo de Interacción

1. **Usuario abre modal**: Animación de entrada suave
2. **Ve información organizada**: Secciones visuales claras
3. **Identifica estado rápidamente**: Color del header
4. **Revisa detalles**: Scroll por secciones
5. **Cambia estado si necesario**: Click en tarjeta → spinner → toast
6. **Elimina si necesario**: Click eliminar → modal confirmación → toast
7. **Cierra modal**: Click en cerrar o X

---

## 📝 Código Destacado

### Header Dinámico
```tsx
<div className={`relative px-8 py-6 rounded-t-2xl ${
  estadoActual?.value === 'COMPLETADA' ? 'bg-gradient-to-r from-gray-600 to-gray-700' :
  estadoActual?.value === 'CANCELADA' ? 'bg-gradient-to-r from-red-600 to-red-700' :
  estadoActual?.value === 'CONFIRMADA' ? 'bg-gradient-to-r from-green-600 to-green-700' :
  estadoActual?.value === 'REPROGRAMADA' ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
  'bg-gradient-to-r from-blue-600 to-blue-700'
}`}>
```

### Tarjeta de Fecha con Gradiente
```tsx
<div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 space-y-2">
  <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-green-600 text-xl">calendar_today</span>
    <span className="text-gray-900 font-medium">
      {format(new Date(cita.fechaInicio), "dd 'de' MMMM, yyyy", { locale: es })}
    </span>
  </div>
  <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-green-600 text-xl">schedule</span>
    <span className="text-2xl font-bold text-gray-900">
      {format(new Date(cita.fechaInicio), 'HH:mm')}
    </span>
  </div>
</div>
```

### Grid de Estados
```tsx
<div className="grid grid-cols-5 gap-2">
  {ESTADOS.map((estado) => {
    const isActive = estado.value === cita.estado
    return (
      <button
        onClick={() => handleChangeStatus(estado.value)}
        disabled={changingStatus || isActive}
        className={`p-3 rounded-xl border-2 transition-all ${
          isActive ? `${estado.borderColor} ${estado.bgColor}` : 'border-gray-200 bg-white'
        }`}
      >
        <span className={`material-symbols-outlined ${isActive ? estado.color : 'text-gray-400'}`}>
          {estado.icon}
        </span>
        <span>{estado.label}</span>
      </button>
    )
  })}
</div>
```

---

## ✅ Checklist de Implementación

- [x] Header dinámico con gradiente según estado
- [x] Iconos específicos por tipo y estado
- [x] Secciones organizadas con títulos
- [x] Tarjetas con gradientes para fechas
- [x] Tarjetas con gradientes para participantes
- [x] Tarjeta destacada para ubicación
- [x] Grid de recordatorios con estados visuales
- [x] Grid de estados con iconos
- [x] Indicador de carga al cambiar estado
- [x] Badge "Enviado" en recordatorios
- [x] Formato de fechas en español
- [x] Animaciones y transiciones
- [x] Scroll optimizado
- [x] Botones con diseño consistente
- [x] Modal de confirmación para eliminar

---

## 🎁 Bonus Features

### Información de Contacto Completa
- ✅ Email del perito con icono `mail`
- ✅ Teléfono del perito con icono `phone`
- ✅ Separadores visuales entre secciones

### Estado de Notificaciones
- ✅ Muestra si el recordatorio fue enviado
- ✅ Badge "Enviado" con icono `done_all`
- ✅ Diferenciación visual entre activo/inactivo

### Responsividad
- ✅ Padding adaptativo (p-4 en mobile)
- ✅ Grid responsive (cols-2 y cols-5)
- ✅ Altura máxima calculada con viewport
- ✅ Scroll solo en contenido

---

**Fecha de implementación**: 2 de diciembre de 2025  
**Archivo modificado**: `frontend/citas-frg/src/components/DetalleCitaModal.tsx`  
**Sprint**: Sprint 3 - Dashboard Mejorado con Gráficas ✅  
**Relacionado**: MEJORAS_MODAL_CITA.md (modal de crear cita)
