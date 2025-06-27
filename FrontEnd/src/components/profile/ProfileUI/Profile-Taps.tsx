import type { ReactNode } from "react";
import type { TapsComp } from "../../../pages/Profile Page/Profile";

interface TabsProps {
  changeTab: TapsComp;
  icon: ReactNode;
  setTabs: (tab: TapsComp) => void;
  currentTab: TapsComp;
  title:string
}

export const ProfileTabs: React.FC<TabsProps> = ({changeTab,icon,setTabs,currentTab,title}) => {
  return (
    <button
      onClick={() => setTabs(changeTab)}
      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
        changeTab === currentTab
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span>{title}</span>
      </div>
    </button>
  );
};
