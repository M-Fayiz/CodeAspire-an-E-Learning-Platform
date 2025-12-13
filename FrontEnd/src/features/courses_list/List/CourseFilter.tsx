import categoryService from "@/service/admin/category.service";
import type { ICategory } from "@/types/category.types";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
type ExpandedSections = {
  categories: boolean;
  level: boolean;
};

type FilterSectionProps = {
  title: string;
  children: ReactNode;
  sectionKey: keyof ExpandedSections;
};

interface FiltersProps {
  handleCategory: (cat: string[]) => void;
  handleSubCategory: (cat: string[]) => void;
  handleLevel: (cat: string[]) => void;
}
const FilterSidebar: React.FC<FiltersProps> = ({
  handleCategory,
  handleLevel,
}) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    categories: true,

    level: true,
  });
  const [searchCategory, setSearchcategory] = useState<string[]>([]);

  const [levels, setLevel] = useState<string[]>([]);

  const [category, setCategory] = useState<ICategory[]>([]);
  useEffect(() => {
    async function fetchCategory() {
      const categoryData = await categoryService.listCategory();
      if (categoryData) {
        setCategory(categoryData);
      }
    }
    fetchCategory();
  }, []);

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const handleSelectedCategory = (category: string, checked: boolean) => {
    setSearchcategory((prev) => {
      const updated = checked
        ? [...prev, category]
        : prev.filter((c) => c !== category);
      handleCategory(updated);
      return updated;
    });
  };

  const handleSelectedLevel = (level: string, checked: boolean) => {
    setLevel((prev) => {
      const updated = checked
        ? [...prev, level]
        : prev.filter((l) => l !== level);
      handleLevel(updated);
      return updated;
    });
  };
  const FilterSection: React.FC<FilterSectionProps> = ({
    title,
    children,
    sectionKey,
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        {title}
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
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

      <FilterSection title="CATEGORY" sectionKey="categories">
        <div className="space-y-2">
          {category &&
            category.map((cat) => (
              <label
                key={cat._id}
                className="flex items-center space-x-2 cursor-pointer hover:text-blue-600"
              >
                <input
                  type="checkbox"
                  checked={searchCategory.includes(cat._id)}
                  onChange={(e) =>
                    handleSelectedCategory(cat._id, e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{cat.title}</span>
                {/* <span className="text-xs text-gray-500 ml-auto">
                  ({Math.floor(Math.random() * 500) + 50})
                </span> */}
              </label>
            ))}
        </div>
      </FilterSection>

      <FilterSection title="LEVEL" sectionKey="level">
        <div className="space-y-2">
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <label
              key={level}
              className="flex items-center space-x-2 cursor-pointer hover:text-blue-600"
            >
              <input
                type="checkbox"
                checked={levels.includes(level)}
                onChange={(e) => handleSelectedLevel(level, e.target.checked)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* <FilterSection title="PRICE" sectionKey="price">
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
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Free</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Paid</span>
            </label>
          </div>
        </div>
      </FilterSection> */}
    </div>
  );
};

export default FilterSidebar;
