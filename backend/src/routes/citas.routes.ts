import { Router } from 'express';
import { CitasController } from '../controllers/citas.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { body, query } from 'express-validator';

const router = Router();

// Validaciones para crear cita
const createCitaValidation = [
  body('titulo')
    .notEmpty()
    .withMessage('El título es requerido')
    .trim()
    .escape(),
  body('tipo')
    .isIn(['EVALUACION', 'AUDIENCIA', 'ENTREGA_INFORME', 'SEGUIMIENTO', 'OTRA'])
    .withMessage('Tipo de cita inválido'),
  body('fechaInicio')
    .isISO8601()
    .withMessage('Fecha de inicio debe ser una fecha válida'),
  body('fechaFin')
    .isISO8601()
    .withMessage('Fecha de fin debe ser una fecha válida'),
  body('peritoId')
    .notEmpty()
    .withMessage('El ID del perito es requerido')
    .isUUID()
    .withMessage('ID de perito inválido'),
  body('oficioId')
    .notEmpty()
    .withMessage('El ID del oficio es requerido')
    .isUUID()
    .withMessage('ID de oficio inválido'),
  body('estado')
    .optional()
    .isIn(['PROGRAMADA', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'REPROGRAMADA'])
    .withMessage('Estado inválido'),
  validateRequest
];

// Validaciones para actualizar cita
const updateCitaValidation = [
  body('titulo')
    .optional()
    .trim()
    .escape(),
  body('tipo')
    .optional()
    .isIn(['EVALUACION', 'AUDIENCIA', 'ENTREGA_INFORME', 'SEGUIMIENTO', 'OTRA'])
    .withMessage('Tipo de cita inválido'),
  body('fechaInicio')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inicio debe ser una fecha válida'),
  body('fechaFin')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fin debe ser una fecha válida'),
  body('estado')
    .optional()
    .isIn(['PROGRAMADA', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'REPROGRAMADA'])
    .withMessage('Estado inválido'),
  validateRequest
];

// Validaciones para cambiar estado
const changeStatusValidation = [
  body('estado')
    .isIn(['PROGRAMADA', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'REPROGRAMADA'])
    .withMessage('Estado inválido'),
  validateRequest
];

// Validaciones para consultas
const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('La página debe ser un número mayor a 0'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
  query('tipo').optional().isIn(['EVALUACION', 'AUDIENCIA', 'ENTREGA_INFORME', 'SEGUIMIENTO', 'OTRA']).withMessage('Tipo inválido'),
  query('estado').optional().isIn(['PROGRAMADA', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'REPROGRAMADA']).withMessage('Estado inválido'),
  query('fechaDesde').optional().isISO8601().withMessage('Fecha desde debe ser válida'),
  query('fechaHasta').optional().isISO8601().withMessage('Fecha hasta debe ser válida'),
  validateRequest
];

// Validaciones para verificar disponibilidad
const disponibilidadValidation = [
  query('peritoId').notEmpty().withMessage('peritoId es requerido'),
  query('fechaInicio').notEmpty().isISO8601().withMessage('fechaInicio es requerida y debe ser válida'),
  query('fechaFin').notEmpty().isISO8601().withMessage('fechaFin es requerida y debe ser válida'),
  validateRequest
];

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas CRUD
router.get('/', queryValidation, CitasController.getCitas);
router.get('/proximas', CitasController.getCitasProximas);
router.get('/disponibilidad', disponibilidadValidation, CitasController.verificarDisponibilidad);
router.get('/perito/:peritoId', CitasController.getCitasPerito);
router.get('/oficio/:oficioId', CitasController.getCitasOficio);
router.get('/:id', CitasController.getCita);
router.post('/', createCitaValidation, CitasController.createCita);
router.put('/:id', updateCitaValidation, CitasController.updateCita);
router.delete('/:id', CitasController.deleteCita);

// Rutas específicas
router.patch('/:id/estado', changeStatusValidation, CitasController.cambiarEstado);

export { router as citasRoutes };
