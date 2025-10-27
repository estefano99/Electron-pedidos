import { BrowserWindow } from 'electron'
import { IPrinterStrategy, PrintPayload } from '../IPrinterStrategy'

export class EscPosPrinter implements IPrinterStrategy {
  async print(printerName: string, payload: PrintPayload): Promise<{ success: boolean; error?: string }> {
    // Generar HTML con estilo para impresora térmica (más compacto)
    const html = `
      <div style="font-family: monospace; font-size: 12px; width: 80mm; padding: 5px;">
        <div style="text-align: center; font-weight: bold; margin-bottom: 10px;">
          ${payload.header}
        </div>
        <div style="border-top: 1px dashed #000; margin: 5px 0;"></div>
        <div style="white-space: pre-wrap; margin: 10px 0;">
          ${payload.text}
        </div>
        <div style="border-top: 1px dashed #000; margin: 5px 0;"></div>
        ${payload.footer ? `<div style="text-align: center; margin-top: 10px;">${payload.footer}</div>` : ''}
        <div style="text-align: center; margin-top: 10px; font-size: 10px;">
          ${new Date().toLocaleString()}
        </div>
      </div>
    `

    const printWin = new BrowserWindow({ show: false })
    await printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

    return new Promise((resolve) => {
      printWin.webContents.print(
        {
          silent: true,
          deviceName: printerName,
          printBackground: false,
          margins: {
            marginType: 'none'
          }
        },
        (success, reason) => {
          printWin.close()
          if (success) {
            console.log("✅ EscPosPrinter: Impresión exitosa")
            resolve({ success: true })
          } else {
            console.error("❌ EscPosPrinter: Error al imprimir:", reason)
            resolve({ success: false, error: reason })
          }
        }
      )
    })
  }
}
