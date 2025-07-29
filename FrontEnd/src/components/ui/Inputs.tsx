
import React, { useState } from 'react';
import { Eye, EyeOff,  X } from 'lucide-react'; 

interface IInputProps {
  type?: string;
  placeholder?: string; 
  value?: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  label:string,
  showPasswordToggle?: boolean;
  min?:string
  max?:string
  textArea?:boolean;
  required?:boolean;
 
}

export const Input: React.FC<IInputProps> = ({
  type,
  placeholder,
  value,
  name,
  onChange,
  icon,
  error,
  label,
  showPasswordToggle,
  textArea,
  min,
  max,
  
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div>
      <label className="block text-sm font-bold  text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300">
            {icon}
          </span>
        )}
        {textArea?(
          <textarea
            value={value}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        ):(   
        <input
          min={min}
          max={max}
          type={inputType}
          value={value}
          name={name}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full pl-8 pr-10 py-2.5 rounded-sm border ${
            error ? 'border-red-400' : 'border-gray-300'
          } ${isFocused ? 'bg-white/30' : ''}`}
          placeholder={placeholder}
        />
        )}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <div className="mt-2 text-red-400 text-sm flex items-center">
          <X className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};


