import { z } from 'zod'

// Schema para Oficio
export const oficioSchema = z.object({
  numeroExpediente: z.string()
    .min(1, 'El número de expediente es requerido')
    .max(50, 'El número de expediente no puede exceder 50 caracteres')
    .regex(/^[A-Z0-9\-\/]+$/, 'Solo se permiten letras mayúsculas, números, guiones y barras'),
  
  nombreSolicitante: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  apellidoSolicitante: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  tipoPeritaje: z.string()
    .min(1, 'El tipo de peritaje es requerido')
    .max(100, 'El tipo de peritaje no puede exceder 100 caracteres'),
  
  descripcion: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .optional()
    .or(z.literal('')),
  
  prioridad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'URGENTE'], {
    errorMap: () => ({ message: 'Seleccione una prioridad válida' })
  }),
  
  estado: z.enum(['PENDIENTE', 'EN_REVISION', 'ASIGNADO', 'EN_PROCESO', 'COMPLETADO', 'ARCHIVADO'], {
    errorMap: () => ({ message: 'Seleccione un estado válido' })
  }).optional(),
  
  peritoId: z.string()
    .uuid('ID de perito inválido')
    .optional()
    .nullable()
})

export type OficioFormData = z.infer<typeof oficioSchema>

// Schema para Perito
export const peritoSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  apellido: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  especialidad: z.string()
    .min(3, 'La especialidad debe tener al menos 3 caracteres')
    .max(100, 'La especialidad no puede exceder 100 caracteres'),
  
  telefono: z.string()
    .regex(/^[0-9]{10}$/, 'El teléfono debe tener exactamente 10 dígitos')
    .optional()
    .or(z.literal('')),
  
  email: z.string()
    .email('Email inválido')
    .max(100, 'El email no puede exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  estado: z.enum(['ACTIVO', 'INACTIVO', 'SUSPENDIDO'], {
    errorMap: () => ({ message: 'Seleccione un estado válido' })
  }).optional()
})

export type PeritoFormData = z.infer<typeof peritoSchema>

// Schema para Cita
export const citaSchema = z.object({
  oficioId: z.string()
    .uuid('ID de oficio inválido')
    .min(1, 'Debe seleccionar un oficio'),
  
  peritoId: z.string()
    .uuid('ID de perito inválido')
    .min(1, 'Debe seleccionar un perito'),
  
  fechaHora: z.date({
    required_error: 'La fecha y hora son requeridas',
    invalid_type_error: 'Fecha inválida'
  })
    .refine((date) => date > new Date(), {
      message: 'La fecha debe ser futura'
    }),
  
  duracionMinutos: z.number()
    .int('La duración debe ser un número entero')
    .min(15, 'La duración mínima es 15 minutos')
    .max(480, 'La duración máxima es 8 horas (480 minutos)')
    .default(60),
  
  lugar: z.string()
    .min(5, 'El lugar debe tener al menos 5 caracteres')
    .max(200, 'El lugar no puede exceder 200 caracteres'),
  
  notas: z.string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
  
  estado: z.enum(['PROGRAMADA', 'CONFIRMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA', 'REAGENDADA'], {
    errorMap: () => ({ message: 'Seleccione un estado válido' })
  }).optional()
})

export type CitaFormData = z.infer<typeof citaSchema>

// Schema para Login
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
})

export type LoginFormData = z.infer<typeof loginSchema>

// Schema para cambio de contraseña
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'La contraseña actual es requerida'),
  
  newPassword: z.string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  confirmPassword: z.string()
    .min(1, 'Debe confirmar la contraseña')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

// Helpers para validación
export const validateOficio = (data: unknown) => {
  return oficioSchema.safeParse(data)
}

export const validatePerito = (data: unknown) => {
  return peritoSchema.safeParse(data)
}

export const validateCita = (data: unknown) => {
  return citaSchema.safeParse(data)
}

export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data)
}
