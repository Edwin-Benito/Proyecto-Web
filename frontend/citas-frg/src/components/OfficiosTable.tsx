 'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui'
import EditarOficioModal from './EditarOficioModal'
import { AccionesMenu } from './AccionesMenu'
import { ConfirmacionModal } from './ConfirmacionModal'
import { CambiarEstadoModal } from './CambiarEstadoModal'
import { Oficio, OfficiosFilter } from '@/app/types'
import { oficiosService } from '@/services'
import toast from 'react-hot-toast'

// Hook personalizado para debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

type SortField = 'numeroExpediente' | 'nombreSolicitante' | 'fechaIngreso' | 'estado' | 'prioridad'
type SortOrder = 'asc' | 'desc'

export function OfficiosTable() {
  // mover useRouter al top-level para cumplir reglas de Hooks
  const router = useRouter()

  // Estados para datos
  const [oficios, setOficios] = useState<Oficio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState<Oficio['estado'] | ''>('')
  const [prioridadFilter, setPrioridadFilter] = useState<Oficio['prioridad'] | ''>('')
  // peritoFilter removed: not used
  
  // Debounced search term para evitar peticiones excesivas
  const debouncedSearchTerm = useDebounce(searchTerm, 500) // 500ms delay para mejor UX
  
  // Efecto para mostrar indicador de búsqueda
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }, [searchTerm, debouncedSearchTerm])
  
  // Estados para paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [sortField, setSortField] = useState<SortField>('fechaIngreso')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Estados para UI
  const [selectedOficios, setSelectedOficios] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  
  // Estados para modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedOficioId, setSelectedOficioId] = useState<string | null>(null)
  
  // Estados para modales de acciones
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCambiarEstadoModalOpen, setIsCambiarEstadoModalOpen] = useState(false)
  const [oficioToDelete, setOficioToDelete] = useState<string | null>(null)
  const [oficioToChangeStatus, setOficioToChangeStatus] = useState<Oficio | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Cargar oficios
  const loadOficios = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: Partial<OfficiosFilter> = {
        page: currentPage,
        limit: pageSize,
        sortBy: sortField,
        sortOrder,
        busqueda: debouncedSearchTerm || undefined,
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
      setOficios([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, sortField, sortOrder, debouncedSearchTerm, estadoFilter, prioridadFilter])

  // Efecto para cargar datos - usar la función memoizada
  useEffect(() => {
    loadOficios()
  }, [loadOficios])

  // Efecto separado para resetear página cuando cambia la búsqueda o filtros
  // llamamos directamente a setCurrentPage(1) para evitar leer currentPage en el efecto
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, estadoFilter, prioridadFilter])

  // Abrir modal de edición
  const handleEdit = (oficioId: string) => {
    setSelectedOficioId(oficioId)
    setIsEditModalOpen(true)
  }

  // Cerrar modal de edición
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedOficioId(null)
  }

  // Callback después de actualizar oficio
  const handleEditSuccess = () => {
    loadOficios()
  }

  // Handlers para acciones
  const handleDeleteClick = (oficioId: string) => {
    setOficioToDelete(oficioId)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!oficioToDelete) return

    setIsDeleting(true)
    try {
      const response = await oficiosService.deleteOficio(oficioToDelete)
      if (response.success) {
        toast.success('Oficio eliminado exitosamente')
        loadOficios() // Recargar la lista
      } else {
        toast.error(response.message || 'Error al eliminar el oficio')
      }
    } catch (error) {
      console.error('Error eliminando oficio:', error)
      toast.error('Error al eliminar el oficio')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setOficioToDelete(null)
    }
  }

  const handleChangeStatusClick = (oficio: Oficio) => {
    setOficioToChangeStatus(oficio)
    setIsCambiarEstadoModalOpen(true)
  }

  const handleConfirmChangeStatus = async (nuevoEstado: Oficio['estado'], observaciones?: string) => {
    if (!oficioToChangeStatus) return

    try {
      const response = await oficiosService.changeStatus(oficioToChangeStatus.id, nuevoEstado, observaciones)
      if (response.success) {
        toast.success('Estado actualizado exitosamente')
        loadOficios()
      } else {
        toast.error(response.message || 'Error al cambiar el estado')
      }
    } catch (error) {
      console.error('Error cambiando estado:', error)
      toast.error('Error al cambiar el estado')
    } finally {
      setIsCambiarEstadoModalOpen(false)
      setOficioToChangeStatus(null)
    }
  }

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
    const colors: Record<string, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      ASIGNADO: 'bg-blue-100 text-blue-800',
      EN_PROCESO: 'bg-orange-100 text-orange-800',
      REVISION: 'bg-purple-100 text-purple-800',
      COMPLETADO: 'bg-green-100 text-green-800',
      RECHAZADO: 'bg-red-100 text-red-800',
      VENCIDO: 'bg-red-100 text-red-800',
    }
    return colors[estado] || 'bg-gray-100 text-gray-800'
  }

  // Función para obtener color de prioridad
  const getPrioridadColor = (prioridad: Oficio['prioridad']) => {
    const colors: Record<string, string> = {
      BAJA: 'bg-gray-100 text-gray-800',
      MEDIA: 'bg-yellow-100 text-yellow-800',
      ALTA: 'bg-orange-100 text-orange-800',
      URGENTE: 'bg-red-100 text-red-800',
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
      {/* Búsqueda y filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por expediente, nombre o perito..."
              className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isSearching ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Indicador de búsqueda en progreso */}
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            {/* Botón para limpiar búsqueda */}
            {searchTerm && !isSearching && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Botón de filtros */}
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            Filtros
          </Button>
        </div>

        {/* Indicador de búsqueda activa */}
        {debouncedSearchTerm && (
          <p className="text-sm text-gray-600 mb-4">
            Mostrando resultados para: <span className="font-medium">&quot;{debouncedSearchTerm}&quot;</span>
            <button
              onClick={() => setSearchTerm('')}
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              Limpiar filtro
            </button>
          </p>
        )}

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
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="ASIGNADO">Asignado</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="COMPLETADO">Completado</option>
                  <option value="VENCIDO">Vencido</option>
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
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                  <option value="URGENTE">Urgente</option>
                </select>
              </div>
                <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setEstadoFilter('')
                    setPrioridadFilter('')
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
        <Table className="">
          <Thead>
            <Tr>
              <Th>
                <input
                  type="checkbox"
                  checked={selectedOficios.size === oficios.length && oficios.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </Th>
              <Th 
                className="cursor-pointer hover:bg-gray-100"
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
              </Th>
              <Th 
                className="cursor-pointer hover:bg-gray-100"
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
              </Th>
              <Th 
                className="cursor-pointer hover:bg-gray-100"
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
              </Th>
              <Th 
                className="cursor-pointer hover:bg-gray-100"
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
              </Th>
              <Th>
                Perito Asignado
              </Th>
              <Th 
                className="cursor-pointer hover:bg-gray-100"
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
              </Th>
              <Th align="right">
                Acciones
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {oficios.map((oficio) => (
              <Tr key={oficio.id}>
                <Td align="left" className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOficios.has(oficio.id)}
                    onChange={() => handleSelectOficio(oficio.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </Td>
                <Td className="whitespace-nowrap font-medium text-gray-900">
                  {oficio.numeroExpediente}
                </Td>
                <Td className="whitespace-nowrap text-gray-900">
                  <div>
                    <div className="font-medium">{oficio.nombreSolicitante} {oficio.apellidoSolicitante}</div>
                    <div className="text-gray-500 text-xs">{oficio.tipoPeritaje}</div>
                  </div>
                </Td>
                <Td className="whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(oficio.estado)}`}>
                    {oficio.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </Td>
                <Td className="whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadColor(oficio.prioridad)}`}>
                    {oficio.prioridad.toUpperCase()}
                  </span>
                </Td>
                <Td className="whitespace-nowrap text-gray-500">
                  {oficio.perito ? (
                    <div>
                      <div className="font-medium text-gray-900">{oficio.perito.nombre} {oficio.perito.apellido}</div>
                      <div className="text-xs">{oficio.perito.especialidad}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Sin asignar</span>
                  )}
                </Td>
                <Td className="whitespace-nowrap text-gray-500">
                  <div>
                    <div>{formatDate(oficio.fechaIngreso)}</div>
                    {oficio.fechaVencimiento && (
                      <div className={`text-xs ${new Date(oficio.fechaVencimiento) < new Date() ? 'text-red-600' : 'text-gray-400'}`}>
                        Vence: {formatDate(oficio.fechaVencimiento)}
                      </div>
                    )}
                  </div>
                </Td>
                <Td align="right" className="whitespace-nowrap font-medium">
                  <div className="flex justify-end gap-1 items-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/dashboard/oficios/${oficio.id}`)}
                      title="Ver detalles"
                      aria-label={`Ver detalles del oficio ${oficio.numeroExpediente}`}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Button>

                    <AccionesMenu
                      acciones={[
                        {
                          label: 'Editar',
                          icon: 'edit',
                          onClick: () => handleEdit(oficio.id)
                        },
                        {
                          label: 'Cambiar Estado',
                          icon: 'sync_alt',
                          onClick: () => handleChangeStatusClick(oficio)
                        },
                        {
                          label: 'Ver Detalles',
                          icon: 'visibility',
                          onClick: () => router.push(`/dashboard/oficios/${oficio.id}`)
                        },
                        {
                          label: 'Eliminar',
                          icon: 'delete',
                          onClick: () => handleDeleteClick(oficio.id),
                          variant: 'danger',
                          divider: true
                        }
                      ]}
                    />
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
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

      {/* Modal de edición */}
      <EditarOficioModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
        oficioId={selectedOficioId}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmacionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setOficioToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Oficio?"
        message="Esta acción no se puede deshacer. Se eliminará el oficio y todos sus documentos asociados."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Modal de cambiar estado */}
      {oficioToChangeStatus && (
        <CambiarEstadoModal
          isOpen={isCambiarEstadoModalOpen}
          onClose={() => {
            setIsCambiarEstadoModalOpen(false)
            setOficioToChangeStatus(null)
          }}
          onConfirm={handleConfirmChangeStatus}
          estadoActual={oficioToChangeStatus.estado}
        />
      )}
    </div>
  )
}