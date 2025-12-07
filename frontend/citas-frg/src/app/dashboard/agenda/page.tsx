'use client'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import React, { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { CalendarioCitas } from '@/components/CalendarioCitas'
import { CrearCitaModal } from '@/components/CrearCitaModal'
import { DetalleCitaModal } from '@/components/DetalleCitaModal'
import type { Cita } from '@/app/types'

export default function AgendaPage() {
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false)
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false)
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null)
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>()
  const [fechaFin, setFechaFin] = useState<Date | undefined>()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSelectCita = (cita: Cita) => {
    setCitaSeleccionada(cita)
    setIsDetalleModalOpen(true)
  }

  const handleCreateCita = (fechaInicio?: Date, fechaFin?: Date) => {
    setFechaInicio(fechaInicio)
    setFechaFin(fechaFin)
    setIsCrearModalOpen(true)
  }

  const handleNuevaCitaClick = () => {
    setFechaInicio(undefined)
    setFechaFin(undefined)
    setIsCrearModalOpen(true)
  }

  const handleCitaCreada = () => {
    setIsCrearModalOpen(false)
    setRefreshKey(prev => prev + 1)
  }

  const handleCitaActualizada = () => {
    setIsDetalleModalOpen(false)
    setCitaSeleccionada(null)
    setRefreshKey(prev => prev + 1)
  }

  const handleCitaEliminada = () => {
    setIsDetalleModalOpen(false)
    setCitaSeleccionada(null)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agenda de Citas y Audiencias</h1>
              <p className="text-sm text-gray-600">Visualiza y gestiona tus eventos programados.</p>
            </div>
            <button
              onClick={handleNuevaCitaClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Nueva Cita
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <CalendarioCitas
              key={refreshKey}
              onSelectCita={handleSelectCita}
              onCreateCita={handleCreateCita}
            />
          </div>
        </main>
      </div>

      {isCrearModalOpen && (
        <CrearCitaModal
          isOpen={isCrearModalOpen}
          onClose={() => setIsCrearModalOpen(false)}
          onSuccess={handleCitaCreada}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
        />
      )}

      {isDetalleModalOpen && citaSeleccionada && (
        <DetalleCitaModal
          isOpen={isDetalleModalOpen}
          onClose={() => {
            setIsDetalleModalOpen(false)
            setCitaSeleccionada(null)
          }}
          cita={citaSeleccionada}
          onUpdate={handleCitaActualizada}
          onDelete={handleCitaEliminada}
        />
      )}
    </div>
  )
}
