import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

export function getTenantIdFromDisk(): string | null {
  const userDataPath = path.join(app.getPath('userData'), 'tenant.json')

  // 1. Si ya existe en userData, usarlo
  if (fs.existsSync(userDataPath)) {
    const raw = fs.readFileSync(userDataPath, 'utf-8')
    const parsed = JSON.parse(raw)
    return parsed?.tenantId ?? null
  }

  // 2. Buscar fallback (distinto según entorno)
  const isDev = !app.isPackaged
  const fallbackPath = isDev
    ? path.resolve(process.cwd(), 'src/main/config/tenant.json') // desarrollo
    : path.join(__dirname, 'config/tenant.json') // producción (empaquetado)

  console.log('📦 Buscando fallback en:', fallbackPath)

  if (fs.existsSync(fallbackPath)) {
    const raw = fs.readFileSync(fallbackPath, 'utf-8')
    const parsed = JSON.parse(raw)
    const tenantId = parsed?.tenantId ?? null

    if (tenantId) {
      // Copiar al disco del usuario
      fs.writeFileSync(userDataPath, JSON.stringify({ tenantId }))
    }

    return tenantId
  }

  console.error('❌ No se encontró tenant.json en ninguna ruta')
  return null
}
