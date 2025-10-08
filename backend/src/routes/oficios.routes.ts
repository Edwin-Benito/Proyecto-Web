import { Router } from 'express';
import { OfficiosController } from '../controllers/oficios.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { body, query } from 'express-validator';

const router = Router();

// Validaciones para crear oficio
const createOfficioValidation = [
  body('expediente')
    .notEmpty()
    .withMessage('El número de expediente es requerido'),
  body('nombre')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('dependencia')
    .notEmpty()
    .withMessage('La dependencia es requerida'),
  body('tipo')
    .isIn(['Pericial', 'Ampliación', 'Aclaración', 'Ratificación'])
    .withMessage('Tipo de oficio inválido'),
  body('fecha_recepcion')
    .isISO8601()
    .withMessage('Fecha de recepción debe ser una fecha válida'),
  validateRequest
];

// Validaciones para actualizar oficio
const updateOfficioValidation = [
  body('expediente').optional().notEmpty().withMessage('El número de expediente es requerido'),
  body('nombre').optional().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('dependencia').optional().notEmpty().withMessage('La dependencia es requerida'),
  body('tipo').optional().isIn(['Pericial', 'Ampliación', 'Aclaración', 'Ratificación']).withMessage('Tipo de oficio inválido'),
  body('fecha_recepcion').optional().isISO8601().withMessage('Fecha de recepción debe ser una fecha válida'),
  body('estado').optional().isIn(['Pendiente', 'En Proceso', 'Completado', 'Cancelado']).withMessage('Estado inválido'),
  validateRequest
];

// Validaciones para consultas (query parameters)
const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('La página debe ser un número mayor a 0'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
  query('tipo').optional().isIn(['Pericial', 'Ampliación', 'Aclaración', 'Ratificación']).withMessage('Tipo de oficio inválido'),
  query('estado').optional().isIn(['Pendiente', 'En Proceso', 'Completado', 'Cancelado']).withMessage('Estado inválido'),
  validateRequest
];

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas CRUD
router.get('/', queryValidation, OfficiosController.getOficios);
router.get('/:id', OfficiosController.getOficioById);
router.post('/', createOfficioValidation, OfficiosController.createOficio);

// Rutas específicas
router.put('/:id/perito', OfficiosController.assignPerito);
router.patch('/:id/status', OfficiosController.changeStatus);

export { router as oficiosRoutes };