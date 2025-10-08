import { Request, Response } from 'express';
import { LoginRequest, AuthenticatedRequest, JWTPayload } from '../types';
import { findUserByEmail, findUserById } from '../models/usuario.model';
import { generateToken } from '../utils/jwt.utils';
import { sendSuccess, sendError, sendValidationError, sendUnauthorized } from '../utils/response.utils';

export class AuthController {
  
  // Login de usuario
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;
      
      // Validar que se enviaron los datos requeridos
      if (!email || !password) {
        sendValidationError(res, 'Email y contraseña son requeridos');
        return;
      }
      
      // Buscar usuario
      const usuario = findUserByEmail(email);
      
      if (!usuario || usuario.password !== password) {
        sendUnauthorized(res, 'Credenciales inválidas');
        return;
      }
      
      if (!usuario.activo) {
        sendUnauthorized(res, 'Usuario desactivado');
        return;
      }
      
      // Generar token
      const tokenPayload: JWTPayload = {
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      };
      
      const token = generateToken(tokenPayload);
      
      // Remover password de la respuesta
      const { password: _, ...usuarioSinPassword } = usuario;
      
      sendSuccess(res, {
        user: usuarioSinPassword,
        token: token
      }, 'Login exitoso');
      
    } catch (error) {
      console.error('Error en login:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Obtener perfil del usuario autenticado
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const usuario = findUserById(authReq.user?.userId || '');
      
      if (!usuario) {
        sendError(res, 'Usuario no encontrado', 404);
        return;
      }
      
      const { password: _, ...usuarioSinPassword } = usuario;
      sendSuccess(res, usuarioSinPassword, 'Perfil obtenido exitosamente');
      
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Logout (opcional - para invalidar tokens en el servidor)
  static async logout(req: Request, res: Response): Promise<void> {
    sendSuccess(res, null, 'Logout exitoso');
  }
}