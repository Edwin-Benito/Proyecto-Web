'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

// Enlaces de navegación dinámicos
const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { name: 'Recepción de Oficios', href: '/dashboard/oficios', icon: 'inbox' },
  { name: 'Gestión de Peritos', href: '/dashboard/peritos', icon: 'group' },
  { name: 'Agendamiento de Citas', href: '/dashboard/agenda', icon: 'calendar_month' },
  // Placeholders de futuras secciones
  { name: 'Historial de Casos', href: '/dashboard/historial', icon: 'history' },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 shrink-0 items-center gap-2 px-6 text-gray-900">
        <span className="material-symbols-outlined text-blue-600 text-2xl">gavel</span>
        <h1 className="text-lg font-bold">Peritos App</h1>
      </div>
      
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {navLinks.map((item) => {
          // Marcar activo: la ruta raíz '/dashboard' solo cuando sea exactamente esa ruta.
          // Para las subsecciones, marcamos activo cuando el pathname empiece con el href.
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname?.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 font-bold text-blue-600'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
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