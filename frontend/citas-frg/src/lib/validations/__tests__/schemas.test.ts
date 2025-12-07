import { 
  validateOficio, 
  validatePerito, 
  validateCita,
  validateLogin 
} from '../schemas'

describe('Validation Schemas', () => {
  describe('oficioSchema', () => {
    it('should validate a valid oficio', () => {
      const validOficio = {
        numeroExpediente: 'EXP-2024-001',
        nombreSolicitante: 'Juan',
        apellidoSolicitante: 'Pérez',
        tipoPeritaje: 'Grafoscopía',
        descripcion: 'Análisis de documentos',
        prioridad: 'MEDIA' as const,
      }

      const result = validateOficio(validOficio)
      expect(result.success).toBe(true)
    })

    it('should reject invalid numeroExpediente', () => {
      const invalidOficio = {
        numeroExpediente: 'exp-2024', // minúsculas no permitidas
        nombreSolicitante: 'Juan',
        apellidoSolicitante: 'Pérez',
        tipoPeritaje: 'Grafoscopía',
        prioridad: 'MEDIA' as const,
      }

      const result = validateOficio(invalidOficio)
      expect(result.success).toBe(false)
    })

    it('should reject nombres with numbers', () => {
      const invalidOficio = {
        numeroExpediente: 'EXP-2024-001',
        nombreSolicitante: 'Juan123', // números no permitidos
        apellidoSolicitante: 'Pérez',
        tipoPeritaje: 'Grafoscopía',
        prioridad: 'MEDIA' as const,
      }

      const result = validateOficio(invalidOficio)
      expect(result.success).toBe(false)
    })

    it('should reject short descripcion', () => {
      const invalidOficio = {
        numeroExpediente: 'EXP-2024-001',
        nombreSolicitante: 'Juan',
        apellidoSolicitante: 'Pérez',
        tipoPeritaje: 'Grafoscopía',
        descripcion: 'corto', // menos de 10 caracteres
        prioridad: 'MEDIA' as const,
      }

      const result = validateOficio(invalidOficio)
      expect(result.success).toBe(false)
    })
  })

  describe('peritoSchema', () => {
    it('should validate a valid perito', () => {
      const validPerito = {
        nombre: 'María',
        apellido: 'González',
        especialidad: 'Grafoscopía',
        telefono: '5512345678',
        email: 'maria@example.com',
      }

      const result = validatePerito(validPerito)
      expect(result.success).toBe(true)
    })

    it('should reject invalid telefono', () => {
      const invalidPerito = {
        nombre: 'María',
        apellido: 'González',
        especialidad: 'Grafoscopía',
        telefono: '123', // menos de 10 dígitos
        email: 'maria@example.com',
      }

      const result = validatePerito(invalidPerito)
      expect(result.success).toBe(false)
    })

    it('should reject invalid email', () => {
      const invalidPerito = {
        nombre: 'María',
        apellido: 'González',
        especialidad: 'Grafoscopía',
        telefono: '5512345678',
        email: 'invalid-email', // email inválido
      }

      const result = validatePerito(invalidPerito)
      expect(result.success).toBe(false)
    })
  })

  describe('citaSchema', () => {
    it('should validate a valid cita', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)

      const validCita = {
        oficioId: '123e4567-e89b-12d3-a456-426614174000',
        peritoId: '123e4567-e89b-12d3-a456-426614174001',
        fechaHora: futureDate,
        duracionMinutos: 60,
        lugar: 'Sala de juntas 1',
        notas: 'Llevar documentación',
      }

      const result = validateCita(validCita)
      expect(result.success).toBe(true)
    })

    it('should reject past date', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)

      const invalidCita = {
        oficioId: '123e4567-e89b-12d3-a456-426614174000',
        peritoId: '123e4567-e89b-12d3-a456-426614174001',
        fechaHora: pastDate,
        duracionMinutos: 60,
        lugar: 'Sala de juntas 1',
      }

      const result = validateCita(invalidCita)
      expect(result.success).toBe(false)
    })

    it('should reject invalid UUID', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)

      const invalidCita = {
        oficioId: 'invalid-uuid',
        peritoId: '123e4567-e89b-12d3-a456-426614174001',
        fechaHora: futureDate,
        duracionMinutos: 60,
        lugar: 'Sala de juntas 1',
      }

      const result = validateCita(invalidCita)
      expect(result.success).toBe(false)
    })
  })

  describe('loginSchema', () => {
    it('should validate valid login', () => {
      const validLogin = {
        email: 'user@example.com',
        password: 'password123',
      }

      const result = validateLogin(validLogin)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidLogin = {
        email: 'not-an-email',
        password: 'password123',
      }

      const result = validateLogin(invalidLogin)
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const invalidLogin = {
        email: 'user@example.com',
        password: '12345', // menos de 6 caracteres
      }

      const result = validateLogin(invalidLogin)
      expect(result.success).toBe(false)
    })
  })
})
