import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import {
  getDashboardStats,
  getCitasPorMes,
  getPeritosMasActivos,
  getTendencias
} from '../controllers/stats.controller'

const router = Router()

// Todas las rutas requieren autenticación
router.use(authMiddleware)

// GET /api/stats/dashboard - Estadísticas generales del dashboard
router.get('/dashboard', getDashboardStats)

// GET /api/stats/citas-mes - Citas por mes (últimos 6 meses)
router.get('/citas-mes', getCitasPorMes)

// GET /api/stats/peritos-activos - Top peritos más activos
router.get('/peritos-activos', getPeritosMasActivos)

// GET /api/stats/tendencias - Tendencias comparativas
router.get('/tendencias', getTendencias)

export default router
