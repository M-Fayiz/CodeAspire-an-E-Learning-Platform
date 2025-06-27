import { Bell, ChevronDown, HelpCircle, LogOut, Menu, Search, Settings, User, X } from "lucide-react";
import React,{useState} from "react";
import type { IDecodedUserType } from "../../../types/auth.types";
import { useAuth } from "../../../context/auth.context";
import { Spinner } from "../../templates/Spinner";
import { Link } from "react-router";

interface IHeaderProbs{
  user:IDecodedUserType
  onMenuToggle:()=>void
  isSidebarOpen:boolean
}

const Header :React.FC<IHeaderProbs>=({ user, onMenuToggle, isSidebarOpen }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const {logout,loading}=useAuth()

  const notifications = [
    { id: 1, text: "New course enrollment", time: "5 min ago", unread: true },
    { id: 2, text: "Assignment submitted", time: "1 hour ago", unread: true },
    { id: 3, text: "System maintenance scheduled", time: "2 hours ago", unread: false }
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-gray-900">Tech Master</h1>
        </div>
        
        
        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, users, content..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 lg:w-80"
          />
        </div>
      </div>

      
      <div className="flex items-center space-x-3">
        
        <button className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors">
          <Search className="w-5 h-5 text-gray-600" />
        </button>

        
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                      notification.unread ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                    }`}
                  >
                    <p className="text-sm text-gray-900">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <img
              src={user.profile}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="py-2">
                <Link to={`/${user.role}/profile`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4 mr-3" />
                  My Profile
                </Link>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4 mr-3" />
                  Account Settings
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <HelpCircle className="w-4 h-4 mr-3" />
                  Help & Support
                </a>
              </div>
              <div className="border-t border-gray-200 py-2">
                <button onClick={logout} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {loading&&<Spinner fullScreen variant="theme"/>}
    </header>
  );
};

export default Header