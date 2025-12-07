import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { JWTPayload, AuthenticatedRequest } from '../types';

// @ts-nocheck
export const authMiddleware = (req: any, res: any, next: any): void => {
  try {
    const authHeader = req.headers.authorization as string | undefined;
    const token: string | undefined = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
      return;
    }
    
    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    
    // Agregar información del usuario al request
    (req as AuthenticatedRequest).user = {
      userId: decoded.userId,
      email: decoded.email,
      rol: decoded.rol
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
    return;
  }
};

// Middleware para verificar roles específicos
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }
    
    if (!roles.includes(authReq.user.rol)) {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
      return;
    }
    
    next();
  };
};