import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { oficiosRoutes } from './oficios.routes';
import { peritosRoutes } from './peritos.routes';

const router = Router();

// Montar todas las rutas con sus prefijos
router.use('/auth', authRoutes);
router.use('/oficios', oficiosRoutes);
router.use('/peritos', peritosRoutes);

// Ruta de salud del API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

export { router as apiRoutes };