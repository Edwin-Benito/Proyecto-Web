'use client'

import { Button } from '@/components/ui'

interface ConfirmacionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export function ConfirmacionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  isLoading = false
}: ConfirmacionModalProps) {
  if (!isOpen) return null

  const variantColors = {
    danger: {
      icon: 'error',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonBg: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: 'warning',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      buttonBg: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      icon: 'info',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-600 hover:bg-blue-700'
    }
  }

  const colors = variantColors[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Icono */}
          <div className="flex items-center justify-center mb-4">
            <div className={`h-12 w-12 rounded-full ${colors.iconBg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined ${colors.iconColor} text-3xl`}>
                {colors.icon}
              </span>
            </div>
          </div>

          {/* Título */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          {/* Mensaje */}
          <p className="text-sm text-gray-600 text-center mb-6">
            {message}
          </p>

          {/* Botones */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${colors.buttonBg}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-base">
                    refresh
                  </span>
                  Procesando...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
