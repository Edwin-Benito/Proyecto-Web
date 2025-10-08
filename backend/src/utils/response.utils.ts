import { Response } from 'express';
import { ApiResponse } from '../types';

// Utilidad para respuestas exitosas
export const sendSuccess = <T>(
  res: Response, 
  data?: T, 
  message: string = 'Operación exitosa',
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data
  };
  res.status(statusCode).json(response);
};

// Utilidad para respuestas de error
export const sendError = (
  res: Response,
  message: string = 'Error interno del servidor',
  statusCode: number = 500,
  error?: string
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error
  };
  res.status(statusCode).json(response);
};

// Utilidad para respuesta de validación
export const sendValidationError = (
  res: Response,
  message: string = 'Datos inválidos'
): void => {
  sendError(res, message, 400);
};

// Utilidad para respuesta no autorizada
export const sendUnauthorized = (
  res: Response,
  message: string = 'No autorizado'
): void => {
  sendError(res, message, 401);
};

// Utilidad para respuesta no encontrado
export const sendNotFound = (
  res: Response,
  message: string = 'Recurso no encontrado'
): void => {
  sendError(res, message, 404);
};

// Utilidad para crear respuestas de error (sin enviar)
export const createErrorResponse = (message: string, errors?: any): ApiResponse => ({
  success: false,
  message,
  error: errors
});

// Utilidad para crear respuestas exitosas (sin enviar)
export const createSuccessResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: true,
  message,
  data
});