export interface PrintPayload {
  header: string
  text: string
  footer?: string
}

export interface IPrinterStrategy {
  print(printerName: string, payload: PrintPayload): Promise<{ success: boolean; error?: string }>
}
