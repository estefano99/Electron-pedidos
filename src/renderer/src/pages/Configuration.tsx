"use client"

import HeaderPages from "@/components/HeaderPages"
import { SettingsPanel } from "@/components/configuration/SettingsPanel"

export default function ConfiguracionPage() {
  return (
    <div className="w-full overflow-auto">
      {/* Header */}
      <HeaderPages title="Configuración" />
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <SettingsPanel />
      </main>
    </div>
  )
}
