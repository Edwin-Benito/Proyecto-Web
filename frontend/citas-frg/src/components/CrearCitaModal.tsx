'use client'

import { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { citasService, peritosService, oficiosService } from '@/services'
import type { Cita, Perito, Oficio } from '@/app/types'
import toast from 'react-hot-toast'
import { format, addHours, parseISO, isBefore, isAfter } from 'date-fns'

interface CrearCitaModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  fechaInicio?: Date
  fechaFin?: Date
  peritoId?: string
  oficioId?: string
}

const TIPOS_CITA: Array<{ value: Cita['tipo']; label: string; icon: string; color: string }> = [
  { value: 'EVALUACION', label: 'Evaluación', icon: 'fact_check', color: 'blue' },
  { value: 'AUDIENCIA', label: 'Audiencia', icon: 'gavel', color: 'purple' },
  { value: 'ENTREGA_INFORME', label: 'Entrega de Informe', icon: 'description', color: 'green' },
  { value: 'SEGUIMIENTO', label: 'Seguimiento', icon: 'update', color: 'amber' },
  { value: 'OTRA', label: 'Otra', icon: 'event', color: 'gray' },
]

export function CrearCitaModal({
  isOpen,
  onClose,
  onSuccess,
  fechaInicio,
  fechaFin,
  peritoId,
  oficioId,
}: CrearCitaModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    horaInicio: '',
    fechaFin: '',
    horaFin: '',
    ubicacion: '',
    tipo: 'EVALUACION' as Cita['tipo'],
    peritoId: peritoId || '',
    oficioId: oficioId || '',
    recordatorio24h: true,
    recordatorio1h: true,
  })

  const [peritos, setPeritos] = useState<Perito[]>([])
  const [oficios, setOficios] = useState<Oficio[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchPerito, setSearchPerito] = useState('')
  const [searchOficio, setSearchOficio] = useState('')

  useEffect(() => {
    if (isOpen) {
      // Inicializar fechas si se proporcionan
      if (fechaInicio) {
        setFormData((prev) => ({
          ...prev,
          fechaInicio: format(fechaInicio, 'yyyy-MM-dd'),
          horaInicio: format(fechaInicio, 'HH:mm'),
        }))
      } else {
        // Por defecto, sugerir el día actual
        const now = new Date()
        setFormData((prev) => ({
          ...prev,
          fechaInicio: format(now, 'yyyy-MM-dd'),
          horaInicio: format(addHours(now, 1), 'HH:mm'), // +1 hora
        }))
      }
      
      if (fechaFin) {
        setFormData((prev) => ({
          ...prev,
          fechaFin: format(fechaFin, 'yyyy-MM-dd'),
          horaFin: format(fechaFin, 'HH:mm'),
        }))
      } else {
        // Sugerir 1 hora después del inicio
        const now = fechaInicio || new Date()
        const endTime = addHours(now, 2)
        setFormData((prev) => ({
          ...prev,
          fechaFin: format(endTime, 'yyyy-MM-dd'),
          horaFin: format(endTime, 'HH:mm'),
        }))
      }

      loadData()
    }
  }, [isOpen, fechaInicio, fechaFin])

  const loadData = async () => {
    try {
      setLoadingData(true)

      const [peritosResponse, oficiosResponse] = await Promise.all([
        peritosService.getPeritos({ limit: 100, activo: true, disponible: true }),
        oficiosService.getOficios({ limit: 100 }),
      ])

      if (peritosResponse.success && peritosResponse.data) {
        setPeritos(peritosResponse.data.data || [])
      }

      if (oficiosResponse.success && oficiosResponse.data) {
        setOficios(oficiosResponse.data.data || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Error al cargar datos')
    } finally {
      setLoadingData(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
      
      // Limpiar error del campo cuando el usuario empieza a escribir
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    }

    // Auto-ajustar hora fin si cambia hora inicio
    if (name === 'horaInicio' && value) {
      const [hours, minutes] = value.split(':').map(Number)
      const newEndHour = (hours + 1) % 24
      const newEndTime = `${String(newEndHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      setFormData((prev) => ({ ...prev, horaFin: newEndTime }))
    }

    // Auto-ajustar fecha fin si cambia fecha inicio
    if (name === 'fechaInicio' && value) {
      if (!formData.fechaFin || isBefore(parseISO(formData.fechaFin), parseISO(value))) {
        setFormData((prev) => ({ ...prev, fechaFin: value }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido'
    }

    if (!formData.peritoId) {
      newErrors.peritoId = 'Debe seleccionar un perito'
    }

    if (!formData.oficioId) {
      newErrors.oficioId = 'Debe seleccionar un oficio'
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida'
    }

    if (!formData.horaInicio) {
      newErrors.horaInicio = 'La hora de inicio es requerida'
    }

    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es requerida'
    }

    if (!formData.horaFin) {
      newErrors.horaFin = 'La hora de fin es requerida'
    }

    // Validar que la fecha fin sea después de la fecha inicio
    if (formData.fechaInicio && formData.fechaFin && formData.horaInicio && formData.horaFin) {
      const inicio = parseISO(`${formData.fechaInicio}T${formData.horaInicio}`)
      const fin = parseISO(`${formData.fechaFin}T${formData.horaFin}`)
      
      if (isAfter(inicio, fin) || inicio.getTime() === fin.getTime()) {
        newErrors.fechaFin = 'La fecha/hora de fin debe ser posterior a la de inicio'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Por favor, corrija los errores en el formulario')
      return
    }

    setLoading(true)
    try {
      // Combinar fecha y hora
      const fechaInicio = new Date(`${formData.fechaInicio}T${formData.horaInicio}`)
      const fechaFin = new Date(`${formData.fechaFin}T${formData.horaFin}`)

      const citaData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion || undefined,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        ubicacion: formData.ubicacion || undefined,
        tipo: formData.tipo,
        estado: 'PROGRAMADA' as Cita['estado'],
        peritoId: formData.peritoId,
        oficioId: formData.oficioId,
        recordatorio24h: formData.recordatorio24h,
        recordatorio1h: formData.recordatorio1h,
      }

      const response = await citasService.createCita(citaData as any)

      if (response.success) {
        toast.success('✅ Cita creada exitosamente')
        onSuccess()
        onClose()
        resetForm()
      } else {
        toast.error(response.message || 'Error al crear la cita')
      }
    } catch (error) {
      console.error('Error creating cita:', error)
      toast.error('Error al crear la cita')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      fechaInicio: '',
      horaInicio: '',
      fechaFin: '',
      horaFin: '',
      ubicacion: '',
      tipo: 'EVALUACION',
      peritoId: peritoId || '',
      oficioId: oficioId || '',
      recordatorio24h: true,
      recordatorio1h: true,
    })
    setErrors({})
    setSearchPerito('')
    setSearchOficio('')
  }

  // Filtrar peritos y oficios por búsqueda
  const peritosFiltered = peritos.filter((p) =>
    `${p.nombre} ${p.apellido} ${p.especialidad}`
      .toLowerCase()
      .includes(searchPerito.toLowerCase())
  )

  const oficiosFiltered = oficios.filter((o) =>
    `${o.numeroExpediente} ${o.nombreSolicitante} ${o.apellidoSolicitante}`
      .toLowerCase()
      .includes(searchOficio.toLowerCase())
  )

  const selectedTipo = TIPOS_CITA.find((t) => t.value === formData.tipo)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4 py-8">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-auto my-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* Header con gradiente */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="material-symbols-outlined text-white text-3xl">calendar_add_on</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Nueva Cita</h3>
                  <p className="text-blue-100 text-sm">Programa un evento en el calendario</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center backdrop-blur-sm"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {loadingData ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 rounded-xl">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-blue-900 font-medium">Cargando datos...</span>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
              {/* Sección 1: Información Básica */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <span className="material-symbols-outlined text-blue-600">info</span>
                  <h4>Información Básica</h4>
                </div>
                
                <div className="grid grid-cols-1 gap-4 pl-8">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título de la Cita *
                    </label>
                    <input
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      placeholder="Ej: Evaluación pericial caso #123"
                      className={`w-full px-4 py-3 border ${
                        errors.titulo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      required
                    />
                    {errors.titulo && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {errors.titulo}
                      </p>
                    )}
                  </div>

                  {/* Tipo de Cita - Tarjetas visuales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipo de Cita *
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {TIPOS_CITA.map((tipo) => {
                        const isSelected = formData.tipo === tipo.value
                        const borderColorClass = isSelected
                          ? tipo.color === 'blue' ? 'border-blue-500 bg-blue-50'
                          : tipo.color === 'purple' ? 'border-purple-500 bg-purple-50'
                          : tipo.color === 'green' ? 'border-green-500 bg-green-50'
                          : tipo.color === 'amber' ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-500 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        
                        const iconColorClass = isSelected
                          ? tipo.color === 'blue' ? 'text-blue-600'
                          : tipo.color === 'purple' ? 'text-purple-600'
                          : tipo.color === 'green' ? 'text-green-600'
                          : tipo.color === 'amber' ? 'text-amber-600'
                          : 'text-gray-600'
                          : 'text-gray-400'
                        
                        const textColorClass = isSelected
                          ? tipo.color === 'blue' ? 'text-blue-900'
                          : tipo.color === 'purple' ? 'text-purple-900'
                          : tipo.color === 'green' ? 'text-green-900'
                          : tipo.color === 'amber' ? 'text-amber-900'
                          : 'text-gray-900'
                          : 'text-gray-600'

                        return (
                          <button
                            key={tipo.value}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, tipo: tipo.value }))}
                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${borderColorClass}`}
                          >
                            <span className={`material-symbols-outlined text-2xl ${iconColorClass}`}>
                              {tipo.icon}
                            </span>
                            <span className={`text-xs font-medium text-center ${textColorClass}`}>
                              {tipo.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 2: Asignación */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <span className="material-symbols-outlined text-blue-600">group</span>
                  <h4>Asignación</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 pl-8">
                  {/* Perito con búsqueda */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Perito Asignado *
                    </label>
                    {!peritoId && (
                      <input
                        type="text"
                        placeholder="Buscar perito..."
                        value={searchPerito}
                        onChange={(e) => setSearchPerito(e.target.value)}
                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    )}
                    <select
                      name="peritoId"
                      value={formData.peritoId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.peritoId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                      required
                      disabled={!!peritoId}
                    >
                      <option value="">Seleccionar perito</option>
                      {peritosFiltered.map((perito) => (
                        <option key={perito.id} value={perito.id}>
                          {perito.nombre} {perito.apellido} - {perito.especialidad}
                        </option>
                      ))}
                    </select>
                    {errors.peritoId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {errors.peritoId}
                      </p>
                    )}
                  </div>

                  {/* Oficio con búsqueda */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Oficio Relacionado *
                    </label>
                    {!oficioId && (
                      <input
                        type="text"
                        placeholder="Buscar oficio..."
                        value={searchOficio}
                        onChange={(e) => setSearchOficio(e.target.value)}
                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    )}
                    <select
                      name="oficioId"
                      value={formData.oficioId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.oficioId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                      required
                      disabled={!!oficioId}
                    >
                      <option value="">Seleccionar oficio</option>
                      {oficiosFiltered.map((oficio) => (
                        <option key={oficio.id} value={oficio.id}>
                          {oficio.numeroExpediente} - {oficio.nombreSolicitante} {oficio.apellidoSolicitante}
                        </option>
                      ))}
                    </select>
                    {errors.oficioId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {errors.oficioId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección 3: Fecha y Hora */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <span className="material-symbols-outlined text-blue-600">schedule</span>
                  <h4>Fecha y Horario</h4>
                </div>

                <div className="grid grid-cols-2 gap-6 pl-8">
                  {/* Inicio */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <span className="material-symbols-outlined text-sm text-green-600">play_circle</span>
                      Inicio
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
                        <input
                          type="date"
                          name="fechaInicio"
                          value={formData.fechaInicio}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border ${
                            errors.fechaInicio ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                          required
                        />
                        {errors.fechaInicio && (
                          <p className="mt-1 text-xs text-red-600">{errors.fechaInicio}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Hora</label>
                        <input
                          type="time"
                          name="horaInicio"
                          value={formData.horaInicio}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border ${
                            errors.horaInicio ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                          required
                        />
                        {errors.horaInicio && (
                          <p className="mt-1 text-xs text-red-600">{errors.horaInicio}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fin */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <span className="material-symbols-outlined text-sm text-red-600">stop_circle</span>
                      Fin
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
                        <input
                          type="date"
                          name="fechaFin"
                          value={formData.fechaFin}
                          onChange={handleInputChange}
                          min={formData.fechaInicio}
                          className={`w-full px-4 py-3 border ${
                            errors.fechaFin ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                          required
                        />
                        {errors.fechaFin && (
                          <p className="mt-1 text-xs text-red-600">{errors.fechaFin}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Hora</label>
                        <input
                          type="time"
                          name="horaFin"
                          value={formData.horaFin}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border ${
                            errors.horaFin ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                          required
                        />
                        {errors.horaFin && (
                          <p className="mt-1 text-xs text-red-600">{errors.horaFin}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 4: Detalles Adicionales */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <span className="material-symbols-outlined text-blue-600">edit_note</span>
                  <h4>Detalles Adicionales</h4>
                </div>

                <div className="space-y-4 pl-8">
                  {/* Ubicación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">
                        location_on
                      </span>
                      <input
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleInputChange}
                        placeholder="Dirección o lugar de la cita"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Detalles adicionales de la cita..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 5: Recordatorios */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <span className="material-symbols-outlined text-blue-600">notifications</span>
                  <h4>Recordatorios</h4>
                </div>

                <div className="space-y-3 pl-8">
                  <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-all group">
                    <input
                      type="checkbox"
                      name="recordatorio24h"
                      checked={formData.recordatorio24h}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600 text-xl">event_note</span>
                        <span className="text-sm font-medium text-blue-900">Recordatorio 24 horas antes</span>
                      </div>
                      <p className="text-xs text-blue-700 ml-7">Te notificaremos un día antes del evento</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl cursor-pointer hover:bg-amber-100 transition-all group">
                    <input
                      type="checkbox"
                      name="recordatorio1h"
                      checked={formData.recordatorio1h}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-600 text-xl">alarm</span>
                        <span className="text-sm font-medium text-amber-900">Recordatorio 1 hora antes</span>
                      </div>
                      <p className="text-xs text-amber-700 ml-7">Te notificaremos una hora antes del evento</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer con botones */}
          <div className="px-8 py-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || loadingData}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>Crear Cita</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
