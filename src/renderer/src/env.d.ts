/// <reference types="vite/client" />

// Esa interfaz que estás editando (en global.d.ts o un archivo similar) es solo para TypeScript del renderer, es decir, del front de Electron.
// Sirve para que el auto completado, el chequeo de tipos y el TS compiler sepan que existe window.api.(metodo)) y cómo se usa.

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
      printTicket: (data: {
        header?: string
        text?: string
        footer?: string
        printerName?: string
      }) => Promise<{ ok: boolean; error?: string }>
      printOrderTicket: (data: {
        html: string
        printerName: string
      }) => Promise<{ ok: boolean; error?: string }>
      getTenantId: () => Promise<string>
    }
  }
}
