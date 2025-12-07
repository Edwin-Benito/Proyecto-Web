'use client'

import { memo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface OficiosEstadoChartProps {
  data: Array<{
    estado: string
    count: number
  }>
}

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: '#ef4444',       // red-500
  EN_REVISION: '#f59e0b',     // amber-500
  ASIGNADO: '#3b82f6',        // blue-500
  EN_PROCESO: '#8b5cf6',      // violet-500
  COMPLETADO: '#10b981',      // emerald-500
  ARCHIVADO: '#6b7280'        // gray-500
}

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  EN_REVISION: 'En Revisión',
  ASIGNADO: 'Asignado',
  EN_PROCESO: 'En Proceso',
  COMPLETADO: 'Completado',
  ARCHIVADO: 'Archivado'
}

export const OficiosEstadoChart = memo(function OficiosEstadoChart({ data }: OficiosEstadoChartProps) {
  const chartData = data.map(item => ({
    name: ESTADO_LABELS[item.estado] || item.estado,
    value: item.count,
    color: ESTADO_COLORS[item.estado] || '#9ca3af'
  }))

  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Oficios por Estado
      </h3>
      
      {total > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value} oficios`, 'Cantidad']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No hay datos disponibles
        </div>
      )}
    </div>
  )
})
