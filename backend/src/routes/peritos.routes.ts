import { Router } from 'express';
import { PeritosController } from '../controllers/peritos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { body, query } from 'express-validator';

const router = Router();

// Validaciones para crear perito
const createPeritoValidation = [
  body('nombre')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('especialidad')
    .notEmpty()
    .withMessage('La especialidad es requerida'),
  body('telefono')
    .optional()
    .isMobilePhone('es-MX')
    .withMessage('El teléfono debe ser un número válido'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),
  validateRequest
];

// Validaciones para actualizar perito
const updatePeritoValidation = [
  body('nombre').optional().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('especialidad').optional().notEmpty().withMessage('La especialidad es requerida'),
  body('telefono').optional().isMobilePhone('es-MX').withMessage('El teléfono debe ser un número válido'),
  body('email').optional().isEmail().withMessage('Debe proporcionar un email válido'),
  body('disponible').optional().isBoolean().withMessage('Disponible debe ser verdadero o falso'),
  validateRequest
];

// Validaciones para consultas
const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('La página debe ser un número mayor a 0'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
  query('especialidad').optional().notEmpty().withMessage('La especialidad no puede estar vacía'),
  query('disponible').optional().isBoolean().withMessage('Disponible debe ser verdadero o falso'),
  validateRequest
];

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas CRUD
router.get('/', queryValidation, PeritosController.getPeritos);

export { router as peritosRoutes };