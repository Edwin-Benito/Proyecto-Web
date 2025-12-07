"use client"

import React from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

const PerfilPeritoPage: React.FC = () => {
  // Mock data por ahora
  const perito = {
    id: 'p1',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    especialidad: ['Contabilidad Forense', 'Auditoría'],
    cedula: '98765432109',
    telefono: '+52 555 0123',
    email: 'carlos.mendoza@peritos.com',
  }

  const casos = [
    { expediente: '2024-002', solicitante: 'Juan Carlos Rodríguez', estado: 'ASIGNADO' },
    { expediente: '2024-010', solicitante: 'María López', estado: 'PENDIENTE' },
    { expediente: '2024-015', solicitante: 'Ana Fernández', estado: 'COMPLETADO' },
  ]

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <p className="text-sm text-gray-600">
                <Link href="/dashboard/peritos" className="text-blue-600 hover:underline">← Volver a la lista</Link>
              </p>
              <h1 className="text-2xl font-bold text-gray-900">Perfil del Perito</h1>
              <p className="text-sm text-gray-600">Detalles de contacto y casos asignados.</p>
            </div>

            {/* Información de contacto */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Información de Contacto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Nombre Completo</div>
                  <div className="mt-1 text-gray-900 font-medium">{perito.nombre} {perito.apellido}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Especialidad</div>
                  <div className="mt-1 text-gray-900 font-medium">{perito.especialidad.join(', ')}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Cédula Profesional</div>
                  <div className="mt-1 text-gray-900 font-medium">{perito.cedula}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Teléfono</div>
                  <div className="mt-1 text-gray-900 font-medium">{perito.telefono}</div>
                </div>

                <div className="sm:col-span-2">
                  <div className="text-sm text-gray-500">Correo Electrónico</div>
                  <div className="mt-1 text-gray-900 font-medium">{perito.email}</div>
                </div>
              </div>
            </div>

            {/* Casos asignados */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Casos Asignados</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expediente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {casos.map((c) => (
                      <tr key={c.expediente} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.expediente}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.solicitante}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PerfilPeritoPage
