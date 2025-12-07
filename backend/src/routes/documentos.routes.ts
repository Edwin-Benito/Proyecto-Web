import { Router } from 'express';
import { DocumentosController } from '../controllers/documentos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload, handleMulterError } from '../config/multer';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Subir documento
router.post(
  '/upload',
  upload.single('file'),
  handleMulterError,
  DocumentosController.uploadDocumento
);

// Obtener documento por ID
router.get('/:id', DocumentosController.getDocumento);

// Descargar documento
router.get('/:id/download', DocumentosController.downloadDocumento);

// Eliminar documento
router.delete('/:id', DocumentosController.deleteDocumento);

// Listar documentos de un oficio
router.get('/oficio/:oficioId', DocumentosController.getDocumentosByOficio);

export { router as documentosRoutes };
