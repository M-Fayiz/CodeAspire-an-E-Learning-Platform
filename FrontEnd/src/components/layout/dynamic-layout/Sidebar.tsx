import type { IDecodedUserType } from "../../../types/auth.types";
import React from "react";
import navigationConfig from "../../../config/UI-config/Navigation.config";
import type { NavigationItem } from "../../../config/UI-config/Navigation.config";
import { NavLink } from "react-router-dom";

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

  const NavItem: React.FC<NavItemProps> = ({ item, isSecondary = false }) => (
    <NavLink
      to={item.path}
      end={false}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-black text-white"
            : isSecondary
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        }`
      }
    >
      <item.icon className="w-5 h-5 mr-3" />
      <span className="flex-1">{item.label}</span>

      {item.badge && (
        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-500 text-white">
          {item.badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-[74px] left-0 z-40 w-64  bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-4 py-4 space-y-6 overflow-auto ">
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Main Menu
              </h3>
              <div className="space-y-1">
                {navigation.map((item, index) => (
                  <NavItem key={index} item={item} />
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
