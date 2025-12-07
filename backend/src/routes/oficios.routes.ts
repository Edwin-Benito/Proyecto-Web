import { Router } from 'express';
import { OfficiosController } from '../controllers/oficios.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { body, query } from 'express-validator';

const router = Router();

// Validaciones para crear oficio
const createOfficioValidation = [
  body('numeroExpediente')
    .notEmpty()
    .withMessage('El número de expediente es requerido')
    .trim()
    .escape(),
  body('nombreSolicitante')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres')
    .trim()
    .escape(),
  body('apellidoSolicitante')
    .isLength({ min: 2 })
    .withMessage('El apellido debe tener al menos 2 caracteres')
    .trim()
    .escape(),
  body('cedulaSolicitante')
    .notEmpty()
    .withMessage('La cédula es requerida')
    .trim()
    .escape(),
  body('tipoPeritaje')
    .notEmpty()
    .withMessage('El tipo de peritaje es requerido')
    .trim()
    .escape(),
  body('descripcion')
    .notEmpty()
    .withMessage('La descripción es requerida')
    .trim()
    .escape(),
  body('fechaVencimiento')
    .isISO8601()
    .withMessage('Fecha de vencimiento debe ser una fecha válida'),
  body('prioridad')
    .optional()
    .isIn(['BAJA', 'MEDIA', 'ALTA', 'URGENTE'])
    .withMessage('Prioridad inválida'),
  validateRequest
];

// Validaciones para actualizar estado
const changeStatusValidation = [
  body('estado')
    .isIn(['PENDIENTE', 'ASIGNADO', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'])
    .withMessage('Estado inválido'),
  body('observaciones')
    .optional()
    .trim()
    .escape(),
  validateRequest
];

// Validaciones para asignar perito
const assignPeritoValidation = [
  body('peritoId')
    .notEmpty()
    .withMessage('El ID del perito es requerido')
    .isUUID()
    .withMessage('ID de perito inválido'),
  validateRequest
];

// Validaciones para consultas (query parameters)
const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('La página debe ser un número mayor a 0'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
  query('estado').optional().isIn(['PENDIENTE', 'ASIGNADO', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO']).withMessage('Estado inválido'),
  query('prioridad').optional().isIn(['BAJA', 'MEDIA', 'ALTA', 'URGENTE']).withMessage('Prioridad inválida'),
  validateRequest
];

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas CRUD
router.get('/', queryValidation, OfficiosController.getOficios);
router.get('/:id', OfficiosController.getOficioById);
router.post('/', createOfficioValidation, OfficiosController.createOficio);
router.put('/:id', OfficiosController.updateOficio);

// Rutas específicas
router.put('/:id/perito', assignPeritoValidation, OfficiosController.assignPerito);
router.patch('/:id/status', changeStatusValidation, OfficiosController.changeStatus);

export { router as oficiosRoutes };