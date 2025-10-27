import Sidebar from "@/components/sidebar/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) return <div>Cargando...</div>
  if (!isAuthenticated) return <div>No autenticado</div>
  return (
    <main className="flex w-full h-screen">
      <Sidebar />
      <Outlet />
      <Toaster />
    </main>
  );
};

export default AdminLayout;
