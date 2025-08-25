import { Search, TrendingUp } from "lucide-react";
import type React from "react";

interface SearchBarProps {
  placeHolder: string;
  searchQuery:string
  onChange:(e: React.ChangeEvent<HTMLInputElement>)=>void
  name:string
}
const SearchBar: React.FC<SearchBarProps> = ({ placeHolder,searchQuery,onChange,name }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search for ${placeHolder}...`}
            value={searchQuery}
            onChange={onChange}
            name={name}
            className="w-full pl-10 pr-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
