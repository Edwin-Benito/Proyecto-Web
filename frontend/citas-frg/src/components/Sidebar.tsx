'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const menuItems = [
  {
    name: 'Recepción de Oficios',
    icon: 'inbox',
    href: '/',
    active: true,
  },
  {
    name: 'Detalle de Oficio y Asignación',
    icon: 'assignment_ind',
    href: '/asignacion',
    active: false,
  },
  {
    name: 'Vista del Caso para Peritos',
    icon: 'visibility',
    href: '/casos',
    active: false,
  },
  {
    name: 'Agendamiento de Citas',
    icon: 'calendar_month',
    href: '/citas',
    active: false,
  },
  {
    name: 'Gestión de Peritos',
    icon: 'group',
    href: '/peritos',
    active: false,
  },
  {
    name: 'Historial de Casos',
    icon: 'history',
    href: '/historial',
    active: false,
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 shrink-0 items-center gap-2 px-6 text-gray-900">
        <span className="material-symbols-outlined text-blue-600 text-2xl">gavel</span>
        <h1 className="text-lg font-bold">Peritos App</h1>
      </div>
      
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors ${
              item.active
                ? 'bg-blue-100 font-bold text-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            {item.name}
          </a>
        ))}
      </nav>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <button className="relative h-10 w-10 rounded-full">
            <img
              alt="Avatar de usuario"
              className="h-full w-full rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCasuzSXiFqgJqD70Vsm6r2g6KAETG0PWOrhLKXrqiOm-Agod5Rp8APPs54nOhbpHiqgZy0yF_uA6HXIg_50AATQjAccMIdCzhnk5_MQTLQWLC9dN9F0R94qxnhJ9at9I6CKBbEatoUUlKUIKmBl70vb48NwWjR00diDxL8hbS-q0fp8l9hLtehCKVogp96zu_Ps1ySFKHEAO2VDaiEGxCaVtqsGuXy8jfNSfOHqj6e4AHB4KKr1nYWMWUOWaRwRLesUCBL8bQpRFPj"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></div>
          </button>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
            </p>
            <p className="text-xs text-gray-600 capitalize">
              {user?.rol || 'Sin rol'}
            </p>
          </div>
          <button 
            onClick={logout}
            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            title="Cerrar sesión"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}