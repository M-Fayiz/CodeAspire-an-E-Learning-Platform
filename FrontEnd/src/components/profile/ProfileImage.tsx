import { Edit2, User } from "lucide-react";

const ProfileImage: React.FC<{ 
  src?: string; 
  alt: string; 
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onImageChange?: (file: File) => void;
}> = ({ src, alt, size = 'md', editable = false, onImageChange }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <User className="w-1/2 h-1/2 text-gray-400" />
        )}
      </div>
      {editable && (
        <div className="absolute bottom-0 right-0">
          <label className="bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
            <Edit2 className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ProfileImage