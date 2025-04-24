import ConfiguracionImpresion from "@/components/ConfiguracionImpresion"

const Start = () => {
  const imprimirPara = async (destino: 'caja' | 'cocina') => {
    console.log(destino)
    const config = JSON.parse(localStorage.getItem('impresoras_config') || '{}')
    const { impresora, modo } = config[destino] || {}

    console.log(`Imprimir en ${destino} con impresora "${impresora}" en modo "${modo}"`)


    if (!impresora || !modo) {
      alert(`⚠️ Faltan datos para imprimir en ${destino}, (¿Presiono en guardar configuracion?)`)
      return
    }

    const payload = {
      header: destino === 'caja' ? '🔥 BURGER APP' : '🧑‍🍳 COCINA',
      text: destino === 'caja' ? 'Pedido #123\n- 1x Lomito' : '- 1x Lomito',
      footer: destino === 'caja' ? 'Gracias por tu compra!' : ''
    }

    if (modo === 'driver') {
      const result = await window.api.printTicket({ printerName: impresora, ...payload })
      result.ok
        ? alert(`✅ Ticket enviado a ${destino}`)
        : alert(`❌ Error: ${result.error}`)
    } else {
      const result = await window.api.printToThermal(impresora, payload)
      result.success
        ? alert(`✅ Ticket enviado a ${destino}`)
        : alert(`❌ Error: ${result.error}`)
    }
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl mb-4">Inicio</h1>
      <ConfiguracionImpresion />

      <div className="flex gap-4 mt-6">
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


export default Start
