import express from 'express';
import { ApiResponse } from '../types';

// @ts-nocheck
// Middleware para manejar errores globalmente
export const errorHandler = (
  error: Error,
  req: any,
  res: any,
  next: any
): void => {
  console.error('Error capturado:', error);

  // Error de validación
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      error: error.message
    });
    return;
  }

  // Error de JWT
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
    return;
  }

  // Error de token expirado
  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
    return;
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req: any, res: any): void => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.path} no encontrada`
  });
};

// Middleware para logging de requests
export const requestLogger = (req: any, res: any, next: any): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
};