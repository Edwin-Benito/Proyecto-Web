'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import EditarPeritoModal from './EditarPeritoModal';
import { AccionesMenu } from './AccionesMenu';
import { ConfirmacionModal } from './ConfirmacionModal';
import { Perito } from '@/app/types';
import { peritosService } from '@/services';
import toast from 'react-hot-toast';

export function PeritosTable() {
  const [peritos, setPeritos] = useState<Perito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [disponibleFilter, setDisponibleFilter] = useState<boolean | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPeritoId, setSelectedPeritoId] = useState<string | null>(null);
  
  // Estados para modal de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [peritoToDelete, setPeritoToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar peritos
  const loadPeritos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page: currentPage,
        limit: pageSize,
        busqueda: searchTerm || undefined,
        disponible: disponibleFilter !== '' ? disponibleFilter : undefined,
      };

      const response = await peritosService.getPeritos(filters);

      if (response.success && response.data) {
        setPeritos(response.data.data);
        setTotalItems(response.data.total);
      } else {
        throw new Error(response.message || 'Error al cargar peritos');
      }
    } catch (err) {
      console.error('Error loading peritos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setPeritos([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, disponibleFilter]);

  useEffect(() => {
    loadPeritos();
  }, [loadPeritos]);

  // Resetear página cuando cambian filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, disponibleFilter]);

  // Toggle disponibilidad
  const handleToggleDisponibilidad = async (peritoId: string, disponible: boolean) => {
    try {
      const response = await peritosService.toggleDisponibilidad(peritoId, !disponible);
      
      if (response.success) {
        toast.success(`Perito ${!disponible ? 'disponible' : 'no disponible'}`);
        loadPeritos();
      } else {
        toast.error(response.message || 'Error al actualizar disponibilidad');
      }
    } catch (error) {
      console.error('Error toggling disponibilidad:', error);
      toast.error('Error al actualizar disponibilidad');
    }
  };

  // Abrir modal de edición
  const handleEdit = (peritoId: string) => {
    setSelectedPeritoId(peritoId);
    setIsEditModalOpen(true);
  };

  // Cerrar modal de edición
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPeritoId(null);
  };

  // Callback después de actualizar perito
  const handleEditSuccess = () => {
    loadPeritos();
  };

  // Handlers para eliminar
  const handleDeleteClick = (peritoId: string) => {
    setPeritoToDelete(peritoId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!peritoToDelete) return;

    setIsDeleting(true);
    try {
      const response = await peritosService.deletePerito(peritoToDelete);
      if (response.success) {
        toast.success('Perito eliminado exitosamente');
        loadPeritos();
      } else {
        toast.error(response.message || 'Error al eliminar el perito');
      }
    } catch (error) {
      console.error('Error eliminando perito:', error);
      toast.error('Error al eliminar el perito');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setPeritoToDelete(null);
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando peritos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header con búsqueda */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Peritos Registrados ({totalItems})
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Búsqueda */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, cédula o especialidad..."
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

            {/* Filtro de disponibilidad */}
            <select
              value={disponibleFilter.toString()}
              onChange={(e) => setDisponibleFilter(e.target.value === '' ? '' : e.target.value === 'true')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="true">Disponibles</option>
              <option value="false">No Disponibles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && peritos.length === 0 && (
        <div className="p-6 bg-red-50 border-b border-red-200">
          <p className="text-red-800 text-sm">
            {error} - No se pudieron cargar los peritos
          </p>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre del Perito
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cédula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {peritos.map((perito) => (
              <tr key={perito.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${perito.disponible ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {perito.nombre} {perito.apellido}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {perito.cedula}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="flex flex-wrap gap-1">
                    {perito.especialidad.split(',').map((esp, idx) => (
                      <span key={idx} className="inline-flex px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200">
                        {esp.trim()}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div>
                    <div>{perito.telefono}</div>
                    <div className="text-xs text-gray-500">{perito.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleToggleDisponibilidad(perito.id, perito.disponible)}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      perito.disponible
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {perito.disponible ? 'Disponible' : 'No Disponible'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2 items-center">
                    <Link href={`/dashboard/peritos/${perito.id}`}>
                      <Button variant="secondary" size="sm" aria-label={`Ver perfil del perito ${perito.nombre} ${perito.apellido}`}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Button>
                    </Link>

                    <AccionesMenu
                      acciones={[
                        {
                          label: 'Editar',
                          icon: 'edit',
                          onClick: () => handleEdit(perito.id)
                        },
                        {
                          label: perito.disponible ? 'Marcar No Disponible' : 'Marcar Disponible',
                          icon: perito.disponible ? 'visibility_off' : 'visibility',
                          onClick: () => handleToggleDisponibilidad(perito.id, perito.disponible),
                          variant: perito.disponible ? 'warning' : 'success'
                        },
                        {
                          label: 'Ver Perfil',
                          icon: 'person',
                          onClick: () => window.location.href = `/dashboard/peritos/${perito.id}`
                        },
                        {
                          label: 'Eliminar',
                          icon: 'delete',
                          onClick: () => handleDeleteClick(perito.id),
                          variant: 'danger',
                          divider: true
                        }
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensaje cuando no hay datos */}
      {peritos.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay peritos</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza registrando un nuevo perito.</p>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {peritos.length} de {totalItems} peritos
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
                const page = i + 1;
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
                );
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
      <EditarPeritoModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
        peritoId={selectedPeritoId}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmacionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPeritoToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Perito?"
        message="Esta acción no se puede deshacer. El perito será eliminado del sistema."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default PeritosTable;