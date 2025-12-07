'use client'

import { useState, useRef, useEffect } from 'react'

interface AccionMenuItem {
  label: string
  icon: string
  onClick: () => void
  variant?: 'default' | 'danger' | 'success' | 'warning'
  divider?: boolean
}

interface AccionesMenuProps {
  acciones: AccionMenuItem[]
}

export function AccionesMenu({ acciones }: AccionesMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case 'danger':
        return 'text-red-600 hover:bg-red-50'
      case 'success':
        return 'text-green-600 hover:bg-green-50'
      case 'warning':
        return 'text-yellow-600 hover:bg-yellow-50'
      default:
        return 'text-gray-700 hover:bg-gray-100'
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        title="Más acciones"
      >
        <span className="material-symbols-outlined text-gray-600">more_vert</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          {acciones.map((accion, index) => (
            <div key={index}>
              {accion.divider && <div className="border-t border-gray-200 my-1"></div>}
              <button
                onClick={() => {
                  accion.onClick()
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${getVariantClasses(accion.variant)}`}
              >
                <span className="material-symbols-outlined text-lg">{accion.icon}</span>
                {accion.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
