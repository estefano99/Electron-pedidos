import { useEffect, useState } from 'react'

const ConfiguracionImpresion = () => {
  const [impresoras, setImpresoras] = useState<string[]>([])
  const [config, setConfig] = useState({
    caja: { impresora: '', modo: 'driver' },
    cocina: { impresora: '', modo: 'driver' }
  })

  useEffect(() => {
    const fetch = async () => {
      const list = await window.api.getThermalPrinters()
      setImpresoras(list.map((p: any) => p.name))

      const saved = JSON.parse(localStorage.getItem('impresoras_config') || '{}')
      if (saved.caja || saved.cocina) {
        setConfig({
          caja: saved.caja || { impresora: '', modo: 'driver' },
          cocina: saved.cocina || { impresora: '', modo: 'driver' }
        })
      }
    }
    fetch()
  }, [])

  const actualizar = (area: 'caja' | 'cocina', key: 'impresora' | 'modo', value: string) => {
    setConfig((prev) => ({
      ...prev,
      [area]: {
        ...prev[area],
        [key]: value
      }
    }))
  }

  const guardar = () => {
    localStorage.setItem('impresoras_config', JSON.stringify(config))
    alert('✅ Configuración guardada correctamente')
  }

  return (
    <div className="p-4 mb-6 bg-gray-800 rounded-lg text-white">
      <h2 className="text-lg font-semibold mb-4">Configuración de Impresoras</h2>

      {/* CAJA */}
      <div className="mb-4 flex bg-gray-700/80 p-4 rounded-lg">
        <div className="w-full pr-2">
          <label className="block mb-1 font-medium">Caja - Impresora</label>
          <select
            className="text-black p-2 mb-2 rounded w-full"
            value={config.caja.impresora}
            onChange={(e) => actualizar('caja', 'impresora', e.target.value)}
          >
            <option value="">Seleccionar impresora</option>
            {impresoras.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="w-full pr-2">
          <label className="block mb-1 font-medium">Caja - Modo</label>
          <select
            className="text-black p-2 rounded w-full"
            value={config.caja.modo}
            onChange={(e) => actualizar('caja', 'modo', e.target.value)}
          >
            <option value="driver">Driver (Recomendado)</option>
            <option value="raw">Raw (ESC/POS)</option>
          </select>
        </div>
      </div>

      {/* COCINA */}
      <div className="mb-4 flex bg-gray-700/80 p-4 rounded-lg">
        <div className="w-full pr-2">
          <label className="block mb-1 font-medium">Cocina - Impresora</label>
          <select
            className="text-black p-2 mb-2 rounded w-full"
            value={config.cocina.impresora}
            onChange={(e) => actualizar('cocina', 'impresora', e.target.value)}
          >
            <option value="">Seleccionar impresora</option>
            {impresoras.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="w-full pr-2">
          <label className="block mb-1 font-medium">Cocina - Modo</label>
          <select
            className="text-black p-2 rounded w-full"
            value={config.cocina.modo}
            onChange={(e) => actualizar('cocina', 'modo', e.target.value)}
          >
            <option value="driver">Driver (Recomendado)</option>
            <option value="raw">Raw (ESC/POS)</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={guardar}
          className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded transition-all duration-300"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  )
}

export default ConfiguracionImpresion
