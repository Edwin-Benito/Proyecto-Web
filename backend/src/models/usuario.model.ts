import { Usuario } from '../types';

export const usuarios: Usuario[] = [
  {
    id: '1',
    email: 'admin@peritos.com',
    password: 'admin123', // En producción usar hash
    nombre: 'Administrador',
    apellido: 'Sistema',
    rol: 'administrador',
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2', 
    email: 'coordinador@peritos.com',
    password: 'coord123',
    nombre: 'María',
    apellido: 'Coordinadora',
    rol: 'coordinador',
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'perito@peritos.com', 
    password: 'perito123',
    nombre: 'Juan',
    apellido: 'Perito',
    rol: 'perito',
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Funciones helper para el modelo de Usuario
export const findUserByEmail = (email: string): Usuario | undefined => {
  return usuarios.find(u => u.email === email);
};

export const findUserById = (id: string): Usuario | undefined => {
  return usuarios.find(u => u.id === id);
};

export const getUsersWithoutPassword = () => {
  return usuarios.map(({ password, ...usuario }) => usuario);
};