// @ts-nocheck
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendNotFound, sendValidationError } from '../utils/response.utils';

export class CitasController {

  // Obtener lista de citas con filtros y paginación
  static async getCitas(req: any, res: any): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'fechaInicio',
        sortOrder = 'asc',
        peritoId,
        oficioId,
        tipo,
        estado,
        fechaDesde,
        fechaHasta
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = Math.min(parseInt(limit as string), 100);
      const skip = (pageNum - 1) * limitNum;

      // Construir filtros dinámicos
      const where: any = {};

      if (peritoId) where.peritoId = peritoId;
      if (oficioId) where.oficioId = oficioId;
      if (tipo) where.tipo = tipo;
      if (estado) where.estado = estado;

      // Filtro de rango de fechas
      if (fechaDesde || fechaHasta) {
        where.fechaInicio = {};
        if (fechaDesde) where.fechaInicio.gte = new Date(fechaDesde as string);
        if (fechaHasta) where.fechaInicio.lte = new Date(fechaHasta as string);
      }

      const [citas, total] = await Promise.all([
        prisma.cita.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { [sortBy as string]: sortOrder },
          include: {
            perito: {
              select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                especialidad: true
              }
            },
            oficio: {
              select: {
                id: true,
                numeroExpediente: true,
                nombreSolicitante: true,
                tipoPeritaje: true
              }
            }
          }
        }),
        prisma.cita.count({ where })
      ]);

      sendSuccess(res, {
        data: citas,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error('Error al obtener citas:', error);
      sendError(res, 'Error al obtener citas');
    }
  }

  // Obtener una cita por ID
  static async getCita(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;

      const cita = await prisma.cita.findUnique({
        where: { id },
        include: {
          perito: {
            select: {
              id: true,
              nombre: true,
              email: true,
              telefono: true,
              especialidad: true
            }
          },
          oficio: {
            select: {
              id: true,
              numeroExpediente: true,
              nombreSolicitante: true,
              apellidoSolicitante: true,
              tipoPeritaje: true
            }
          }
        }
      });

      if (!cita) {
        sendNotFound(res, 'Cita no encontrada');
        return;
      }

      sendSuccess(res, cita);
    } catch (error) {
      console.error('Error al obtener cita:', error);
      sendError(res, 'Error al obtener cita');
    }
  }

  // Crear nueva cita
  static async createCita(req: any, res: any): Promise<void> {
    try {
      const {
        titulo,
        descripcion,
        fechaInicio,
        fechaFin,
        ubicacion,
        tipo,
        estado = 'PROGRAMADA',
        oficioId,
        peritoId,
        recordatorio24h = true,
        recordatorio1h = true
      } = req.body;

      // Validaciones básicas
      if (!titulo || !fechaInicio || !fechaFin || !oficioId || !peritoId || !tipo) {
        sendValidationError(res, 'Faltan campos requeridos: titulo, fechaInicio, fechaFin, oficioId, peritoId, tipo');
        return;
      }

      // Validar que fechaFin sea posterior a fechaInicio
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (fin <= inicio) {
        sendValidationError(res, 'La fecha de fin debe ser posterior a la fecha de inicio');
        return;
      }

      // Verificar que el perito existe y está disponible
      const perito = await prisma.perito.findUnique({
        where: { id: peritoId }
      });

      if (!perito) {
        sendNotFound(res, 'Perito no encontrado');
        return;
      }

      if (!perito.activo) {
        sendValidationError(res, 'El perito no está activo');
        return;
      }

      // Verificar que el oficio existe
      const oficio = await prisma.oficio.findUnique({
        where: { id: oficioId }
      });

      if (!oficio) {
        sendNotFound(res, 'Oficio no encontrado');
        return;
      }

      // Verificar disponibilidad del perito (no tiene otra cita en ese horario)
      const citaConflicto = await prisma.cita.findFirst({
        where: {
          peritoId,
          estado: {
            in: ['PROGRAMADA', 'CONFIRMADA']
          },
          OR: [
            {
              AND: [
                { fechaInicio: { lte: inicio } },
                { fechaFin: { gte: inicio } }
              ]
            },
            {
              AND: [
                { fechaInicio: { lte: fin } },
                { fechaFin: { gte: fin } }
              ]
            },
            {
              AND: [
                { fechaInicio: { gte: inicio } },
                { fechaFin: { lte: fin } }
              ]
            }
          ]
        }
      });

      if (citaConflicto) {
        sendValidationError(res, 'El perito ya tiene una cita programada en ese horario');
        return;
      }

      // Crear la cita
      const nuevaCita = await prisma.cita.create({
        data: {
          titulo,
          descripcion,
          fechaInicio: inicio,
          fechaFin: fin,
          ubicacion,
          tipo,
          estado,
          oficioId,
          peritoId,
          recordatorio24h,
          recordatorio1h,
          notificado24h: false,
          notificado1h: false
        },
        include: {
          perito: {
            select: {
              id: true,
              nombre: true,
              email: true,
              telefono: true,
              especialidad: true
            }
          },
          oficio: {
            select: {
              id: true,
              numeroExpediente: true,
              nombreSolicitante: true,
              tipoPeritaje: true
            }
          }
        }
      });

      sendSuccess(res, nuevaCita, 'Cita creada exitosamente', 201);
    } catch (error) {
      console.error('Error al crear cita:', error);
      sendError(res, 'Error al crear cita');
    }
  }

  // Actualizar cita
  static async updateCita(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Verificar que la cita existe
      const citaExistente = await prisma.cita.findUnique({
        where: { id }
      });

      if (!citaExistente) {
        sendNotFound(res, 'Cita no encontrada');
        return;
      }

      // Si se actualiza fechaInicio o fechaFin, validar
      if (updates.fechaInicio || updates.fechaFin) {
        const inicio = updates.fechaInicio ? new Date(updates.fechaInicio) : citaExistente.fechaInicio;
        const fin = updates.fechaFin ? new Date(updates.fechaFin) : citaExistente.fechaFin;

        if (fin <= inicio) {
          sendValidationError(res, 'La fecha de fin debe ser posterior a la fecha de inicio');
          return;
        }

        // Verificar disponibilidad del perito si se cambian las fechas
        const peritoId = updates.peritoId || citaExistente.peritoId;

        const citaConflicto = await prisma.cita.findFirst({
          where: {
            id: { not: id },
            peritoId,
            estado: {
              in: ['PROGRAMADA', 'CONFIRMADA']
            },
            OR: [
              {
                AND: [
                  { fechaInicio: { lte: inicio } },
                  { fechaFin: { gte: inicio } }
                ]
              },
              {
                AND: [
                  { fechaInicio: { lte: fin } },
                  { fechaFin: { gte: fin } }
                ]
              },
              {
                AND: [
                  { fechaInicio: { gte: inicio } },
                  { fechaFin: { lte: fin } }
                ]
              }
            ]
          }
        });

        if (citaConflicto) {
          sendValidationError(res, 'El perito ya tiene una cita programada en ese horario');
          return;
        }

        updates.fechaInicio = inicio;
        updates.fechaFin = fin;
      }

      // Actualizar la cita
      const citaActualizada = await prisma.cita.update({
        where: { id },
        data: updates,
        include: {
          perito: {
            select: {
              id: true,
              nombre: true,
              email: true,
              telefono: true,
              especialidad: true
            }
          },
          oficio: {
            select: {
              id: true,
              numeroExpediente: true,
              nombreSolicitante: true,
              tipoPeritaje: true
            }
          }
        }
      });

      sendSuccess(res, citaActualizada, 'Cita actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      sendError(res, 'Error al actualizar cita');
    }
  }

  // Eliminar cita
  static async deleteCita(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;

      const cita = await prisma.cita.findUnique({
        where: { id }
      });

      if (!cita) {
        sendNotFound(res, 'Cita no encontrada');
        return;
      }

      await prisma.cita.delete({
        where: { id }
      });

      sendSuccess(res, null, 'Cita eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      sendError(res, 'Error al eliminar cita');
    }
  }

  // Cambiar estado de una cita
  static async cambiarEstado(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
        sendValidationError(res, 'El estado es requerido');
        return;
      }

      const estadosValidos = ['PROGRAMADA', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'REPROGRAMADA'];
      if (!estadosValidos.includes(estado)) {
        sendValidationError(res, 'Estado inválido');
        return;
      }

      const cita = await prisma.cita.findUnique({
        where: { id }
      });

      if (!cita) {
        sendNotFound(res, 'Cita no encontrada');
        return;
      }

      const citaActualizada = await prisma.cita.update({
        where: { id },
        data: { estado },
        include: {
          perito: {
            select: {
              id: true,
              nombre: true,
              email: true,
              telefono: true,
              especialidad: true
            }
          },
          oficio: {
            select: {
              id: true,
              numeroExpediente: true,
              nombreSolicitante: true,
              tipoPeritaje: true
            }
          }
        }
      });

      sendSuccess(res, citaActualizada, 'Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      sendError(res, 'Error al cambiar estado');
    }
  }

  // Obtener citas de un perito
  static async getCitasPerito(req: any, res: any): Promise<void> {
    try {
      const { peritoId } = req.params;
      const { fechaDesde, fechaHasta } = req.query;

      const where: any = { peritoId };

      if (fechaDesde || fechaHasta) {
        where.fechaInicio = {};
        if (fechaDesde) where.fechaInicio.gte = new Date(fechaDesde as string);
        if (fechaHasta) where.fechaInicio.lte = new Date(fechaHasta as string);
      }

      const citas = await prisma.cita.findMany({
        where,
        orderBy: { fechaInicio: 'asc' },
        include: {
          oficio: {
            select: {
              id: true,
              numeroExpediente: true,
              nombreSolicitante: true,
              tipoPeritaje: true
            }
          }
        }
      });

      sendSuccess(res, citas);
    } catch (error) {
      console.error('Error al obtener citas del perito:', error);
      sendError(res, 'Error al obtener citas del perito');
    }
  }

  // Obtener citas de un oficio
  static async getCitasOficio(req: any, res: any): Promise<void> {
    try {
      const { oficioId } = req.params;

      const citas = await prisma.cita.findMany({
        where: { oficioId },
        orderBy: { fechaInicio: 'asc' },
        include: {
          perito: {
            select: {
              id: true,
              nombre: true,
              email: true,
              telefono: true,
              especialidad: true
            }
          }
        }
      });

      sendSuccess(res, citas);
    } catch (error) {
      console.error('Error al obtener citas del oficio:', error);
      sendError(res, 'Error al obtener citas del oficio');
    }
  }

  // Obtener citas próximas (para notificaciones)
  static async getCitasProximas(req: any, res: any): Promise<void> {
    try {
      const { horas = 24 } = req.query;
      const horasNum = parseInt(horas as string);

      const ahora = new Date();
      const limite = new Date(ahora.getTime() + horasNum * 60 * 60 * 1000);

      const citas = await prisma.cita.findMany({
        where: {
          fechaInicio: {
            gte: ahora,
            lte: limite
          },
          estado: {
            in: ['PROGRAMADA', 'CONFIRMADA']
          }
        },
        orderBy: { fechaInicio: 'asc' },
        include: {
          perito: {
            select: {
              id: true,
              nombre: true,
              email: true,
              telefono: true
            }
          },
          oficio: {
            select: {
              id: true,
              numeroExpediente: true,
              nombreSolicitante: true
            }
          }
        }
      });

      sendSuccess(res, citas);
    } catch (error) {
      console.error('Error al obtener citas próximas:', error);
      sendError(res, 'Error al obtener citas próximas');
    }
  }

  // Verificar disponibilidad de perito
  static async verificarDisponibilidad(req: any, res: any): Promise<void> {
    try {
      const { peritoId, fechaInicio, fechaFin, citaId } = req.query;

      if (!peritoId || !fechaInicio || !fechaFin) {
        sendValidationError(res, 'peritoId, fechaInicio y fechaFin son requeridos');
        return;
      }

      const inicio = new Date(fechaInicio as string);
      const fin = new Date(fechaFin as string);

      const where: any = {
        peritoId: peritoId as string,
        estado: {
          in: ['PROGRAMADA', 'CONFIRMADA']
        },
        OR: [
          {
            AND: [
              { fechaInicio: { lte: inicio } },
              { fechaFin: { gte: inicio } }
            ]
          },
          {
            AND: [
              { fechaInicio: { lte: fin } },
              { fechaFin: { gte: fin } }
            ]
          },
          {
            AND: [
              { fechaInicio: { gte: inicio } },
              { fechaFin: { lte: fin } }
            ]
          }
        ]
      };

      // Si se proporciona citaId, excluirla de la búsqueda
      if (citaId) {
        where.id = { not: citaId as string };
      }

      const citaConflicto = await prisma.cita.findFirst({ where });

      sendSuccess(res, {
        disponible: !citaConflicto,
        citaConflicto: citaConflicto || null
      });
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      sendError(res, 'Error al verificar disponibilidad');
    }
  }
}
