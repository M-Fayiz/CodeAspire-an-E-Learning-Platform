import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    tools: true,
    rating: true,
    level: true,
    price: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ title, children, sectionKey }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        {title}
        {expandedSections[sectionKey] ? 
          <ChevronUp className="w-4 h-4" /> : 
          <ChevronDown className="w-4 h-4" />
        }
      </button>
      {expandedSections[sectionKey] && children}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      <FilterSection title="CATEGORY" sectionKey="category">
        <div className="space-y-2">
          {['Development', 'Data Science', 'Design', 'Business', 'Marketing'].map(category => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">{category}</span>
              <span className="text-xs text-gray-500 ml-auto">({Math.floor(Math.random() * 500) + 50})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="LEVEL" sectionKey="level">
        <div className="space-y-2">
          {['All Level', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
            <label key={level} className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
              <input type="radio" name="level" className="text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="PRICE" sectionKey="price">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="0" 
              max="200" 
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>$200+</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Free</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Paid</span>
            </label>
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar