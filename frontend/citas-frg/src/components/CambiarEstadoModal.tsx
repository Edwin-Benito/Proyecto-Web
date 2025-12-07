'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import type { Oficio } from '@/app/types'

interface CambiarEstadoModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (estado: Oficio['estado'], observaciones?: string) => Promise<void>
  estadoActual: Oficio['estado']
}

const ESTADOS: Array<{ value: Oficio['estado']; label: string; color: string }> = [
  { value: 'PENDIENTE', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ASIGNADO', label: 'Asignado', color: 'bg-blue-100 text-blue-800' },
  { value: 'EN_PROCESO', label: 'En Proceso', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'COMPLETADO', label: 'Completado', color: 'bg-green-100 text-green-800' },
  { value: 'RECHAZADO', label: 'Rechazado', color: 'bg-gray-100 text-gray-800' },
  { value: 'VENCIDO', label: 'Vencido', color: 'bg-red-100 text-red-800' },
]

export function CambiarEstadoModal({ isOpen, onClose, onConfirm, estadoActual }: CambiarEstadoModalProps) {
  const [nuevoEstado, setNuevoEstado] = useState<Oficio['estado']>(estadoActual)
  const [observaciones, setObservaciones] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (nuevoEstado === estadoActual) {
      onClose()
      return
    }

    setIsLoading(true)
    try {
      await onConfirm(nuevoEstado, observaciones || undefined)
      onClose()
      setObservaciones('')
    } catch (error) {
      console.error('Error cambiando estado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Cambiar Estado</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Estado Actual */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado Actual
              </label>
              <div className="flex items-center gap-2">
                {ESTADOS.find(e => e.value === estadoActual) && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${ESTADOS.find(e => e.value === estadoActual)!.color}`}>
                    {ESTADOS.find(e => e.value === estadoActual)!.label}
                  </span>
                )}
              </div>
            </div>

            {/* Nuevo Estado */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuevo Estado *
              </label>
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value as Oficio['estado'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {ESTADOS.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Observaciones */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones (opcional)
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Agrega notas sobre este cambio de estado..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || nuevoEstado === estadoActual}
                className="flex-1"
              >
                {isLoading ? 'Guardando...' : 'Cambiar Estado'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
