import type { IDecodedUserType } from "../../../types/auth.types";
import React from "react";
import { navigationConfig } from "../../../config/UI-config/Navigation.config";
import { Link } from "react-router-dom";
import type { NavigationItem } from "../../../config/UI-config/Navigation.config";
import { useLocation } from "react-router";

interface ISidebarProps {
  user: IDecodedUserType;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  item: NavigationItem;
  isSecondary?: boolean;
}

const Sidebar: React.FC<ISidebarProps> = ({ user, isOpen, onClose }) => {
  const navigation = navigationConfig[user.role];
  const location = useLocation();
  const isActive = (path: string) => location.pathname == path;
  const NavItem: React.FC<NavItemProps> = ({ item, isSecondary = false }) => (
    <Link
      to={item.path}
      key={item.path}
      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
        isActive(item.path)
          ? "bg-blue-600 text-white"
          : isSecondary
            ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      <item.icon
        className={`w-5 h-5 mr-3 ${isActive(item.path) ? "text-white" : ""}`}
      />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span
          className={`ml-2 px-2 py-1 text-xs rounded-full ${
            isActive(item.path)
              ? "bg-blue-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-[74px] left-0 z-40 w-64  bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src={`${user.profile ? user.profile : "/illustration/Avatar.jpeg"}`}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <div
                className={`px-2 py-1 text-xs rounded-full font-medium ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-800"
                    : user.role === "mentor"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {user.role}
              </div>
            </div>
          </div> */}

          <nav className="flex-1 px-4 py-4 space-y-6 overflow-auto ">
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Main Menu
              </h3>
              <div className="space-y-1">
                {navigation.primary.map((item, index) => (
                  <NavItem key={index} item={item} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Other
              </h3>
              <div className="space-y-1">
                {navigation.secondary.map((item, index) => (
                  <NavItem key={index} item={item} isSecondary />
                ))}
              </div>
            </div>
          </nav>

          {/* <div className="p-4 border-t border-gray-200">
            
          </div> */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
