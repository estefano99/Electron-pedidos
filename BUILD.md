# 📦 Guía de Compilación - Food Management

## 🎯 Pre-requisitos

Antes de compilar el ejecutable, asegúrate de tener:

- ✅ Node.js 18+ instalado
- ✅ Git configurado
- ✅ Todas las dependencias instaladas: `npm install`
- ✅ Backend funcionando y accesible

---

## 🔧 Configuración antes de compilar

### 1. Verificar Variables de Entorno

**Archivo:** `.env.production`

```bash
VITE_BACK_URL=http://localhost:4000
VITE_API_PATH=/api
```

⚠️ **Importante:** Si el backend estará en otra URL en producción, actualiza `VITE_BACK_URL`.

---

### 2. Verificar Configuración del Tenant

**Archivo:** `src/main/config/tenant.json`

Este archivo debe contener los datos del restaurante que usará la aplicación.

Ejemplo:
```json
{
  "tenantId": "uuid-del-tenant",
  "name": "nombre-interno",
  "displayName": "Nombre Público del Restaurante"
}
```

---

### 3. Actualizar Versión (Opcional)

**Archivo:** `package.json`

```json
{
  "version": "1.0.1"  // Incrementa según sea necesario
}
```

---

## 🚀 Compilar Ejecutable

### Para Windows

```bash
npm run build:win
```

**Resultado:**  
El ejecutable se generará en: `dist/food-management-1.0.1-setup.exe`

---

### Para macOS

```bash
npm run build:mac
```

**Resultado:**  
El ejecutable se generará en: `dist/food-management-1.0.1.dmg`

---

### Para Linux

```bash
npm run build:linux
```

**Resultado:**  
Se generarán múltiples formatos en: `dist/`
- `food-management-1.0.1.AppImage`
- `food-management-1.0.1.deb`
- `food-management-1.0.1.snap`

---

## 🔄 Auto-Actualización (GitHub Releases)

Si quieres habilitar actualizaciones automáticas:

### 1. Configurar Repositorio

**Archivo:** `package.json`

```json
"build": {
  "publish": [
    {
      "provider": "github",
      "owner": "julibosch",
      "repo": "food-management"
    }
  ]
}
```

### 2. Crear Token de GitHub

1. Ve a: https://github.com/settings/tokens
2. Genera un token con permisos de `repo`
3. Guárdalo en una variable de entorno:

```bash
# Windows PowerShell
$env:GH_TOKEN="tu-token-aqui"

# Linux/Mac
export GH_TOKEN="tu-token-aqui"
```

### 3. Compilar y Publicar

```bash
npm run build:win-publish
```

Esto compilará y subirá el ejecutable como draft en GitHub Releases.

---

## 📝 Notas Importantes

### Tamaño del Ejecutable

El ejecutable final pesará aproximadamente **150-200 MB** porque incluye:
- Chromium (motor de Electron)
- Node.js runtime
- Tu aplicación React
- Todas las dependencias

### Firma de Código (Code Signing)

Actualmente la firma está **deshabilitada** (`sign: false` en electron-builder.yml).

Para producción real, considera:
- Comprar un certificado de firma de código
- Configurar la firma en `electron-builder.yml`

Sin firma, Windows puede mostrar advertencias de seguridad al instalar.

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"

**Solución:**
```bash
rm -rf node_modules
npm install
npm run build:win
```

### Error: "ENOENT: no such file or directory"

**Solución:** Verifica que existan los archivos de iconos:
- `build/icon.ico` (Windows)
- `build/icon.icns` (macOS)
- `build/icon.png` (Linux)

### Error en la impresión

**Solución:** Asegúrate de que `node-thermal-printer` esté correctamente instalado:
```bash
npm rebuild node-thermal-printer --update-binary
```

---

## 📊 Checklist Final antes de Distribuir

- [ ] Versión actualizada en `package.json`
- [ ] Variables de entorno configuradas correctamente
- [ ] Tenant configurado en `tenant.json`
- [ ] Backend accesible desde la URL configurada
- [ ] Probado en desarrollo: `npm run dev`
- [ ] Compilado exitosamente: `npm run build:win`
- [ ] Ejecutable probado en PC limpia
- [ ] Impresora térmica probada (si aplica)
- [ ] Auto-actualización probada (si aplica)

---

## 🎉 ¡Listo!

Tu ejecutable de Food Management está listo para distribuir. 

Para cualquier duda, revisa:
- [Electron Builder Docs](https://www.electron.build/)
- [Electron Docs](https://www.electronjs.org/docs)
