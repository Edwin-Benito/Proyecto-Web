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
    .withMessage('El nombre debe tener al menos 2 caracteres')
    .trim()
    .escape(),
  body('apellido')
    .isLength({ min: 2 })
    .withMessage('El apellido debe tener al menos 2 caracteres')
    .trim()
    .escape(),
  body('cedula')
    .notEmpty()
    .withMessage('La cédula es requerida')
    .trim()
    .escape(),
  body('especialidad')
    .notEmpty()
    .withMessage('La especialidad es requerida')
    .trim()
    .escape(),
  body('telefono')
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  validateRequest
];

// Validaciones para actualizar perito
const updatePeritoValidation = [
  body('nombre').optional().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres').trim().escape(),
  body('apellido').optional().isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres').trim().escape(),
  body('cedula').optional().notEmpty().withMessage('La cédula no puede estar vacía').trim().escape(),
  body('especialidad').optional().notEmpty().withMessage('La especialidad es requerida').trim().escape(),
  body('telefono').optional().notEmpty().withMessage('El teléfono no puede estar vacío').trim(),
  body('email').optional().isEmail().withMessage('Debe proporcionar un email válido').normalizeEmail(),
  body('disponible').optional().isBoolean().withMessage('Disponible debe ser verdadero o falso'),
  body('activo').optional().isBoolean().withMessage('Activo debe ser verdadero o falso'),
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
router.get('/:id', PeritosController.getPeritoById);
router.post('/', createPeritoValidation, PeritosController.createPerito);
router.put('/:id', updatePeritoValidation, PeritosController.updatePerito);
router.patch('/:id/disponibilidad', PeritosController.toggleDisponibilidad);
router.delete('/:id', PeritosController.deletePerito);

export { router as peritosRoutes };