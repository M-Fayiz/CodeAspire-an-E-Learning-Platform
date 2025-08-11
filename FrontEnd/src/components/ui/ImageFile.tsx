import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import FormErrorText from '../shared/FormErrorText';
import { Controller} from 'react-hook-form';
import type{Control, FieldErrors }from 'react-hook-form'
import type { ICourseData } from "@/types/courses.types"

interface Props {
  control: Control<ICourseData>;
  errors: FieldErrors<ICourseData>;
}

function ImageUploadPreview({ control, errors }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Controller
        name="thumbnail"
        control={control}
        rules={{
          required: 'Please upload your course thumbnail',
          validate: (value: File | FileList | string | undefined) => {
            const file = value instanceof FileList ? value[0] : value instanceof File ? value : null

            if (!file) return 'File is required'

            const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf']
            if (!acceptedTypes.includes(file.type)) {
              return 'Only JPEG, PNG, or PDF files are allowed.'
            }

            return true;
          }
        }}
        render={({ field }) => (
          <>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string)
                  };
                  reader.readAsDataURL(file)
                  field.onChange(e.target.files)
                }
              }}
            />
          </>
        )}
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="max-w-xs rounded-sm shadow border"
        />
      )}
      <FormErrorText message={errors.thumbnail?.message as string} />
    </div>
  );
}

export default ImageUploadPreview;
