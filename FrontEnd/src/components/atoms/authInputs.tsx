
import React, { useState } from 'react';
import { Eye, EyeOff,  X } from 'lucide-react'; 

interface IInputProps {
  type: string;
  placeholder: string; 
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  error: string;
  label:string,
  showPasswordToggle?: boolean; 
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
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          value={value}
          name={name}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
            error ? 'border-red-400' : 'border-gray-300'
          } ${isFocused ? 'bg-white/20' : ''}`}
          placeholder={placeholder}
        />
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


