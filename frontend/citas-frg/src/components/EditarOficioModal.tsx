import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { oficiosService, peritosService } from '@/services';
import { Oficio } from '@/app/types';
import toast from 'react-hot-toast';

interface EditarOficioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  oficioId: string | null;
}

interface OficioFormState {
  numeroExpediente: string;
  nombreSolicitante: string;
  apellidoSolicitante: string;
  cedulaSolicitante: string;
  telefonoSolicitante: string;
  emailSolicitante: string;
  tipoPeritaje: string;
  descripcion: string;
  fechaVencimiento: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE' | '';
  estado: 'PENDIENTE' | 'ASIGNADO' | 'EN_PROCESO' | 'REVISION' | 'COMPLETADO' | 'RECHAZADO' | 'VENCIDO' | '';
  peritoId: string;
}

const initialState: OficioFormState = {
  numeroExpediente: '',
  nombreSolicitante: '',
  apellidoSolicitante: '',
  cedulaSolicitante: '',
  telefonoSolicitante: '',
  emailSolicitante: '',
  tipoPeritaje: '',
  descripcion: '',
  fechaVencimiento: '',
  prioridad: '',
  estado: '',
  peritoId: '',
};

const prioridadOptions: Array<Exclude<OficioFormState['prioridad'], ''>> = ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'];
const estadoOptions: Array<Exclude<OficioFormState['estado'], ''>> = [
  'PENDIENTE',
  'ASIGNADO',
  'EN_PROCESO',
  'REVISION',
  'COMPLETADO',
  'RECHAZADO',
  'VENCIDO',
];

const EditarOficioModal: React.FC<EditarOficioModalProps> = ({ isOpen, onClose, onSuccess, oficioId }) => {
  const [form, setForm] = useState<OficioFormState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [peritosDisponibles, setPeritosDisponibles] = useState<Array<{ id: string; nombre: string; apellido: string }>>([]);

  // Cargar datos del oficio cuando se abre el modal
  useEffect(() => {
    if (isOpen && oficioId) {
      loadOficioData();
      loadPeritosDisponibles();
    } else if (!isOpen) {
      setForm(initialState);
      setIsLoading(false);
      setIsSubmitting(false);
      setPeritosDisponibles([]);
    }
  }, [isOpen, oficioId]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, isSubmitting, isLoading]);

  const loadOficioData = async () => {
    if (!oficioId) return;

    setIsLoading(true);
    try {
      const response = await oficiosService.getOficio(oficioId);

      if (response.success && response.data) {
        const oficio = response.data;
        setForm({
          numeroExpediente: oficio.numeroExpediente,
          nombreSolicitante: oficio.nombreSolicitante,
          apellidoSolicitante: oficio.apellidoSolicitante,
          cedulaSolicitante: oficio.cedulaSolicitante,
          telefonoSolicitante: oficio.telefonoSolicitante || '',
          emailSolicitante: oficio.emailSolicitante || '',
          tipoPeritaje: oficio.tipoPeritaje,
          descripcion: oficio.descripcion,
          fechaVencimiento: oficio.fechaVencimiento ? new Date(oficio.fechaVencimiento).toISOString().split('T')[0] : '',
          prioridad: oficio.prioridad,
          estado: oficio.estado,
          peritoId: oficio.perito?.id || '',
        });
      } else {
        toast.error('Error al cargar datos del oficio');
        onClose();
      }
    } catch (error) {
      console.error('Error loading oficio:', error);
      toast.error('Error al cargar datos del oficio');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const loadPeritosDisponibles = async () => {
    try {
      const response = await peritosService.getPeritos({ disponible: true, activo: true });
      
      if (response.success && response.data) {
        setPeritosDisponibles(response.data.data.map(p => ({
          id: p.id,
          nombre: p.nombre,
          apellido: p.apellido,
        })));
      }
    } catch (error) {
      console.error('Error loading peritos:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oficioId) return;

    setIsSubmitting(true);

    try {
      // Validar campos requeridos
      if (!form.prioridad) {
        toast.error('Por favor selecciona una prioridad');
        setIsSubmitting(false);
        return;
      }

      if (!form.estado) {
        toast.error('Por favor selecciona un estado');
        setIsSubmitting(false);
        return;
      }

      // Preparar datos para enviar
      const updateData: any = {
        numeroExpediente: form.numeroExpediente,
        nombreSolicitante: form.nombreSolicitante,
        apellidoSolicitante: form.apellidoSolicitante,
        cedulaSolicitante: form.cedulaSolicitante,
        telefonoSolicitante: form.telefonoSolicitante || null,
        emailSolicitante: form.emailSolicitante || null,
        tipoPeritaje: form.tipoPeritaje,
        descripcion: form.descripcion,
        fechaVencimiento: new Date(form.fechaVencimiento).toISOString(),
        prioridad: form.prioridad,
        estado: form.estado,
      };

      // Solo incluir peritoId si se seleccionó uno
      if (form.peritoId) {
        updateData.peritoId = form.peritoId;
      }

      const response = await oficiosService.updateOficio(oficioId, updateData);

      if (response.success) {
        toast.success('Oficio actualizado exitosamente');
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.message || 'Error al actualizar el oficio');
      }
    } catch (error: any) {
      console.error('Error actualizando oficio:', error);
      toast.error(error.message || 'Error al actualizar el oficio');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !isLoading && !isSubmitting && onClose()}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-3xl mx-4 rounded-lg bg-white shadow-lg border border-gray-200">
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Editar Oficio</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Cerrar"
            disabled={isSubmitting || isLoading}
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando datos...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-5 overflow-y-auto max-h-[75vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Input
                  label="N° Expediente"
                  name="numeroExpediente"
                  placeholder="Ej. 2024-001"
                  value={form.numeroExpediente}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                >
                  <option value="" disabled>Selecciona un estado</option>
                  {estadoOptions.map(e => (
                    <option key={e} value={e}>{e.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <Input
                  label="Nombre Solicitante"
                  name="nombreSolicitante"
                  placeholder="Nombre"
                  value={form.nombreSolicitante}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  label="Apellido Solicitante"
                  name="apellidoSolicitante"
                  placeholder="Apellido"
                  value={form.apellidoSolicitante}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  label="Cédula Solicitante"
                  name="cedulaSolicitante"
                  placeholder="1234567890"
                  value={form.cedulaSolicitante}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  label="Teléfono"
                  name="telefonoSolicitante"
                  placeholder="0991234567"
                  value={form.telefonoSolicitante}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Input
                  label="Email"
                  name="emailSolicitante"
                  type="email"
                  placeholder="ejemplo@mail.com"
                  value={form.emailSolicitante}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Input
                  label="Tipo de Peritaje"
                  name="tipoPeritaje"
                  placeholder="Ej. Medicina Legal"
                  value={form.tipoPeritaje}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  label="Fecha de Vencimiento"
                  name="fechaVencimiento"
                  type="date"
                  value={form.fechaVencimiento}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">
                  Prioridad
                </label>
                <select
                  id="prioridad"
                  name="prioridad"
                  value={form.prioridad}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                >
                  <option value="" disabled>Selecciona una prioridad</option>
                  {prioridadOptions.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="peritoId" className="block text-sm font-medium text-gray-700">
                  Perito Asignado
                </label>
                <select
                  id="peritoId"
                  name="peritoId"
                  value={form.peritoId}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                >
                  <option value="">Sin asignar</option>
                  {peritosDisponibles.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} {p.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Descripción detallada del oficio..."
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Actualizando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditarOficioModal;
