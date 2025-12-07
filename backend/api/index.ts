// @ts-nocheck
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { apiRoutes } from '../src/routes/index';
import { errorHandler } from '../src/middlewares/error.middleware';

const app = express();

// CORS DEBE IR PRIMERO - Permitir todos los dominios .vercel.app
app.use(cors({
  origin: true, // Permitir todos los orígenes por ahora
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
}));

// Middleware para parsear JSON - DEBE IR TEMPRANO
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar helmet para security headers (DESPUÉS de CORS)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Montar todas las rutas API
app.use('/api', apiRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: '¡Servidor API Peritos funcionando en Vercel!',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  return res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'Connected' : 'Not configured'
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Exportar para Vercel Serverless Functions
export default app;
