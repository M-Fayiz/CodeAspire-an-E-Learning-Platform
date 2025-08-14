import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import FormErrorText from "../shared/FormErrorText";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import type { ICourseData } from "@/types/courses.types";

interface Props {
  control: Control<ICourseData>;
  errors: FieldErrors<ICourseData>;
}

function ImageUploadPreview() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="max-w-xs rounded-sm shadow border"
        />
      )}
    </div>
  );
}

export default ImageUploadPreview;
