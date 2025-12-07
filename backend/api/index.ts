import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { apiRoutes } from '../src/routes';
import { errorHandler } from '../src/middlewares/error.middleware';

const app = express();

// Configurar helmet para security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Configurar rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Rate limiting más estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Máximo 5 intentos de login en 15 minutos
  message: 'Demasiados intentos de inicio de sesión, por favor intenta más tarde.',
  skipSuccessfulRequests: true,
});
app.use('/api/auth/login', authLimiter);

// Configurar CORS - Permitir todos los orígenes en producción de Vercel
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL || '',
        /\.vercel\.app$/,
      ]
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.FRONTEND_URL || 'http://localhost:3001'
      ],
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Montar todas las rutas API
app.use('/api', apiRoutes);

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '¡Servidor API Peritos funcionando en Vercel!',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de salud
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Exportar para Vercel Serverless
export default app;
