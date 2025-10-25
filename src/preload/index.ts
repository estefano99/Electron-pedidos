import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Printers
  getThermalPrinters: () => ipcRenderer.invoke('get-thermal-printers'),
  printToThermal: (printerName: string, data: any) =>
    ipcRenderer.invoke('print-to-thermal', printerName, data),
  printTicket: (data: any) => ipcRenderer.invoke('print-ticket', data),
  printOrderTicket: (data: any) => ipcRenderer.invoke('print-order-ticket', data),

  // Store - Tenant
  getTenantId: () => ipcRenderer.invoke('store:get-tenant-id'),
  setTenantId: (tenantId: string | null) => ipcRenderer.invoke('store:set-tenant-id', tenantId),
  clearTenantId: () => ipcRenderer.invoke('store:clear-tenant-id'),

  // Store - User
  getUser: () => ipcRenderer.invoke('store:get-user'),
  setUser: (user: { id: string; username: string; role: string } | null) =>
    ipcRenderer.invoke('store:set-user', user),
  clearUser: () => ipcRenderer.invoke('store:clear-user'),

  // Store - Clear all
  clearAllStore: () => ipcRenderer.invoke('store:clear-all'),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
