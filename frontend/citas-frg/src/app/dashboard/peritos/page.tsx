 'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import PeritosTable from '@/components/PeritosTable'
import NuevoPeritoModal from '@/components/NuevoPeritoModal'
import { Button } from '@/components/ui'

function GestionPeritosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión y Directorio de Peritos</h1>
                <p className="text-sm text-gray-600">Visualiza el estado y disponibilidad de los peritos registrados.</p>
              </div>
              <Button variant="primary" onClick={handleOpenModal}>
                <span className="material-symbols-outlined text-base">person_add</span>
                + Registrar Nuevo Perito
              </Button>
            </div>
            <PeritosTable />
          </div>
        </main>

        {/* Nuevo Perito Modal */}
        <NuevoPeritoModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  )
}

export default GestionPeritosPage
