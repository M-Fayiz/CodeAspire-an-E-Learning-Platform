import { Input } from "@/components/ui/Inputs";
import { Combobox } from "@/components/ui/SelectWithSearch";
import {
  COURSE_LANGUAGE,
  COURSE_LEVEL,
} from "@/constants/courseInputs.constant";

import { useCourseFormContext } from "@/context/courseForm.context";
import categoryService from "@/service/admin/category.service";
import type { ICategoryTree } from "@/types/category.types";
import React, { useEffect, useMemo, useState } from "react";
import { FileUp } from "lucide-react";
import { sharedService } from "@/service/shared.service";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
interface BaseCaourseProps {
  handleTap?: (tap: "basic" | "curriculum" | "publish") => void;
}

const BasicCourseInformation: React.FC<BaseCaourseProps> = () => {
  const [categories, setCategories] = useState<ICategoryTree[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState("");
  const [spin, setSpin] = useState(false);
  const { formData, updateBaseField, OnSubmit, setField, zodError } =
    useCourseFormContext();
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await categoryService.listCategory();
      if (result) {
        setCategories(result);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    async function getImageUrl() {
      if (typeof formData.thumbnail == "string") {
        const resultURl = await sharedService.getPreSignedDownloadURL(
          formData.thumbnail,
        );

        setImage(resultURl);
      } else if (formData.thumbnail instanceof File) {
        setImage(URL.createObjectURL(formData.thumbnail as File));
      }
    }
    getImageUrl();
  }, [formData.thumbnail]);

  const handleSubCategory = (selectedLabel: string | undefined) => {
    if (selectedLabel) {
      setSelectedCategory(selectedLabel);
    }
  };

  const { categoryOptions, subCategoryOptions } = useMemo(() => {
    const categoryOptions = categories.map((category) => ({
      key: category.key,
      label: category.label,
    }));

    const subCategoryOptions =
      categories
        .find((c) => c.label === selectedCategory)
        ?.children?.map((child) => ({
          key: child.key,
          label: child.label,
        })) || [];

    return { categoryOptions, subCategoryOptions };
  }, [categories, selectedCategory]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Basic Information
        </h2>
      </div>
      <form onSubmit={OnSubmit}>
        <div className="w-full space-y-4">
          <Input
            placeholder="Course Title"
            label="Course Title"
            name="title"
            value={formData.title}
            onChange={updateBaseField}
            error={zodError.title}
          />

          <Input
            textArea
            name="description"
            onChange={updateBaseField}
            value={formData.description}
            placeholder="write Course description"
            label={"Course description"}
            error={zodError.description}
          />

          <Input
            type="text"
            placeholder="Enter Course Price"
            label="Course Price"
            name="price"
            value={formData.price}
            onChange={updateBaseField}
            error={zodError.price}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 ">
            <div className="flex flex-col gap-2">
              <Combobox
                label="Choose a Category"
                value={formData.categoryId}
                boxOptions={categoryOptions}
                name="categoryId"
                setCategory={handleSubCategory}
                onChange={setField}
              />
              <p className="text-red-400 text-sm">{zodError.categoryId}</p>
            </div>
            {subCategoryOptions.length > 0 && (
              <>
                <Combobox
                  label="Choose a SubCategory"
                  value={formData.subCategoryId || ""}
                  boxOptions={subCategoryOptions}
                  name="subCategoryId"
                  onChange={setField}
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Combobox
                label="Select a Language"
                value={formData.language}
                boxOptions={[
                  ...COURSE_LANGUAGE.map((data) => ({
                    label: data,
                    key: data,
                  })),
                ]}
                name="language"
                onChange={setField}
              />
              <p className="text-red-400 text-sm">{zodError.language}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Combobox
                label="Select a Course Level"
                value={formData.level}
                boxOptions={[
                  ...COURSE_LEVEL.map((data) => ({
                    label: data,
                    key: data,
                  })),
                ]}
                name="level"
                onChange={setField}
              />
              <p className="text-red-400 text-sm">{zodError.level}</p>
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-400 rounded-2xl flex flex-col items-center justify-center    hover:border-blue-500 transition cursor-pointer bg-gray-50">
            <div className="col-span-1 md:col-span-2">
              <div className=" border-gray-400 rounded-2xl flex flex-col items-center justify-center p-3   hover:border-blue-500 transition cursor-pointer bg-gray-50">
                <div className="mb-1 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                  <FileUp className="text-blue-500 w-8 h-8" />
                </div>

                <p className="text-gray-700 font-medium mb-2">
                  Upload Thumbnail
                </p>

                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={updateBaseField}
                  className="block w-full text-sm text-gray-600 
                          file:mr-4 file:py-2 file:px-4 
                          file:rounded-lg file:border-0 
                          file:text-sm file:font-semibold 
                          file:bg-blue-100 file:text-blue-600 
                          hover:file:bg-blue-200"
                />

                {zodError?.thumbnail && (
                  <p className="text-red-500 text-sm mt-2">
                    {zodError.thumbnail}
                  </p>
                )}
              </div>
            </div>
            {image && (
              <div>
                <img
                  src={image}
                  alt="Preview"
                  className="w-64 h-64 object-cover rounded-sm shadow"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
          >
            {spin && <Spinner />}
            Save as Draft & Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicCourseInformation;
