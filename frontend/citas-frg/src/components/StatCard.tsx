'use client'

import { memo } from 'react'

interface StatCardProps {
  title: string
  value: number
  subtitle?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'stable'
  }
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-violet-500'
}

export const StatCard = memo(function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'blue'
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value.toLocaleString()}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          
          {trend && (
            <div className="flex items-center mt-2">
              {trend.direction === 'up' && (
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )}
              {trend.direction === 'down' && (
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              {trend.direction === 'stable' && (
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                </svg>
              )}
              <span className={`ml-2 text-sm font-medium ${
                trend.direction === 'up' ? 'text-emerald-600' :
                trend.direction === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {trend.value > 0 && '+'}{trend.value.toFixed(1)}%
              </span>
              <span className="ml-1 text-sm text-gray-500">vs mes anterior</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`flex-shrink-0 ${colorClasses[color]} rounded-full p-3`}>
            <div className="h-8 w-8 text-white">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
