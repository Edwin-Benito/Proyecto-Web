import { Perito } from '../types';

export const peritos: Perito[] = [
  {
    id: '1',
    nombre: 'Dr. Carlos',
    apellido: 'Mendoza',
    cedula: '1234567890',
    especialidad: ['Medicina General', 'Traumatología'],
    telefono: '+52 555 0100',
    email: 'carlos.mendoza@peritos.com',
    activo: true,
    casosAsignados: 5,
    disponible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    nombre: 'Dra. Ana',
    apellido: 'González',
    cedula: '9876543210',
    especialidad: ['Psicología', 'Psiquiatría'],
    telefono: '+52 555 0200',
    email: 'ana.gonzalez@peritos.com',
    activo: true,
    casosAsignados: 3,
    disponible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Funciones helper para el modelo de Perito
export const findPeritoById = (id: string): Perito | undefined => {
  return peritos.find(p => p.id === id);
};

export const getPeritosActivos = (): Perito[] => {
  return peritos.filter(p => p.activo);
};

export const getPeritosDisponibles = (): Perito[] => {
  return peritos.filter(p => p.activo && p.disponible);
};