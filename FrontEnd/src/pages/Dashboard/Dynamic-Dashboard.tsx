import  { useState } from "react";
// import type { IDecodedUserType } from "../../types/auth.types";
import  Header from "../../components/layout/dynamic-layout/Header-dashboard";
import Sidebar from "../../components/layout/dynamic-layout/Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth.context";


const DynamicLayout =() => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {user}=useAuth()
  
  console.log('user from context 🔁', user);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  
  if(!user) {

    console.log('User not found, redirecting...');
    return <Navigate to='/auth/login' replace />

  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        user={user} 
        onMenuToggle={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          user={user} 
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            <Outlet/>
          </div>
        </main>
      </div>
    </div>
  );
};


export default DynamicLayout