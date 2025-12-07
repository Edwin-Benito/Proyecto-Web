// @ts-nocheck
import { AuthenticatedRequest } from '../types';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendNotFound, sendValidationError } from '../utils/response.utils';
import path from 'path';
import fs from 'fs';

export class DocumentosController {

  // Subir documento
  static async uploadDocumento(req: any, res: any): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      
      if (!req.file) {
        sendValidationError(res, 'No se ha proporcionado ningún archivo');
        return;
      }

      const { oficioId, tipo, nombre } = req.body;

      if (!oficioId) {
        // Eliminar archivo si no hay oficioId
        fs.unlinkSync(req.file.path);
        sendValidationError(res, 'El ID del oficio es requerido');
        return;
      }

      // Verificar que el oficio existe
      const oficio = await prisma.oficio.findUnique({
        where: { id: oficioId }
      });

      if (!oficio) {
        // Eliminar archivo si no existe el oficio
        fs.unlinkSync(req.file.path);
        sendNotFound(res, 'Oficio no encontrado');
        return;
      }

      // Crear registro del documento en la base de datos
      const documento = await prisma.documento.create({
        data: {
          nombre: nombre || req.file.originalname,
          nombreOriginal: req.file.originalname,
          tipo: tipo || path.extname(req.file.originalname).substring(1),
          url: `/uploads/${req.file.filename}`,
          tamano: req.file.size,
          oficioId: oficioId,
          subidoPorId: authReq.user?.userId || ''
        }
      });

      // Registrar en historial
      await prisma.historialOficio.create({
        data: {
          accion: 'DOCUMENTO_AGREGADO',
          descripcion: `Documento "${documento.nombre}" agregado al oficio`,
          oficioId: oficioId,
          realizadoPor: authReq.user?.userId || ''
        }
      });

      sendSuccess(res, documento, 'Documento subido exitosamente', 201);
      
    } catch (error) {
      // Eliminar archivo en caso de error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Error subiendo documento:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Obtener documento por ID
  static async getDocumento(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      
      const documento = await prisma.documento.findUnique({
        where: { id },
        include: {
          oficio: {
            select: {
              numeroExpediente: true
            }
          }
        }
      });
      
      if (!documento) {
        sendNotFound(res, 'Documento no encontrado');
        return;
      }

      sendSuccess(res, documento, 'Documento obtenido exitosamente');
      
    } catch (error) {
      console.error('Error obteniendo documento:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Descargar archivo
  static async downloadDocumento(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      
      const documento = await prisma.documento.findUnique({
        where: { id }
      });
      
      if (!documento) {
        sendNotFound(res, 'Documento no encontrado');
        return;
      }

      const filePath = path.join(__dirname, '../../uploads', path.basename(documento.url));
      
      if (!fs.existsSync(filePath)) {
        sendNotFound(res, 'Archivo no encontrado en el servidor');
        return;
      }

      res.download(filePath, documento.nombre);
      
    } catch (error) {
      console.error('Error descargando documento:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Eliminar documento
  static async deleteDocumento(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const authReq = req as AuthenticatedRequest;
      
      const documento = await prisma.documento.findUnique({
        where: { id }
      });
      
      if (!documento) {
        sendNotFound(res, 'Documento no encontrado');
        return;
      }

      // Eliminar archivo físico
      const filePath = path.join(__dirname, '../../uploads', path.basename(documento.url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Eliminar registro de la base de datos
      await prisma.documento.delete({
        where: { id }
      });

      // Registrar en historial
      await prisma.historialOficio.create({
        data: {
          accion: 'DOCUMENTO_ELIMINADO',
          descripcion: `Documento "${documento.nombre}" eliminado`,
          oficioId: documento.oficioId,
          realizadoPor: authReq.user?.userId || ''
        }
      });

      sendSuccess(res, null, 'Documento eliminado exitosamente');
      
    } catch (error) {
      console.error('Error eliminando documento:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Listar documentos de un oficio
  static async getDocumentosByOficio(req: any, res: any): Promise<void> {
    try {
      const { oficioId } = req.params;
      
      const documentos = await prisma.documento.findMany({
        where: { oficioId },
        orderBy: {
          createdAt: 'desc'
        }
      });

      sendSuccess(res, documentos, 'Documentos obtenidos exitosamente');
      
    } catch (error) {
      console.error('Error obteniendo documentos:', error);
      sendError(res, 'Error interno del servidor');
    }
  }
}
