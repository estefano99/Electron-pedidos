import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import { createPrinterStrategy } from './printers/PrinterFactory'
import { tenantStore, userStore, clearAllStore } from './store'

let mainWindow: BrowserWindow

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: false, // 👈 Habilitar integración completa
      nodeIntegration: true, // 👈 Necesario para que funcione getPrinters()
      sandbox: false
    }
  })

  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // Solo abrir DevTools en desarrollo
    if (is.dev) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Escuchar cuando se carga el contenido
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://food-management-backend-production.up.railway.app https://ipapi.co http://localhost:4000; img-src 'self' data: blob: https://res.cloudinary.com; style-src 'self' 'unsafe-inline';"
        ]
      }
    })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.foodmanagement.app')
  if (!is.dev) autoUpdater.checkForUpdatesAndNotify()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.webContents.openDevTools()
  })

  // ========== Store Handlers ==========
  // Store IPC handlers
  ipcMain.handle('store:get-tenant-id', async () => {
    return await tenantStore.getTenantId()
  })

  ipcMain.handle('store:set-tenant-id', async (_event, tenantId) => {
    await tenantStore.setTenantId(tenantId)
  })

  ipcMain.handle('store:clear-tenant-id', async () => {
    await tenantStore.clearTenantId()
  })

  // User
  ipcMain.handle('store:get-user', async () => {
    return await userStore.getUser()
  })

  ipcMain.handle('store:set-user', async (_, user) => {
    await userStore.setUser(user)
    return { success: true }
  })

  ipcMain.handle('store:clear-user', async () => {
    await userStore.clearUser()
    return { success: true }
  })

  // Clear all (logout)
  ipcMain.handle('store:clear-all', async () => {
    await clearAllStore()
    return { success: true }
  })

  // ========== Printers Handlers ==========
  ipcMain.handle('get-thermal-printers', async () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (!win) throw new Error('No hay ventana activa.')

    const printers = await win.webContents.getPrintersAsync()
    if (!printers || !Array.isArray(printers)) {
      throw new Error('No se pudo acceder a las impresoras.')
    }

    return printers
  })

  ipcMain.handle('print-ticket', async (_, data) => {
    const { printerName, modo, config, ...payload } = data
    try {
      const strategy = createPrinterStrategy(modo, config)
      const result = await strategy.print(printerName, payload)
      return result.success ? { ok: true } : { ok: false, error: result.error }
    } catch (e) {
      return { ok: false, error: (e as Error).message }
    }
  })

  ipcMain.handle('print-order-ticket', async (_, { printerName, html }) => {
    if (!printerName || !html) {
      return { ok: false, error: 'Faltan datos para imprimir el ticket de la orden' }
    }

    const win = new BrowserWindow({ show: false })

    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

    return new Promise((resolve) => {
      win.webContents.print(
        {
          silent: true,
          deviceName: printerName,
          printBackground: false
        },
        (success, failureReason) => {
          win.close()
          resolve(success ? { ok: true } : { ok: false, error: failureReason })
        }
      )
    })
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    autoUpdater.checkForUpdatesAndNotify()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
