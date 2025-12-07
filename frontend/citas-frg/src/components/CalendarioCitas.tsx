'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, addHours } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui'
import { citasService, peritosService } from '@/services'
import type { Cita, Perito } from '@/app/types'
import toast from 'react-hot-toast'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Configurar localizer con date-fns
const locales = {
  es: es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Interfaz para eventos del calendario
interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: Cita
}

interface CalendarioCitasProps {
  peritoId?: string
  oficioId?: string
  onSelectCita?: (cita: Cita) => void
  onCreateCita?: (start: Date, end: Date) => void
}

export function CalendarioCitas({ peritoId, oficioId, onSelectCita, onCreateCita }: CalendarioCitasProps) {
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())
  const [peritos, setPeritos] = useState<Perito[]>([])
  const [selectedPerito, setSelectedPerito] = useState<string>(peritoId || '')

  // Cargar citas
  const loadCitas = useCallback(async () => {
    try {
      setLoading(true)

      const filters: any = {}
      if (selectedPerito) filters.peritoId = selectedPerito
      if (oficioId) filters.oficioId = oficioId
      
      // Filtrar por rango de fecha basado en la vista actual
      const startDate = startOfWeek(date, { locale: es })
      const endDate = addHours(startDate, view === 'month' ? 720 : view === 'week' ? 168 : 24)
      
      filters.fechaDesde = startDate.toISOString()
      filters.fechaHasta = endDate.toISOString()

      const response = await citasService.getCitas(filters)

      if (response.success && response.data) {
        setCitas(response.data.data || [])
      } else {
        toast.error(response.message || 'Error al cargar citas')
      }
    } catch (error) {
      console.error('Error loading citas:', error)
      toast.error('Error al cargar citas')
    } finally {
      setLoading(false)
    }
  }, [selectedPerito, oficioId, date, view])

  // Cargar peritos para el filtro
  useEffect(() => {
    const loadPeritos = async () => {
      try {
        const response = await peritosService.getPeritos({ limit: 100, activo: true })
        if (response.success && response.data) {
          setPeritos(response.data.data || [])
        }
      } catch (error) {
        console.error('Error loading peritos:', error)
      }
    }

    if (!peritoId) {
      loadPeritos()
    }
  }, [peritoId])

  useEffect(() => {
    loadCitas()
  }, [loadCitas])

  // Convertir citas a eventos del calendario
  const events: CalendarEvent[] = useMemo(() => {
    return citas.map((cita) => ({
      id: cita.id,
      title: `${cita.titulo} - ${cita.perito?.nombre || 'Perito'}`,
      start: new Date(cita.fechaInicio),
      end: new Date(cita.fechaFin),
      resource: cita,
    }))
  }, [citas])

  // Estilos personalizados para eventos según el estado
  const eventStyleGetter = (event: CalendarEvent) => {
    const cita = event.resource
    let backgroundColor = '#3b82f6' // azul por defecto
    
    switch (cita.estado) {
      case 'PROGRAMADA':
        backgroundColor = '#3b82f6' // azul
        break
      case 'CONFIRMADA':
        backgroundColor = '#10b981' // verde
        break
      case 'COMPLETADA':
        backgroundColor = '#6b7280' // gris
        break
      case 'CANCELADA':
        backgroundColor = '#ef4444' // rojo
        break
      case 'REPROGRAMADA':
        backgroundColor = '#f59e0b' // amarillo
        break
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    }
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    onSelectCita?.(event.resource)
  }

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    onCreateCita?.(start, end)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Filtros */}
      {!peritoId && (
        <div className="mb-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por perito:</label>
          <select
            value={selectedPerito}
            onChange={(e) => setSelectedPerito(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los peritos</option>
            {peritos.map((perito) => (
              <option key={perito.id} value={perito.id}>
                {perito.nombre} {perito.apellido}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Leyenda de estados */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-600"></div>
          <span className="text-gray-700">Programada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-600"></div>
          <span className="text-gray-700">Confirmada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-600"></div>
          <span className="text-gray-700">Completada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-600"></div>
          <span className="text-gray-700">Cancelada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-600"></div>
          <span className="text-gray-700">Reprogramada</span>
        </div>
      </div>

      {/* Calendario */}
      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          messages={{
            next: 'Siguiente',
            previous: 'Anterior',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Cita',
            noEventsInRange: 'No hay citas en este rango',
            showMore: (total) => `+ Ver más (${total})`,
          }}
          culture="es"
        />
      </div>
    </div>
  )
}
