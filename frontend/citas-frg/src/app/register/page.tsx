'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  cedula: string;
  telefono: string;
  especialidad: string;
  mensaje: string;
}

interface FormErrors {
  nombre?: string;
  apellido?: string;
  email?: string;
  cedula?: string;
  telefono?: string;
  especialidad?: string;
  mensaje?: string;
  general?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
    especialidad: '',
    mensaje: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const especialidades = [
    'Perito Mecánico Automotriz',
    'Perito en Avalúos Inmobiliarios', 
    'Perito Médico',
    'Perito Contable',
    'Perito en Informática',
    'Perito en Construcción',
    'Perito en Electricidad',
    'Perito en Incendios',
    'Otra especialidad'
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validación de nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validación de apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    // Validación de email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    }

    // Validación de cédula
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (formData.cedula.trim().length < 7) {
      newErrors.cedula = 'La cédula debe tener al menos 7 caracteres';
    }

    // Validación de teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (formData.telefono.trim().length < 8) {
      newErrors.telefono = 'El teléfono debe tener al menos 8 caracteres';
    }

    // Validación de especialidad
    if (!formData.especialidad) {
      newErrors.especialidad = 'Debe seleccionar una especialidad';
    }

    // Validación de mensaje
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido';
    } else if (formData.mensaje.trim().length < 20) {
      newErrors.mensaje = 'El mensaje debe tener al menos 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simular envío de solicitud
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Aquí iría la lógica para enviar la solicitud al backend
      console.log('Solicitud de registro:', formData);
      
      setIsSubmitted(true);
    } catch (error) {
      setErrors({
        general: 'Error al enviar la solicitud. Por favor, intenta nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mx-auto h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Solicitud Enviada!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu solicitud de registro ha sido enviada exitosamente. El administrador la revisará y te contactará pronto.
            </p>
            <div className="space-y-4">
              <Link href="/">
                <button className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                  Volver al Inicio
                </button>
              </Link>
              <Link href="/login">
                <button className="w-full border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors">
                  Ir a Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="border-b border-border-light dark:border-border-dark px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <svg 
                className="h-8 w-8 text-primary cursor-pointer" 
                fill="none" 
                viewBox="0 0 48 48" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" 
                  fill="currentColor"
                />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-text-light dark:text-text-dark">Registro de Perito</h1>
          </div>
          <Link href="/login">
            <button className="text-primary hover:text-primary/80 font-medium">
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
              Solicitud de Registro
            </h2>
            <p className="text-subtle-light dark:text-subtle-dark">
              Completa el formulario para solicitar acceso como perito al sistema
            </p>
          </div>

          <div className="bg-white dark:bg-background-dark rounded-lg shadow-lg p-8 border border-border-light dark:border-border-dark">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              )}

              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange('nombre')}
                    className={`mt-1 w-full px-4 py-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 transition-all duration-200 text-text-light dark:text-text-dark placeholder-subtle-light dark:placeholder-subtle-dark ${
                      errors.nombre 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-border-light dark:border-border-dark focus:ring-primary focus:border-primary'
                    }`}
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="apellido"
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={handleInputChange('apellido')}
                    className={`mt-1 w-full px-4 py-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 transition-all duration-200 text-text-light dark:text-text-dark placeholder-subtle-light dark:placeholder-subtle-dark ${
                      errors.apellido 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-border-light dark:border-border-dark focus:ring-primary focus:border-primary'
                    }`}
                    placeholder="Tu apellido"
                  />
                  {errors.apellido && (
                    <p className="mt-1 text-sm text-red-500">{errors.apellido}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cedula" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark">
                    Cédula <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cedula"
                    type="text"
                    required
                    value={formData.cedula}
                    onChange={handleInputChange('cedula')}
                    className={`mt-1 w-full px-4 py-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 transition-all duration-200 text-text-light dark:text-text-dark placeholder-subtle-light dark:placeholder-subtle-dark ${
                      errors.cedula 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-border-light dark:border-border-dark focus:ring-primary focus:border-primary'
                    }`}
                    placeholder="12345678"
                  />
                  {errors.cedula && (
                    <p className="mt-1 text-sm text-red-500">{errors.cedula}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={handleInputChange('telefono')}
                    className={`mt-1 w-full px-4 py-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 transition-all duration-200 text-text-light dark:text-text-dark placeholder-subtle-light dark:placeholder-subtle-dark ${
                      errors.telefono 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-border-light dark:border-border-dark focus:ring-primary focus:border-primary'
                    }`}
                    placeholder="09XX-XXXXXX"
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-500">{errors.telefono}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className={`mt-1 w-full px-4 py-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 transition-all duration-200 text-text-light dark:text-text-dark placeholder-subtle-light dark:placeholder-subtle-dark ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-border-light dark:border-border-dark focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="especialidad" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark">
                  Especialidad <span className="text-red-500">*</span>
                </label>
                <select
                  id="especialidad"
                  required
                  value={formData.especialidad}
                  onChange={handleInputChange('especialidad')}
                  className={`mt-1 w-full px-4 py-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 transition-all duration-200 text-text-light dark:text-text-dark ${
                    errors.especialidad 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-border-light dark:border-border-dark focus:ring-primary focus:border-primary'
                  }`}
                >
                  <option value="">Selecciona tu especialidad</option>
                  {especialidades.map((esp) => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
                {errors.especialidad && (
                  <p className="mt-1 text-sm text-red-500">{errors.especialidad}</p>
                )}
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark">
                  Mensaje / Comentarios <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="mensaje"
                  rows={4}
                  required
                  value={formData.mensaje}
                  onChange={handleInputChange('mensaje')}
                  className={`mt-1 w-full px-4 py-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 transition-all duration-200 text-text-light dark:text-text-dark placeholder-subtle-light dark:placeholder-subtle-dark resize-none ${
                    errors.mensaje 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-border-light dark:border-border-dark focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="Describe tu experiencia, certificaciones y por qué deseas formar parte del equipo de peritos..."
                />
                {errors.mensaje && (
                  <p className="mt-1 text-sm text-red-500">{errors.mensaje}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 ${
                    isSubmitting 
                      ? 'bg-primary/70 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando solicitud...
                    </>
                  ) : (
                    'Enviar Solicitud de Registro'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="text-center">
            <p className="text-sm text-subtle-light dark:text-subtle-dark">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}