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
      {...register('thumbnail',{
        required:'Please Upload Your Course Thumbnail' ,
        
        validate: {
          acceptedFormats: (value) => {
            const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];
                 
            if (value && value.length > 0) {
              const fileType = value[0].type;
              if (!acceptedTypes.includes(fileType)) {
                return "Invalid file format. Only JPEG, PNG, or PDF files are allowed.";
              }
            }
           return true; 
          },
        },
      })}
       accept="image/*"
       onChange={(e) => {
    handleImageChange(e);
  }}/>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="max-w-xs rounded-sm shadow border"
        />
      )}
      <FormErrorText message={errors.thumbnail?.message as string}/>
    </div>
  );
}

export default ImageUploadPreview;
