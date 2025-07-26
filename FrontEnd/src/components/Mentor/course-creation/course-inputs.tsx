import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FormData {
  title: string;
  category: string;
  price: string;
  language: string;
  level: string;
  duration: string;
  durationType: string;
}

export default function CourseBasicInfoForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    price: '',
    language: '',
    level: '',
    duration: '',
    durationType: 'Day'
  });

  const [activeTab, setActiveTab] = useState('basic');

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Design',
    'Business',
    'Marketing',
    'Music',
    'Photography'
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Korean'
  ];

  const levels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'All Levels'
  ];

  const durationTypes = ['Day', 'Week', 'Month', 'Hour'];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving form data:', formData);
  };

  const handleSaveAndPreview = () => {
    console.log('Saving and previewing:', formData);
  };

  const handleSaveAndNext = () => {
    console.log('Saving and moving to next step:', formData);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      category: '',
      price: '',
      language: '',
      level: '',
      duration: '',
      durationType: 'Day'
    });
  };

  const CustomSelect = ({ 
    value, 
    onChange, 
    options, 
    placeholder 
  }: { 
    value: string; 
    onChange: (value: string) => void; 
    options: string[]; 
    placeholder: string; 
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg border border-blue-200 shadow-sm">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
            activeTab === 'basic'
              ? 'border-pink-500 text-gray-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="mr-2">📝</span>
          Basic Information
          <span className="ml-2 text-xs text-green-600">7/12</span>
        </button>
        <button
          onClick={() => setActiveTab('advance')}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
            activeTab === 'advance'
              ? 'border-pink-500 text-gray-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="mr-2">📊</span>
          Advance Information
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
            activeTab === 'curriculum'
              ? 'border-pink-500 text-gray-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="mr-2">📚</span>
          Curriculum
        </button>
        <button
          onClick={() => setActiveTab('publish')}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
            activeTab === 'publish'
              ? 'border-pink-500 text-gray-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="mr-2">🚀</span>
          Publish Course
        </button>
      </div>

      {/* Form Content */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Basic Information</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleSaveAndPreview}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Save & Preview
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Your course title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={80}
              />
              <div className="absolute right-3 top-2 text-xs text-gray-400">
                {formData.title.length}/80
              </div>
            </div>
          </div>

          {/* Course Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Category
            </label>
            <CustomSelect
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              options={categories}
              placeholder="Select..."
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="text"
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Course Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Language
              </label>
              <CustomSelect
                value={formData.language}
                onChange={(value) => handleInputChange('language', value)}
                options={languages}
                placeholder="Select..."
              />
            </div>

            {/* Course Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Level
              </label>
              <CustomSelect
                value={formData.level}
                onChange={(value) => handleInputChange('level', value)}
                options={levels}
                placeholder="Select..."
              />
            </div>

            {/* Durations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durations
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Course durations"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <CustomSelect
                  value={formData.durationType}
                  onChange={(value) => handleInputChange('durationType', value)}
                  options={durationTypes}
                  placeholder="Day"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSaveAndNext}
            className="px-8 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
          >
            Save & Next
          </button>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium rounded-b-lg">
        1320 Hug × 696 Hug
      </div>
    </div>
  );
}