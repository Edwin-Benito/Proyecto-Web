// Tipos relacionados con autenticación
export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: 'ADMINISTRADOR' | 'COORDINADOR' | 'PERITO'
  avatar?: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
}

// Tipos relacionados con peritos
export interface Perito {
  id: string
  nombre: string
  apellido: string
  cedula: string
  especialidad: string // En backend es string separado por comas
  telefono: string
  email: string
  activo: boolean
  disponible: boolean
  createdAt: string
  updatedAt: string
}

// Tipos relacionados con oficios
export interface Oficio {
  id: string
  numeroExpediente: string
  nombreSolicitante: string
  apellidoSolicitante: string
  cedulaSolicitante: string
  telefonoSolicitante?: string
  emailSolicitante?: string
  tipoPeritaje: string
  descripcion: string
  fechaIngreso: string
  fechaAsignacion?: string
  fechaCita?: string
  fechaVencimiento: string
  estado: 'PENDIENTE' | 'ASIGNADO' | 'EN_PROCESO' | 'REVISION' | 'COMPLETADO' | 'RECHAZADO' | 'VENCIDO'
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE'
  perito?: Perito // Relación con perito
  peritoId?: string
  creadoPor?: User // Relación con usuario creador
  creadoPorId: string
  documentos?: Documento[]
  observaciones?: string
  createdAt: string
  updatedAt: string
}

// Tipos para documentos
export interface Documento {
  id: string
  nombre: string
  nombreOriginal: string
  tipo: string
  url: string
  tamano: number // Backend usa 'tamano' sin ñ
  version: number
  fechaSubida: string
  oficioId: string
  subidoPorId: string
  createdAt: string
  updatedAt: string
}

// Tipos para citas
export interface Cita {
  id: string
  titulo: string
  descripcion?: string
  fechaInicio: string
  fechaFin: string
  ubicacion?: string
  tipo: 'EVALUACION' | 'SEGUIMIENTO' | 'ENTREGA_INFORME' | 'OTRO'
  estado: 'PROGRAMADA' | 'CONFIRMADA' | 'REALIZADA' | 'CANCELADA' | 'REPROGRAMADA'
  oficioId: string
  peritoId: string
  observaciones?: string
  createdAt: string
  updatedAt: string
}

// Tipos para filtros y paginación
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface OfficiosFilter extends PaginationParams {
  estado?: Oficio['estado']
  prioridad?: Oficio['prioridad']
  peritoId?: string
  fechaDesde?: string
  fechaHasta?: string
  tipoPeritaje?: string
  busqueda?: string // Para búsqueda general
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Tipos para respuestas de API
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Tipos para estadísticas del dashboard
export interface DashboardStats {
  totalOficios: number
  oficiosPendientes: number
  oficiosEnProceso: number
  oficiosCompletados: number
  oficiosVencidos: number
  totalPeritos: number
  peritosActivos: number
  peritosDisponibles: number
  citasHoy: number
  citasSemana: number
}

// Tipos para notificaciones
export interface Notificacion {
  id: string
  titulo: string
  mensaje: string
  tipo: 'info' | 'success' | 'warning' | 'error'
  leida: boolean
  fechaCreacion: string
  userId: string
  oficioId?: string
}

// Tipos para Citas
export interface Cita {
  id: string
  titulo: string
  descripcion?: string
  fechaInicio: string
  fechaFin: string
  ubicacion?: string
  tipo: 'EVALUACION' | 'AUDIENCIA' | 'ENTREGA_INFORME' | 'SEGUIMIENTO' | 'OTRA'
  estado: 'PROGRAMADA' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA' | 'REPROGRAMADA'
  oficioId: string
  oficio?: Oficio
  peritoId: string
  perito?: Perito
  recordatorio24h: boolean
  recordatorio1h: boolean
  notificado24h: boolean
  notificado1h: boolean
  createdAt: string
  updatedAt: string
}

export interface CitaFilter extends PaginationParams {
  peritoId?: string
  oficioId?: string
  tipo?: Cita['tipo']
  estado?: Cita['estado']
  fechaDesde?: string
  fechaHasta?: string
}