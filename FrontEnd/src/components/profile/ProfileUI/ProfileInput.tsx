// Input Field Component
export const InputField: React.FC<{
  label: string;
  type?: string;
  value: string;
  name:string;
  onChange:  (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  error?:string
}> = ({ label, type = 'text', value, onChange, disabled = false, required = false, icon ,name,error}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
            icon ? 'pl-10' : ''
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
      </div>
       {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};


 export const TextareaField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rows?: number;
}> = ({ label, value, onChange, disabled = false, rows = 3 }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
};
