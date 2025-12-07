// @ts-nocheck
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendNotFound } from '../utils/response.utils';

export class PeritosController {

  // Obtener lista de peritos con filtros y paginación
  static async getPeritos(req: any, res: any): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        activo,
        disponible,
        especialidad,
        busqueda
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Construir filtros dinámicos
      const where: any = {};

      if (activo !== undefined) where.activo = activo === 'true';
      if (disponible !== undefined) where.disponible = disponible === 'true';
      if (especialidad) {
        where.especialidad = {
          contains: especialidad as string,
          mode: 'insensitive'
        };
      }
      if (busqueda) {
        where.OR = [
          { nombre: { contains: busqueda as string, mode: 'insensitive' } },
          { apellido: { contains: busqueda as string, mode: 'insensitive' } },
          { cedula: { contains: busqueda as string } },
          { email: { contains: busqueda as string, mode: 'insensitive' } }
        ];
      }

      // Ejecutar queries en paralelo
      const [peritos, total] = await Promise.all([
        prisma.perito.findMany({
          where,
          include: {
            _count: {
              select: {
                oficiosAsignados: true,
                citas: true
              }
            }
          },
          orderBy: {
            nombre: 'asc'
          },
          skip,
          take: limitNum
        }),
        prisma.perito.count({ where })
      ]);

      const response = {
        data: peritos,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      };

      sendSuccess(res, response, 'Peritos obtenidos exitosamente');
      
    } catch (error) {
      console.error('Error obteniendo peritos:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Obtener un perito específico por ID
  static async getPeritoById(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      
      const perito = await prisma.perito.findUnique({
        where: { id },
        include: {
          oficiosAsignados: {
            orderBy: {
              fechaIngreso: 'desc'
            },
            take: 10
          },
          citas: {
            orderBy: {
              fechaInicio: 'desc'
            },
            take: 10
          },
          _count: {
            select: {
              oficiosAsignados: true,
              citas: true
            }
          }
        }
      });
      
      if (!perito) {
        sendNotFound(res, 'Perito no encontrado');
        return;
      }

      sendSuccess(res, perito, 'Perito obtenido exitosamente');
      
    } catch (error) {
      console.error('Error obteniendo perito:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Crear un nuevo perito
  static async createPerito(req: any, res: any): Promise<void> {
    try {
      const nuevoPerito = await prisma.perito.create({
        data: req.body
      });

      sendSuccess(res, nuevoPerito, 'Perito creado exitosamente', 201);
      
    } catch (error) {
      console.error('Error creando perito:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Actualizar perito
  static async updatePerito(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      
      const perito = await prisma.perito.findUnique({ where: { id } });
      
      if (!perito) {
        sendNotFound(res, 'Perito no encontrado');
        return;
      }

      const peritoActualizado = await prisma.perito.update({
        where: { id },
        data: req.body
      });

      sendSuccess(res, peritoActualizado, 'Perito actualizado exitosamente');
      
    } catch (error) {
      console.error('Error actualizando perito:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Cambiar disponibilidad de un perito
  static async toggleDisponibilidad(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      
      const perito = await prisma.perito.findUnique({ where: { id } });
      
      if (!perito) {
        sendNotFound(res, 'Perito no encontrado');
        return;
      }

      const peritoActualizado = await prisma.perito.update({
        where: { id },
        data: {
          disponible: !perito.disponible
        }
      });

      sendSuccess(res, peritoActualizado, 'Disponibilidad actualizada exitosamente');
      
    } catch (error) {
      console.error('Error actualizando disponibilidad:', error);
      sendError(res, 'Error interno del servidor');
    }
  }

  // Eliminar perito (soft delete)
  static async deletePerito(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      
      const perito = await prisma.perito.findUnique({ where: { id } });
      
      if (!perito) {
        sendNotFound(res, 'Perito no encontrado');
        return;
      }

      await prisma.perito.update({
        where: { id },
        data: {
          activo: false
        }
      });

      sendSuccess(res, null, 'Perito eliminado exitosamente');
      
    } catch (error) {
      console.error('Error eliminando perito:', error);
      sendError(res, 'Error interno del servidor');
    }
  }
}
