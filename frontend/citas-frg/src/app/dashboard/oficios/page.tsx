'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { OfficiosTable } from '@/components/OfficiosTable'
import NuevoOficioModal from '@/components/NuevoOficioModal'
import { Button } from '@/components/ui'
import { withAuth } from '@/context/AuthContext'

function OfficiosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Recepción de Oficios</h1>
                <p className="text-gray-600 mt-2">
                  Gestiona los oficios recibidos y asigna peritos para su atención.
                </p>
              </div>
              <Button variant="primary" onClick={handleOpenModal}>
                <span className="material-symbols-outlined text-base">add</span>
                Nuevo Oficio
              </Button>
            </div>
            
            <OfficiosTable />
          </div>
        </main>
      </div>
      <NuevoOficioModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

export default withAuth(OfficiosPage)
