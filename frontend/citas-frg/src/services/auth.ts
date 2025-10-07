import { ApiResponse, LoginRequest, LoginResponse, User } from '@/app/types'
import { apiService } from './api'

class AuthService {
  // Iniciar sesión
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', credentials)
      
      if (response.success && response.data?.token) {
        // Guardar el token en el servicio API
        apiService.setToken(response.data.token)
        
        // Guardar información del usuario
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }
      }
      
      return response
    } catch (error) {
      throw error
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout (opcional, para invalidar token en el servidor)
      await apiService.post('/auth/logout')
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Limpiar datos locales
      apiService.removeToken()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
      }
    }
  }

  // Refrescar token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiService.post<{ token: string }>('/auth/refresh', {
        refreshToken
      })

      if (response.success && response.data?.token) {
        apiService.setToken(response.data.token)
      }

      return response
    } catch (error) {
      // Si falla el refresh, cerrar sesión
      this.logout()
      throw error
    }
  }

  // Obtener perfil del usuario actual
  async getProfile(): Promise<ApiResponse<User>> {
    return apiService.get<User>('/auth/profile')
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    return !!(token && user)
  }

  // Obtener usuario actual del localStorage
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }

  // Obtener token del localStorage
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  // Obtener refresh token
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refreshToken')
  }

  // Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiService.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
  }

  // Solicitar recuperación de contraseña
  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return apiService.post('/auth/forgot-password', { email })
  }

  // Restablecer contraseña con token
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiService.post('/auth/reset-password', { token, newPassword })
  }
}

// Exportar instancia singleton
export const authService = new AuthService()
export default authService