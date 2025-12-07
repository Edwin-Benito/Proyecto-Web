import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { sendSuccess, sendError } from '../utils/response.utils'

// Obtener estadísticas del dashboard
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Contar oficios por estado
    const oficiosPorEstado = await prisma.oficio.groupBy({
      by: ['estado'],
      _count: {
        id: true
      }
    })

    // Contar oficios por prioridad
    const oficiosPorPrioridad = await prisma.oficio.groupBy({
      by: ['prioridad'],
      _count: {
        id: true
      }
    })

    // Total de oficios
    const totalOficios = await prisma.oficio.count()

    // Total de peritos activos
    const peritosActivos = await prisma.perito.count({
      where: { activo: true }
    })

    // Total de citas
    const totalCitas = await prisma.cita.count()

    // Citas de hoy
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)

    const citasHoy = await prisma.cita.count({
      where: {
        fechaInicio: {
          gte: hoy,
          lt: manana
        }
      }
    })

    // Citas pendientes (futuras)
    const citasPendientes = await prisma.cita.count({
      where: {
        fechaInicio: {
          gte: new Date()
        },
        estado: {
          in: ['PROGRAMADA', 'CONFIRMADA']
        }
      }
    })

    return sendSuccess(res, {
      oficiosPorEstado: oficiosPorEstado.map((item: any) => ({
        estado: item.estado,
        count: item._count.id
      })),
      oficiosPorPrioridad: oficiosPorPrioridad.map((item: any) => ({
        prioridad: item.prioridad,
        count: item._count.id
      })),
      totales: {
        oficios: totalOficios,
        peritosActivos,
        citas: totalCitas,
        citasHoy,
        citasPendientes
      }
    })
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    return sendError(res, 'Error al obtener estadísticas del dashboard', 500)
  }
}

// Obtener estadísticas de citas por mes (últimos 6 meses)
export const getCitasPorMes = async (req: Request, res: Response) => {
  try {
    const seisMesesAtras = new Date()
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6)

    const citas = await prisma.cita.findMany({
      where: {
        fechaInicio: {
          gte: seisMesesAtras
        }
      },
      select: {
        fechaInicio: true
      }
    })

    // Agrupar por mes
    const citasPorMes = citas.reduce((acc: any, cita: any) => {
      const mes = new Date(cita.fechaInicio).toISOString().slice(0, 7) // YYYY-MM
      acc[mes] = (acc[mes] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Generar array con todos los meses (incluso los que tienen 0 citas)
    const meses = []
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date()
      fecha.setMonth(fecha.getMonth() - i)
      const mesKey = fecha.toISOString().slice(0, 7)
      meses.push({
        mes: mesKey,
        count: citasPorMes[mesKey] || 0
      })
    }

    return sendSuccess(res, meses)
  } catch (error) {
    console.error('Error getting citas por mes:', error)
    return sendError(res, 'Error al obtener citas por mes', 500)
  }
}

// Obtener peritos más activos
export const getPeritosMasActivos = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10

    const peritosConCitas = await prisma.perito.findMany({
      where: {
        activo: true
      },
      include: {
        _count: {
          select: {
            oficiosAsignados: true,
            citas: true
          }
        }
      },
      orderBy: {
        citas: {
          _count: 'desc'
        }
      },
      take: limit
    })

    const resultado = peritosConCitas.map((perito: any) => ({
      id: perito.id,
      nombre: `${perito.nombre} ${perito.apellido}`,
      especialidad: perito.especialidad,
      oficiosAsignados: perito._count.oficiosAsignados,
      citasRealizadas: perito._count.citas,
      total: perito._count.oficiosAsignados + perito._count.citas
    }))

    return sendSuccess(res, resultado)
  } catch (error) {
    console.error('Error getting peritos más activos:', error)
    return sendError(res, 'Error al obtener peritos más activos', 500)
  }
}

// Obtener tendencias (comparación con periodo anterior)
export const getTendencias = async (req: Request, res: Response) => {
  try {
    const ahora = new Date()
    const inicioMesActual = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)

    // Oficios este mes
    const oficiosMesActual = await prisma.oficio.count({
      where: {
        fechaIngreso: {
          gte: inicioMesActual
        }
      }
    })

    // Oficios mes anterior
    const oficiosMesAnterior = await prisma.oficio.count({
      where: {
        fechaIngreso: {
          gte: inicioMesAnterior,
          lt: inicioMesActual
        }
      }
    })

    // Citas este mes
    const citasMesActual = await prisma.cita.count({
      where: {
        fechaInicio: {
          gte: inicioMesActual
        }
      }
    })

    // Citas mes anterior
    const citasMesAnterior = await prisma.cita.count({
      where: {
        fechaInicio: {
          gte: inicioMesAnterior,
          lt: inicioMesActual
        }
      }
    })

    // Calcular porcentajes de cambio
    const cambioOficios = oficiosMesAnterior > 0
      ? ((oficiosMesActual - oficiosMesAnterior) / oficiosMesAnterior) * 100
      : 0

    const cambioCitas = citasMesAnterior > 0
      ? ((citasMesActual - citasMesAnterior) / citasMesAnterior) * 100
      : 0

    return sendSuccess(res, {
      oficios: {
        actual: oficiosMesActual,
        anterior: oficiosMesAnterior,
        cambio: Math.round(cambioOficios * 100) / 100,
        tendencia: cambioOficios > 0 ? 'up' : cambioOficios < 0 ? 'down' : 'stable'
      },
      citas: {
        actual: citasMesActual,
        anterior: citasMesAnterior,
        cambio: Math.round(cambioCitas * 100) / 100,
        tendencia: cambioCitas > 0 ? 'up' : cambioCitas < 0 ? 'down' : 'stable'
      }
    })
  } catch (error) {
    console.error('Error getting tendencias:', error)
    return sendError(res, 'Error al obtener tendencias', 500)
  }
}
