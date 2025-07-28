import {
  Home,
  Menu,
  LogOut,
  Pizza,
  ChefHat,
  Tags,
  ClipboardList,
  Cog
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarNav from "./SidebarNav";
import { Button } from "../ui/button";
import SidebarLink from "./SidebarLink";
import { useQuery } from "@tanstack/react-query";
import { RestaurantSettings } from "@/types/configuration";
import { getConfiguration } from "@/api/ConfigurationApi";

const Sidebar = () => {
  const { data } = useQuery<RestaurantSettings>({
    queryKey: ["settings"],
    queryFn: getConfiguration,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return (
    <div className="h-14 absolute md:relative md:h-full w-1/6 2xl:w-[20%] md:border-r md:bg-muted/40 md:block">
      <div className="hidden md:flex h-full flex-col gap-2">
        <div className="flex h-14 items-center gap-2 border-b px-4 lg:h-[60px] lg:px-6">
          <img
            src={data?.logoUrl}
            alt="Imagen del local comercial"
            loading="lazy"
            className="h-10 w-10 object-contain rounded-md shadow"
          />
          <p className="flex items-center gap-2 font-semibold">
            <span className="flex gap-3 text-base md:text-lg">
              {data ? data.displayName : "Sistema de pedidos"}
            </span>
          </p>
        </div>
        <div className="flex-1">
          <SidebarNav
            links={[
              { title: "Inicio", icon: Home },
              { title: "Categorias", icon: Tags },
              { title: "Productos", icon: Pizza },
              { title: "Ingredientes", icon: ChefHat },
              { title: "Pedidos", icon: ClipboardList },
              { title: "Configuracion", icon: Cog },
            ]}
          />
        </div>
        <div className="w-full flex flex-col justify-center h-20">
          <SidebarLink
            key={`cerrar-sesion`}
            linkTitle={`Cerrar sesión`}
            linkIcon={LogOut}
            redirectTo={`cerrar-sesion`}
          />
        </div>
      </div>
      {/* Menu hamburguesa para mobile */}
      <div className="flex flex-col md:hidden absolute z-50">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SidebarNav
                links={[
                  { title: "Inicio", icon: Home },
                  { title: "Categorias", icon: Tags },
                  { title: "Productos", icon: Pizza },
                  { title: "Ingredientes", icon: ChefHat },
                  { title: "Pedidos", icon: ClipboardList },
                  { title: "Configuracion", icon: Cog },
                ]}
              />
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
};

export default Sidebar;
