import { ApiResponse, Oficio, OfficiosFilter, PaginatedResponse, Documento } from '@/app/types'
import { apiService } from './api'

class OfficiosService {
  // Obtener lista de oficios con filtros y paginación
  async getOficios(filters: Partial<OfficiosFilter> = {}): Promise<ApiResponse<PaginatedResponse<Oficio>>> {
    const queryParams = new URLSearchParams()
    
    // Agregar parámetros de filtrado
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    const endpoint = `/oficios${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiService.get<PaginatedResponse<Oficio>>(endpoint)
  }

  // Obtener un oficio específico por ID
  async getOficio(id: string): Promise<ApiResponse<Oficio>> {
    return apiService.get<Oficio>(`/oficios/${id}`)
  }

  // Crear un nuevo oficio
  async createOficio(oficio: Omit<Oficio, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Oficio>> {
    return apiService.post<Oficio>('/oficios', oficio)
  }

  // Actualizar un oficio existente
  async updateOficio(id: string, updates: Partial<Oficio>): Promise<ApiResponse<Oficio>> {
    return apiService.put<Oficio>(`/oficios/${id}`, updates)
  }

  // Eliminar un oficio
  async deleteOficio(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/oficios/${id}`)
  }

  // Asignar perito a un oficio
  async assignPerito(oficioId: string, peritoId: string): Promise<ApiResponse<Oficio>> {
    return apiService.patch<Oficio>(`/oficios/${oficioId}/assign`, { peritoId })
  }

  // Cambiar estado de un oficio
  async changeStatus(oficioId: string, estado: Oficio['estado'], observaciones?: string): Promise<ApiResponse<Oficio>> {
    return apiService.patch<Oficio>(`/oficios/${oficioId}/status`, { estado, observaciones })
  }

  // Cambiar prioridad de un oficio
  async changePriority(oficioId: string, prioridad: Oficio['prioridad']): Promise<ApiResponse<Oficio>> {
    return apiService.patch<Oficio>(`/oficios/${oficioId}/priority`, { prioridad })
  }

  // Subir documentos a un oficio
  async uploadDocuments(oficioId: string, files: File[]): Promise<ApiResponse<Documento[]>> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('documentos', file)
    })
    formData.append('oficioId', oficioId)

    return apiService.upload<Documento[]>(`/oficios/${oficioId}/documents`, formData)
  }

  // Eliminar documento de un oficio
  async deleteDocument(oficioId: string, documentoId: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/oficios/${oficioId}/documents/${documentoId}`)
  }

  // Obtener documentos de un oficio
  async getDocuments(oficioId: string): Promise<ApiResponse<Documento[]>> {
    return apiService.get<Documento[]>(`/oficios/${oficioId}/documents`)
  }

  // Buscar oficios por términos generales
  async searchOficios(query: string): Promise<ApiResponse<Oficio[]>> {
    return apiService.get<Oficio[]>(`/oficios/search?q=${encodeURIComponent(query)}`)
  }

  // Obtener estadísticas de oficios
  async getStats(): Promise<ApiResponse<{
    total: number
    porEstado: Record<Oficio['estado'], number>
    porPrioridad: Record<Oficio['prioridad'], number>
    porMes: Array<{ mes: string; cantidad: number }>
  }>> {
    return apiService.get('/oficios/stats')
  }

  // Obtener oficios próximos a vencer
  async getOficiosProximosVencer(dias: number = 7): Promise<ApiResponse<Oficio[]>> {
    return apiService.get<Oficio[]>(`/oficios/proximos-vencer?dias=${dias}`)
  }

  // Exportar oficios (CSV, Excel, PDF)
  async exportOficios(formato: 'csv' | 'excel' | 'pdf', filters?: Partial<OfficiosFilter>): Promise<Blob> {
    const queryParams = new URLSearchParams()
    queryParams.append('formato', formato)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`${apiService['baseURL']}/oficios/export?${queryParams.toString()}`, {
      headers: apiService['getHeaders'](),
    })

    if (!response.ok) {
      throw new Error(`Error exporting data: ${response.statusText}`)
    }

    return response.blob()
  }

  // Duplicar oficio
  async duplicateOficio(id: string): Promise<ApiResponse<Oficio>> {
    return apiService.post<Oficio>(`/oficios/${id}/duplicate`)
  }

  // Obtener historial de cambios de un oficio
  async getOficioHistory(id: string): Promise<ApiResponse<Array<{
    id: string
    accion: string
    descripcion: string
    usuario: string
    fecha: string
    detalles?: unknown
  }>>> {
    return apiService.get(`/oficios/${id}/history`)
  }
}

// Exportar instancia singleton
export const oficiosService = new OfficiosService()
export default oficiosService