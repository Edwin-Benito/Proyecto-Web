import { PrismaClient, Rol, EstadoOficio, Prioridad } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de base de datos...')

  // Limpiar base de datos (opcional - comentar en producción)
  await prisma.notificacion.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.historialOficio.deleteMany()
  await prisma.cita.deleteMany()
  await prisma.comentario.deleteMany()
  await prisma.documento.deleteMany()
  await prisma.oficio.deleteMany()
  await prisma.perito.deleteMany()
  await prisma.usuario.deleteMany()

  console.log('✅ Base de datos limpiada')

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@peritos.com',
      password: hashedPassword,
      nombre: 'Admin',
      apellido: 'Sistema',
      rol: Rol.ADMINISTRADOR,
      activo: true,
    },
  })

  const coordinador = await prisma.usuario.create({
    data: {
      email: 'coordinador@peritos.com',
      password: hashedPassword,
      nombre: 'María',
      apellido: 'Coordinadora',
      rol: Rol.COORDINADOR,
      activo: true,
    },
  })

  console.log('✅ Usuarios creados:', { admin: admin.email, coordinador: coordinador.email })

  // Crear peritos
  const perito1 = await prisma.perito.create({
    data: {
      nombre: 'Dr. Carlos',
      apellido: 'Mendoza',
      cedula: '1234567890',
      especialidad: 'Medicina General,Traumatología',
      telefono: '+52 555 0100',
      email: 'carlos.mendoza@peritos.com',
      activo: true,
      disponible: true,
    },
  })

  const perito2 = await prisma.perito.create({
    data: {
      nombre: 'Dra. Ana',
      apellido: 'González',
      cedula: '9876543210',
      especialidad: 'Psicología,Psiquiatría',
      telefono: '+52 555 0200',
      email: 'ana.gonzalez@peritos.com',
      activo: true,
      disponible: true,
    },
  })

  const perito3 = await prisma.perito.create({
    data: {
      nombre: 'Ing. Roberto',
      apellido: 'Silva',
      cedula: '5555555555',
      especialidad: 'Ingeniería Automotriz,Balística',
      telefono: '+52 555 0300',
      email: 'roberto.silva@peritos.com',
      activo: true,
      disponible: false,
    },
  })

  console.log('✅ Peritos creados:', perito1.email, perito2.email, perito3.email)

  // Crear oficios
  const oficios = await Promise.all([
    prisma.oficio.create({
      data: {
        numeroExpediente: '2024-001',
        nombreSolicitante: 'María',
        apellidoSolicitante: 'García López',
        cedulaSolicitante: '12345678901',
        telefonoSolicitante: '+52 555 0123',
        emailSolicitante: 'maria.garcia@email.com',
        tipoPeritaje: 'Peritaje Médico',
        descripcion: 'Evaluación médica para determinar grado de incapacidad por accidente laboral',
        fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        estado: EstadoOficio.PENDIENTE,
        prioridad: Prioridad.MEDIA,
        creadoPorId: coordinador.id,
      },
    }),
    prisma.oficio.create({
      data: {
        numeroExpediente: '2024-002',
        nombreSolicitante: 'Juan',
        apellidoSolicitante: 'Pérez Martín',
        cedulaSolicitante: '98765432109',
        telefonoSolicitante: '+52 555 0456',
        emailSolicitante: 'juan.perez@email.com',
        tipoPeritaje: 'Peritaje Psicológico',
        descripcion: 'Evaluación psicológica para caso de divorcio y custodia de menores',
        fechaAsignacion: new Date(),
        fechaVencimiento: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 días
        estado: EstadoOficio.ASIGNADO,
        prioridad: Prioridad.ALTA,
        peritoId: perito2.id,
        creadoPorId: coordinador.id,
      },
    }),
    prisma.oficio.create({
      data: {
        numeroExpediente: '2024-003',
        nombreSolicitante: 'Ana',
        apellidoSolicitante: 'Rodríguez Silva',
        cedulaSolicitante: '11223344556',
        telefonoSolicitante: '+52 555 0789',
        emailSolicitante: 'ana.rodriguez@email.com',
        tipoPeritaje: 'Peritaje Médico',
        descripcion: 'Evaluación de lesiones por accidente de tránsito - Caso urgente',
        fechaAsignacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Hace 2 días
        fechaCita: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // En 3 días
        fechaVencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días
        estado: EstadoOficio.EN_PROCESO,
        prioridad: Prioridad.URGENTE,
        peritoId: perito1.id,
        creadoPorId: admin.id,
        observaciones: 'Caso urgente, requiere atención inmediata',
      },
    }),
    prisma.oficio.create({
      data: {
        numeroExpediente: '2024-004',
        nombreSolicitante: 'Pedro',
        apellidoSolicitante: 'Martínez Ruiz',
        cedulaSolicitante: '22334455667',
        telefonoSolicitante: '+52 555 0111',
        tipoPeritaje: 'Peritaje Automotriz',
        descripcion: 'Evaluación de daños vehiculares por colisión',
        fechaAsignacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        fechaVencimiento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        estado: EstadoOficio.REVISION,
        prioridad: Prioridad.MEDIA,
        peritoId: perito3.id,
        creadoPorId: coordinador.id,
      },
    }),
  ])

  console.log('✅ Oficios creados:', oficios.length)

  // Crear citas
  const cita = await prisma.cita.create({
    data: {
      titulo: 'Evaluación médica - Caso 2024-003',
      descripcion: 'Primera evaluación de lesiones por accidente',
      fechaInicio: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // En 3 días a las 9:00 AM
      fechaFin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // Hasta las 10:00 AM
      ubicacion: 'Consultorio Central - Piso 3',
      oficioId: oficios[2].id,
      peritoId: perito1.id,
    },
  })

  console.log('✅ Cita creada:', cita.titulo)

  // Crear comentarios
  await prisma.comentario.createMany({
    data: [
      {
        texto: 'Paciente muestra signos evidentes de lesiones en extremidades superiores',
        oficioId: oficios[2].id,
        autorId: admin.id,
      },
      {
        texto: 'Se requiere segunda evaluación para determinar grado de incapacidad',
        oficioId: oficios[2].id,
        autorId: admin.id,
      },
    ],
  })

  console.log('✅ Comentarios creados')

  // Crear historial
  await prisma.historialOficio.createMany({
    data: [
      {
        accion: 'CREADO',
        descripcion: 'Oficio creado en el sistema',
        oficioId: oficios[0].id,
        realizadoPor: coordinador.id,
      },
      {
        accion: 'ASIGNADO',
        descripcion: `Oficio asignado al perito ${perito2.nombre} ${perito2.apellido}`,
        oficioId: oficios[1].id,
        realizadoPor: coordinador.id,
      },
      {
        accion: 'CAMBIO_ESTADO',
        descripcion: 'Estado cambiado a EN_PROCESO',
        estadoAnterior: { estado: 'ASIGNADO' },
        estadoNuevo: { estado: 'EN_PROCESO' },
        oficioId: oficios[2].id,
        realizadoPor: admin.id,
      },
    ],
  })

  console.log('✅ Historial creado')

  // Crear notificaciones
  await prisma.notificacion.createMany({
    data: [
      {
        tipo: 'OFICIO_ASIGNADO',
        titulo: 'Nuevo oficio asignado',
        mensaje: `Se te ha asignado el oficio ${oficios[1].numeroExpediente}`,
        usuarioId: coordinador.id,
        leida: false,
      },
      {
        tipo: 'CITA_PROGRAMADA',
        titulo: 'Cita programada',
        mensaje: `Tienes una cita programada para el ${cita.fechaInicio.toLocaleDateString()}`,
        usuarioId: admin.id,
        leida: false,
      },
    ],
  })

  console.log('✅ Notificaciones creadas')

  console.log('\n🎉 Seed completado exitosamente!\n')
  console.log('📧 Credenciales de acceso:')
  console.log('   Admin: admin@peritos.com / password123')
  console.log('   Coordinador: coordinador@peritos.com / password123')
  console.log('\n💡 La base de datos ahora contiene datos de prueba listos para usar\n')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
