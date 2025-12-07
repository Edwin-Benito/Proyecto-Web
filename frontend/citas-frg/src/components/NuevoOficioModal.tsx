import React, { useEffect, useState } from 'react';
import { Button, Input } from '@/components/ui';
import { oficiosService } from '@/services/oficios';
import toast from 'react-hot-toast';

interface NuevoOficioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback para refrescar la lista
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
};

const prioridadOptions: Array<OficioFormState['prioridad']> = ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'];

const NuevoOficioModal: React.FC<NuevoOficioModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState<OficioFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, isSubmitting]);

  // Reset del formulario al abrir/cerrar
  useEffect(() => {
    if (!isOpen) {
      setForm(initialState);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar campos requeridos
      if (!form.prioridad) {
        toast.error('Por favor selecciona una prioridad');
        setIsSubmitting(false);
        return;
      }

      // Preparar datos para enviar
      const oficioData = {
        ...form,
        fechaVencimiento: new Date(form.fechaVencimiento).toISOString(),
      };

      const response = await oficiosService.createOficio(oficioData as any);

      if (response.success) {
        toast.success('Oficio creado exitosamente');
        onSuccess?.(); // Refrescar lista
        onClose();
      } else {
        toast.error(response.message || 'Error al crear el oficio');
      }
    } catch (error: any) {
      console.error('Error creando oficio:', error);
      toast.error(error.message || 'Error al crear el oficio');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 rounded-lg bg-white shadow-lg border border-gray-200 animate-fade-in">
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Nuevo Oficio</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
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
              <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">Prioridad</label>
              <select
                id="prioridad"
                name="prioridad"
                value={form.prioridad}
                onChange={handleChange}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
              >
                <option value="" disabled>Selecciona una opción</option>
                {prioridadOptions.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
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
              {isSubmitting ? 'Guardando...' : 'Guardar Oficio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoOficioModal;
