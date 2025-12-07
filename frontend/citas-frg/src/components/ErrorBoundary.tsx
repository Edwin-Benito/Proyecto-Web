'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error a servicio de monitoring (Sentry, LogRocket, etc.)
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Aquí podrías enviar el error a un servicio de logging
    // logErrorToService(error, errorInfo)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI si se proporciona
      if (this.props.fallback) {
        return this.props.fallback
      }

      // UI por defecto
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Algo salió mal
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Lo sentimos, ocurrió un error inesperado
                </p>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-sm">
                <summary className="cursor-pointer text-gray-700 font-medium mb-2">
                  Detalles del error
                </summary>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 overflow-auto">
                  <p className="font-mono text-xs text-red-600 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="font-mono text-xs text-gray-600 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.resetError}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Intentar nuevamente
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC para envolver componentes con ErrorBoundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
