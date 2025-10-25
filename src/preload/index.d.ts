import { ElectronAPI } from '@electron-toolkit/preload'

interface TenantData {
  id: string
  name: string
  displayName: string
}

interface UserData {
  id: string
  username: string
  role: string
}

interface API {
  // Printers
  getThermalPrinters: () => Promise<any[]>
  printToThermal: (printerName: string, data: any) => Promise<any>
  printTicket: (data: any) => Promise<any>
  printOrderTicket: (data: any) => Promise<any>

    // Store API
  getTenantId: () => Promise<string | null>
  setTenantId: (tenantId: string | null) => Promise<void>
  clearTenantId: () => Promise<void>

  // Store - User
  getUser: () => Promise<UserData | null>
  setUser: (user: UserData | null) => Promise<{ success: boolean }>
  clearUser: () => Promise<{ success: boolean }>

  // Store - Clear all
  clearAllStore: () => Promise<{ success: boolean }>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
