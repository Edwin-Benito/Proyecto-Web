'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Oficio, Documento } from '@/app/types'
import { oficiosService } from '@/services'
import toast from 'react-hot-toast'

export default function OficioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const oficioId = params.id as string

  const [oficio, setOficio] = useState<Oficio | null>(null)
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingFile, setUploadingFile] = useState(false)

  useEffect(() => {
    if (oficioId) {
      loadOficioData()
    }
  }, [oficioId])

  const loadOficioData = async () => {
    try {
      setLoading(true)
      const response = await oficiosService.getOficio(oficioId)

      if (response.success && response.data) {
        setOficio(response.data)
        if (response.data.documentos) {
          setDocumentos(response.data.documentos)
        }
      } else {
        toast.error('Error al cargar el oficio')
        router.push('/dashboard/oficios')
      }
    } catch (error) {
      console.error('Error loading oficio:', error)
      toast.error('Error al cargar el oficio')
      router.push('/dashboard/oficios')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingFile(true)
      const formData = new FormData()
      formData.append('documento', file)
      formData.append('oficioId', oficioId)

      toast.success('Documento subido exitosamente')
      loadOficioData()
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Error al subir el documento')
    } finally {
      setUploadingFile(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ASIGNADO: 'bg-blue-100 text-blue-800 border-blue-200',
      EN_PROCESO: 'bg-purple-100 text-purple-800 border-purple-200',
      REVISION: 'bg-orange-100 text-orange-800 border-orange-200',
      COMPLETADO: 'bg-green-100 text-green-800 border-green-200',
      RECHAZADO: 'bg-red-100 text-red-800 border-red-200',
      VENCIDO: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    return colors[estado] || 'bg-gray-100 text-gray-800'
  }

  const getPrioridadColor = (prioridad: string) => {
    const colors: Record<string, string> = {
      BAJA: 'bg-gray-100 text-gray-700',
      MEDIA: 'bg-blue-100 text-blue-700',
      ALTA: 'bg-orange-100 text-orange-700',
      URGENTE: 'bg-red-100 text-red-700',
    }
    return colors[prioridad] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!oficio) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Oficio no encontrado</h2>
          <p className="mt-2 text-gray-600">El oficio que buscas no existe o ha sido eliminado.</p>
          <Link href="/dashboard/oficios">
            <Button className="mt-4" variant="primary">Volver a Oficios</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/oficios" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-3">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Oficios
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Oficio {oficio.numeroExpediente}</h1>
              <p className="text-gray-600 mt-1">Creado el {formatDate(oficio.createdAt)}</p>
            </div>
            
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(oficio.estado)}`}>
                {oficio.estado.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPrioridadColor(oficio.prioridad)}`}>
                {oficio.prioridad}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del Solicitante */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Solicitante</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                  <p className="text-gray-900">{oficio.nombreSolicitante} {oficio.apellidoSolicitante}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cédula</label>
                  <p className="text-gray-900">{oficio.cedulaSolicitante}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="text-gray-900">{oficio.telefonoSolicitante || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{oficio.emailSolicitante || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Detalles del Oficio */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Oficio</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Peritaje</label>
                  <p className="text-gray-900">{oficio.tipoPeritaje}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Descripción</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{oficio.descripcion}</p>
                </div>
                {oficio.observaciones && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Observaciones</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{oficio.observaciones}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha de Ingreso</label>
                    <p className="text-gray-900">{formatDate(oficio.fechaIngreso)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha de Vencimiento</label>
                    <p className={`font-medium ${
                      oficio.fechaVencimiento && new Date(oficio.fechaVencimiento) < new Date()
                        ? 'text-red-600'
                        : 'text-gray-900'
                    }`}>
                      {formatDate(oficio.fechaVencimiento)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Documentos ({documentos.length})</h2>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                  />
                  <Button variant="primary" size="sm" disabled={uploadingFile}>
                    {uploadingFile ? 'Subiendo...' : '+ Subir Documento'}
                  </Button>
                </label>
              </div>

              {documentos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2">No hay documentos adjuntos</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documentos.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div className="flex items-center gap-3">
                        <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">{doc.nombreOriginal || doc.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {(doc.tamano / 1024).toFixed(2)} KB • {formatDate(doc.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">
                        Descargar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Perito Asignado */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Perito Asignado</h2>
              {oficio.perito ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                      {oficio.perito.nombre[0]}{oficio.perito.apellido[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{oficio.perito.nombre} {oficio.perito.apellido}</p>
                      <p className="text-sm text-gray-500">{oficio.perito.cedula}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Especialidad</label>
                    <p className="text-gray-900">{oficio.perito.especialidad}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contacto</label>
                    <p className="text-gray-900">{oficio.perito.telefono}</p>
                    <p className="text-sm text-gray-600">{oficio.perito.email}</p>
                  </div>
                  {oficio.fechaAsignacion && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Fecha de Asignación</label>
                      <p className="text-gray-900">{formatDate(oficio.fechaAsignacion)}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">No hay perito asignado</p>
                  <Button variant="primary" size="sm">Asignar Perito</Button>
                </div>
              )}
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h2>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Oficio
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Descargar Reporte
                </Button>
                <Button variant="secondary" className="w-full justify-start text-red-600 hover:bg-red-50">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar Oficio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
