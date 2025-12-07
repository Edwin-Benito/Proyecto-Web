# 🚀 Despliegue Rápido - Proyecto Web Peritos

## ✅ Archivos de Configuración Creados

- ✅ `backend/api/index.ts` - Adaptador serverless para Vercel
- ✅ `backend/vercel.json` - Configuración de deployment backend
- ✅ `frontend/citas-frg/vercel.json` - Configuración frontend
- ✅ `GUIA_DESPLIEGUE.md` - Guía completa paso a paso
- ✅ `.env.production.example` - Template de variables de entorno

## 📝 Próximos Pasos

### 1️⃣ Actualizar el Repositorio
```bash
git add .
git commit -m "feat: configurar despliegue Vercel + Neon"
git push origin develop
```

### 2️⃣ Crear Base de Datos en Neon
1. Ve a https://neon.tech
2. Regístrate con GitHub (gratis)
3. Crea un proyecto llamado `peritos-db`
4. Copia la connection string

### 3️⃣ Desplegar Backend en Vercel
1. Ve a https://vercel.com
2. Importa tu repo `Edwin-Benito/Proyecto-Web`
3. **Root Directory**: `backend`
4. Agrega variables de entorno:
   - `DATABASE_URL`: [tu URL de Neon]
   - `JWT_SECRET`: [genera un string aleatorio]
   - `NODE_ENV`: `production`

### 4️⃣ Desplegar Frontend en Vercel
1. Crea otro proyecto en Vercel (mismo repo)
2. **Root Directory**: `frontend/citas-frg`
3. Agrega variable de entorno:
   - `NEXT_PUBLIC_API_URL`: `https://tu-backend.vercel.app/api`

### 5️⃣ Conectar Backend ↔ Frontend
1. Actualiza `FRONTEND_URL` en el backend con la URL del frontend
2. Redeploy el backend

## 📖 Documentación Completa
Lee el archivo `GUIA_DESPLIEGUE.md` para instrucciones detalladas.

## 🆓 Todo es GRATIS
- ✅ Vercel: Plan gratuito para proyectos personales
- ✅ Neon: 0.5GB PostgreSQL gratis para siempre
- ✅ No necesitas tarjeta de crédito

## 🎓 URLs Finales
Después del despliegue tendrás:
- Frontend: `https://tu-proyecto-frontend.vercel.app`
- Backend: `https://tu-proyecto-backend.vercel.app`
- Base de Datos: Neon PostgreSQL (cloud)

¡Buena suerte con tu presentación! 🎉
