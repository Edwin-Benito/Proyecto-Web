'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  /*const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validación de email
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    //if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Implementar lógica real de autenticación
      console.log('Datos de login:', formData);
      
      // Simular éxito y redirección (cambiar por la ruta deseada)
      router.push('/panelControl');
    } catch (error) {
      setErrors({
        general: 'Error de autenticación. Por favor, verifica tus credenciales.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display">
      {/* Header */}
      <header className="border-b border-border-light dark:border-border-dark px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <svg 
              className="h-8 w-8 text-primary" 
              fill="none" 
              viewBox="0 0 48 48" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" 
                fill="currentColor"
              />
            </svg>
            <h1 className="text-xl font-bold text-text-light dark:text-text-dark">Peritos App</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
              Iniciar sesión en tu cuenta
            </h2>
          </div>

          <div className="rounded-lg bg-white dark:bg-background-dark shadow-lg p-8 space-y-6 border border-border-light dark:border-border-dark">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              )}
              
              <div>
                <label 
                  htmlFor="email-address" 
                  className="block text-sm font-medium text-subtle-light dark:text-subtle-dark"
                >
                  Nombre de usuario o correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className={`w-full px-4 py-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 transition-all duration-200 text-text-light dark:text-text-dark placeholder-subtle-light dark:placeholder-subtle-dark ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-border-light dark:border-border-dark focus:ring-primary focus:border-primary'
                    }`}
                    placeholder="usuario@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-subtle-light dark:text-subtle-dark"
                >
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className={`w-full px-4 py-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 transition-all duration-200 text-text-light dark:text-text-dark placeholder-subtle-light dark:placeholder-subtle-dark ${
                      errors.password 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-border-light dark:border-border-dark focus:ring-primary focus:border-primary'
                    }`}
                    placeholder="********"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange('rememberMe')}
                    className="h-4 w-4 rounded border-border-light dark:border-border-dark text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-subtle-light dark:text-subtle-dark">
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <a 
                    href="#" 
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative flex w-full justify-center rounded-lg border border-transparent py-3 px-4 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-colors duration-200 ${
                    isLoading 
                      ? 'bg-primary/70 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}