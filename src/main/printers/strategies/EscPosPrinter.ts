import { IPrinterStrategy, PrintPayload } from '../IPrinterStrategy'
import ThermalPrinter from 'node-thermal-printer'

export class EscPosPrinter implements IPrinterStrategy {
  async print(printerName: string, payload: PrintPayload) {
    const printer = new ThermalPrinter.printer({
      type: ThermalPrinter.types.EPSON,
      interface: `printer:${printerName}`,
    })

    printer.alignCenter()
    printer.println(payload.header)
    printer.drawLine()
    printer.alignLeft()
    printer.println(payload.text)
    printer.drawLine()
    if (payload.footer) printer.println(payload.footer)
    printer.newLine()
    printer.println(new Date().toLocaleString())
    printer.cut()

    try {
      const ok = await printer.execute()
      console.log("🚀 ~ EscPosPrinter ~ print ~ ok:", ok)
      return { success: !!ok }
    } catch (error) {
      console.log("🚀 ~ EscPosPrinter ~ print ~ error:", error)
      return { success: false, error: (error as Error).message }
    }
  }
}
