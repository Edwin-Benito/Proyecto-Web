'use client'

import { Button } from '@/components/ui'
import { citasService } from '@/services'
import type { Cita } from '@/app/types'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'
import { ConfirmacionModal } from './ConfirmacionModal'

interface DetalleCitaModalProps {
  isOpen: boolean
  onClose: () => void
  cita: Cita
  onUpdate: () => void
}

const ESTADOS: Array<{ 
  value: Cita['estado']
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
}> = [
  { 
    value: 'PROGRAMADA', 
    label: 'Programada', 
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: 'event_available'
  },
  { 
    value: 'CONFIRMADA', 
    label: 'Confirmada', 
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: 'check_circle'
  },
  { 
    value: 'REALIZADA', 
    label: 'Completada', 
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: 'task_alt'
  },
  { 
    value: 'CANCELADA', 
    label: 'Cancelada', 
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: 'cancel'
  },
  { 
    value: 'REPROGRAMADA', 
    label: 'Reprogramada', 
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: 'update'
  },
]

const TIPO_ICONS: Record<string, string> = {
  'EVALUACION': 'fact_check',
  'AUDIENCIA': 'gavel',
  'ENTREGA_INFORME': 'description',
  'SEGUIMIENTO': 'update',
  'OTRA': 'event',
}

