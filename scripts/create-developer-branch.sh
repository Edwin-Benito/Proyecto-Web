#!/bin/bash

# Script para crear la rama developer desde main
# Solo debe ejecutarse UNA VEZ por el Team Lead

echo "🚀 Creando la rama developer desde main..."
echo ""

# Verificar que estamos en la raíz del proyecto
if [ ! -d ".git" ]; then
    echo "❌ Error: Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
fi

# Verificar que git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git no está instalado"
    exit 1
fi

# Actualizar main
echo "📥 Paso 1: Actualizando rama main..."
git checkout main
if [ $? -ne 0 ]; then
    echo "❌ Error: No se pudo cambiar a la rama main"
    exit 1
fi

git pull origin main
if [ $? -ne 0 ]; then
    echo "⚠️  Advertencia: No se pudo actualizar main desde el remoto"
fi

# Crear rama developer
echo ""
echo "🌿 Paso 2: Creando rama developer desde main..."
git checkout -b developer
if [ $? -ne 0 ]; then
    echo "❌ Error: No se pudo crear la rama developer"
    echo "Posiblemente ya existe. Verifica con: git branch -a"
    exit 1
fi

# Subir rama developer al remoto
echo ""
echo "☁️  Paso 3: Subiendo rama developer al repositorio remoto..."
git push -u origin developer
if [ $? -ne 0 ]; then
    echo "❌ Error: No se pudo subir la rama developer al remoto"
    echo "Verifica tus permisos y conexión a internet"
    exit 1
fi

# Verificar que todo salió bien
echo ""
echo "✅ ¡Rama developer creada exitosamente!"
echo ""
echo "📋 Verificación:"
git branch -a | grep developer

echo ""
echo "🎉 ¡Listo! La rama developer está disponible para todo el equipo."
echo ""
echo "👥 Próximos pasos para el equipo:"
echo "  1. Actualizar su repositorio local: git fetch --all"
echo "  2. Ver la nueva rama: git branch -a"
echo "  3. Crear ramas desde developer: git checkout developer && git checkout -b feature/mi-funcionalidad"
echo ""
echo "📖 Lee DEVELOPER_BRANCH_SETUP.md para más información sobre el flujo de trabajo"
