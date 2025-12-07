import { ApiResponse, Cita, CitaFilter, PaginatedResponse } from '@/app/types'
import { apiService } from './api'

class CitasService {
  // Obtener lista de citas con filtros y paginación
  async getCitas(filters: Partial<CitaFilter> = {}): Promise<ApiResponse<PaginatedResponse<Cita>>> {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    const endpoint = `/citas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiService.get<PaginatedResponse<Cita>>(endpoint)
  }

  // Obtener una cita específica por ID
  async getCita(id: string): Promise<ApiResponse<Cita>> {
    return apiService.get<Cita>(`/citas/${id}`)
  }

  // Crear una nueva cita
  async createCita(cita: Omit<Cita, 'id' | 'createdAt' | 'updatedAt' | 'notificado24h' | 'notificado1h'>): Promise<ApiResponse<Cita>> {
    return apiService.post<Cita>('/citas', cita)
  }

  // Actualizar una cita existente
  async updateCita(id: string, updates: Partial<Cita>): Promise<ApiResponse<Cita>> {
    return apiService.put<Cita>(`/citas/${id}`, updates)
  }

  // Eliminar una cita
  async deleteCita(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/citas/${id}`)
  }

  // Cambiar estado de una cita
  async cambiarEstado(id: string, estado: Cita['estado']): Promise<ApiResponse<Cita>> {
    return apiService.patch<Cita>(`/citas/${id}/estado`, { estado })
  }

  // Obtener citas de un perito
  async getCitasPerito(peritoId: string, fechaDesde?: string, fechaHasta?: string): Promise<ApiResponse<Cita[]>> {
    const params = new URLSearchParams()
    if (fechaDesde) params.append('fechaDesde', fechaDesde)
    if (fechaHasta) params.append('fechaHasta', fechaHasta)
    
    return apiService.get<Cita[]>(`/citas/perito/${peritoId}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  // Obtener citas de un oficio
  async getCitasOficio(oficioId: string): Promise<ApiResponse<Cita[]>> {
    return apiService.get<Cita[]>(`/citas/oficio/${oficioId}`)
  }

  // Obtener citas próximas (para notificaciones)
  async getCitasProximas(horas: number = 24): Promise<ApiResponse<Cita[]>> {
    return apiService.get<Cita[]>(`/citas/proximas?horas=${horas}`)
  }

  // Verificar disponibilidad de un perito en una fecha/hora
  async verificarDisponibilidad(peritoId: string, fechaInicio: string, fechaFin: string, citaIdExcluir?: string): Promise<ApiResponse<{ disponible: boolean; conflictos?: Cita[] }>> {
    const params = new URLSearchParams()
    params.append('fechaInicio', fechaInicio)
    params.append('fechaFin', fechaFin)
    if (citaIdExcluir) params.append('excluir', citaIdExcluir)
    
    return apiService.get(`/citas/verificar-disponibilidad/${peritoId}?${params.toString()}`)
  }
}

// Exportar instancia singleton
export const citasService = new CitasService()
export default citasService
