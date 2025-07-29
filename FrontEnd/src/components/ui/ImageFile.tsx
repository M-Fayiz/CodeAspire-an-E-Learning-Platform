import React, { useState } from 'react';
import { Input } from "@/components/ui/input"; // from ShadCN

function ImageUploadPreview() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" accept="image/*" onChange={handleImageChange} />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="max-w-xs rounded shadow border"
        />
      )}
    </div>
  );
}

export default ImageUploadPreview;
