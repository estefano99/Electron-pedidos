import Sidebar from "@/components/sidebar/Sidebar";
// import { SkeletonCard } from "@/components/SkeletonCard";
import { Toaster } from "@/components/ui/toaster";
// import { useAuth } from "@/hooks/useAuth";
// import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  // const navigate = useNavigate();
  // const { isError, isLoading } = useAuth();

  // useEffect(() => {
  //   if (isError) return navigate("/");
  // }, [isError, navigate]);

  // if (isLoading) return "Cargando...";
  return (
    <main className="flex w-full h-screen">
      <Sidebar />
      <Outlet />
      <Toaster />
    </main>
  );
};

export default AdminLayout;
