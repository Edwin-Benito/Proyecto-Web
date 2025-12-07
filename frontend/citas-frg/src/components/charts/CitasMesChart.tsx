'use client'

import { memo, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CitasMesChartProps {
  data: Array<{
    mes: string
    count: number
  }>
}

export const CitasMesChart = memo(function CitasMesChart({ data }: CitasMesChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      mes: new Date(item.mes + '-01').toLocaleDateString('es-ES', { 
        month: 'short', 
        year: 'numeric' 
      }),
      citas: item.count
    }))
  }, [data])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Citas por Mes (Últimos 6 meses)
      </h3>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="mes" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="citas" 
              stroke="#3b82f6" 
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Citas"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No hay datos disponibles
        </div>
      )}
    </div>
  )
})
