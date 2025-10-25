import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Cog,
  ClipboardList,
  ChefHat,
  Pizza,
  Tags,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { RestaurantSettings } from "@/types/configuration"
import { getConfiguration } from "@/api/ConfigurationApi"
import clienteAxios from "@/config/axios"
import clsx from "clsx"
// import { toast } from "sonner"

const navigation = [
  { name: "Inicio", href: "/inicio", icon: LayoutDashboard },
  { name: "Categorias", href: "/categorias", icon: Tags },
  { name: "Productos", href: "/productos", icon: Pizza },
  { name: "Ingredientes", href: "/ingredientes", icon: ChefHat },
  { name: "Pedidos", href: "/pedidos", icon: ClipboardList },
  { name: "Configuracion", href: "/configuracion", icon: Cog },
]

//  links={[
//               { title: "Inicio", icon: Home },
//               { title: "Categorias", icon: Tags },
//               { title: "Productos", icon: Pizza },
//               { title: "Ingredientes", icon: ChefHat },
//               { title: "Pedidos", icon: ClipboardList },
//               { title: "Configuracion", icon: Cog },
//             ]}

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const navigate = useNavigate()
  // const logout = useLogout()

  // const logoutSession = async () => {
  //   try {
  //     await logout.mutateAsync()
  //     navigate("/", {replace: true})
  //   } catch (err: any) {
  //     toast.error("No se pudo cerrar sesión", { description: err?.message ?? "Error inesperado" })
  //   }
  // }

  const { data } = useQuery<RestaurantSettings>({
    queryKey: ["settings"],
    queryFn: getConfiguration,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const logout = async () => {
    try {
      // Hacer llamada al backend para limpiar la cookie
      await clienteAxios.post('/auth/logout')

      // Limpiar el store local (tenantId y user)
      await window.api.clearAllStore()
    } catch (error) {
      console.error('Error al hacer logout:', error)
    } finally {
      // Redirigir independientemente del resultado
      navigate("/");
    }
  };

  return (
    <div
      className={cn(
        "md:bg-muted/40 border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700 px-3">
        {/* Logo + nombre */}
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={data?.logoUrl}
            alt="Imagen del local comercial"
            loading="lazy"
            className="h-10 w-10 object-contain rounded-md shadow"
          />
          {!collapsed && (
            <p className="font-semibold text-base md:text-lg truncate">
              {data ? data.displayName : "Sistema de pedidos"}
            </p>
          )}
        </div>

        {/* Botón colapsar */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0 p-2"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className={cn("py-4 px-2 lg:px-4 space-y-2", collapsed && "px-0")}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                {
                  "bg-muted text-primary hover:text-primary": isActive,
                  "text-muted-foreground hover:text-primary": !isActive,
                },
                collapsed && "justify-center rounded-lg p-3"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3")} />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="py-4 px-2 lg:px-4 space-y-2">

      <Button
        onClick={logout}
        variant="destructive"
        className={clsx(
          "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg",
          collapsed && "justify-center px-0"
        )}
        >
        <LogOut className="h-5 w-5 shrink-0" />
        {!collapsed && <span>Cerrar sesión</span>}
      </Button>
        </div>
    </div>
  )
}

export default Sidebar
