import express from 'express';
import cors from 'cors';
import { apiRoutes } from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3001;

// Configurar CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Montar todas las rutas API
app.use('/api', apiRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '¡Servidor API Peritos funcionando con TypeScript!',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📋 API disponible en http://localhost:${port}/api`);
  console.log(`💚 Salud del servidor: http://localhost:${port}/api/health`);
});