export function DetalleCitaModal({ isOpen, onClose, cita, onUpdate }: DetalleCitaModalProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)

  if (!isOpen) return null

  const estadoActual = ESTADOS.find(e => e.value === cita.estado)

  const handleChangeStatus = async (nuevoEstado: Cita['estado']) => {
    if (nuevoEstado === cita.estado) return

    setChangingStatus(true)
    try {
      const response = await citasService.cambiarEstado(cita.id, nuevoEstado)
      if (response.success) {
        toast.success('✅ Estado actualizado exitosamente')
        onUpdate()
      } else {
        toast.error(response.message || 'Error al actualizar estado')
      }
    } catch (error) {
      console.error('Error changing status:', error)
      toast.error('Error al actualizar estado')
    } finally {
      setChangingStatus(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await citasService.deleteCita(cita.id)
      if (response.success) {
        toast.success('✅ Cita eliminada exitosamente')
        onUpdate()
        onClose()
      } else {
        toast.error(response.message || 'Error al eliminar cita')
      }
    } catch (error) {
      console.error('Error deleting cita:', error)
      toast.error('Error al eliminar cita')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4 py-8">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-auto mx-auto my-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con gradiente dinámico según estado */}
          <div className={`relative px-8 py-6 rounded-t-2xl ${
            estadoActual?.value === 'REALIZADA' ? 'bg-gradient-to-r from-gray-600 to-gray-700' :
            estadoActual?.value === 'CANCELADA' ? 'bg-gradient-to-r from-red-600 to-red-700' :
            estadoActual?.value === 'CONFIRMADA' ? 'bg-gradient-to-r from-green-600 to-green-700' :
            estadoActual?.value === 'REPROGRAMADA' ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
            'bg-gradient-to-r from-blue-600 to-blue-700'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <span className="material-symbols-outlined text-white text-3xl">
                      {TIPO_ICONS[cita.tipo] || 'event'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-white/20 text-white backdrop-blur-sm`}>
                        <span className="material-symbols-outlined text-sm">{estadoActual?.icon}</span>
                        {estadoActual?.label}
                      </span>
                      <span className="text-xs text-white/80 font-medium">
                        {cita.tipo.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{cita.titulo}</h3>
                <p className="text-white/80 text-sm">
                  {format(new Date(cita.fechaInicio), "EEEE, dd 'de' MMMM 'del' yyyy", { locale: es })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center backdrop-blur-sm"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <div className="p-8 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {/* Sección 1: Fecha y Hora */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <span className="material-symbols-outlined text-blue-600">schedule</span>
                <h4>Fecha y Horario</h4>
              </div>

              <div className="grid grid-cols-2 gap-6 pl-8">
                {/* Inicio */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                    <span className="material-symbols-outlined text-sm text-green-600">play_circle</span>
                    Inicio
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600 text-xl">calendar_today</span>
                      <span className="text-gray-900 font-medium">
                        {format(new Date(cita.fechaInicio), "dd 'de' MMMM, yyyy", { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600 text-xl">schedule</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {format(new Date(cita.fechaInicio), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fin */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                    <span className="material-symbols-outlined text-sm text-red-600">stop_circle</span>
                    Fin
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-600 text-xl">calendar_today</span>
                      <span className="text-gray-900 font-medium">
                        {format(new Date(cita.fechaFin), "dd 'de' MMMM, yyyy", { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-600 text-xl">schedule</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {format(new Date(cita.fechaFin), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Participantes */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <span className="material-symbols-outlined text-blue-600">group</span>
                <h4>Participantes</h4>
              </div>

              <div className="grid grid-cols-2 gap-4 pl-8">
                {/* Perito */}
                {cita.perito && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-blue-600">person</span>
                      <span className="text-xs font-medium text-blue-900">Perito Asignado</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900">
                        {cita.perito.nombre} {cita.perito.apellido}
                      </p>
                      <p className="text-xs text-gray-600">{cita.perito.especialidad}</p>
                      <div className="pt-2 mt-2 border-t border-blue-200 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="material-symbols-outlined text-xs">mail</span>
                          {cita.perito.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="material-symbols-outlined text-xs">phone</span>
                          {cita.perito.telefono}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Oficio */}
                {cita.oficio && (
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-purple-600">description</span>
                      <span className="text-xs font-medium text-purple-900">Oficio Relacionado</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900">{cita.oficio.numeroExpediente}</p>
                      <p className="text-sm text-gray-700">
                        {cita.oficio.nombreSolicitante} {cita.oficio.apellidoSolicitante}
                      </p>
                      <p className="text-xs text-gray-600 pt-2 mt-2 border-t border-purple-200">
                        {cita.oficio.tipoPeritaje}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sección 3: Detalles */}
            {(cita.ubicacion || cita.descripcion) && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <span className="material-symbols-outlined text-blue-600">edit_note</span>
                  <h4>Detalles Adicionales</h4>
                </div>

                <div className="space-y-4 pl-8">
                  {/* Ubicación */}
                  {cita.ubicacion && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-600 text-xl mt-0.5">location_on</span>
                        <div>
                          <p className="text-xs font-medium text-amber-900 mb-1">Ubicación</p>
                          <p className="text-gray-900 font-medium">{cita.ubicacion}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Descripción */}
                  {cita.descripcion && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Descripción</p>
                      <p className="text-gray-900 leading-relaxed">{cita.descripcion}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sección 4: Recordatorios */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <span className="material-symbols-outlined text-blue-600">notifications</span>
                <h4>Recordatorios</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 pl-8">
                <div className={`p-4 rounded-xl border-2 ${
                  cita.recordatorio24h 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`material-symbols-outlined ${
                      cita.recordatorio24h ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {cita.recordatorio24h ? 'check_circle' : 'cancel'}
                    </span>
                    <span className={`text-sm font-medium ${
                      cita.recordatorio24h ? 'text-blue-900' : 'text-gray-500'
                    }`}>
                      24 horas antes
                    </span>
                  </div>
                  {cita.notificado24h && (
                    <div className="flex items-center gap-1 text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full w-fit">
                      <span className="material-symbols-outlined text-xs">done_all</span>
                      Enviado
                    </div>
                  )}
                </div>

                <div className={`p-4 rounded-xl border-2 ${
                  cita.recordatorio1h 
                    ? 'bg-amber-50 border-amber-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`material-symbols-outlined ${
                      cita.recordatorio1h ? 'text-amber-600' : 'text-gray-400'
                    }`}>
                      {cita.recordatorio1h ? 'check_circle' : 'cancel'}
                    </span>
                    <span className={`text-sm font-medium ${
                      cita.recordatorio1h ? 'text-amber-900' : 'text-gray-500'
                    }`}>
                      1 hora antes
                    </span>
                  </div>
                  {cita.notificado1h && (
                    <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full w-fit">
                      <span className="material-symbols-outlined text-xs">done_all</span>
                      Enviado
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección 5: Cambiar Estado */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <span className="material-symbols-outlined text-blue-600">sync_alt</span>
                <h4>Cambiar Estado</h4>
              </div>

              <div className="grid grid-cols-5 gap-2 pl-8">
                {ESTADOS.map((estado) => {
                  const isActive = estado.value === cita.estado
                  return (
                    <button
                      key={estado.value}
                      onClick={() => handleChangeStatus(estado.value)}
                      disabled={changingStatus || isActive}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        isActive
                          ? `${estado.borderColor} ${estado.bgColor}`
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className={`material-symbols-outlined text-xl ${
                        isActive ? estado.color : 'text-gray-400'
                      }`}>
                        {estado.icon}
                      </span>
                      <span className={`text-xs font-medium text-center ${
                        isActive ? estado.color : 'text-gray-600'
                      }`}>
                        {estado.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {changingStatus && (
                <div className="flex items-center justify-center gap-2 py-2 bg-blue-50 rounded-xl text-sm text-blue-900">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  Actualizando estado...
                </div>
              )}
            </div>
          </div>

          {/* Footer con botones */}
          <div className="px-8 py-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-all shadow-lg shadow-red-600/30 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">delete</span>
                Eliminar Cita
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <ConfirmacionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="¿Eliminar Cita?"
        message="Esta acción no se puede deshacer. La cita será eliminada permanentemente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  )
}
