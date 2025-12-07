-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMINISTRADOR', 'COORDINADOR', 'PERITO');

-- CreateEnum
CREATE TYPE "EstadoOficio" AS ENUM ('PENDIENTE', 'ASIGNADO', 'EN_PROCESO', 'REVISION', 'COMPLETADO', 'RECHAZADO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "Prioridad" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "TipoCita" AS ENUM ('EVALUACION', 'AUDIENCIA', 'ENTREGA_INFORME', 'SEGUIMIENTO', 'OTRA');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('PROGRAMADA', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'REPROGRAMADA');

-- CreateEnum
CREATE TYPE "AccionHistorial" AS ENUM ('CREADO', 'ASIGNADO', 'REASIGNADO', 'CAMBIO_ESTADO', 'CAMBIO_PRIORIDAD', 'DOCUMENTO_AGREGADO', 'DOCUMENTO_ELIMINADO', 'COMENTARIO_AGREGADO', 'CITA_CREADA', 'CITA_MODIFICADA', 'ACTUALIZADO');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('OFICIO_ASIGNADO', 'OFICIO_VENCIENDO', 'OFICIO_VENCIDO', 'CITA_PROGRAMADA', 'CITA_PROXIMO', 'COMENTARIO_NUEVO', 'ESTADO_CAMBIADO', 'DOCUMENTO_NUEVO', 'SISTEMA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'COORDINADOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peritos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oficios" (
    "id" TEXT NOT NULL,
    "numeroExpediente" TEXT NOT NULL,
    "nombreSolicitante" TEXT NOT NULL,
    "apellidoSolicitante" TEXT NOT NULL,
    "cedulaSolicitante" TEXT NOT NULL,
    "telefonoSolicitante" TEXT,
    "emailSolicitante" TEXT,
    "tipoPeritaje" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaAsignacion" TIMESTAMP(3),
    "fechaCita" TIMESTAMP(3),
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoOficio" NOT NULL DEFAULT 'PENDIENTE',
    "prioridad" "Prioridad" NOT NULL DEFAULT 'MEDIA',
    "observaciones" TEXT,
    "peritoId" TEXT,
    "creadoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oficios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nombreOriginal" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tamano" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "oficioId" TEXT NOT NULL,
    "subidoPorId" TEXT NOT NULL,
    "fechaSubida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "oficioId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "ubicacion" TEXT,
    "tipo" "TipoCita" NOT NULL DEFAULT 'EVALUACION',
    "estado" "EstadoCita" NOT NULL DEFAULT 'PROGRAMADA',
    "oficioId" TEXT NOT NULL,
    "peritoId" TEXT NOT NULL,
    "recordatorio24h" BOOLEAN NOT NULL DEFAULT true,
    "recordatorio1h" BOOLEAN NOT NULL DEFAULT true,
    "notificado24h" BOOLEAN NOT NULL DEFAULT false,
    "notificado1h" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_oficios" (
    "id" TEXT NOT NULL,
    "accion" "AccionHistorial" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estadoAnterior" JSONB,
    "estadoNuevo" JSONB,
    "oficioId" TEXT NOT NULL,
    "realizadoPor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_oficios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "recurso" TEXT NOT NULL,
    "resourceId" TEXT,
    "descripcion" TEXT NOT NULL,
    "detalles" JSONB,
    "usuarioId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leidaAt" TIMESTAMP(3),

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "peritos_cedula_key" ON "peritos"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "peritos_email_key" ON "peritos"("email");

-- CreateIndex
CREATE UNIQUE INDEX "oficios_numeroExpediente_key" ON "oficios"("numeroExpediente");

-- CreateIndex
CREATE INDEX "oficios_estado_idx" ON "oficios"("estado");

-- CreateIndex
CREATE INDEX "oficios_prioridad_idx" ON "oficios"("prioridad");

-- CreateIndex
CREATE INDEX "oficios_peritoId_idx" ON "oficios"("peritoId");

-- CreateIndex
CREATE INDEX "oficios_fechaVencimiento_idx" ON "oficios"("fechaVencimiento");

-- CreateIndex
CREATE INDEX "documentos_oficioId_idx" ON "documentos"("oficioId");

-- CreateIndex
CREATE INDEX "comentarios_oficioId_idx" ON "comentarios"("oficioId");

-- CreateIndex
CREATE INDEX "citas_oficioId_idx" ON "citas"("oficioId");

-- CreateIndex
CREATE INDEX "citas_peritoId_idx" ON "citas"("peritoId");

-- CreateIndex
CREATE INDEX "citas_fechaInicio_idx" ON "citas"("fechaInicio");

-- CreateIndex
CREATE INDEX "historial_oficios_oficioId_idx" ON "historial_oficios"("oficioId");

-- CreateIndex
CREATE INDEX "historial_oficios_createdAt_idx" ON "historial_oficios"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_accion_idx" ON "audit_logs"("accion");

-- CreateIndex
CREATE INDEX "audit_logs_recurso_idx" ON "audit_logs"("recurso");

-- CreateIndex
CREATE INDEX "audit_logs_usuarioId_idx" ON "audit_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "notificaciones_usuarioId_idx" ON "notificaciones"("usuarioId");

-- CreateIndex
CREATE INDEX "notificaciones_leida_idx" ON "notificaciones"("leida");

-- CreateIndex
CREATE INDEX "notificaciones_createdAt_idx" ON "notificaciones"("createdAt");

-- AddForeignKey
ALTER TABLE "oficios" ADD CONSTRAINT "oficios_peritoId_fkey" FOREIGN KEY ("peritoId") REFERENCES "peritos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oficios" ADD CONSTRAINT "oficios_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_oficioId_fkey" FOREIGN KEY ("oficioId") REFERENCES "oficios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_oficioId_fkey" FOREIGN KEY ("oficioId") REFERENCES "oficios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_oficioId_fkey" FOREIGN KEY ("oficioId") REFERENCES "oficios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_peritoId_fkey" FOREIGN KEY ("peritoId") REFERENCES "peritos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_oficios" ADD CONSTRAINT "historial_oficios_oficioId_fkey" FOREIGN KEY ("oficioId") REFERENCES "oficios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
