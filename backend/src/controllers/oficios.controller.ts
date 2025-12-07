// @ts-nocheck
import { AuthenticatedRequest, OfficiosFilter, PaginatedResponse, Oficio } from '../types';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendNotFound, sendValidationError } from '../utils/response.utils';

export class OfficiosController {

  // Obtener lista de oficios con filtros y paginación
  static async getOficios(req: any, res: any): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'fechaIngreso',
        sortOrder = 'desc',
        estado,
        prioridad,
        peritoId,
        tipoPeritaje,
        busqueda,
        numeroExpediente,
        nombreSolicitante,
        cedulaSolicitante,
        fechaDesde,
        fechaHasta
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Construir filtros dinámicos
      const where: any = {};

      if (estado) where.estado = estado;
      if (prioridad) where.prioridad = prioridad;
      if (peritoId) where.peritoId = peritoId;
      if (tipoPeritaje) {
        where.tipoPeritaje = {
          contains: tipoPeritaje as string,
          mode: 'insensitive'
        };
      }

      // Filtros específicos adicionales
      if (numeroExpediente) {
        where.numeroExpediente = {
          contains: numeroExpediente as string,
          mode: 'insensitive'
        };
      }

      if (nombreSolicitante) {
        where.OR = [
          { nombreSolicitante: { contains: nombreSolicitante as string, mode: 'insensitive' } },
          { apellidoSolicitante: { contains: nombreSolicitante as string, mode: 'insensitive' } }
        ];
      }

      if (cedulaSolicitante) {
        where.cedulaSolicitante = {
          contains: cedulaSolicitante as string
        };
      }

      // Filtro por rango de fechas
      if (fechaDesde || fechaHasta) {
        where.fechaIngreso = {};
        if (fechaDesde) {
          where.fechaIngreso.gte = new Date(fechaDesde as string);
        }
        if (fechaHasta) {
          // Agregar 23:59:59 para incluir todo el día
          const hasta = new Date(fechaHasta as string);
          hasta.setHours(23, 59, 59, 999);
          where.fechaIngreso.lte = hasta;
        }
      }

      // Búsqueda global (sobrescribe filtros específicos si está presente)
      if (busqueda) {
        where.OR = [
          { numeroExpediente: { contains: busqueda as string, mode: 'insensitive' } },
          { nombreSolicitante: { contains: busqueda as string, mode: 'insensitive' } },
          { apellidoSolicitante: { contains: busqueda as string, mode: 'insensitive' } },
          { cedulaSolicitante: { contains: busqueda as string } },
          { tipoPeritaje: { contains: busqueda as string, mode: 'insensitive' } }
        ];
      }

