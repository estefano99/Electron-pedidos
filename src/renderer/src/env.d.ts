/// <reference types="vite/client" />

export {}

declare global {
  interface Window {
    api: {
      getPrinters: () => Promise<Electron.PrinterInfo[]>
      getThermalPrinters: () => Promise<Electron.PrinterInfo[]>
      printToThermal: (
        printerName: string,
        data: {
          header?: string
          text?: string
          footer?: string
          qrCode?: string
          barCode?: string
        }
      ) => Promise<{ success: boolean; result?: any; error?: string }>
      printTicket: (
        data: {
          header?: string
          text?: string
          footer?: string
          printerName?: string
        }
      ) => Promise<{ ok: boolean; error?: string }>
    }
  }
}
