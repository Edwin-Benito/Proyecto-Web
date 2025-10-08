import { Request, Response } from 'express';
import { AuthenticatedRequest, OfficiosFilter, PaginatedResponse, Oficio } from '../types';
import { oficios, findOficioById, createOficio, updateOficio } from '../models/oficio.model';
import { findPeritoById } from '../models/perito.model';
import { sendSuccess, sendError, sendNotFound, sendValidationError } from '../utils/response.utils';

export class OfficiosController {

  // Obtener lista de oficios con filtros y paginación
  static async getOficios(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'fechaIngreso',
        sortOrder = 'desc',
        estado,
        prioridad,
        peritoId,
        fechaDesde,
        fechaHasta,
        tipoPeritaje,
        busqueda
      } = req.query;

      let filteredOficios = [...oficios];

      // Aplicar filtros
      if (estado) {
        filteredOficios = filteredOficios.filter(o => o.estado === estado);
      }
      
      if (prioridad) {
        filteredOficios = filteredOficios.filter(o => o.prioridad === prioridad);
      }
      
      if (peritoId) {
        filteredOficios = filteredOficios.filter(o => o.peritoId === peritoId);
      }
      
      if (tipoPeritaje) {
        filteredOficios = filteredOficios.filter(o => 
          o.tipoPeritaje.toLowerCase().includes((tipoPeritaje as string).toLowerCase())
        );
      }
      
      if (busqueda) {
        const searchTerm = (busqueda as string).toLowerCase();
        filteredOficios = filteredOficios.filter(o => 
          o.numeroExpediente.toLowerCase().includes(searchTerm) ||
          o.nombreSolicitante.toLowerCase().includes(searchTerm) ||
          o.apellidoSolicitante.toLowerCase().includes(searchTerm) ||
          o.cedulaSolicitante.includes(searchTerm)
        );
      }

      // Ordenamiento
      filteredOficios.sort((a, b) => {
        const aValue = a[sortBy as keyof Oficio] as string;
        const bValue = b[sortBy as keyof Oficio] as string;
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Paginación
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      
      const paginatedOficios = filteredOficios.slice(startIndex, endIndex);
      const totalPages = Math.ceil(filteredOficios.length / limitNum);

      const response: PaginatedResponse<Oficio> = {
        data: paginatedOficios,
        total: filteredOficios.length,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages
      };

      sendSuccess(res, response, 'Oficios obtenidos exitosamente');
      
    } catch (error) {
      console.error('Error obteniendo oficios:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Obtener un oficio específico por ID
  static async getOficioById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const oficio = findOficioById(id);
      
      if (!oficio) {
        sendNotFound(res, 'Oficio no encontrado');
        return;
      }

      sendSuccess(res, oficio, 'Oficio obtenido exitosamente');
      
    } catch (error) {
      console.error('Error obteniendo oficio:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Crear un nuevo oficio
  static async createOficio(req: Request, res: Response): Promise<void> {
    try {
      const nuevoOficio = createOficio({
        ...req.body,
        documentos: []
      });

      sendSuccess(res, nuevoOficio, 'Oficio creado exitosamente', 201);
      
    } catch (error) {
      console.error('Error creando oficio:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Asignar perito a un oficio
  static async assignPerito(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { peritoId } = req.body;
      
      const oficio = findOficioById(id);
      const perito = findPeritoById(peritoId);
      
      if (!oficio) {
        sendNotFound(res, 'Oficio no encontrado');
        return;
      }
      
      if (!perito) {
        sendNotFound(res, 'Perito no encontrado');
        return;
      }

      const oficioActualizado = updateOficio(id, {
        peritoId: peritoId,
        peritoAsignado: perito,
        fechaAsignacion: new Date().toISOString(),
        estado: 'asignado'
      });

      sendSuccess(res, oficioActualizado, 'Perito asignado exitosamente');
      
    } catch (error) {
      console.error('Error asignando perito:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Cambiar estado de un oficio
  static async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { estado, observaciones } = req.body;
      
      const oficio = findOficioById(id);
      
      if (!oficio) {
        sendNotFound(res, 'Oficio no encontrado');
        return;
      }

      const oficioActualizado = updateOficio(id, {
        estado,
        observaciones
      });

      sendSuccess(res, oficioActualizado, 'Estado del oficio actualizado exitosamente');
      
    } catch (error) {
      console.error('Error cambiando estado:', error);
      sendError(res, 'Error interno del servidor');
    }
  }
}