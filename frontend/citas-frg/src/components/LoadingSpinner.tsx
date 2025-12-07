'use client'

import { memo } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'white' | 'gray'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

const colorClasses = {
  blue: 'text-blue-600',
  white: 'text-white',
  gray: 'text-gray-600'
}

export const LoadingSpinner = memo(function LoadingSpinner({
  size = 'md',
  color = 'blue',
  className = ''
}: LoadingSpinnerProps) {
  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
})

interface LoadingOverlayProps {
  message?: string
  fullscreen?: boolean
}

export const LoadingOverlay = memo(function LoadingOverlay({
  message = 'Cargando...',
  fullscreen = false
}: LoadingOverlayProps) {
  const containerClass = fullscreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0'

  return (
    <div className={`${containerClass} flex items-center justify-center bg-white/80 backdrop-blur-sm`}>
      <div className="text-center">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="mt-4 text-sm font-medium text-gray-700">{message}</p>
        )}
      </div>
    </div>
  )
})

interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

export const LoadingSkeleton = memo(function LoadingSkeleton({
  lines = 3,
  className = ''
}: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded ${
            index !== lines - 1 ? 'mb-3' : ''
          } ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  )
})
