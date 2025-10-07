# Guía para colaboradores

¡Gracias por tu interés en contribuir! Este proyecto utiliza una estrategia de ramas para trabajo en equipo y buenas prácticas colaborativas con Git.

---

## ⚙️ Configuración inicial

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/Edwin-Benito/Proyecto-Web.git
   cd Proyecto-Web
   ```

2. **Configura tu usuario en Git (solo la primera vez):**
   ```bash
   git config user.name "Tu Nombre Completo"
   git config user.email "tu.email@universidad.edu"
   git config --list
   ```

3. **Instala dependencias:**
   ```bash
   cd backend && pnpm install
   cd ../frontend/citas-frg && pnpm install
   cd ../..
   ```

---

## 🌳 Estrategia de ramas

### Siempre trabaja desde la rama `develop`

**Antes de crear tu rama de desarrollo, posicionate en `develop`:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-tu-modulo
```
- Ejemplos de nombres:  
  - `feature/frontend-login`  
  - `feature/backend-user-api`  
  - `feature/ui-dashboard`

---

## 🔄 Flujo correcto para subir cambios

1. **Haz tus cambios en tu rama de módulo (`feature/...`).**
2. **Sube tus cambios a GitHub:**
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   git push origin nombre-de-tu-rama-actual
   ```
   
   **Ejemplos según tu rama:**
   ```bash
   git push origin feature/frontend-login    # Si estás en esa rama
   git push origin feature/backend-api       # Si estás en esa rama
   git push origin develop                   # Si estás en develop
   ```
3. **Crea un Pull Request (PR) en GitHub:**
   - **¡Importante!** El PR debe ir de tu rama `feature/...` **hacia `develop`**.
   - Nunca hagas PR directo a `main`.
   - Espera revisión y aprobación del equipo.
4. **Cuando el PR es aprobado, se hace merge a `develop`.**
5. **Solo el líder del equipo o responsables hacen merge de `develop` a `main` cuando el código está estable y listo para producción.**

---

## 🚫 No hagas cambios directos a la rama `main`

- **Jamás hagas push directo ni PR a `main`.**
- `main` se mantiene siempre estable y actualizado solo desde `develop`.
- Todo el trabajo colaborativo se integra primero en `develop`.

---

## 📝 Convenciones de commit

Utiliza el siguiente formato en los mensajes de commit:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de errores
- `docs:` Cambios de documentación
- `style:` Cambios de formato/código
- `refactor:` Refactorización
- `test:` Agregar/modificar pruebas
- `chore:` Tareas de mantenimiento

**Ejemplo:**
```bash
git commit -m "feat: agregar formulario de registro de usuarios"
```

---

## 🚦 Reglas de colaboración

1. **Nunca hagas push directo a `main`.**
2. **Siempre crea Pull Requests de tu rama feature a `develop`.**
3. **Haz commits pequeños y frecuentes.**
4. **Actualiza tu rama antes de comenzar.**
5. **Revisa el código de tus compañeros antes de aprobar PR.**
6. **Ejecuta tests antes de hacer push.**

---

## 🆘 Comandos útiles y solución de problemas

```bash
# Ver estado actual
git status

# Ver historial de commits
git log --oneline

# Descartar cambios no guardados
git checkout .

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Actualizar lista de ramas remotas
git fetch

# Cambiar a una rama remota
git checkout -b nombre-rama origin/nombre-rama
```

---

¿Dudas o sugerencias? ¡Abre una issue en GitHub!