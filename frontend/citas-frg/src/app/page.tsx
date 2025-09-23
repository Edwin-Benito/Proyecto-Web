'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse {
  message: string;
  timestamp: string;
  status: string;
}

export default function Home() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Función para probar la conexión con el backend
  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/test`);
      if (!response.ok) throw new Error('Error en la conexión');
      
      const data: ApiResponse = await response.json();
      setApiData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener usuarios
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/users`);
      if (!response.ok) throw new Error('Error obteniendo usuarios');
      
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🚀 Frontend ↔️ Backend
          </h1>
          <p className="text-lg text-gray-600">
            Prueba la conexión entre Next.js y Express
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sección de prueba de conexión */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              🔗 Prueba de Conexión
            </h2>
            
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mb-4"
            >
              {loading ? 'Conectando...' : 'Probar Conexión'}
            </button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                ❌ Error: {error}
              </div>
            )}

            {apiData && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <h3 className="font-semibold">✅ Conexión exitosa:</h3>
                <p className="mt-2">{apiData.message}</p>
                <p className="text-sm mt-1">Hora: {new Date(apiData.timestamp).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Sección de usuarios */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              👥 Lista de Usuarios
            </h2>
            
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mb-4"
            >
              {loading ? 'Cargando...' : 'Obtener Usuarios'}
            </button>

            {users.length > 0 && (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Información técnica */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            ⚙️ Información Técnica
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Frontend (Next.js)</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Puerto: 3000</li>
                <li>• Framework: Next.js 15</li>
                <li>• TypeScript ✅</li>
                <li>• Tailwind CSS ✅</li>
                <li>• App Router ✅</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Backend (Express)</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Puerto: 3001</li>
                <li>• Framework: Express.js</li>
                <li>• CORS configurado ✅</li>
                <li>• APIs REST ✅</li>
                <li>• Nodemon ✅</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}