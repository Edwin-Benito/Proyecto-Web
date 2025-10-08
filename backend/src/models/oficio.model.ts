import { Oficio } from '../types';
import { peritos } from './perito.model';

export let oficios: Oficio[] = [
  {
    id: '1',
    numeroExpediente: '2024-001',
    nombreSolicitante: 'María',
    apellidoSolicitante: 'García López',
    cedulaSolicitante: '12345678901',
    telefonoSolicitante: '+52 555 0123',
    emailSolicitante: 'maria.garcia@email.com',
    tipoPeritaje: 'Peritaje Médico',
    descripcion: 'Evaluación médica para determinar grado de incapacidad',
    fechaIngreso: new Date('2024-01-15').toISOString(),
    fechaVencimiento: new Date('2024-02-15').toISOString(),
    estado: 'pendiente',
    prioridad: 'media',
    documentos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    numeroExpediente: '2024-002',
    nombreSolicitante: 'Juan',
    apellidoSolicitante: 'Pérez Martín',
    cedulaSolicitante: '98765432109',
    telefonoSolicitante: '+52 555 0456',
    emailSolicitante: 'juan.perez@email.com',
    tipoPeritaje: 'Peritaje Psicológico',
    descripcion: 'Evaluación psicológica para caso de divorcio',
    fechaIngreso: new Date('2024-01-20').toISOString(),
    fechaAsignacion: new Date('2024-01-22').toISOString(),
    fechaVencimiento: new Date('2024-02-20').toISOString(),
    estado: 'asignado',
    prioridad: 'alta',
    peritoId: '2',
    peritoAsignado: peritos[1],
    documentos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    numeroExpediente: '2024-003',
    nombreSolicitante: 'Ana',
    apellidoSolicitante: 'Rodríguez Silva',
    cedulaSolicitante: '11223344556',
    telefonoSolicitante: '+52 555 0789',
    emailSolicitante: 'ana.rodriguez@email.com',
    tipoPeritaje: 'Peritaje Médico',
    descripcion: 'Evaluación de lesiones por accidente laboral',
    fechaIngreso: new Date('2024-01-25').toISOString(),
    fechaAsignacion: new Date('2024-01-26').toISOString(),
    fechaCita: new Date('2024-02-01').toISOString(),
    fechaVencimiento: new Date('2024-02-25').toISOString(),
    estado: 'en_proceso',
    prioridad: 'urgente',
    peritoId: '1',
    peritoAsignado: peritos[0],
    documentos: [],
    observaciones: 'Caso urgente, requiere atención inmediata',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Funciones helper para el modelo de Oficio
export const findOficioById = (id: string): Oficio | undefined => {
  return oficios.find(o => o.id === id);
};

export const createOficio = (oficio: Omit<Oficio, 'id' | 'createdAt' | 'updatedAt'>): Oficio => {
  const newOficio: Oficio = {
    ...oficio,
    id: (oficios.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  oficios.push(newOficio);
  return newOficio;
};

export const updateOficio = (id: string, updates: Partial<Oficio>): Oficio | null => {
  const index = oficios.findIndex(o => o.id === id);
  if (index === -1) return null;
  
  oficios[index] = {
    ...oficios[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return oficios[index];
};

export const deleteOficio = (id: string): boolean => {
  const index = oficios.findIndex(o => o.id === id);
  if (index === -1) return false;
  
  oficios.splice(index, 1);
  return true;
};