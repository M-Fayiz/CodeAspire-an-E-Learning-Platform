import { Search } from "lucide-react";
import type React from "react";

interface SearchBarProps {
  placeHolder: string;
  searchQuery: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeHolder,
  searchQuery,
  onChange,
  name,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

      <input
        type="text"
        placeholder={`Search ${placeHolder}`}
        value={searchQuery}
        onChange={onChange}
        name={name}
        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-black 
        focus:border-transparent transition"
      />
    </div>
  );
};

export default SearchBar;
