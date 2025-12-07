'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { withAuth } from '@/context/AuthContext'
import { statsService } from '@/services'
import type { DashboardStats, CitasPorMes, PeritoActivo, Tendencias } from '@/services/stats'
import { StatCard } from '@/components/StatCard'
import { OficiosEstadoChart } from '@/components/charts/OficiosEstadoChart'
import { PrioridadChart } from '@/components/charts/PrioridadChart'
import { CitasMesChart } from '@/components/charts/CitasMesChart'
import { PeritosActivosChart } from '@/components/charts/PeritosActivosChart'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import toast from 'react-hot-toast'
import Link from 'next/link'

function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [citasMes, setCitasMes] = useState<CitasPorMes[]>([])
  const [peritosActivos, setPeritosActivos] = useState<PeritoActivo[]>([])
  const [tendencias, setTendencias] = useState<Tendencias | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      const [statsRes, citasRes, peritosRes, tendenciasRes] = await Promise.all([
        statsService.getDashboardStats(),
        statsService.getCitasPorMes(),
        statsService.getPeritosMasActivos(10),
        statsService.getTendencias()
      ])

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data)
      }

      if (citasRes.success && citasRes.data) {
        setCitasMes(citasRes.data)
      }

      if (peritosRes.success && peritosRes.data) {
        setPeritosActivos(peritosRes.data)
      }

      if (tendenciasRes.success && tendenciasRes.data) {
        setTendencias(tendenciasRes.data)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
      toast.error('Error al cargar el dashboard')
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <div className="flex h-screen w-full bg-white">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner size="lg" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Vista general del sistema de gestión de peritos y oficios
              </p>
            </div>
            
            {/* Tarjetas de Estadísticas */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Oficios"
                  value={stats.totales.oficios}
                  trend={tendencias ? {
                    value: tendencias.oficios.cambio,
                    direction: tendencias.oficios.tendencia
                  } : undefined}
                  icon={
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                      <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  }
                  color="blue"
                />

                <StatCard
                  title="Peritos Activos"
                  value={stats.totales.peritosActivos}
                  subtitle="Disponibles para asignación"
                  icon={
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  }
                  color="green"
                />

                <StatCard
                  title="Citas Programadas"
                  value={stats.totales.citasPendientes}
                  trend={tendencias ? {
                    value: tendencias.citas.cambio,
                    direction: tendencias.citas.tendencia
                  } : undefined}
                  icon={
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  }
                  color="purple"
                />

                <StatCard
                  title="Citas Hoy"
                  value={stats.totales.citasHoy}
                  subtitle="Programadas para hoy"
                  icon={
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  }
                  color="yellow"
                />
              </div>
            )}

            {/* Gráficas - Fila 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {stats && <OficiosEstadoChart data={stats.oficiosPorEstado} />}
              {stats && <PrioridadChart data={stats.oficiosPorPrioridad} />}
            </div>

            {/* Gráficas - Fila 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <CitasMesChart data={citasMes} />
              <PeritosActivosChart data={peritosActivos} />
            </div>
            
            {/* Accesos Rápidos */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Accesos Rápidos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  href="/dashboard/oficios"
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <span className="material-symbols-outlined text-blue-600 text-3xl">inbox</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Oficios</h3>
                        <p className="text-sm text-gray-600">Gestionar oficios</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/peritos"
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-green-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <span className="material-symbols-outlined text-green-600 text-3xl">group</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Peritos</h3>
                        <p className="text-sm text-gray-600">Administrar peritos</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/agenda"
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-purple-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <span className="material-symbols-outlined text-purple-600 text-3xl">calendar_month</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Agenda</h3>
                        <p className="text-sm text-gray-600">Programar citas</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default withAuth(DashboardPage)