      // Ejecutar queries en paralelo
      const [oficios, total] = await Promise.all([
        prisma.oficio.findMany({
          where,
          include: {
            perito: true,
            creadoPor: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true
              }
            }
          },
          orderBy: {
            [sortBy as string]: sortOrder as 'asc' | 'desc'
          },
          skip,
          take: limitNum
        }),
        prisma.oficio.count({ where })
      ]);

      const response: PaginatedResponse<any> = {
        data: oficios,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      };

      sendSuccess(res, response, 'Oficios obtenidos exitosamente');
      
    } catch (error) {
      console.error('Error obteniendo oficios:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Obtener un oficio específico por ID
  static async getOficioById(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      
      const oficio = await prisma.oficio.findUnique({
        where: { id },
        include: {
          perito: true,
          creadoPor: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true
            }
          },
          documentos: true,
          comentarios: {
            include: {
              autor: {
                select: {
                  id: true,
                  nombre: true,
                  apellido: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          citas: {
            include: {
              perito: true
            },
            orderBy: {
              fechaInicio: 'asc'
            }
          },
          historial: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
      
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
  static async createOficio(req: any, res: any): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      
      const nuevoOficio = await prisma.oficio.create({
        data: {
          ...req.body,
          creadoPorId: authReq.user?.userId
        },
        include: {
          perito: true,
          creadoPor: {
            select: {
              id: true,
              nombre: true,
              apellido: true
            }
          }
        }
      });

      // Crear registro en historial
      await prisma.historialOficio.create({
        data: {
          accion: 'CREADO',
          descripcion: 'Oficio creado en el sistema',
          oficioId: nuevoOficio.id,
          realizadoPor: authReq.user?.userId || ''
        }
      });

      sendSuccess(res, nuevoOficio, 'Oficio creado exitosamente', 201);
      
    } catch (error) {
      console.error('Error creando oficio:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Asignar perito a un oficio
  static async assignPerito(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const { peritoId } = req.body;
      const authReq = req as AuthenticatedRequest;
      
      const oficio = await prisma.oficio.findUnique({ where: { id } });
      const perito = await prisma.perito.findUnique({ where: { id: peritoId } });
      
      if (!oficio) {
        sendNotFound(res, 'Oficio no encontrado');
        return;
      }
      
      if (!perito) {
        sendNotFound(res, 'Perito no encontrado');
        return;
      }

      const oficioActualizado = await prisma.oficio.update({
        where: { id },
        data: {
          peritoId,
          fechaAsignacion: new Date(),
          estado: 'ASIGNADO'
        },
        include: {
          perito: true
        }
      });

      // Crear registro en historial
      await prisma.historialOficio.create({
        data: {
          accion: 'ASIGNADO',
          descripcion: `Oficio asignado al perito ${perito.nombre} ${perito.apellido}`,
          oficioId: id,
          realizadoPor: authReq.user?.userId || ''
        }
      });

      sendSuccess(res, oficioActualizado, 'Perito asignado exitosamente');
      
    } catch (error) {
      console.error('Error asignando perito:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Cambiar estado de un oficio
  static async changeStatus(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const { estado, observaciones } = req.body;
      const authReq = req as AuthenticatedRequest;
      
      const oficio = await prisma.oficio.findUnique({ where: { id } });
      
      if (!oficio) {
        sendNotFound(res, 'Oficio no encontrado');
        return;
      }

      const estadoAnterior = oficio.estado;

      const oficioActualizado = await prisma.oficio.update({
        where: { id },
        data: {
          estado,
          observaciones
        }
      });

      // Crear registro en historial
      await prisma.historialOficio.create({
        data: {
          accion: 'CAMBIO_ESTADO',
          descripcion: `Estado cambiado de ${estadoAnterior} a ${estado}`,
          estadoAnterior: { estado: estadoAnterior },
          estadoNuevo: { estado },
          oficioId: id,
          realizadoPor: authReq.user?.userId || ''
        }
      });

      sendSuccess(res, oficioActualizado, 'Estado del oficio actualizado exitosamente');
      
    } catch (error) {
      console.error('Error cambiando estado:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Actualizar oficio completo
  static async updateOficio(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const {
        numeroExpediente,
        nombreSolicitante,
        apellidoSolicitante,
        cedulaSolicitante,
        telefonoSolicitante,
        emailSolicitante,
        tipoPeritaje,
        descripcion,
        fechaVencimiento,
        prioridad,
        estado,
        peritoId,
        observaciones
      } = req.body;

      const authReq = req as AuthenticatedRequest;

      // Verificar que el oficio existe
      const oficioExistente = await prisma.oficio.findUnique({ where: { id } });
      
      if (!oficioExistente) {
        sendNotFound(res, 'Oficio no encontrado');
        return;
      }

      // Si se está asignando un perito, verificar que existe y está disponible
      if (peritoId && peritoId !== oficioExistente.peritoId) {
        const perito = await prisma.perito.findUnique({ where: { id: peritoId } });
        if (!perito) {
          sendNotFound(res, 'Perito no encontrado');
          return;
        }
        if (!perito.disponible) {
          sendValidationError(res, 'El perito seleccionado no está disponible');
          return;
        }
      }

      // Preparar datos de actualización
      const dataToUpdate: any = {
        numeroExpediente,
        nombreSolicitante,
        apellidoSolicitante,
        cedulaSolicitante,
        telefonoSolicitante,
        emailSolicitante,
        tipoPeritaje,
        descripcion,
        prioridad,
        estado,
        observaciones
      };

      // Convertir fechaVencimiento a Date si existe
      if (fechaVencimiento) {
        dataToUpdate.fechaVencimiento = new Date(fechaVencimiento);
      }

      // Actualizar peritoId si se proporcionó
      if (peritoId !== undefined) {
        dataToUpdate.peritoId = peritoId || null;
        
        // Si se asigna por primera vez, actualizar fechaAsignacion
        if (peritoId && !oficioExistente.peritoId) {
          dataToUpdate.fechaAsignacion = new Date();
        }
      }

      // Actualizar el oficio
      const oficioActualizado = await prisma.oficio.update({
        where: { id },
        data: dataToUpdate,
        include: {
          perito: true,
          creadoPor: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true
            }
          }
        }
      });

      // Crear registro en historial
      const cambios: string[] = [];
      if (estado !== oficioExistente.estado) cambios.push(`estado: ${oficioExistente.estado} → ${estado}`);
      if (prioridad !== oficioExistente.prioridad) cambios.push(`prioridad: ${oficioExistente.prioridad} → ${prioridad}`);
      if (peritoId && peritoId !== oficioExistente.peritoId) cambios.push('perito asignado');

      if (cambios.length > 0) {
        await prisma.historialOficio.create({
          data: {
            accion: 'ACTUALIZADO',
            descripcion: `Oficio actualizado: ${cambios.join(', ')}`,
            oficioId: id,
            realizadoPor: authReq.user?.userId || ''
          }
        });
      }

      sendSuccess(res, oficioActualizado, 'Oficio actualizado exitosamente');
      
    } catch (error) {
      console.error('Error actualizando oficio:', error);
      sendError(res, 'Error interno del servidor');
    }
  }
}
