import { Request, Response } from 'express';
import { peritos, getPeritosActivos, getPeritosDisponibles } from '../models/perito.model';
import { sendSuccess, sendError } from '../utils/response.utils';

export class PeritosController {

  // Obtener lista de peritos
  static async getPeritos(req: Request, res: Response): Promise<void> {
    try {
      const { activos, disponibles } = req.query;
      
      let resultado = peritos;
      
      if (activos === 'true') {
        resultado = getPeritosActivos();
      } else if (disponibles === 'true') {
        resultado = getPeritosDisponibles();
      }

      sendSuccess(res, resultado, 'Peritos obtenidos exitosamente');
      
    } catch (error) {
      console.error('Error obteniendo peritos:', error);
      sendError(res, 'Error interno del servidor');
    }
  }
}