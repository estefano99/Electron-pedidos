import net from "net"
import { IPrinterStrategy, PrintPayload } from "../IPrinterStrategy"

export class TcpPrinter implements IPrinterStrategy {
  constructor(private host: string, private port: number = 9100) {}

  async print(_: string, payload: PrintPayload): Promise<{ success: boolean; error?: string | undefined }> {
    const commands = `
      ${payload.header}\n------------------\n
      ${payload.text}\n
      ------------------\n
      ${payload.footer || ""}\n
      ${new Date().toLocaleString()}\n\n\n
    `

    return new Promise((resolve) => {
      const client = new net.Socket()
      client.connect(this.port, this.host, () => {
        client.write(commands, () => {
          client.end()
          resolve({ success: true })
        })
      })
      client.on("error", (err) => resolve({ success: false, error: err.message }))
    })
  }
}
