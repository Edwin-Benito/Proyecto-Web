import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { peritosService } from '@/services/peritos';
import { Perito } from '@/app/types';
import toast from 'react-hot-toast';

interface EditarPeritoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  peritoId: string | null;
}

interface PeritoFormState {
  nombre: string;
  apellido: string;
  cedula: string;
  especialidad: string;
  telefono: string;
  email: string;
  disponible: boolean;
  activo: boolean;
}

const initialState: PeritoFormState = {
  nombre: '',
  apellido: '',
  cedula: '',
  especialidad: '',
  telefono: '',
  email: '',
  disponible: true,
  activo: true,
};

const EditarPeritoModal: React.FC<EditarPeritoModalProps> = ({ isOpen, onClose, onSuccess, peritoId }) => {
  const [form, setForm] = useState<PeritoFormState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del perito cuando se abre el modal
  useEffect(() => {
    if (isOpen && peritoId) {
      loadPeritoData();
    } else if (!isOpen) {
      setForm(initialState);
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }, [isOpen, peritoId]);

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

  const loadPeritoData = async () => {
    if (!peritoId) return;

    setIsLoading(true);
    try {
      const response = await peritosService.getPerito(peritoId);

      if (response.success && response.data) {
        const perito = response.data;
        setForm({
          nombre: perito.nombre,
          apellido: perito.apellido,
          cedula: perito.cedula,
          especialidad: perito.especialidad,
          telefono: perito.telefono,
          email: perito.email,
          disponible: perito.disponible,
          activo: perito.activo,
        });
      } else {
        toast.error('Error al cargar datos del perito');
        onClose();
      }
    } catch (error) {
      console.error('Error loading perito:', error);
      toast.error('Error al cargar datos del perito');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!peritoId) return;

    setIsSubmitting(true);

    try {
      const response = await peritosService.updatePerito(peritoId, form);

      if (response.success) {
        toast.success('Perito actualizado exitosamente');
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.message || 'Error al actualizar el perito');
      }
    } catch (error: any) {
      console.error('Error actualizando perito:', error);
      toast.error(error.message || 'Error al actualizar el perito');
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

      <div className="relative z-10 w-full max-w-2xl mx-4 rounded-lg bg-white shadow-lg border border-gray-200">
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Editar Perito</h2>
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

              <div className="md:col-span-2 flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={form.disponible}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Disponible para asignación</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={form.activo}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Activo en el sistema</span>
                </label>
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

export default EditarPeritoModal;
