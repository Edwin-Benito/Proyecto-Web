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

const ESTADOS: Array<{ value: Cita['estado']; label: string; color: string }> = [
  { value: 'PROGRAMADA', label: 'Programada', color: 'bg-blue-100 text-blue-800' },
  { value: 'CONFIRMADA', label: 'Confirmada', color: 'bg-green-100 text-green-800' },
  { value: 'COMPLETADA', label: 'Completada', color: 'bg-gray-100 text-gray-800' },
  { value: 'CANCELADA', label: 'Cancelada', color: 'bg-red-100 text-red-800' },
  { value: 'REPROGRAMADA', label: 'Reprogramada', color: 'bg-yellow-100 text-yellow-800' },
]

export function DetalleCitaModal({ isOpen, onClose, cita, onUpdate }: DetalleCitaModalProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)

  if (!isOpen) return null

  const handleChangeStatus = async (nuevoEstado: Cita['estado']) => {
    if (nuevoEstado === cita.estado) return

    setChangingStatus(true)
    try {
      const response = await citasService.cambiarEstado(cita.id, nuevoEstado)
      if (response.success) {
        toast.success('Estado actualizado exitosamente')
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
        toast.success('Cita eliminada exitosamente')
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{cita.titulo}</h3>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    ESTADOS.find(e => e.value === cita.estado)?.color
                  }`}>
                    {ESTADOS.find(e => e.value === cita.estado)?.label}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Información de la Cita */}
            <div className="space-y-4">
              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha y Hora de Inicio
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span className="material-symbols-outlined text-blue-600">calendar_today</span>
                    <span>
                      {format(new Date(cita.fechaInicio), "dd 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <span className="material-symbols-outlined text-blue-600">schedule</span>
                    <span>{format(new Date(cita.fechaInicio), 'HH:mm')}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha y Hora de Fin
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span className="material-symbols-outlined text-blue-600">calendar_today</span>
                    <span>
                      {format(new Date(cita.fechaFin), "dd 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <span className="material-symbols-outlined text-blue-600">schedule</span>
                    <span>{format(new Date(cita.fechaFin), 'HH:mm')}</span>
                  </div>
                </div>
              </div>

              {/* Perito */}
              {cita.perito && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perito Asignado
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span className="material-symbols-outlined text-green-600">person</span>
                    <span>{cita.perito.nombre} {cita.perito.apellido}</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-8">
                    {cita.perito.email} • {cita.perito.telefono}
                  </div>
                </div>
              )}

              {/* Oficio */}
              {cita.oficio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Oficio Relacionado
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span className="material-symbols-outlined text-purple-600">description</span>
                    <span>{cita.oficio.numeroExpediente}</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-8">
                    {cita.oficio.nombreSolicitante} {cita.oficio.apellidoSolicitante}
                  </div>
                </div>
              )}

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cita
                </label>
                <div className="text-gray-900">
                  {cita.tipo.replace('_', ' ')}
                </div>
              </div>

              {/* Ubicación */}
              {cita.ubicacion && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span className="material-symbols-outlined text-red-600">location_on</span>
                    <span>{cita.ubicacion}</span>
                  </div>
                </div>
              )}

              {/* Descripción */}
              {cita.descripcion && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {cita.descripcion}
                  </p>
                </div>
              )}

              {/* Recordatorios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recordatorios
                </label>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`material-symbols-outlined ${cita.recordatorio24h ? 'text-blue-600' : 'text-gray-400'}`}>
                      {cita.recordatorio24h ? 'check_circle' : 'cancel'}
                    </span>
                    <span className={cita.recordatorio24h ? 'text-gray-900' : 'text-gray-500'}>
                      24 horas antes {cita.notificado24h && '(Enviado)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`material-symbols-outlined ${cita.recordatorio1h ? 'text-blue-600' : 'text-gray-400'}`}>
                      {cita.recordatorio1h ? 'check_circle' : 'cancel'}
                    </span>
                    <span className={cita.recordatorio1h ? 'text-gray-900' : 'text-gray-500'}>
                      1 hora antes {cita.notificado1h && '(Enviado)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cambiar Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cambiar Estado
                </label>
                <div className="flex gap-2 flex-wrap">
                  {ESTADOS.map((estado) => (
                    <button
                      key={estado.value}
                      onClick={() => handleChangeStatus(estado.value)}
                      disabled={changingStatus || estado.value === cita.estado}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        estado.value === cita.estado
                          ? estado.color
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {estado.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cerrar
              </Button>
              <Button
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Eliminar Cita
              </Button>
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
