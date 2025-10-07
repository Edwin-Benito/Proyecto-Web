# 📝 Hoja de Referencia - Flujo de Trabajo Developer

## 🎯 Flujo Completo en 5 Pasos

```
┌─────────────────────────────────────────────────────────────┐
│  PASO 1: ACTUALIZAR DEVELOPER                               │
│  ───────────────────────────────────────────────────────── │
│  git checkout developer                                     │
│  git pull origin developer                                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 2: CREAR TU RAMA                                      │
│  ───────────────────────────────────────────────────────── │
│  git checkout -b feature/mi-funcionalidad                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 3: TRABAJAR Y GUARDAR                                 │
│  ───────────────────────────────────────────────────────── │
│  (hacer cambios en el código)                               │
│  git add .                                                  │
│  git commit -m "feat: mi cambio"                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 4: SUBIR TU RAMA                                      │
│  ───────────────────────────────────────────────────────── │
│  git push origin feature/mi-funcionalidad                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 5: CREAR PULL REQUEST EN GITHUB                       │
│  ───────────────────────────────────────────────────────── │
│  GitHub.com → Pull Request                                  │
│  De: feature/mi-funcionalidad → A: developer                │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Comandos Más Usados

| Acción | Comando |
|--------|---------|
| Ver en qué rama estás | `git branch` |
| Ver cambios pendientes | `git status` |
| Ver últimos commits | `git log --oneline -5` |
| Cambiar de rama | `git checkout nombre-rama` |
| Descartar cambios en un archivo | `git checkout -- archivo.js` |
| Actualizar tu rama con developer | `git pull origin developer` |

---

## 🚨 Comandos de Emergencia

### Deshice algo por error

```bash
# Ver historial para encontrar el commit bueno
git log --oneline

# Volver a ese commit (reemplaza abc123 con el hash)
git reset --hard abc123
```

### Tengo conflictos al hacer merge

```bash
# 1. Ver archivos en conflicto
git status

# 2. Abrir archivos y buscar:
#    <<<<<<< HEAD
#    (tu código)
#    =======
#    (código de developer)
#    >>>>>>> developer

# 3. Editar archivo y dejar el código correcto

# 4. Guardar cambios
git add .
git commit -m "merge: resolver conflictos con developer"
```

### Quiero guardar cambios sin commit

```bash
# Guardar temporalmente
git stash

# Cambiar de rama
git checkout otra-rama

# Volver a tu rama
git checkout tu-rama

# Recuperar cambios guardados
git stash pop
```

---

## 📌 Convenciones de Commits

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feat:` | Nueva funcionalidad | `feat: agregar formulario de login` |
| `fix:` | Corrección de bug | `fix: corregir validación de email` |
| `docs:` | Cambios en documentación | `docs: actualizar README` |
| `style:` | Formato de código | `style: aplicar prettier` |
| `refactor:` | Refactorización | `refactor: simplificar función de login` |
| `test:` | Tests | `test: agregar tests de login` |
| `chore:` | Tareas de mantenimiento | `chore: actualizar dependencias` |

---

## 🔍 Estructura de Ramas

```
main            ← Producción (estable)
  │
  └─ developer  ← Integración (testing del equipo)
      │
      ├─ feature/frontend-login
      ├─ feature/backend-api
      ├─ feature/ui-design
      └─ feature/...
```

---

## ✅ Checklist Diario

Antes de empezar a trabajar:
- [ ] `git checkout developer`
- [ ] `git pull origin developer`
- [ ] `git checkout -b feature/mi-funcionalidad` (o checkout a tu rama existente)

Mientras trabajas:
- [ ] Hacer commits pequeños y frecuentes
- [ ] Mensajes de commit descriptivos
- [ ] Push frecuente de tu rama

Al terminar una funcionalidad:
- [ ] `git pull origin developer` (actualizar con cambios del equipo)
- [ ] Resolver conflictos si hay
- [ ] `git push origin feature/mi-funcionalidad`
- [ ] Crear Pull Request en GitHub
- [ ] Solicitar revisión del equipo

---

## 📚 Documentación Adicional

- [DEVELOPER_BRANCH_SETUP.md](../DEVELOPER_BRANCH_SETUP.md) - Guía completa de configuración
- [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md) - Estrategia detallada con ejemplos
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Comandos esenciales
- [README.md](../README.md) - Documentación general del proyecto

---

## 💡 Tips

1. **Commits frecuentes**: Es mejor hacer muchos commits pequeños que uno grande
2. **Pull antes de push**: Siempre hacer `git pull` antes de `git push` para evitar conflictos
3. **Ramas descriptivas**: Usa nombres claros como `feature/login-page` no `mi-rama` o `test`
4. **Lee los errores**: Git te da mensajes útiles cuando algo sale mal
5. **Pide ayuda**: Si algo no funciona, pregunta al Team Lead o al equipo

---

**Recuerda**: ¡Nunca tengas miedo de hacer preguntas! Git puede ser confuso al principio, pero con práctica se vuelve natural. 🚀
