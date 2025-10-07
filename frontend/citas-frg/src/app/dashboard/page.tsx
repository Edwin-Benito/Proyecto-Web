'use client'

import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { OfficiosTable } from '@/components/OfficiosTable'
import { withAuth } from '@/context/AuthContext'

function DashboardPage() {
  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Recepción de Oficios
                </h2>
                <p className="text-sm text-gray-600">
                  Gestiona los oficios recibidos y asigna peritos para su atención.
                </p>
              </div>
              <button className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
                <span className="material-symbols-outlined text-base">add</span>
                Nuevo Oficio
              </button>
            </div>
            <OfficiosTable />
          </div>
        </main>
      </div>
    </div>
  )
}

export default withAuth(DashboardPage)