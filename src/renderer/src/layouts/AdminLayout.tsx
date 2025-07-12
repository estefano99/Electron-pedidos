import Sidebar from "@/components/sidebar/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <main className="flex w-full h-screen">
      <Sidebar />
      <Outlet />
      <Toaster />
    </main>
  );
};

export default AdminLayout;
