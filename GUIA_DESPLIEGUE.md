# 🚀 Guía de Despliegue: Vercel + Neon PostgreSQL

## 📋 Requisitos Previos
- Cuenta en GitHub (ya la tienes)
- Cuenta en Vercel (gratis): https://vercel.com
- Cuenta en Neon (gratis): https://neon.tech

---

## 🗄️ PASO 1: Configurar Base de Datos en Neon

### 1.1 Crear cuenta y proyecto
1. Ve a https://neon.tech y regístrate (usa tu GitHub)
2. Click en "Create Project"
3. Nombra el proyecto: `peritos-db` (o como prefieras)
4. Región: Elige la más cercana (us-east-1 para México/Latinoamérica)
5. Click "Create Project"

### 1.2 Obtener Connection String
1. En el dashboard de Neon, verás "Connection String"
2. Copia la URL completa, se ve así:
   ```
   postgresql://usuario:password@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
3. **GUARDA ESTA URL** - la necesitarás después

### 1.3 Ejecutar migraciones (opcional, puedes hacerlo después)
```bash
# En tu computadora, primero actualiza el .env del backend
DATABASE_URL="tu-url-de-neon-aqui"

# Ejecuta las migraciones
cd backend
pnpm prisma migrate deploy
pnpm db:seed
```

---

## 🔧 PASO 2: Desplegar Backend en Vercel

### 2.1 Preparar repositorio
```bash
# Desde la raíz del proyecto
git add .
git commit -m "feat: configurar proyecto para despliegue en Vercel + Neon"
git push origin develop
```

### 2.2 Importar proyecto en Vercel
1. Ve a https://vercel.com y haz login con GitHub
2. Click en "Add New" → "Project"
3. Selecciona tu repo: `Edwin-Benito/Proyecto-Web`
4. **IMPORTANTE**: En "Configure Project":
   - **Root Directory**: Cambia a `backend`
   - **Framework Preset**: Other
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

### 2.3 Configurar Variables de Entorno
En la sección "Environment Variables", agrega:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Tu connection string de Neon (del paso 1.2) |
| `JWT_SECRET` | Un string aleatorio seguro (mínimo 32 caracteres) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | (déjalo vacío por ahora, lo agregaremos después) |

### 2.4 Desplegar
1. Click en "Deploy"
2. Espera 2-3 minutos
3. ¡Vercel te dará una URL como: `https://tu-backend.vercel.app`!
4. **COPIA ESTA URL** - la necesitarás para el frontend

---

## 🎨 PASO 3: Desplegar Frontend en Vercel

### 3.1 Crear nuevo proyecto en Vercel
1. En Vercel, click "Add New" → "Project"
2. Selecciona el **mismo repo**: `Edwin-Benito/Proyecto-Web`
3. **IMPORTANTE**: En "Configure Project":
   - **Root Directory**: Cambia a `frontend/citas-frg`
   - **Framework Preset**: Next.js (auto-detectado)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

### 3.2 Configurar Variables de Entorno
En "Environment Variables", agrega:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | La URL de tu backend (del paso 2.4) + `/api` |

Ejemplo: `https://tu-backend.vercel.app/api`

### 3.3 Desplegar
1. Click en "Deploy"
2. Espera 2-3 minutos
3. ¡Tu frontend estará en: `https://tu-frontend.vercel.app`!

---

## 🔄 PASO 4: Conectar Frontend y Backend

### 4.1 Actualizar CORS en Backend
1. Ve a tu proyecto backend en Vercel
2. Settings → Environment Variables
3. Agrega/actualiza `FRONTEND_URL` con la URL de tu frontend:
   ```
   https://tu-frontend.vercel.app
   ```
4. Click "Redeploy" en el dashboard

### 4.2 Verificar conexión
1. Abre tu frontend: `https://tu-frontend.vercel.app`
2. Intenta hacer login
3. Deberías poder acceder al dashboard

---

## 🎯 PASO 5: Ejecutar Migraciones de Base de Datos

Si no lo hiciste en el paso 1.3, hazlo ahora:

```bash
# En tu computadora local
cd backend

# Actualiza tu .env con la URL de Neon
DATABASE_URL="postgresql://..."

# Ejecuta migraciones
pnpm prisma migrate deploy

# Ejecuta seed (datos de prueba)
pnpm db:seed
```

---

## ✅ Verificación Final

### Checklist:
- [ ] Backend responde en: `https://tu-backend.vercel.app`
- [ ] Frontend carga en: `https://tu-frontend.vercel.app`
- [ ] Puedes hacer login
- [ ] Puedes ver oficios/peritos/citas
- [ ] Base de datos en Neon tiene datos

### URLs de Prueba:
- **Health Check**: `https://tu-backend.vercel.app/health`
- **API Root**: `https://tu-backend.vercel.app/api`
- **Login**: `https://tu-frontend.vercel.app/login`

---

## 🔧 Comandos Útiles

### Logs del Backend
```bash
# Ver logs en tiempo real
vercel logs [URL-de-tu-backend]
```

### Redeployar después de cambios
```bash
# Haz tus cambios y commitea
git add .
git commit -m "tu mensaje"
git push origin develop

# Vercel redespliega automáticamente
```

### Ver base de datos
```bash
# En tu computadora
cd backend
pnpm db:studio
# Abre http://localhost:5555
```

---

## 🆘 Solución de Problemas Comunes

### Error: "Cannot connect to database"
- Verifica que `DATABASE_URL` esté correctamente configurada en Vercel
- Asegúrate de incluir `?sslmode=require` al final de la URL

### Error: "CORS blocked"
- Verifica que `FRONTEND_URL` en el backend sea la URL correcta
- Asegúrate de haber redeployado el backend después de agregar la variable

### Error: "API not found"
- Verifica que `NEXT_PUBLIC_API_URL` termine en `/api`
- Ejemplo correcto: `https://backend.vercel.app/api`

### El frontend no carga
- Verifica que Next.js 15 sea compatible (lo es)
- Revisa los logs en Vercel: Settings → Functions → View Logs

---

## 💡 Tips Adicionales

### Dominios Personalizados (Opcional)
Puedes agregar tu propio dominio gratis en Vercel:
1. Settings → Domains
2. Agrega tu dominio
3. Sigue las instrucciones DNS

### Monitoreo
Vercel te da analytics gratis:
- Ve a Analytics en el dashboard
- Puedes ver requests, errores, performance

### Variables de Entorno Locales vs Producción
- Local: Usa `.env` y `.env.local`
- Producción: Configura en Vercel UI
- **NUNCA** commitees archivos `.env` con secretos reales

---

## 📞 Soporte

Si algo no funciona:
1. Revisa los logs en Vercel
2. Verifica las variables de entorno
3. Prueba el health check del backend
4. Revisa la consola del navegador (F12)

**¡Listo!** Tu proyecto está en producción 🎉
