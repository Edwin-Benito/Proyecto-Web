// Tipos relacionados con autenticación
export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: 'administrador' | 'coordinador' | 'perito'
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
  especialidad: string[]
  telefono: string
  email: string
  activo: boolean
  casosAsignados: number
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
  estado: 'pendiente' | 'asignado' | 'en_proceso' | 'completado' | 'vencido'
  prioridad: 'baja' | 'media' | 'alta' | 'urgente'
  peritoAsignado?: Perito
  peritoId?: string
  documentos: Documento[]
  observaciones?: string
  createdAt: string
  updatedAt: string
}

// Tipos para documentos
export interface Documento {
  id: string
  nombre: string
  tipo: string
  url: string
  tamaño: number
  fechaSubida: string
  oficioId: string
}

// Tipos para citas
export interface Cita {
  id: string
  oficioId: string
  peritoId: string
  fecha: string
  hora: string
  direccion: string
  estado: 'programada' | 'confirmada' | 'realizada' | 'cancelada' | 'reprogramada'
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
export interface ApiResponse<T = any> {
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