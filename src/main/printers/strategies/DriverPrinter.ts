import { BrowserWindow } from "electron"
import { IPrinterStrategy, PrintPayload } from "../IPrinterStrategy"

export class DriverPrinter implements IPrinterStrategy {
  async print(printerName: string, payload: PrintPayload): Promise<{ success: boolean; error?: string | undefined }> {
    const html = `
      <div style="font-family: monospace; padding: 20px;">
        <h2 style="text-align: center;">${payload.header}</h2>
        <hr />
        <pre>${payload.text}</pre>
        <hr />
        <p style="text-align: center;">${payload.footer || ''}</p>
        <p style="text-align: center;">${new Date().toLocaleString()}</p>
      </div>
    `
    const printWin = new BrowserWindow({ show: false })
    await printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

    return new Promise((resolve) => {
      printWin.webContents.print({ silent: true, deviceName: printerName }, (success, reason) => {
        printWin.close()
        if (success) resolve({ success: true })
        else resolve({ success: false, error: reason })
      })
    })
  }
}
