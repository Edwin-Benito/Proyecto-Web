import { ApiResponse } from '@/app/types'
import { 
  AppError, 
  AuthenticationError, 
  NetworkError, 
  NotFoundError,
  retryWithBackoff,
  logger,
  parseApiError 
} from '@/lib/errors'

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Clase base para manejar peticiones HTTP
class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.loadToken()
  }

  // Cargar token del localStorage
  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }
  }

  // Establecer token de autenticación
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  // Remover token
  removeToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  // Headers por defecto
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  // Método genérico para peticiones
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    enableRetry = true
  ): Promise<ApiResponse<T>> {
    const makeRequest = async (): Promise<ApiResponse<T>> => {
      const url = `${this.baseURL}${endpoint}`
      
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      }

      try {
        logger.debug(`API Request: ${options.method || 'GET'} ${endpoint}`)
        
        const response = await fetch(url, config)
        
        if (!response.ok) {
          // Si es 401, el token probablemente expiró
          if (response.status === 401) {
            this.removeToken()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            throw new AuthenticationError('Sesión expirada')
          }

          // Si es 404
          if (response.status === 404) {
            throw new NotFoundError('Recurso no encontrado')
          }
          
          const errorData = await response.json().catch(() => ({}))
          throw new AppError(
            errorData.message || `HTTP Error ${response.status}`,
            response.status,
            errorData.code
          )
        }

        const data = (await response.json()) as ApiResponse<T>
        logger.debug(`API Response: ${endpoint}`, { success: data.success })
        return data
      } catch (error) {
        // Si es error de red
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new NetworkError('No se pudo conectar con el servidor')
        }
        
        // Si ya es un AppError, lanzarlo
        if (error instanceof AppError) {
          throw error
        }

        // Error desconocido
        logger.error('API Request Error', error, { endpoint, method: options.method })
        throw parseApiError(error)
      }
    }

    // Aplicar retry logic si está habilitado
    if (enableRetry) {
      return retryWithBackoff(makeRequest, {
        maxRetries: 2,
        retryDelay: 1000,
        onRetry: (attempt, error) => {
          logger.warn(`Retry attempt ${attempt} for ${endpoint}`, { error: error.message })
        }
      })
    }

    return makeRequest()
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Método especial para upload de archivos
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {}
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken()
          window.location.href = '/login'
        }
        
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP Error ${response.status}`)
      }

      return (await response.json()) as ApiResponse<T>
    } catch (error) {
      console.error('Upload Error:', error)
      throw error
    }
  }
}

// Exportar instancia singleton
export const apiService = new ApiService()
export default apiService