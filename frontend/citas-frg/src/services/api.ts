import { ApiResponse } from '@/app/types'

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
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        // Si es 401, el token probablemente expiró
        if (response.status === 401) {
          this.removeToken()
          window.location.href = '/login'
        }
        
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP Error ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Request Error:', error)
      throw error
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
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

      return await response.json()
    } catch (error) {
      console.error('Upload Error:', error)
      throw error
    }
  }
}

// Exportar instancia singleton
export const apiService = new ApiService()
export default apiService