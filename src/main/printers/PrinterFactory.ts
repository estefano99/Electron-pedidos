import { IPrinterStrategy } from './IPrinterStrategy'
import { DriverPrinter } from './strategies/DriverPrinter'
import { EscPosPrinter } from './strategies/EscPosPrinter'
import { TcpPrinter } from './strategies/TcpPrinter'

export function createPrinterStrategy(mode: string, config: any): IPrinterStrategy {
  console.log(new Date(), ' 🚀 ~ createPrinterStrategy ~ mode:', mode)

  switch (mode) {
    case 'driver':
      return new DriverPrinter()
    case 'raw':
      throw new Error(`RAW no soportado aun: ${mode}`)
    case 'escpos':
      return new EscPosPrinter()
    case 'tcp':
      return new TcpPrinter(config.ip, config.port)
    default:
      throw new Error(`Modo de impresión no soportado: ${mode}`)
  }
}
