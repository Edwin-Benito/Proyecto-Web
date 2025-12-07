import React, { useEffect, useState } from 'react';
import { Button, Input } from '@/components/ui';
import { peritosService } from '@/services/peritos';
import toast from 'react-hot-toast';

interface NuevoPeritoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface PeritoFormState {
  nombre: string;
  apellido: string;
  cedula: string;
  especialidad: string;
  telefono: string;
  email: string;
}

const initialState: PeritoFormState = {
  nombre: '',
  apellido: '',
  cedula: '',
  especialidad: '',
  telefono: '',
  email: '',
};

const NuevoPeritoModal: React.FC<NuevoPeritoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState<PeritoFormState>(initialState);
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

  // Reset del formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setForm(initialState);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await peritosService.createPerito(form);

      if (response.success) {
        toast.success('Perito creado exitosamente');
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.message || 'Error al crear el perito');
      }
    } catch (error: any) {
      console.error('Error creando perito:', error);
      toast.error(error.message || 'Error al crear el perito');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl mx-4 rounded-lg bg-white shadow-lg border border-gray-200">
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Registrar Nuevo Perito</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Cerrar"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-5 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Input
                label="Nombre"
                name="nombre"
                placeholder="Nombre del perito"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Input
                label="Apellido"
                name="apellido"
                placeholder="Apellido del perito"
                value={form.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Input
                label="Cédula Profesional"
                name="cedula"
                placeholder="1234567890"
                value={form.cedula}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Input
                label="Teléfono"
                name="telefono"
                type="tel"
                placeholder="0991234567"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Correo Electrónico"
                name="email"
                type="email"
                placeholder="perito@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700">
                Especialidad(es)
              </label>
              <textarea
                id="especialidad"
                name="especialidad"
                value={form.especialidad}
                onChange={handleChange}
                required
                rows={2}
                placeholder="Ej: Medicina Legal, Psiquiatría (separados por comas)"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors resize-none"
              />
              <p className="text-xs text-gray-500">Separar múltiples especialidades con comas</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Perito'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoPeritoModal;