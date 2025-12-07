import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { body } from 'express-validator';

const router = Router();

// Validaciones para el login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  validateRequest
];

// Validaciones para el registro
const registerValidation = [
  body('nombre')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('apellido')
    .isLength({ min: 2 })
    .withMessage('El apellido debe tener al menos 2 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol')
    .optional()
    .isIn(['ADMINISTRADOR', 'COORDINADOR', 'PERITO'])
    .withMessage('Rol inválido'),
  validateRequest
];

// Rutas públicas
router.post('/login', loginValidation, AuthController.login);
router.post('/register', registerValidation, AuthController.register);

// Rutas protegidas
router.get('/profile', authMiddleware, AuthController.getProfile);
router.post('/logout', authMiddleware, AuthController.logout);

export { router as authRoutes };