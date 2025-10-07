# 🌳 Estrategia de Ramas - Flujo de Trabajo

## 📊 Diagrama del Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                         MAIN                                │
│              (Producción - Solo código estable)             │
│  ---------------------------------------------------------- │
│                          ↑                                  │
│                          │ PR aprobado (Team Lead)          │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                          ↓                                  │
│                      DEVELOPER                              │
│           (Integración - Testing del equipo)                │
│  ---------------------------------------------------------- │
│         ↑          ↑          ↑          ↑          ↑       │
│         │          │          │          │          │       │
│      PR │       PR │       PR │       PR │       PR │       │
│         │          │          │          │          │       │
└─────────┼──────────┼──────────┼──────────┼──────────┼───────┘
          │          │          │          │          │
   ┌──────┴───┐ ┌───┴────┐ ┌───┴────┐ ┌───┴────┐ ┌──┴─────┐
   │ feature/ │ │feature/│ │feature/│ │feature/│ │feature/│
   │ frontend │ │backend │ │  ui-   │ │frontend│ │backend │
   │  -login  │ │ -api   │ │ design │ │ -pages │ │-services│
   └──────────┘ └────────┘ └────────┘ └────────┘ └────────┘
      Edwin      Erick      Aldo       José       Francisco
```

## 🔄 Flujo de Trabajo Paso a Paso

### 1️⃣ Configuración Inicial (Una sola vez - Team Lead)

```bash
# Crear la rama developer desde main
git checkout main
git checkout -b developer
git push -u origin developer
```

**Resultado**: Ahora tienes dos ramas principales:
- `main`: Código de producción (estable)
- `developer`: Código de desarrollo (integración del equipo)

---

### 2️⃣ Comenzar una Nueva Funcionalidad (Cada Desarrollador)

```bash
# 1. Actualizar developer
git checkout developer
git pull origin developer

# 2. Crear tu rama desde developer
git checkout -b feature/mi-funcionalidad

# 3. Trabajar en tu código...
# (hacer cambios)

# 4. Guardar cambios
git add .
git commit -m "feat: mi nueva funcionalidad"

# 5. Subir tu rama
git push origin feature/mi-funcionalidad
```

---

### 3️⃣ Integrar tu Trabajo (Pull Request)

1. **Ve a GitHub** → Tu repositorio
2. **Crea Pull Request**: `feature/mi-funcionalidad` → `developer`
3. **Solicita revisión** del equipo
4. **Espera aprobación** y resuelve comentarios
5. **Haz merge** después de la aprobación

---

### 4️⃣ Llevar Cambios a Producción (Team Lead)

Cuando `developer` está estable y probado:

```bash
# 1. Asegurar que developer está actualizado
git checkout developer
git pull origin developer

# 2. Crear PR en GitHub: developer → main
# O hacer merge localmente:
git checkout main
git pull origin main
git merge developer
git push origin main
```

---

## 🎯 Ventajas de Este Flujo

### ✅ Para el Equipo

1. **Independencia**: Cada desarrollador trabaja en su propia rama sin afectar a otros
2. **Seguridad**: Los errores no llegan a producción (`main`)
3. **Colaboración**: Fácil integrar y probar cambios de varios desarrolladores
4. **Revisión**: Los Pull Requests permiten revisión de código antes de integrar

### ✅ Para el Proyecto

1. **`main` siempre estable**: Listo para desplegar en cualquier momento
2. **`developer` como zona de prueba**: Detectar problemas antes de producción
3. **Historial limpio**: Commits organizados por funcionalidad
4. **Rollback fácil**: Si algo falla, es fácil revertir

---

## 📋 Escenarios Comunes

### Escenario 1: Traer Cambios de Otros Desarrolladores

```bash
# Estás en tu rama feature/mi-funcionalidad
git checkout feature/mi-funcionalidad

# Traer los últimos cambios de developer
git pull origin developer

# Si hay conflictos, resolverlos
git add .
git commit -m "merge: sincronizar con developer"
```

### Escenario 2: Corregir un Error en Producción (Hotfix)

```bash
# Crear hotfix desde main
git checkout main
git checkout -b hotfix/corregir-error-critico

