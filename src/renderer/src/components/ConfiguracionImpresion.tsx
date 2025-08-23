import { useEffect, useState } from 'react'

type ImpresoraConfig = {
  impresora: string
  modo: 'driver' | 'escpos' | 'tcp' | 'bluetooth'
  opciones?: {
    ip?: string
    port?: number
    mac?: string
    [key: string]: any
  }
}

type ConfiguracionGeneral = {
  [key: string]: ImpresoraConfig
}

const AREAS: Array<'caja' | 'cocina'> = ['caja', 'cocina']

const MODO_IMPRESION: { value: ImpresoraConfig['modo']; label: string }[] = [
  { value: 'driver', label: 'Driver (Recomendado)' },
  { value: 'escpos', label: 'ESC/POS' },
  { value: 'tcp', label: 'TCP (IP)' },
  { value: 'bluetooth', label: 'Bluetooth' }
]

const ConfiguracionImpresion = () => {
  const [impresoras, setImpresoras] = useState<string[]>([])
  const [config, setConfig] = useState<ConfiguracionGeneral>({
    caja: { impresora: '', modo: 'driver', opciones: {} },
    cocina: { impresora: '', modo: 'driver', opciones: {} }
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

  const actualizarOpcion = (area: string, key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [area]: {
        ...prev[area],
        opciones: {
          ...prev[area].opciones,
          [key]: value
        }
      }
    }))
  }

  const actualizarCampo = (area: string, key: keyof ImpresoraConfig, value: any) => {
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

      {AREAS.map((area) => (
        <div key={area} className="mb-4 flex bg-gray-700/80 p-4 rounded-lg">
          <div className="w-full pr-2">
            <label className="block mb-1 font-medium capitalize">
              {area} - Impresora
            </label>
            <select
              className="text-black p-2 mb-2 rounded w-full"
              value={config[area].impresora}
              onChange={(e) => actualizarCampo(area, 'impresora', e.target.value)}
            >
              <option value="">Seleccionar impresora</option>
              {impresoras.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="w-full pr-2">
            <label className="block mb-1 font-medium capitalize">{area} - Modo</label>
            <select
              className="text-black p-2 rounded w-full"
              value={config[area].modo}
              onChange={(e) => actualizarCampo(area, 'modo', e.target.value)}
            >
              {MODO_IMPRESION.map((modo) => (
                <option key={modo.value} value={modo.value}>
                  {modo.label}
                </option>
              ))}
            </select>

            {config[area].modo === 'tcp' && (
              <>
                <label className="block mt-2 text-sm">IP</label>
                <input
                  type="text"
                  className="text-black p-2 rounded w-full"
                  value={config[area].opciones?.ip || ''}
                  onChange={(e) => actualizarOpcion(area, 'ip', e.target.value)}
                />
                <label className="block mt-2 text-sm">Puerto</label>
                <input
                  type="number"
                  className="text-black p-2 rounded w-full"
                  value={config[area].opciones?.port || 9100}
                  onChange={(e) => actualizarOpcion(area, 'port', parseInt(e.target.value))}
                />
              </>
            )}
          </div>
        </div>
      ))}

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
