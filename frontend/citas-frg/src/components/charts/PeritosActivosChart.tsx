'use client'

import { memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PeritosActivosChartProps {
  data: Array<{
    id: string
    nombre: string
    especialidad: string
    oficiosAsignados: number
    citasRealizadas: number
    total: number
  }>
}

export const PeritosActivosChart = memo(function PeritosActivosChart({ data }: PeritosActivosChartProps) {
  const chartData = data.slice(0, 10).map(perito => ({
    nombre: perito.nombre.split(' ').slice(0, 2).join(' '), // Primeros 2 nombres
    oficios: perito.oficiosAsignados,
    citas: perito.citasRealizadas
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Peritos Más Activos (Top 10)
      </h3>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="nombre" 
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="oficios" 
              fill="#3b82f6" 
              name="Oficios Asignados"
            />
            <Bar 
              dataKey="citas" 
              fill="#10b981" 
              name="Citas Realizadas"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[350px] flex items-center justify-center text-gray-500">
          No hay datos disponibles
        </div>
      )}
    </div>
  )
})
