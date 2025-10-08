import { Request } from 'express';

// Tipos para el sistema de usuarios
export interface Usuario {
  id: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: 'administrador' | 'coordinador' | 'perito';
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

// Datos de entrada para login
export interface LoginRequest {
  email: string;
  password: string;
}

// Respuesta de autenticación
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
  };
}

// Datos de entrada para registro
export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: 'administrador' | 'coordinador' | 'perito';
}

// Respuesta genérica de API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Payload del JWT
export interface JWTPayload {
  userId: string;
  email: string;
  rol: string;
}

// Tipos para Peritos
export interface Perito {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  especialidad: string[];
  telefono: string;
  email: string;
  activo: boolean;
  casosAsignados: number;
  disponible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos para Oficios
export interface Oficio {
  id: string;
  numeroExpediente: string;
  nombreSolicitante: string;
  apellidoSolicitante: string;
  cedulaSolicitante: string;
  telefonoSolicitante?: string;
  emailSolicitante?: string;
  tipoPeritaje: string;
  descripcion: string;
  fechaIngreso: string;
  fechaAsignacion?: string;
  fechaCita?: string;
  fechaVencimiento: string;
  estado: 'pendiente' | 'asignado' | 'en_proceso' | 'completado' | 'vencido';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  peritoAsignado?: Perito;
  peritoId?: string;
  documentos: Documento[];
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para documentos
export interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  url: string;
  tamaño: number;
  fechaSubida: string;
  oficioId: string;
}

// Tipos para filtros y paginación
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OfficiosFilter extends PaginationParams {
  estado?: Oficio['estado'];
  prioridad?: Oficio['prioridad'];
  peritoId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  tipoPeritaje?: string;
  busqueda?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Request personalizado con usuario autenticado
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    rol: string;
  };
}