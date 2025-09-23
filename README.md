# Proyecto Web - Sistema de Citas

Un proyecto fullstack desarrollado con **Next.js** (frontend) y **Express.js** (backend) para la materia de Desarrollo Web.

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **React Server Components** - Componentes del servidor

### Backend
- **Express.js** - Framework de Node.js
- **Node.js** - Entorno de ejecución
- **CORS** - Cross-Origin Resource Sharing
- **Nodemon** - Desarrollo con hot reload

## 📁 Estructura del Proyecto

```
Proyecto Web/
├── frontend/citas-frg/     # Aplicación Next.js
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx    # Página principal con conexión al backend
│   │       └── layout.tsx  # Layout principal
│   ├── .env.local          # Variables de entorno
│   └── package.json
├── backend/                # API Express.js
│   ├── index.js           # Servidor principal con APIs
│   └── package.json
├── package.json           # Configuración del workspace
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- pnpm (gestor de paquetes)

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Edwin-Benito/Proyecto-Web.git
   cd Proyecto-Web
   ```

2. **Instalar dependencias del backend:**
   ```bash
   cd backend
   pnpm install
   ```

3. **Instalar dependencias del frontend:**
   ```bash
   cd ../frontend/citas-frg
   pnpm install
   ```

## 🚀 Ejecución

### Desarrollo

1. **Iniciar el backend (puerto 3001):**
   ```bash
   cd backend
   pnpm dev
   ```

2. **Iniciar el frontend (puerto 3000):**
   ```bash
   cd frontend/citas-frg
   pnpm dev
   ```

3. **Acceder a la aplicación:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📡 APIs Disponibles

- `GET /` - Mensaje de bienvenida
- `GET /api/test` - Prueba de conexión
- `GET /api/users` - Lista de usuarios de ejemplo
- `POST /api/users` - Crear nuevo usuario

## ✨ Características

- ✅ **Conexión Frontend-Backend** completamente funcional
- ✅ **CORS configurado** para desarrollo
- ✅ **TypeScript** en el frontend
- ✅ **Hot reload** en ambos entornos
- ✅ **Variables de entorno** configuradas
- ✅ **APIs REST** funcionales
- ✅ **Interfaz interactiva** para probar la conectividad

## 👨‍💻 Desarrollador

**Edwin Benito** - Estudiante de Desarrollo Web

## 📝 Notas de Desarrollo

Este proyecto fue creado como parte del aprendizaje de desarrollo fullstack, conectando un frontend moderno en Next.js con un backend en Express.js.

### Próximas funcionalidades:
- Sistema de autenticación
- Base de datos
- CRUD completo para gestión de citas
- Validaciones de formularios
- Testing unitario