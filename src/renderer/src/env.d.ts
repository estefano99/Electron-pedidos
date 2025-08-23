/// <reference types="vite/client" />

export {}

declare global {
  type PrinterMode = 'driver' | 'escpos' | 'tcp' | 'bluetooth'

  interface PrinterOptions {
    ip?: string
    port?: number
    mac?: string
    [key: string]: any
  }

  interface PrintPayload {
    header?: string
    text?: string
    footer?: string
  }

  interface PrintTicketInput extends PrintPayload {
    printerName: string
    modo: PrinterMode
    opciones?: PrinterOptions
  }

  interface PrintResult {
    ok: boolean
    error?: string
  }

  interface Window {
    api: {
      /** Lista de impresoras visibles para Electron (renderer) */
      getThermalPrinters: () => Promise<Electron.PrinterInfo[]>

      /** ÚNICO punto de impresión. El main elige la Strategy (driver/escpos/tcp/...) */
      printTicket: (data: PrintTicketInput) => Promise<PrintResult>

      /** (Opcional/Legacy) Mantener solo si lo necesitás; idealmente deprecar. */
      printOrderTicket: (data: { html: string; printerName: string }) => Promise<PrintResult>

      /** (Opcional) Si ya lo usabas en UI */
      getAppVersion?: () => Promise<string>
    }
  }
}
