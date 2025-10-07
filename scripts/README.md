# 📜 Scripts del Proyecto

Esta carpeta contiene scripts útiles para automatizar tareas comunes del proyecto.

## 🛠️ Scripts Disponibles

### `create-developer-branch.sh`

**Descripción**: Crea la rama `developer` desde `main` y la sube al repositorio remoto.

**Uso**:
```bash
# Desde la raíz del proyecto
bash scripts/create-developer-branch.sh
```

**Cuándo usarlo**: 
- Solo una vez al inicio del proyecto
- Solo debe ejecutarlo el Team Lead
- Antes de que el equipo comience a trabajar

**Qué hace**:
1. Verifica que estés en la raíz del proyecto
2. Cambia a la rama `main` y la actualiza
3. Crea la rama `developer` desde `main`
4. Sube la rama `developer` al repositorio remoto
5. Muestra confirmación de éxito

**Requisitos**:
- Git debe estar instalado
- Debes tener permisos para crear ramas en el repositorio
- Debes tener conexión a internet

**Ejemplo de salida exitosa**:
```
🚀 Creando la rama developer desde main...

📥 Paso 1: Actualizando rama main...
Already on 'main'
Already up to date.

🌿 Paso 2: Creando rama developer desde main...
Switched to a new branch 'developer'

☁️  Paso 3: Subiendo rama developer al repositorio remoto...
Total 0 (delta 0), reused 0 (delta 0)
To https://github.com/Edwin-Benito/Proyecto-Web.git
 * [new branch]      developer -> developer

✅ ¡Rama developer creada exitosamente!

📋 Verificación:
  developer
  remotes/origin/developer

🎉 ¡Listo! La rama developer está disponible para todo el equipo.
```

---

## 📋 Agregar Nuevos Scripts

Si necesitas agregar un nuevo script:

1. Créalo en esta carpeta (`scripts/`)
2. Hazlo ejecutable: `chmod +x scripts/tu-script.sh`
3. Documéntalo en este README
4. Incluye comentarios en el script explicando qué hace

### Convenciones para Scripts

- Usar extensión `.sh` para scripts bash
- Incluir comentarios explicativos
- Validar requisitos al inicio (git, node, etc)
- Mostrar mensajes claros de éxito/error
- Usar emojis para facilitar lectura: ✅ ❌ ⚠️ 📥 ☁️
- Retornar códigos de salida apropiados (0 = éxito, 1+ = error)

---

## 🆘 Solución de Problemas

### El script no se ejecuta

```bash
# Dale permisos de ejecución
chmod +x scripts/create-developer-branch.sh
```

### Error: "Git no está instalado"

```bash
# Instalar git
# En Ubuntu/Debian:
sudo apt-get install git

# En macOS:
brew install git

# En Windows:
# Descargar de https://git-scm.com/
```

### Error: "No se pudo subir al remoto"

- Verifica tu conexión a internet
- Verifica que tienes permisos en el repositorio
- Asegúrate de estar autenticado con GitHub

---

## 📚 Recursos

- [Documentación de Bash](https://www.gnu.org/software/bash/manual/)
- [Guía de Git](https://git-scm.com/doc)
- [DEVELOPER_BRANCH_SETUP.md](../DEVELOPER_BRANCH_SETUP.md) - Documentación de la rama developer
