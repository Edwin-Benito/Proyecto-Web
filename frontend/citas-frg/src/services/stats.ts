import apiService from './api'
import { ApiResponse } from '@/app/types'

export interface DashboardStats {
  oficiosPorEstado: Array<{
    estado: string
    count: number
  }>
  oficiosPorPrioridad: Array<{
    prioridad: string
    count: number
  }>
  totales: {
    oficios: number
    peritosActivos: number
    citas: number
    citasHoy: number
    citasPendientes: number
  }
}

export interface CitasPorMes {
  mes: string
  count: number
}

export interface PeritoActivo {
  id: string
  nombre: string
  especialidad: string
  oficiosAsignados: number
  citasRealizadas: number
  total: number
}

export interface Tendencias {
  oficios: {
    actual: number
    anterior: number
    cambio: number
    tendencia: 'up' | 'down' | 'stable'
  }
  citas: {
    actual: number
    anterior: number
    cambio: number
    tendencia: 'up' | 'down' | 'stable'
  }
}

class StatsService {
  // Obtener estadísticas del dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiService.get<DashboardStats>('/stats/dashboard')
  }

  // Obtener citas por mes
  async getCitasPorMes(): Promise<ApiResponse<CitasPorMes[]>> {
    return apiService.get<CitasPorMes[]>('/stats/citas-mes')
  }

  // Obtener peritos más activos
  async getPeritosMasActivos(limit: number = 10): Promise<ApiResponse<PeritoActivo[]>> {
    return apiService.get<PeritoActivo[]>(`/stats/peritos-activos?limit=${limit}`)
  }

  // Obtener tendencias
  async getTendencias(): Promise<ApiResponse<Tendencias>> {
    return apiService.get<Tendencias>('/stats/tendencias')
  }
}

export const statsService = new StatsService()
export default statsService
