// @ts-nocheck
import bcrypt from 'bcrypt';
import { LoginRequest, AuthenticatedRequest, JWTPayload } from '../types';
import { prisma } from '../lib/prisma';
import { generateToken } from '../utils/jwt.utils';
import { sendSuccess, sendError, sendValidationError, sendUnauthorized } from '../utils/response.utils';

export class AuthController {
  
  // Login de usuario
  static async login(req: any, res: any): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;
      
      // Validar que se enviaron los datos requeridos
      if (!email || !password) {
        sendValidationError(res, 'Email y contraseña son requeridos');
        return;
      }
      
      // Buscar usuario en la base de datos
      const usuario = await prisma.usuario.findUnique({
        where: { email }
      });
      
      if (!usuario) {
        sendUnauthorized(res, 'Credenciales inválidas');
        return;
      }
      
      // Verificar contraseña con bcrypt
      const passwordValida = await bcrypt.compare(password, usuario.password);
      
      if (!passwordValida) {
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
  static async getProfile(req: any, res: any): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const usuario = await prisma.usuario.findUnique({
        where: { id: authReq.user?.userId || '' }
      });
      
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
  static async logout(req: any, res: any): Promise<void> {
    sendSuccess(res, null, 'Logout exitoso');
  }

  // Registrar nuevo usuario
  static async register(req: any, res: any): Promise<void> {
    try {
      const { email, password, nombre, apellido, rol } = req.body;
      
      // Validar campos requeridos
      if (!email || !password || !nombre || !apellido) {
        sendValidationError(res, 'Todos los campos son requeridos');
        return;
      }

      // Verificar si el email ya existe
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
      });

      if (usuarioExistente) {
        sendValidationError(res, 'El email ya está registrado');
        return;
      }

      // Hashear contraseña con bcrypt
      const passwordHash = await bcrypt.hash(password, 10);

      // Crear nuevo usuario
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          email,
          password: passwordHash,
          nombre,
          apellido,
          rol: rol || 'COORDINADOR'
        }
      });

      // Remover password de la respuesta
      const { password: _, ...usuarioSinPassword } = nuevoUsuario;

      // Generar token
      const tokenPayload: JWTPayload = {
        userId: nuevoUsuario.id,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      };
      
      const token = generateToken(tokenPayload);

      sendSuccess(res, {
        user: usuarioSinPassword,
        token
      }, 'Usuario registrado exitosamente', 201);
      
    } catch (error) {
      console.error('Error en registro:', error);
      sendError(res, 'Error interno del servidor');
    }
  }
}
