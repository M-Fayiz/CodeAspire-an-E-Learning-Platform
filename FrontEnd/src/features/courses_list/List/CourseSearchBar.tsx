import { Search } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface SearchBarProps {
  placeholder: string;
  handleSearch: (query: string) => void;
}

const SearchHeader: React.FC<SearchBarProps> = ({
  placeholder,
  handleSearch,
}) => {
  const [search, setSearch] = useState("");
  const handleChange = (value: string) => {
    setSearch(value);
    handleSearch(value);
  };
  return (
    <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {/* {resultCount.toLocaleString()} results found */}
          </span>
          {/* <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              //   value={sortBy}
              //   onChange={(e) => onSortChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div> */}
        </div>
      </div>

      {/* <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Trending:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['React', 'Python', 'UI/UX Design', 'Machine Learning', 'JavaScript', 'Data Analysis'].map(tag => (
            <button
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default SearchHeader;
