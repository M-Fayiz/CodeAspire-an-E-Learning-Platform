import React, { useState } from 'react';
import { Input } from "@/components/ui/input"; 
import { useFormContext } from 'react-hook-form';
import FormErrorText from '../shared/FormErrorText';


function ImageUploadPreview() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {register,formState:{errors}}=useFormContext()
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
      <Input type="file"
      {...register('thumbnail',{required:'Please Upload Your Course Thumbnail' })}
       accept="image/*" onChange={handleImageChange} />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="max-w-xs rounded shadow border"
        />
      )}
      <FormErrorText message={errors.thumbnail?.message as string}/>
    </div>
  );
}

export default ImageUploadPreview;
