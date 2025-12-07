import { ApiResponse, Perito, PaginatedResponse, Oficio } from '@/app/types'
import { apiService } from './api'

interface PeritosFilter {
  page?: number
  limit?: number
  especialidad?: string
  activo?: boolean
  disponible?: boolean
  busqueda?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

class PeritosService {
  // Obtener lista de peritos con filtros y paginación
  async getPeritos(filters: Partial<PeritosFilter> = {}): Promise<ApiResponse<PaginatedResponse<Perito>>> {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    const endpoint = `/peritos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiService.get<PaginatedResponse<Perito>>(endpoint)
  }

  // Obtener un perito específico por ID
  async getPerito(id: string): Promise<ApiResponse<Perito>> {
    return apiService.get<Perito>(`/peritos/${id}`)
  }

  // Crear un nuevo perito
  async createPerito(perito: Omit<Perito, 'id' | 'createdAt' | 'updatedAt' | 'casosAsignados'>): Promise<ApiResponse<Perito>> {
    return apiService.post<Perito>('/peritos', perito)
  }

  // Actualizar un perito existente
  async updatePerito(id: string, updates: Partial<Perito>): Promise<ApiResponse<Perito>> {
    return apiService.put<Perito>(`/peritos/${id}`, updates)
  }

  // Eliminar un perito (soft delete)
  async deletePerito(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/peritos/${id}`)
  }

  // Activar/desactivar perito
  async togglePeritoStatus(id: string, activo: boolean): Promise<ApiResponse<Perito>> {
    return apiService.patch<Perito>(`/peritos/${id}/status`, { activo })
  }

  // Cambiar disponibilidad del perito
  async toggleDisponibilidad(id: string, disponible: boolean): Promise<ApiResponse<Perito>> {
    return apiService.patch<Perito>(`/peritos/${id}/disponibilidad`, { disponible })
  }

  // Obtener peritos disponibles por especialidad
  async getPeritosDisponibles(especialidad?: string): Promise<ApiResponse<Perito[]>> {
    const endpoint = especialidad 
      ? `/peritos/disponibles?especialidad=${encodeURIComponent(especialidad)}`
      : '/peritos/disponibles'
    
    return apiService.get<Perito[]>(endpoint)
  }

  // Obtener casos asignados a un perito
  async getCasosAsignados(peritoId: string, filters?: {
    estado?: string
    fechaDesde?: string
    fechaHasta?: string
  }): Promise<ApiResponse<Oficio[]>> {
    const queryParams = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      })
    }

    const endpoint = `/peritos/${peritoId}/casos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiService.get<Oficio[]>(endpoint)
  }

  // Obtener estadísticas de un perito
  async getPeritoStats(peritoId: string): Promise<ApiResponse<{
    casosCompletados: number
    casosEnProceso: number
    casosPendientes: number
    promedioTiempoCierre: number
    satisfaccionPromedio: number
    especialidadesMasFrecuentes: Array<{ especialidad: string; cantidad: number }>
  }>> {
    return apiService.get(`/peritos/${peritoId}/stats`)
  }

  // Obtener todas las especialidades disponibles
  async getEspecialidades(): Promise<ApiResponse<string[]>> {
    return apiService.get<string[]>('/peritos/especialidades')
  }

  // Buscar peritos por términos generales
  async searchPeritos(query: string): Promise<ApiResponse<Perito[]>> {
    return apiService.get<Perito[]>(`/peritos/search?q=${encodeURIComponent(query)}`)
  }

  // Obtener carga de trabajo de peritos
  async getCargaTrabajo(): Promise<ApiResponse<Array<{
    perito: Perito
    casosActivos: number
    capacidadMaxima: number
    porcentajeOcupacion: number
  }>>> {
    return apiService.get('/peritos/carga-trabajo')
  }

  // Asignar caso automáticamente basado en disponibilidad y especialidad
  async asignarAutomatico(oficioId: string, especialidadRequerida: string): Promise<ApiResponse<{
    perito: Perito
    razon: string
  }>> {
    return apiService.post(`/peritos/asignar-automatico`, {
      oficioId,
      especialidadRequerida
    })
  }

  // Obtener historial de desempeño de un perito
  async getHistorialDesempeño(peritoId: string, periodo?: {
    fechaInicio: string
    fechaFin: string
  }): Promise<ApiResponse<Array<{
    mes: string
    casosCompletados: number
    tiempoPromedio: number
    satisfaccion: number
  }>>> {
    const queryParams = new URLSearchParams()
    
    if (periodo) {
      queryParams.append('fechaInicio', periodo.fechaInicio)
      queryParams.append('fechaFin', periodo.fechaFin)
    }

    const endpoint = `/peritos/${peritoId}/desempeño${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiService.get(endpoint)
  }

  // Exportar datos de peritos
  async exportPeritos(formato: 'csv' | 'excel' | 'pdf', filters?: Partial<PeritosFilter>): Promise<Blob> {
    const queryParams = new URLSearchParams()
    queryParams.append('formato', formato)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`${apiService['baseURL']}/peritos/export?${queryParams.toString()}`, {
      headers: apiService['getHeaders'](),
    })

    if (!response.ok) {
      throw new Error(`Error exporting data: ${response.statusText}`)
    }

    return response.blob()
  }
}

// Exportar instancia singleton
export const peritosService = new PeritosService()
export default peritosService