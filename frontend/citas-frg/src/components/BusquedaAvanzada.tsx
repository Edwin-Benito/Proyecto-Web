'use client'

import { useState, useEffect } from 'react'
import { Input, Button } from '@/components/ui'
import { oficiosService } from '@/services'
import type { Oficio } from '@/app/types'
import toast from 'react-hot-toast'

interface FiltrosAvanzados {
  busquedaGlobal: string
  numeroExpediente: string
  nombreSolicitante: string
  cedulaSolicitante: string
  estado: string
  prioridad: string
  fechaDesde: string
  fechaHasta: string
  tipoPeritaje: string
  peritoAsignado: string
}

interface BusquedaAvanzadaProps {
  onResultados?: (oficios: Oficio[]) => void
  onLimpiar?: () => void
  className?: string
}

export function BusquedaAvanzada({ onResultados, onLimpiar, className = '' }: BusquedaAvanzadaProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [filtros, setFiltros] = useState<FiltrosAvanzados>({
    busquedaGlobal: '',
    numeroExpediente: '',
    nombreSolicitante: '',
    cedulaSolicitante: '',
    estado: '',
    prioridad: '',
    fechaDesde: '',
    fechaHasta: '',
    tipoPeritaje: '',
    peritoAsignado: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  const handleBuscar = async () => {
    setBuscando(true)
    try {
      // Construir parámetros de búsqueda
      const params: Record<string, string> = {}

      if (filtros.busquedaGlobal.trim()) {
        params.busqueda = filtros.busquedaGlobal.trim()
      }
      if (filtros.numeroExpediente.trim()) {
        params.numeroExpediente = filtros.numeroExpediente.trim()
      }
      if (filtros.nombreSolicitante.trim()) {
        params.nombreSolicitante = filtros.nombreSolicitante.trim()
      }
      if (filtros.cedulaSolicitante.trim()) {
        params.cedulaSolicitante = filtros.cedulaSolicitante.trim()
      }
      if (filtros.estado) {
        params.estado = filtros.estado
      }
      if (filtros.prioridad) {
        params.prioridad = filtros.prioridad
      }
      if (filtros.fechaDesde) {
        params.fechaDesde = filtros.fechaDesde
      }
      if (filtros.fechaHasta) {
        params.fechaHasta = filtros.fechaHasta
      }
      if (filtros.tipoPeritaje.trim()) {
        params.tipoPeritaje = filtros.tipoPeritaje.trim()
      }

      const response = await oficiosService.getOficios(params)

      if (response.success && response.data) {
        onResultados?.(response.data.oficios)
        toast.success(`Se encontraron ${response.data.oficios.length} resultados`)
      } else {
        toast.error('No se encontraron resultados')
      }
    } catch (error) {
      console.error('Error al buscar:', error)
      toast.error('Error al realizar la búsqueda')
    } finally {
      setBuscando(false)
    }
  }

  const handleLimpiar = () => {
    setFiltros({
      busquedaGlobal: '',
      numeroExpediente: '',
      nombreSolicitante: '',
      cedulaSolicitante: '',
      estado: '',
      prioridad: '',
      fechaDesde: '',
      fechaHasta: '',
      tipoPeritaje: '',
      peritoAsignado: '',
    })
    onLimpiar?.()
  }

  const handleExportarCSV = async () => {
    try {
      const params: Record<string, string> = {}
      
      if (filtros.busquedaGlobal.trim()) params.busqueda = filtros.busquedaGlobal.trim()
      if (filtros.estado) params.estado = filtros.estado
      if (filtros.prioridad) params.prioridad = filtros.prioridad
      if (filtros.fechaDesde) params.fechaDesde = filtros.fechaDesde
      if (filtros.fechaHasta) params.fechaHasta = filtros.fechaHasta

      const response = await oficiosService.getOficios({ ...params, limit: '100' })

      if (response.success && response.data) {
        const oficios = response.data.oficios
        
        // Crear CSV
        const headers = [
          'Número Expediente',
          'Solicitante',
          'Cédula',
          'Tipo Peritaje',
          'Estado',
          'Prioridad',
          'Fecha Ingreso',
          'Perito Asignado',
        ]
        
        const rows = oficios.map((oficio) => [
          oficio.numeroExpediente,
          `${oficio.nombreSolicitante} ${oficio.apellidoSolicitante}`,
          oficio.cedulaSolicitante,
          oficio.tipoPeritaje,
          oficio.estado,
          oficio.prioridad,
          new Date(oficio.fechaIngreso).toLocaleDateString('es-ES'),
          oficio.perito ? `${oficio.perito.nombre} ${oficio.perito.apellido}` : 'Sin asignar',
        ])

        const csvContent = [
          headers.join(','),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n')

        // Descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `oficios_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success('CSV exportado exitosamente')
      }
    } catch (error) {
      console.error('Error al exportar CSV:', error)
      toast.error('Error al exportar CSV')
    }
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Búsqueda Global */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              name="busquedaGlobal"
              value={filtros.busquedaGlobal}
              onChange={handleInputChange}
              placeholder="Buscar por expediente, solicitante, cédula, tipo de peritaje..."
              icon="search"
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <span className="material-symbols-outlined text-base">tune</span>
            Filtros
          </Button>
          <Button variant="primary" onClick={handleBuscar} disabled={buscando}>
            {buscando ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">
                  refresh
                </span>
                Buscando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">search</span>
                Buscar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filtros Avanzados */}
      {mostrarFiltros && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Número de Expediente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Expediente
              </label>
              <Input
                name="numeroExpediente"
                value={filtros.numeroExpediente}
                onChange={handleInputChange}
                placeholder="Ej: EXP-2024-001"
              />
            </div>

            {/* Nombre Solicitante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Solicitante
              </label>
              <Input
                name="nombreSolicitante"
                value={filtros.nombreSolicitante}
                onChange={handleInputChange}
                placeholder="Nombre completo"
              />
            </div>

            {/* Cédula Solicitante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cédula del Solicitante
              </label>
              <Input
                name="cedulaSolicitante"
                value={filtros.cedulaSolicitante}
                onChange={handleInputChange}
                placeholder="000-0000000-0"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={filtros.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="ASIGNADO">Asignado</option>
                <option value="EN_PROCESO">En Proceso</option>
                <option value="COMPLETADO">Completado</option>
                <option value="RECHAZADO">Rechazado</option>
                <option value="VENCIDO">Vencido</option>
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                name="prioridad"
                value={filtros.prioridad}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las prioridades</option>
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>

            {/* Tipo de Peritaje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Peritaje
              </label>
              <Input
                name="tipoPeritaje"
                value={filtros.tipoPeritaje}
                onChange={handleInputChange}
                placeholder="Ej: Grafotécnico"
              />
            </div>

            {/* Fecha Desde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <input
                type="date"
                name="fechaDesde"
                value={filtros.fechaDesde}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Fecha Hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Hasta
              </label>
              <input
                type="date"
                name="fechaHasta"
                value={filtros.fechaHasta}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={handleLimpiar}>
              <span className="material-symbols-outlined text-base">clear</span>
              Limpiar Filtros
            </Button>
            <Button variant="secondary" onClick={handleExportarCSV}>
              <span className="material-symbols-outlined text-base">download</span>
              Exportar CSV
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
