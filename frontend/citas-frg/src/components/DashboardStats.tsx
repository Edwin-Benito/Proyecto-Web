'use client'

import { useState, useEffect } from 'react'
import { oficiosService, peritosService } from '@/services'
import type { Oficio } from '@/app/types'

interface EstadisticasData {
  totalOficios: number
  oficiosPorEstado: {
    pendiente: number
    asignado: number
    enProceso: number
    completado: number
    rechazado: number
    vencido: number
  }
  peritosDisponibles: number
  peritosOcupados: number
  casosVencidos: number
  tiempoPromedioResolucion: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<EstadisticasData>({
    totalOficios: 0,
    oficiosPorEstado: {
      pendiente: 0,
      asignado: 0,
      enProceso: 0,
      completado: 0,
      rechazado: 0,
      vencido: 0,
    },
    peritosDisponibles: 0,
    peritosOcupados: 0,
    casosVencidos: 0,
    tiempoPromedioResolucion: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEstadisticas = async () => {
      try {
        setLoading(true)

        // Cargar todos los oficios y peritos en paralelo
        const [oficiosResponse, peritosResponse] = await Promise.all([
          oficiosService.getOficios({ limit: '100' }),
          peritosService.getPeritos({ limit: '100' }),
        ])

        if (oficiosResponse.success && oficiosResponse.data && peritosResponse.success && peritosResponse.data) {
          const oficios = oficiosResponse.data.oficios || oficiosResponse.data.data || []
          const peritos = peritosResponse.data.peritos || peritosResponse.data.data || []

          // Calcular estadísticas de oficios
          const totalOficios = oficios.length
          const oficiosPorEstado = {
            pendiente: oficios.filter((o: Oficio) => o.estado === 'PENDIENTE').length,
            asignado: oficios.filter((o: Oficio) => o.estado === 'ASIGNADO').length,
            enProceso: oficios.filter((o: Oficio) => o.estado === 'EN_PROCESO').length,
            completado: oficios.filter((o: Oficio) => o.estado === 'COMPLETADO').length,
            rechazado: oficios.filter((o: Oficio) => o.estado === 'RECHAZADO').length,
            vencido: oficios.filter((o: Oficio) => o.estado === 'VENCIDO').length,
          }

          // Calcular casos vencidos (estado VENCIDO o fecha vencimiento pasada)
          const casosVencidos = oficios.filter((o: Oficio) => {
            if (o.estado === 'VENCIDO') return true
            if (o.fechaVencimiento) {
              const vencimiento = new Date(o.fechaVencimiento)
              return vencimiento < new Date() && o.estado !== 'COMPLETADO'
            }
            return false
          }).length

          // Calcular peritos disponibles
          const peritosDisponibles = peritos.filter((p: any) => p.disponible && p.activo).length
          const peritosOcupados = peritos.filter((p: any) => !p.disponible && p.activo).length

          // Calcular tiempo promedio de resolución (en días)
          const oficiosCompletados = oficios.filter((o: Oficio) => o.estado === 'COMPLETADO')
          let tiempoPromedioResolucion = 0

          if (oficiosCompletados.length > 0) {
            const tiempos = oficiosCompletados.map((o: Oficio) => {
              const inicio = new Date(o.fechaIngreso)
              const fin = new Date(o.fechaActualizacion || o.fechaIngreso)
              return Math.abs(fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
            })
            tiempoPromedioResolucion = tiempos.reduce((a, b) => a + b, 0) / tiempos.length
          }

          setStats({
            totalOficios,
            oficiosPorEstado,
            peritosDisponibles,
            peritosOcupados,
            casosVencidos,
            tiempoPromedioResolucion: Math.round(tiempoPromedioResolucion * 10) / 10,
          })
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEstadisticas()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 mb-8">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Oficios */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Oficios</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOficios}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-3xl">description</span>
            </div>
          </div>
        </div>

        {/* Peritos Disponibles */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peritos Disponibles</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.peritosDisponibles}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.peritosOcupados} ocupados</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-3xl">person</span>
            </div>
          </div>
        </div>

        {/* Casos Vencidos */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Casos Vencidos</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.casosVencidos}</p>
              <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600 text-3xl">warning</span>
            </div>
          </div>
        </div>

        {/* Tiempo Promedio */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.tiempoPromedioResolucion}</p>
              <p className="text-xs text-gray-500 mt-1">días de resolución</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-600 text-3xl">schedule</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Estados */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
        <div className="space-y-3">
          {/* Pendiente */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Pendiente</span>
              <span className="text-sm font-semibold text-gray-900">{stats.oficiosPorEstado.pendiente}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.totalOficios > 0 ? (stats.oficiosPorEstado.pendiente / stats.totalOficios) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Asignado */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Asignado</span>
              <span className="text-sm font-semibold text-gray-900">{stats.oficiosPorEstado.asignado}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.totalOficios > 0 ? (stats.oficiosPorEstado.asignado / stats.totalOficios) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* En Proceso */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">En Proceso</span>
              <span className="text-sm font-semibold text-gray-900">{stats.oficiosPorEstado.enProceso}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.totalOficios > 0 ? (stats.oficiosPorEstado.enProceso / stats.totalOficios) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Completado */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Completado</span>
              <span className="text-sm font-semibold text-gray-900">{stats.oficiosPorEstado.completado}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.totalOficios > 0 ? (stats.oficiosPorEstado.completado / stats.totalOficios) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Rechazado */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Rechazado</span>
              <span className="text-sm font-semibold text-gray-900">{stats.oficiosPorEstado.rechazado}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.totalOficios > 0 ? (stats.oficiosPorEstado.rechazado / stats.totalOficios) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Vencido */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Vencido</span>
              <span className="text-sm font-semibold text-gray-900">{stats.oficiosPorEstado.vencido}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.totalOficios > 0 ? (stats.oficiosPorEstado.vencido / stats.totalOficios) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
