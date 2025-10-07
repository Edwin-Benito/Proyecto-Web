# Proyecto Web - Sistema de Citas

Proyecto escolar colaborativo para la materia de **Desarrollo Web**. Sistema de citas médicas fullstack desarrollado con **Next.js** (frontend) y **Express.js** (backend).

## 📑 Tabla de Contenidos

- [🚀 Demo Rápida](#-demo-rápida)
- [🛠️ Tecnologías Principales](#️-tecnologías-principales)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [✨ Características Principales](#-características-principales)
- [👥 Equipo de Desarrollo](#-equipo-de-desarrollo)
- [👨‍💻 Guía para Colaboradores](#-guía-para-colaboradores)
- [💡 Roadmap](#-roadmap)
- [📡 APIs Disponibles](#-apis-disponibles)

## 🚀 Demo Rápida

¿Solo quieres probar el proyecto? Sigue estos pasos:

```bash
# 1. Clona el repositorio
git clone https://github.com/Edwin-Benito/Proyecto-Web.git
cd Proyecto-Web

# 2. Instala dependencias
cd backend && pnpm install
cd ../frontend/citas-frg && pnpm install

# 3. Ejecuta ambos servidores en terminales separadas
cd ../../backend && pnpm dev      # Backend en :3001
cd ../frontend/citas-frg && pnpm dev  # Frontend en :3000
```

- **Accede al frontend:** [http://localhost:3000](http://localhost:3000)
- **API Backend:** [http://localhost:3001](http://localhost:3001)

## 🛠️ Tecnologías Principales

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Herramientas:** pnpm, Git, CORS

## 📁 Estructura del Proyecto

```
Proyecto Web/
├── frontend/citas-frg/     # App Next.js
│   └── src/app/            # Páginas y layouts principales
├── backend/                # API Express.js
│   └── index.js            # Servidor principal
└── README.md
```

## ✨ Características Principales

- ✅ Conexión funcional frontend ↔ backend
- ✅ APIs REST para usuarios y pruebas
- ✅ Hot reload en ambos entornos
- ✅ Variables de entorno configurables
- ✅ CORS habilitado para desarrollo
- ✅ Interfaz interactiva básica

## 👥 Equipo de Desarrollo

- **Edwin Benito** - Full Stack
- **Francisco Gress** - Frontend/DBA
- **Jose Luis** - Frontend
- **Erick Rivas** - Backend
- **Aldo Pacheco** - Backend

## 👨‍💻 Guía para Colaboradores

Si eres parte del equipo o deseas colaborar, sigue estos pasos:

### 🚦 **IMPORTANTE: Flujo de trabajo con rama `develop`**

**⚠️ Paso obligatorio antes de crear una rama de desarrollo:**

**Siempre inicia tu trabajo desde la rama `develop`:**
```bash
git checkout develop
git pull origin develop
```

### 📋 Configuración inicial (solo primera vez)

1. **Clona y configura:**
   ```bash
   git clone https://github.com/Edwin-Benito/Proyecto-Web.git
   cd Proyecto-Web
   
   # Configura tu usuario
   git config user.name "Tu Nombre Completo"
   git config user.email "tu.email@universidad.edu"
   ```

2. **Instala dependencias:**
   ```bash
   cd backend && pnpm install
   cd ../frontend/citas-frg && pnpm install
   cd ../..
   ```

### 🌳 Creando tu rama de módulo

**Desde `develop`, crea tu rama específica:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-tu-modulo
```

**Ejemplos de nombres de ramas:**
- `feature/frontend-login`
- `feature/backend-user-api`
- `feature/ui-dashboard`

### 🔄 Flujo de desarrollo diario

1. **Actualiza tu rama:**
   ```bash
   git checkout tu-rama
   git pull origin develop
   ```

2. **Desarrolla tu módulo y guarda cambios:**
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   git push origin tu-rama
   ```

### ✅ Después de terminar tu módulo

1. **Asegúrate de que todo esté actualizado:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout tu-rama
   git merge develop  # Resuelve conflictos si hay
   ```

2. **Haz push final:**
   ```bash
   git push origin tu-rama
   ```

3. **Crea Pull Request en GitHub:**
   - Ve a GitHub y crea un PR de `tu-rama` → `develop`
   - Espera revisión del equipo antes del merge

### 📝 Convenciones

- **Commits:** `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`
- **Ramas:** `feature/area-descripcion`
- **PRs:** Siempre hacia `develop`, nunca directo a `main`

---

Para más detalles, revisa [CONTRIBUTING.md](CONTRIBUTING.md)

## 💡 Roadmap

- [ ] Sistema de autenticación y autorización
- [ ] Integración con base de datos (MongoDB/PostgreSQL)
- [ ] CRUD completo para citas médicas
- [ ] Validaciones de formularios
- [ ] Tests unitarios e integración
- [ ] Deployment (Vercel/Heroku)
- [ ] Dashboard administrativo

## 📡 APIs Disponibles

- `GET /` - Mensaje de bienvenida
- `GET /api/test` - Prueba de conexión
- `GET /api/users` - Lista de usuarios de ejemplo
- `POST /api/users` - Crear nuevo usuario

---

**Este proyecto es parte de nuestro aprendizaje en desarrollo fullstack y trabajo colaborativo. ¡Gracias por visitar!** 🚀