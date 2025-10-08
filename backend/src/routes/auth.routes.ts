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
  body('name')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  validateRequest
];

// Rutas públicas
router.post('/login', loginValidation, AuthController.login);

// Rutas protegidas
router.get('/profile', authMiddleware, AuthController.getProfile);
router.post('/logout', authMiddleware, AuthController.logout);

export { router as authRoutes };