# Hacer corrección
git add .
git commit -m "fix: corregir error crítico"

# Subir hotfix
git push origin hotfix/corregir-error-critico

# Crear PR directo a main Y a developer
# (Para que ambas ramas tengan la corrección)
```

### Escenario 3: Funcionalidad muy Grande (Múltiples Días)

```bash
# Día 1: Crear y trabajar
git checkout developer
git pull origin developer
git checkout -b feature/funcionalidad-grande

# Hacer cambios y guardar
git add .
git commit -m "feat: parte 1 de funcionalidad grande"
git push origin feature/funcionalidad-grande

# Día 2: Continuar desde donde quedaste
git checkout feature/funcionalidad-grande
git pull origin developer  # Traer cambios del equipo
# Continuar trabajando...

# Día 3: Terminar y crear PR
git add .
git commit -m "feat: finalizar funcionalidad grande"
git push origin feature/funcionalidad-grande
# Crear PR a developer
```

---

## 🚫 Errores Comunes a Evitar

### ❌ NO hacer esto:

```bash
# NO hacer push directo a main
git checkout main
git push origin main  # ❌ Solo el Team Lead con PR aprobado

# NO crear ramas desde main (usar developer)
git checkout main
git checkout -b feature/nueva-funcionalidad  # ❌ Usar developer

# NO hacer merge sin Pull Request
git checkout developer
git merge feature/mi-rama  # ❌ Usar PR en GitHub para revisión
git push origin developer
```

### ✅ SÍ hacer esto:

```bash
# ✅ Crear ramas desde developer
git checkout developer
git pull origin developer
git checkout -b feature/mi-funcionalidad

# ✅ Usar Pull Requests para merge
# (Hacer PR en GitHub, no merge local)

# ✅ Mantener tu rama actualizada
git checkout feature/mi-funcionalidad
git pull origin developer
```

---

## 📚 Comandos de Referencia Rápida

### Ver Estado

```bash
git status                    # Ver cambios pendientes
git branch                    # Ver rama actual
git branch -a                 # Ver todas las ramas (locales y remotas)
git log --oneline -10         # Ver últimos 10 commits
```

### Cambiar de Rama

```bash
git checkout developer        # Cambiar a developer
git checkout feature/mi-rama  # Cambiar a tu rama
git checkout -b nueva-rama    # Crear y cambiar a nueva rama
```

### Actualizar

```bash
git fetch --all              # Traer info de todas las ramas remotas
git pull origin developer    # Actualizar desde developer
git pull origin main         # Actualizar desde main
```

### Sincronizar

```bash
# En tu rama, traer cambios de developer
git merge developer

# Si hay conflictos
git status                   # Ver archivos en conflicto
# (editar archivos para resolver)
git add .
git commit -m "merge: resolver conflictos"
```

---

## 🆘 Ayuda y Preguntas

### ¿En qué rama estoy?

```bash
git branch
# La rama actual tiene un asterisco (*)
```

### ¿Qué cambios he hecho?

```bash
git status              # Ver archivos modificados
git diff                # Ver cambios específicos
```

### ¿Cómo veo el historial?

```bash
git log --oneline --graph --all -20
# Muestra últimos 20 commits de todas las ramas visualmente
```

### ¿Cómo descarto cambios?

```bash
# Descartar cambios en un archivo específico
git checkout -- archivo.js

# Descartar todos los cambios no guardados
git reset --hard HEAD
```

---

## 📖 Recursos Adicionales

- **[DEVELOPER_BRANCH_SETUP.md](../DEVELOPER_BRANCH_SETUP.md)**: Guía completa de configuración
- **[README.md](../README.md)**: Documentación general del proyecto
- **[TEAM.md](../TEAM.md)**: Roles y responsabilidades del equipo

---

## 💡 Resumen Visual

```
Tu Trabajo          →  Integración      →  Producción
━━━━━━━━━━━━━━━        ━━━━━━━━━━━━━        ━━━━━━━━━━
feature/mi-rama    →   developer       →   main
(tu código)            (testing)           (estable)

      PR                    PR
   (revisión)          (aprobación)
```

**Recuerda**: Los cambios fluyen de izquierda a derecha, siempre con Pull Request! 🚀
