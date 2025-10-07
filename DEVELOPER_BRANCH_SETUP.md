# 🔧 Configuración de la Rama Developer

## 📑 Contenido

- [¿Qué es la rama developer?](#qué-es-la-rama-developer)
- [Ventajas de usar la rama developer](#-ventajas-de-usar-la-rama-developer)
- [Crear la Rama Developer](#-crear-la-rama-developer-solo-una-vez---team-lead)
- [Verificar que la Rama fue Creada](#-verificar-que-la-rama-fue-creada)
- [Flujo de Trabajo con la Rama Developer](#-flujo-de-trabajo-con-la-rama-developer)
- [Reglas Importantes](#-reglas-importantes)
- [Comandos de Ayuda](#-comandos-de-ayuda)
- [Preguntas Frecuentes](#-preguntas-frecuentes)

## ¿Qué es la rama developer?

La rama `developer` es una copia de la rama `main` que sirve como rama de integración para el desarrollo del proyecto. Los cambios realizados en `developer` **NO afectarán** a `main` hasta que se fusionen explícitamente mediante un Pull Request aprobado.

## ✅ Ventajas de usar la rama developer

- ✨ **Aislamiento**: Los cambios en `developer` no afectan a `main`
- 🔒 **Protección**: `main` se mantiene estable y listo para producción
- 🤝 **Colaboración**: El equipo puede integrar funcionalidades en `developer` antes de llevarlas a `main`
- 🔄 **Flexibilidad**: Puedes probar y validar cambios antes de fusionarlos a `main`

## 📋 Crear la Rama Developer (Solo una vez - Team Lead)

```bash
# 1. Asegurarse de estar en la rama main actualizada
git checkout main
git pull origin main

# 2. Crear la rama developer desde main
git checkout -b developer

# 3. Subir la rama developer al repositorio remoto
git push -u origin developer
```

## ✅ Verificar que la Rama fue Creada

```bash
# Ver todas las ramas (local y remota)
git branch -a

# Deberías ver:
# * developer
#   main
#   remotes/origin/developer
#   remotes/origin/main
```

## 🚀 Flujo de Trabajo con la Rama Developer

### Para Desarrolladores del Equipo

#### 1. **Crear una Nueva Funcionalidad**
```bash
# Actualizar developer antes de crear tu rama
git checkout developer
git pull origin developer

# Crear tu rama de funcionalidad desde developer
git checkout -b feature/nombre-de-tu-funcionalidad
```

#### 2. **Trabajar en tu Funcionalidad**
```bash
# Hacer cambios en tu código...

# Guardar cambios
git add .
git commit -m "feat: descripción del cambio"

# Subir tu rama
git push origin feature/nombre-de-tu-funcionalidad
```

#### 3. **Crear Pull Request a Developer**
- Ve a GitHub
- Crea un Pull Request desde `feature/nombre-de-tu-funcionalidad` hacia `developer`
- Solicita revisión del equipo
- Una vez aprobado, haz merge a `developer`

### Para el Team Lead

#### **Integrar Funcionalidades a Developer**
```bash
# 1. Cambiar a developer
git checkout developer
git pull origin developer

# 2. Revisar y aprobar Pull Requests en GitHub
# (Los Pull Requests van de feature/* a developer)

# 3. Después de hacer merge en GitHub, actualizar local
git pull origin developer
```

#### **Llevar Cambios de Developer a Main** (Solo cuando esté listo)
```bash
# 1. Asegurarse que developer está estable y probado
git checkout developer
git pull origin developer

# 2. Crear Pull Request de developer a main en GitHub
# O hacer merge localmente:
git checkout main
git pull origin main
git merge developer

# 3. Subir main actualizado
git push origin main
```

## 🔄 Sincronizar tu Rama con Developer

Si estás trabajando en una funcionalidad y quieres traer los últimos cambios de `developer`:

```bash
# Asegurarse de estar en tu rama
git checkout feature/tu-funcionalidad

# Traer cambios de developer
git pull origin developer

# O usar merge:
git merge developer

# Si hay conflictos, resolverlos y hacer commit
git add .
git commit -m "merge: sincronizar con developer"
```

## 🎯 Reglas Importantes

1. ✅ **Nunca hacer push directo a `main`**
2. ✅ **Siempre crear Pull Request para fusionar a `developer`**
3. ✅ **Solo el Team Lead fusiona `developer` a `main`**
4. ✅ **Mantener `developer` actualizado antes de crear nuevas ramas**
5. ✅ **Probar cambios antes de fusionar a `developer`**

## 📊 Flujo Visual

```
main (producción)
  ↑
  | (PR aprobado - solo Team Lead)
  |
developer (integración)
  ↑
  | (PR con review)
  |
feature/tu-funcionalidad (tu trabajo)
```

## 🆘 Comandos de Ayuda

### Ver en qué rama estás
```bash
git branch
# La rama actual tiene un asterisco (*)
```

### Ver el historial de commits
```bash
git log --oneline --graph --all -10
```

### Ver diferencias entre ramas
```bash
# Ver qué hay en developer que no está en main
git log main..developer --oneline

# Ver qué hay en main que no está en developer
git log developer..main --oneline
```

### Actualizar todas las ramas remotas
```bash
git fetch --all
git branch -r  # Ver ramas remotas
```

## ❓ Preguntas Frecuentes

### ¿Puedo hacer cambios directamente en developer?
No es recomendado. Siempre crea una rama `feature/*` desde `developer`, trabaja ahí, y luego haz un Pull Request a `developer`.

### ¿Qué pasa si developer tiene cambios que necesito en mi rama?
Haz `git pull origin developer` desde tu rama para traer los cambios más recientes.

### ¿Cómo sé si mis cambios están en developer pero no en main?
Usa `git log main..developer --oneline` para ver commits en developer que no están en main.

### ¿Qué hago si metí un cambio malo en developer?
Comunícalo al Team Lead inmediatamente. Se puede revertir el commit con `git revert <commit-hash>`.

## 📝 Resumen

- `main`: Código estable listo para producción
- `developer`: Rama de integración donde se prueban funcionalidades
- `feature/*`: Ramas individuales donde trabajas en nuevas funcionalidades
- Los cambios fluyen: `feature/*` → `developer` → `main`
- Solo con Pull Request aprobados se fusiona entre ramas
