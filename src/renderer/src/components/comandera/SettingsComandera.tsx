import ConfiguracionImpresion from "@/components/ConfiguracionImpresion"
import { useEffect, useState } from "react"

const SettingsComandera = () => {
  const [version, setVersion] = useState('')

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-app-version').then(setVersion)
  }, [])

  console.log(version)

  const imprimirPara = async (destino: 'caja' | 'cocina') => {
    const cfg = JSON.parse(localStorage.getItem('impresoras_config') || '{}')
    const { impresora, modo, opciones } = cfg[destino] || {}

    if (!impresora || !modo) {
      alert(`⚠️ Faltan datos para imprimir en ${destino}. Guardá la configuración.`)
      return
    }

    const payload = {
      header: destino === 'caja' ? 'CAJA' : 'COCINA',
      text: destino === 'caja' ? 'Prueba impresion Caja' : '- Prueba impresion Cocina',
      footer:'prueba exitosa'
    }

    // 👇 Un solo canal IPC
    const result = await window.api.printTicket({
      printerName: impresora,
      modo,                 // 'driver' | 'escpos' | 'tcp' | 'bluetooth'
      opciones,             // { ip, port, mac, ... } si aplica
      ...payload
    })

    console.log("Settings comandera: ", result)
    result.ok
      ? alert(`✅ Ticket enviado a ${destino}`)
      : alert(`❌ Error: ${result.error}`)
  }

  return (
    <div className="p-8 text-white">
      <ConfiguracionImpresion />
      <div className="flex gap-4">
        <button
          onClick={() => imprimirPara('caja')}
          className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded transition-all duration-300"
        >
          Imprimir en caja
        </button>

        <button
          onClick={() => imprimirPara('cocina')}
          className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition-all duration-300"
        >
          Imprimir en cocina
        </button>
      </div>
    </div>
  )
}


export default SettingsComandera
