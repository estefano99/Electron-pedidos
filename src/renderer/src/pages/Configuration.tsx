import HeaderPages from "@/components/HeaderPages"
import SettingsComandera from "@/components/comandera/SettingsComandera"
import { SettingsPanel } from "@/components/configuration/SettingsPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings } from "lucide-react"
import { useState } from "react"

const title_tabs = {
  info_general: "Info. General",
  config_comanderas: "Config. Comanderas",
} as const

type TabKey = keyof typeof title_tabs

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("info_general")

  return (
    <div className="w-full overflow-auto">
      {/* Header */}
      <HeaderPages title="Configuración" />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabKey)}
        >
          <TabsList>
            <TabsTrigger value="info_general">{title_tabs.info_general}</TabsTrigger>
            <TabsTrigger value="config_comanderas">{title_tabs.config_comanderas}</TabsTrigger>
          </TabsList>

          {/* Título dinámico por tab */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              <h2 className="text-2xl font-bold">
                {title_tabs[activeTab]}
              </h2>
            </div>
          </div>

          <TabsContent value="info_general">
            <SettingsPanel />
          </TabsContent>

          <TabsContent value="config_comanderas">
            <SettingsComandera />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
