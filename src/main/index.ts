import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { getTenantIdFromDisk } from './utils/tenant'
import { autoUpdater } from 'electron-updater'
import { printer as ThermalPrinter, types as PrinterTypes } from 'node-thermal-printer'

// const ThermalPrinter = require('node-thermal-printer').printer
// const PrinterTypes = require('node-thermal-printer').types

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
    //! Muestra la consola del renderer
    mainWindow.webContents.openDevTools()
    //* Esto abre la consola en desarrollo
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
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://ipapi.co http://localhost:4000; img-src 'self' data: blob: https://res.cloudinary.com; style-src 'self' 'unsafe-inline';"
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
  electronApp.setAppUserModelId('com.electron')
  autoUpdater.checkForUpdatesAndNotify()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('get-thermal-printers', async () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (!win) throw new Error('No hay ventana activa.')

    const printers = await win.webContents.getPrintersAsync()
    if (!printers || !Array.isArray(printers)) {
      throw new Error('No se pudo acceder a las impresoras.')
    }

    return printers
  })

  ipcMain.handle('print-to-thermal', async (_, printerName, data) => {
    try {
      const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: `usb:${printerName}`,
        options: { timeout: 5000 },
        width: 48
        // characterSet: 'SLOVENIA'
      })

      const isConnected = await printer.isPrinterConnected()
      if (!isConnected) return { success: false, error: 'La impresora no está conectada' }

      printer.alignCenter()
      if (data.header) {
        printer.bold(true)
        printer.println(data.header)
        printer.bold(false)
        printer.newLine()
      }

      printer.drawLine()
      printer.alignLeft()
      printer.println(data.text || 'Prueba de impresión')

      if (data.footer) {
        printer.drawLine()
        printer.alignCenter()
        printer.println(data.footer)
      }

      if (data.qrCode) {
        printer.alignCenter()
        printer.printQR(data.qrCode, { model: 2, cellSize: 8, correction: 'M' })
      }

      // if (data.barCode) {
      //   printer.alignCenter()
      //   printer.printBarcode(data.barCode, {
      //     type: 'CODE128',
      //     width: 2,
      //     height: 50,
      //     position: 'OFF',
      //     includeText: true
      //   })
      // }

      printer.alignCenter()
      printer.newLine()
      printer.println(new Date().toLocaleString())
      printer.cut()

      const result = await printer.execute()
      return { success: true, result }
    } catch (error: any) {
      console.error('Error al imprimir:', error)
      return { success: false, error: error.message }
    }
  })

  //Funcion que obtiene el tenant seteado en main/config/tenant.json
  ipcMain.handle('get-tenant-id', () => {
    const tenantId = getTenantIdFromDisk()
    if (!tenantId) throw new Error('No se encontro el tenantId')
    return tenantId
  })

  ipcMain.handle('print-ticket', async (_, data) => {
    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
    if (!win) return { ok: false, error: 'No hay ventana activa' }

    const printerName = data.printerName
    if (!printerName) {
      return { ok: false, error: 'No se especificó una impresora' }
    }

    const printers = await win.webContents.getPrintersAsync()
    const exists = printers.some((p) => p.name === printerName)

    if (!exists) {
      return { ok: false, error: `La impresora "${printerName}" no está disponible` }
    }

    const html = `
      <div style="font-family: monospace; padding: 20px;">
        <h2 style="text-align: center;">${data.header || 'Ticket'}</h2>
        <hr />
        <pre>${data.text || 'Pedido de prueba'}</pre>
        <hr />
        <p style="text-align: center;">${data.footer || ''}</p>
        <p style="text-align: center;">${new Date().toLocaleString()}</p>
      </div>
    `

    const printWin = new BrowserWindow({ show: false })
    await printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

    return new Promise((resolve) => {
      printWin.webContents.print(
        {
          silent: true,
          deviceName: printerName,
          printBackground: false
        },
        (success, failureReason) => {
          printWin.close()
          if (success) {
            resolve({ ok: true })
          } else {
            resolve({ ok: false, error: failureReason })
          }
        }
      )
    })
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
