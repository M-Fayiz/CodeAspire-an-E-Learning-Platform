import { useState } from "react";
// import type { IDecodedUserType } from "../../types/auth.types";
import Header from "../../components/layout/dynamic-layout/Header-dashboard";
import Sidebar from "../../components/layout/dynamic-layout/Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { NotificationProvider } from "@/context/notification.context";

const DynamicLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col">
        <NotificationProvider userId={user.id}>
          
        
        <Header
          user={user}
          onMenuToggle={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        </NotificationProvider>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4  md:mt-0 lg:mt-0 lg:ml-64 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DynamicLayout;
