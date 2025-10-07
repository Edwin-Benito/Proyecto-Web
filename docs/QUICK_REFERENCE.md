# 🚀 Referencia Rápida - Flujo de Trabajo con Developer

## 📋 Comandos Esenciales

### 🌿 Para Comenzar una Nueva Funcionalidad

```bash
# 1. Actualizar developer
git checkout developer
git pull origin developer

# 2. Crear tu rama
git checkout -b feature/mi-funcionalidad

# 3. Trabajar y guardar
# (hacer cambios en el código)
git add .
git commit -m "feat: descripción del cambio"

# 4. Subir tu rama
git push origin feature/mi-funcionalidad

# 5. Crear Pull Request en GitHub: feature/mi-funcionalidad → developer
```

---

### 🔄 Para Actualizar tu Rama con Cambios del Equipo

```bash
# Traer cambios de developer a tu rama
git checkout feature/mi-funcionalidad
git pull origin developer

# Si hay conflictos, resolverlos y hacer commit
git add .
git commit -m "merge: sincronizar con developer"
```

---

### 📊 Para Ver el Estado

```bash
git status              # Ver cambios pendientes
git branch              # Ver en qué rama estás
git log --oneline -5    # Ver últimos 5 commits
```

---

### ⚠️ Reglas de Oro

1. ✅ **SIEMPRE** crear ramas desde `developer`, no desde `main`
2. ✅ **NUNCA** hacer push directo a `main` o `developer`
3. ✅ **SIEMPRE** usar Pull Request para integrar cambios
4. ✅ **ANTES** de empezar, actualizar `developer`

---

## 🎯 Flujo Visual Simplificado

```
Tu Rama         →    Pull Request    →    Developer    →    Main
feature/xxx          (revisión)           (testing)         (producción)
```

---

## 🆘 Problemas Comunes

### "Ya existe una rama con ese nombre"

```bash
# Usar otro nombre o actualizar la existente
git checkout feature/mi-funcionalidad
git pull origin developer
```

### "Conflictos al hacer merge"

```bash
# 1. Ver archivos en conflicto
git status

# 2. Editar archivos marcados con <<<<<<<

# 3. Después de resolver
git add .
git commit -m "merge: resolver conflictos"
```

### "No puedo cambiar de rama"

```bash
# Guardar cambios primero
git add .
git commit -m "wip: trabajo en progreso"

# Luego cambiar de rama
git checkout otra-rama
```

---

## 📖 Documentación Completa

- [DEVELOPER_BRANCH_SETUP.md](../DEVELOPER_BRANCH_SETUP.md) - Guía completa
- [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md) - Estrategia detallada
- [README.md](../README.md) - Documentación general
