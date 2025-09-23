# Proyecto Web - Sistema de Citas

Un proyecto fullstack desarrollado con **Next.js** (frontend) y **Express.js** (backend) para la materia de Desarrollo Web.

## 📑 Tabla de Contenidos

- [🚀 Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🛠️ Instalación y Configuración](#️-instalación-y-configuración)
- [🚀 Ejecución](#-ejecución)
- [📡 APIs Disponibles](#-apis-disponibles)
- [✨ Características](#-características)
- [👥 Equipo de Desarrollo](#-equipo-de-desarrollo)
- [🤝 Trabajo en Equipo](#-trabajo-en-equipo-5-personas)
- [📝 Notas de Desarrollo](#-notas-de-desarrollo)

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

## � Equipo de Desarrollo

- **Edwin Benito** - Team Lead & Backend Developer
- **Francisco Gress** - Frontend Lead Developer  
- **Jose Luis** - Frontend Developer
- **Erick Rivas** - Backend Developer
- **Aldo Pacheco** - UI/UX Developer

## 🤝 Trabajo en Equipo (5 Personas)

Este proyecto está diseñado para trabajar colaborativamente con **5 desarrolladores**. Aquí tienes todos los comandos y flujo de trabajo necesarios:

### ⚙️ Configuración Inicial para Nuevos Colaboradores

#### 1. **Clonar el Repositorio**
```bash
# Clonar el proyecto
git clone https://github.com/Edwin-Benito/Proyecto-Web.git
cd Proyecto-Web

# Configurar tu información de Git (solo la primera vez)
git config user.name "Tu Nombre"
git config user.email "tu.email@example.com"
```

#### 2. **Instalar Dependencias**
```bash
# Instalar dependencias del backend
cd backend
pnpm install

# Instalar dependencias del frontend
cd ../frontend/citas-frg
pnpm install

# Volver a la raíz del proyecto
cd ../..
```

### 🌟 Estrategia de Ramas para 5 Personas

#### **Estructura de Ramas Recomendada:**
- `main` - Rama principal (código estable)
- `develop` - Rama de desarrollo (integración)
- `feature/frontend-[nombre]` - Funcionalidades del frontend
- `feature/backend-[nombre]` - Funcionalidades del backend
- `feature/ui-[nombre]` - Diseño y componentes UI
- `hotfix/[nombre]` - Correcciones urgentes

#### **División del Equipo por Roles:**
1. **Edwin Benito (Team Lead)** - Arquitectura general y APIs principales
2. **Francisco Gress (Frontend Lead)** - Componentes principales y arquitectura frontend
3. **Jose Luis (Frontend Developer)** - Páginas y componentes específicos
4. **Erick Rivas (Backend Developer)** - Servicios, middleware y autenticación
5. **Aldo Pacheco (UI/UX Developer)** - Diseño, estilos y experiencia de usuario

### 📋 Comandos Esenciales para Colaboración

#### **Crear y Trabajar en una Nueva Rama**
```bash
# Actualizar main antes de crear una rama
git checkout main
git pull origin main

# Crear una nueva rama (ejemplos por rol)
git checkout -b feature/frontend-login          # Frontend
git checkout -b feature/backend-auth-api        # Backend
git checkout -b feature/ui-dashboard-design     # UI/UX
git checkout -b feature/frontend-user-profile   # Frontend
git checkout -b feature/backend-database-setup  # Backend

# Ver todas las ramas
git branch -a
```

#### **Flujo de Trabajo Diario**
```bash
# 1. Comenzar el día - actualizar tu rama
git checkout tu-rama
git pull origin main  # Traer cambios nuevos de main

# 2. Trabajar en tu código...
# (hacer cambios en el código)

# 3. Guardar cambios localmente
git add .
git commit -m "feat: descripción del cambio realizado"

# 4. Subir cambios a GitHub
git push origin tu-rama

# 5. Al final del día o funcionalidad completa
# Crear Pull Request en GitHub para revisar código
```

#### **Sincronización con el Equipo**
```bash
# Actualizar rama develop con los últimos cambios
git checkout develop
git pull origin develop

# Actualizar tu rama con cambios de develop
git checkout tu-rama
git merge develop

# Si hay conflictos, resolverlos y hacer commit
git add .
git commit -m "merge: resolver conflictos con develop"
```

### 🔄 Flujo de Integración (Para el Team Lead)

#### **Crear Rama Develop (solo una vez)**
```bash
git checkout main
git checkout -b develop
git push -u origin develop
```

#### **Integrar Funcionalidades**
```bash
# 1. Cambiar a develop
git checkout develop
git pull origin develop

# 2. Mergear rama de funcionalidad
git merge feature/nombre-de-rama

# 3. Subir develop actualizado
git push origin develop

# 4. Cuando develop esté estable, mergear a main
git checkout main
git merge develop
git push origin main
```

### 🛠️ Comandos Útiles para el Equipo

#### **Información y Estado**
```bash
# Ver estado actual
git status

# Ver historial de commits
git log --oneline

# Ver ramas remotas
git branch -r

# Ver diferencias antes de commit
git diff
```

#### **Solución de Problemas Comunes**
```bash
# Descartar cambios no guardados
git checkout .

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Actualizar lista de ramas remotas
git fetch

# Cambiar a una rama remota
git checkout -b nombre-rama origin/nombre-rama
```

### �️ Comandos de Desarrollo por Área

#### **Frontend Team (Francisco & Jose Luis)**
```bash
# Iniciar desarrollo frontend
cd frontend/citas-frg
pnpm dev  # Puerto 3000

# Comandos útiles
pnpm build       # Construir para producción
pnpm lint        # Revisar código
pnpm type-check  # Verificar TypeScript
```

#### **Backend Team (Edwin & Erick)**
```bash
# Iniciar desarrollo backend
cd backend
pnpm dev  # Puerto 3001

# Comandos útiles
pnpm start    # Modo producción
node index.js # Ejecutar directo
```

#### **UI/UX Team (Aldo)**
```bash
# Trabajar en estilos y componentes
cd frontend/citas-frg
pnpm dev  # Puerto 3000

# Comandos útiles para diseño
pnpm build    # Ver build de producción
# Revisar responsive design en diferentes viewports
```

### 📝 Convenciones del Equipo

#### **Nombres de Commits**
```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato (espacios, comas, etc)
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

#### **Nombres de Ramas**
```bash
feature/frontend-login-form
feature/backend-user-api
feature/ui-responsive-design
hotfix/cors-configuration
bugfix/form-validation
```

### 🔒 Reglas de Colaboración

1. **Nunca hacer push directo a `main`**
2. **Siempre crear Pull Request para review**
3. **Actualizar tu rama antes de empezar a trabajar**
4. **Hacer commits pequeños y frecuentes**
5. **Escribir mensajes de commit descriptivos**
6. **Revisar código de compañeros antes de aprobar PR**
7. **Ejecutar tests antes de hacer push**

### 🆘 Comandos de Emergencia

```bash
# Si algo se rompe, volver a estado limpio
git checkout main
git pull origin main
git checkout -b nueva-rama-limpia

# Si necesitas los cambios de otra persona urgente
git fetch origin
git checkout feature/rama-del-compañero

# Sincronizar fork (si usan forks)
git remote add upstream https://github.com/Edwin-Benito/Proyecto-Web.git
git fetch upstream
git checkout main
git merge upstream/main
```

## 📝 Notas de Desarrollo

Este proyecto fue creado como parte del aprendizaje de desarrollo fullstack en la **materia de Desarrollo Web**, conectando un frontend moderno en Next.js con un backend en Express.js.

### 🎯 Objetivos del Proyecto:
- Aprender desarrollo fullstack moderno
- Practicar trabajo colaborativo con Git
- Implementar comunicación frontend-backend
- Aplicar buenas prácticas de desarrollo

### 🚀 Próximas Funcionalidades:
- [ ] Sistema de autenticación y autorización
- [ ] Integración con base de datos (MongoDB/PostgreSQL)
- [ ] CRUD completo para gestión de citas médicas
- [ ] Validaciones de formularios frontend y backend
- [ ] Testing unitario e integración
- [ ] Deployment en la nube (Vercel/Heroku)
- [ ] Notificaciones en tiempo real
- [ ] Dashboard administrativo

### 📚 Tecnologías por Aprender:
- **Base de datos**: Prisma ORM + PostgreSQL
- **Autenticación**: NextAuth.js o JWT
- **Testing**: Jest + React Testing Library
- **Deploy**: Vercel (frontend) + Railway (backend)
- **Monitoring**: Sentry para error tracking