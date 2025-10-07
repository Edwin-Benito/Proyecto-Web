'use client'

import { useState, useEffect } from 'react'
import { Oficio, OfficiosFilter } from '@/app/types'
import { oficiosService } from '@/services'

type SortField = 'numeroExpediente' | 'nombreSolicitante' | 'fechaIngreso' | 'estado' | 'prioridad'
type SortOrder = 'asc' | 'desc'

export function OfficiosTable() {
  // Estados para datos
  const [oficios, setOficios] = useState<Oficio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState<Oficio['estado'] | ''>('')
  const [prioridadFilter, setPrioridadFilter] = useState<Oficio['prioridad'] | ''>('')
  const [peritoFilter, setPeritoFilter] = useState('')
  
  // Estados para paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [sortField, setSortField] = useState<SortField>('fechaIngreso')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Estados para UI
  const [selectedOficios, setSelectedOficios] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  // Cargar oficios
  const loadOficios = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: Partial<OfficiosFilter> = {
        page: currentPage,
        limit: pageSize,
        sortBy: sortField,
        sortOrder,
        busqueda: searchTerm || undefined,
        estado: estadoFilter || undefined,
        prioridad: prioridadFilter || undefined,
      }

      const response = await oficiosService.getOficios(filters)
      
      if (response.success && response.data) {
        setOficios(response.data.data)
        setTotalItems(response.data.total)
      } else {
        throw new Error(response.message || 'Error al cargar oficios')
      }
    } catch (err) {
      console.error('Error loading oficios:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      // Datos de fallback para desarrollo
      setOficios([
        {
          id: '1',
          numeroExpediente: '2024-001',
          nombreSolicitante: 'María García',
          apellidoSolicitante: 'López',
          cedulaSolicitante: '12345678901',
          telefonoSolicitante: '+52 555 0123',
          emailSolicitante: 'maria.garcia@email.com',
          tipoPeritaje: 'Peritaje Médico',
          estado: 'pendiente',
          prioridad: 'alta',
          fechaIngreso: '2024-03-15T10:00:00Z',
          fechaVencimiento: '2024-03-25T23:59:59Z',
          descripcion: 'Solicitud de peritaje médico para evaluación de incapacidad laboral',
          peritoAsignado: undefined,
          documentos: [],
          observaciones: '',
          fechaAsignacion: undefined,
          createdAt: '2024-03-15T10:00:00Z',
          updatedAt: '2024-03-15T10:00:00Z'
        },
        {
          id: '2',
          numeroExpediente: '2024-002',
          nombreSolicitante: 'Juan Carlos',
          apellidoSolicitante: 'Rodríguez',
          cedulaSolicitante: '23456789012',
          telefonoSolicitante: '+52 555 0456',
          tipoPeritaje: 'Peritaje Contable',
          estado: 'asignado',
          prioridad: 'media',
          fechaIngreso: '2024-03-16T14:30:00Z',
          fechaVencimiento: '2024-03-30T23:59:59Z',
          descripcion: 'Análisis contable de irregularidades financieras',
          peritoAsignado: {
            id: 'p1',
            nombre: 'Carlos',
            apellido: 'Mendoza',
            cedula: '98765432109',
            especialidad: ['Contabilidad Forense'],
            telefono: '+123456789',
            email: 'carlos.mendoza@peritos.com',
            activo: true,
            casosAsignados: 5,
            disponible: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          documentos: [],
          observaciones: '',
          fechaAsignacion: '2024-03-17T09:00:00Z',
          createdAt: '2024-03-16T14:30:00Z',
          updatedAt: '2024-03-17T09:00:00Z'
        },
        {
          id: '3',
          numeroExpediente: '2024-003',
          nombreSolicitante: 'Ana Isabel',
          apellidoSolicitante: 'Fernández',
          cedulaSolicitante: '34567890123',
          tipoPeritaje: 'Peritaje Técnico',
          estado: 'completado',
          prioridad: 'baja',
          fechaIngreso: '2024-03-10T11:15:00Z',
          fechaVencimiento: '2024-03-20T23:59:59Z',
          descripcion: 'Evaluación técnica de daños en vehículo automotor',
          peritoAsignado: {
            id: 'p2',
            nombre: 'Roberto',
            apellido: 'Silva',
            cedula: '87654321098',
            especialidad: ['Ingeniería Automotriz'],
            telefono: '+987654321',
            email: 'roberto.silva@peritos.com',
            activo: true,
            casosAsignados: 3,
            disponible: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          documentos: [],
          observaciones: 'Peritaje completado satisfactoriamente',
          fechaAsignacion: '2024-03-11T08:00:00Z',
          createdAt: '2024-03-10T11:15:00Z',
          updatedAt: '2024-03-18T16:30:00Z'
        }
      ])
      setTotalItems(3)
    } finally {
      setLoading(false)
    }
  }

  // Efecto para cargar datos
  useEffect(() => {
    loadOficios()
  }, [currentPage, pageSize, sortField, sortOrder, searchTerm, estadoFilter, prioridadFilter])

  // Calcular páginas
  const totalPages = Math.ceil(totalItems / pageSize)

  // Función para cambiar ordenamiento
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // Función para manejar selección
  const handleSelectOficio = (oficioId: string) => {
    const newSelected = new Set(selectedOficios)
    if (newSelected.has(oficioId)) {
      newSelected.delete(oficioId)
    } else {
      newSelected.add(oficioId)
    }
    setSelectedOficios(newSelected)
  }

  // Función para seleccionar todos
  const handleSelectAll = () => {
    if (selectedOficios.size === oficios.length) {
      setSelectedOficios(new Set())
    } else {
      setSelectedOficios(new Set(oficios.map(o => o.id)))
    }
  }

  // Función para obtener color del estado
  const getEstadoColor = (estado: Oficio['estado']) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      asignado: 'bg-blue-100 text-blue-800',
      en_proceso: 'bg-orange-100 text-orange-800',
      completado: 'bg-green-100 text-green-800',
      vencido: 'bg-red-100 text-red-800',
    }
    return colors[estado] || 'bg-gray-100 text-gray-800'
  }

  // Función para obtener color de prioridad
  const getPrioridadColor = (prioridad: Oficio['prioridad']) => {
    const colors = {
      baja: 'bg-gray-100 text-gray-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      urgente: 'bg-red-100 text-red-800',
    }
    return colors[prioridad] || 'bg-gray-100 text-gray-800'
  }

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando oficios...</span>
        </div>
      </div>
    )
  }

  if (error && oficios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="text-center">
          <div className="text-red-600 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-800 font-medium">Error al conectar con el servidor</p>
          <p className="text-red-600 text-sm mt-1">Mostrando datos de ejemplo</p>
          <button 
            onClick={loadOficios}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar conexión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header con búsqueda y filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recepción de Oficios ({totalItems})
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Búsqueda */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar por expediente, nombre o perito..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Botón de filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                Filtros
              </button>

              {/* Nuevo Oficio */}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Oficio
              </button>
            </div>
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value as Oficio['estado'] | '')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="asignado">Asignado</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="completado">Completado</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select
                  value={prioridadFilter}
                  onChange={(e) => setPrioridadFilter(e.target.value as Oficio['prioridad'] | '')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setEstadoFilter('')
                    setPrioridadFilter('')
                    setPeritoFilter('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Acciones masivas */}
      {selectedOficios.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedOficios.size} oficios seleccionados
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Asignar Perito
              </button>
              <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedOficios.size === oficios.length && oficios.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('numeroExpediente')}
              >
                <div className="flex items-center gap-1">
                  Expediente
                  {sortField === 'numeroExpediente' && (
                    <svg className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nombreSolicitante')}
              >
                <div className="flex items-center gap-1">
                  Solicitante
                  {sortField === 'nombreSolicitante' && (
                    <svg className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('estado')}
              >
                <div className="flex items-center gap-1">
                  Estado
                  {sortField === 'estado' && (
                    <svg className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('prioridad')}
              >
                <div className="flex items-center gap-1">
                  Prioridad
                  {sortField === 'prioridad' && (
                    <svg className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Perito Asignado
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('fechaIngreso')}
              >
                <div className="flex items-center gap-1">
                  Fecha Ingreso
                  {sortField === 'fechaIngreso' && (
                    <svg className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {oficios.map((oficio) => (
              <tr key={oficio.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOficios.has(oficio.id)}
                    onChange={() => handleSelectOficio(oficio.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {oficio.numeroExpediente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{oficio.nombreSolicitante} {oficio.apellidoSolicitante}</div>
                    <div className="text-gray-500 text-xs">{oficio.tipoPeritaje}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(oficio.estado)}`}>
                    {oficio.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadColor(oficio.prioridad)}`}>
                    {oficio.prioridad.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {oficio.peritoAsignado ? (
                    <div>
                      <div className="font-medium text-gray-900">{oficio.peritoAsignado.nombre} {oficio.peritoAsignado.apellido}</div>
                      <div className="text-xs">{oficio.peritoAsignado.especialidad.join(', ')}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Sin asignar</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div>{formatDate(oficio.fechaIngreso)}</div>
                    {oficio.fechaVencimiento && (
                      <div className={`text-xs ${new Date(oficio.fechaVencimiento) < new Date() ? 'text-red-600' : 'text-gray-400'}`}>
                        Vence: {formatDate(oficio.fechaVencimiento)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-1">
                    <button 
                      className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                      title="Ver detalles"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                      title="Editar"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {oficio.estado === 'pendiente' && (
                      <button 
                        className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                        title="Asignar perito"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensaje cuando no hay datos */}
      {oficios.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay oficios</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo oficio.</p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Oficio
            </button>
          </div>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2">Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="ml-2">
              de {totalItems} oficios
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}