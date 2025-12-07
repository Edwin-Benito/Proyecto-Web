// Utilidades para manejo de errores mejorado

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND_ERROR')
    this.name = 'NotFoundError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Error de conexión') {
    super(message, 0, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

// Opciones para retry
export interface RetryOptions {
  maxRetries?: number
  retryDelay?: number
  retryableStatuses?: number[]
  onRetry?: (attempt: number, error: Error) => void
}

// Función para retry con backoff exponencial
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryableStatuses = [408, 429, 500, 502, 503, 504],
    onRetry
  } = options

  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // No reintentar si no es un error retryable
      if (error instanceof AppError) {
        if (!error.statusCode || !retryableStatuses.includes(error.statusCode)) {
          throw error
        }
      }

      // Si es el último intento, lanzar el error
      if (attempt === maxRetries) {
        throw error
      }

      // Calcular delay con backoff exponencial
      const delay = retryDelay * Math.pow(2, attempt)
      
      // Callback de retry
      if (onRetry) {
        onRetry(attempt + 1, error as Error)
      }

      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

// Logger estructurado
export const logger = {
  error: (message: string, error?: Error | unknown, context?: Record<string, unknown>) => {
    console.error('[ERROR]', message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      context,
      timestamp: new Date().toISOString()
    })
  },

  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn('[WARN]', message, {
      context,
      timestamp: new Date().toISOString()
    })
  },

  info: (message: string, context?: Record<string, unknown>) => {
    console.info('[INFO]', message, {
      context,
      timestamp: new Date().toISOString()
    })
  },

  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[DEBUG]', message, {
        context,
        timestamp: new Date().toISOString()
      })
    }
  }
}

// Parsear errores de API
export function parseApiError(error: unknown): AppError {
  // Si ya es un AppError, retornarlo
  if (error instanceof AppError) {
    return error
  }

  // Si es un Error estándar
  if (error instanceof Error) {
    // Error de red
    if (error.message.includes('fetch') || error.message.includes('Network')) {
      return new NetworkError('No se pudo conectar con el servidor. Verifica tu conexión.')
    }

    return new AppError(error.message)
  }

  // Error desconocido
  return new AppError('Ocurrió un error inesperado')
}

// Mensajes de error amigables
export const errorMessages: Record<string, string> = {
  VALIDATION_ERROR: 'Los datos ingresados no son válidos',
  AUTHENTICATION_ERROR: 'Sesión expirada. Por favor, inicia sesión nuevamente',
  NOT_FOUND_ERROR: 'El recurso solicitado no existe',
  NETWORK_ERROR: 'No se pudo conectar con el servidor',
  DUPLICATE_ERROR: 'Ya existe un registro con estos datos',
  PERMISSION_ERROR: 'No tienes permisos para realizar esta acción',
  SERVER_ERROR: 'Error en el servidor. Intenta nuevamente más tarde'
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError && error.code) {
    return errorMessages[error.code] || error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrió un error inesperado'
}
