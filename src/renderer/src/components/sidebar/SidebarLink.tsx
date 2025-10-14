import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clienteAxios from "@/config/axios";

type LinkProps = {
  redirectTo: string;
  linkTitle: string;
  linkIcon: LucideIcon;
};

const SidebarLink = ({
  redirectTo,
  linkTitle,
  linkIcon: LinkIcon,
}: LinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      // Hacer llamada al backend para limpiar la cookie
      await clienteAxios.post('/auth/logout') // Ajustar la ruta según tu backend
    } catch (error) {
      console.error('Error al hacer logout:', error)
    } finally {
      // Redirigir independientemente del resultado
      navigate("/");
    }
  };

  const isActive = location.pathname === `/${redirectTo}`;

  return (
    <div
      className={clsx(
        {
          "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary cursor-pointer":
            isActive,
          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer":
            !isActive,
          "mx-3 flex justify-center items-center gap-3 mt-3 md:mt-0 bg-red-500 rounded-lg px-3 py-2 text-black transition-all hover:text-black hover:bg-red-700 cursor-pointer": redirectTo === "cerrar-sesion" && !isActive,
        },
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium 2xl:text-lg transition-all"
      )}
      onClick={redirectTo === "cerrar-sesion" ? logout : undefined}
    >
      {redirectTo !== "cerrar-sesion" && (
        <Link className="w-full flex items-center gap-3" to={`/${redirectTo}`}>
          <LinkIcon className={clsx(
            { "text-black": redirectTo === "cerrar-sesion" }
          )} />
          {linkTitle}
        </Link>
      )}
      {redirectTo === "cerrar-sesion" && (
        <span className="flex items-center gap-3 hover:cursor-pointer text-black">
          <LinkIcon className={clsx(
            { "text-black": redirectTo === "cerrar-sesion" }
          )} />
          {linkTitle}
          </span>
        )}
    </div>
  );
};

export default SidebarLink;
