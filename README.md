````markdown
# Food Management

Sistema de gestión de pedidos para restaurantes desarrollado con Electron, React y TypeScript.

## 🚀 Características

- Gestión completa de pedidos (local y online)
- Personalización de ingredientes y extras
- Dashboard con estadísticas de ventas
- Sistema de impresión de tickets térmicos
- Multi-tenant (soporte para múltiples restaurantes)
- Actualización automática

## 🛠️ Tecnologías

- Electron
- React 18
- TypeScript
- TanStack Query
- Tailwind CSS
- Shadcn/ui

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

### Build y publicar (Windows)

```bash
$ npm run build:win-publish
```

## 📦 Estructura del Proyecto

```
food-management-front/
├── src/
│   ├── main/           # Proceso principal de Electron
│   ├── preload/        # Scripts de preload
│   └── renderer/       # Aplicación React
│       ├── api/        # Servicios API
│       ├── components/ # Componentes React
│       ├── hooks/      # Custom hooks
│       ├── pages/      # Páginas
│       └── types/      # Tipos TypeScript
├── build/              # Recursos para el builder
└── resources/          # Iconos y assets
```

## 🔧 Configuración

Antes de compilar, asegúrate de configurar:

1. **Backend URL**: Actualiza la URL del backend en las variables de entorno
2. **Tenant Config**: Configura el archivo `tenant.json` con los datos del restaurante
3. **Auto-update**: Configura el repositorio de GitHub para actualizaciones automáticas

## 📄 Licencia

Este proyecto es privado y de uso interno.

````
