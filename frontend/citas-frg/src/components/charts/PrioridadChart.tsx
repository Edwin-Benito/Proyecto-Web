'use client'

import { memo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface PrioridadChartProps {
  data: Array<{
    prioridad: string
    count: number
  }>
}

const PRIORIDAD_COLORS: Record<string, string> = {
  BAJA: '#10b981',      // emerald-500
  MEDIA: '#3b82f6',     // blue-500
  ALTA: '#f59e0b',      // amber-500
  URGENTE: '#ef4444'    // red-500
}

const PRIORIDAD_LABELS: Record<string, string> = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  URGENTE: 'Urgente'
}

export const PrioridadChart = memo(function PrioridadChart({ data }: PrioridadChartProps) {
  const chartData = data.map(item => ({
    name: PRIORIDAD_LABELS[item.prioridad] || item.prioridad,
    value: item.count,
    color: PRIORIDAD_COLORS[item.prioridad] || '#9ca3af'
  }))

  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Oficios por Prioridad
      </h3>
      
      {total > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
