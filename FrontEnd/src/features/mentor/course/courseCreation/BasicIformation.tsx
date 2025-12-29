import { Input } from "@/components/ui/Inputs";
import { Combobox } from "@/components/ui/SelectWithSearch";
import {
  COURSE_LANGUAGE,
  COURSE_LEVEL,
} from "@/constants/courseInputs.constant";

import { useCourseFormContext } from "@/context/courseForm.context";
import categoryService from "@/service/admin/category.service";
import React, { useEffect, useMemo, useState } from "react";
import { FileUp } from "lucide-react";
import { sharedService } from "@/service/shared.service";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

import { toast } from "sonner";
import { courseFormSchema } from "@/schema/courseForm.schema";
import courseService from "@/service/mentor/course.service";
import { useAuth } from "@/context/auth.context";
import type { ICategory } from "@/types/category.types";
interface BaseCaourseProps {
  handleTap: (tap: "basic" | "curriculum" | "publish") => void;
}

const BasicCourseInformation: React.FC<BaseCaourseProps> = ({ handleTap }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [zodError, setErrors] = useState<{ [key: string]: string }>({});
  const [image, setImage] = useState("");
  const [spin, setSpin] = useState(false);
  const {
    courseId,
    formData,
    setField,
    hydrateFromDB,
    setCourseId,
    setIsDraftReady,
  } = useCourseFormContext();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await categoryService.listCategory();
      if (result) {
        setCategories(result);
      }
    };
    fetchCategories();
  }, []);

  // Thumbnail
  useEffect(() => {
    async function getImageUrl() {
      if (formData.thumbnail && typeof formData.thumbnail == "string") {
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
      _id: category._id,
      label: category.title,
    }));

    const subCategoryOptions =
      categories
        .find((c) => c.title === selectedCategory)
        ?.children?.map((child) => ({
          _id: child._id,
          label: child.title,
        })) || [];

    return { categoryOptions, subCategoryOptions };
  }, [categories, selectedCategory]);

  const handleBaseFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors: Record<string, string> = {};
    try {
      const courseData = courseFormSchema.safeParse(formData);
      if (!courseData.success) {
        courseData.error.issues.forEach((err) => {
          const fieldName = err.path.join(".");
          fieldErrors[fieldName] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
      setSpin(true);
      if (formData._id) {
        const updatedData = await courseService.updateBaseInformation(
          courseId,
          {
            ...courseData.data,
            mentorId: user!.id,
          },
        );
        if (updatedData) {
          setCourseId(updatedData._id as string);
          setSpin(false);
          handleTap("curriculum");
          toast.success("Base Information Updated Successfully");
        }
        return;
      }

      const savedCourseData = await courseService.createCourse({
        ...courseData.data,
        mentorId: user!.id,
      });

      if (savedCourseData._id) {
        setCourseId(savedCourseData._id);
        setIsDraftReady(true);
        hydrateFromDB(savedCourseData);
        setSpin(false);
        handleTap("curriculum");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Basic Information
        </h2>
      </div>
      <form onSubmit={handleBaseFormSubmit}>
        <div className="w-full space-y-4">
          <Input
            placeholder="Course Title"
            label="Course Title"
            name="title"
            value={formData.title}
            onChange={(e) => setField("title", e.target.value)}
            error={zodError.title}
          />

          <Input
            textArea
            name="description"
            onChange={(e) => setField("description", e.target.value)}
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
            value={Number(formData.price)}
            onChange={(e) => setField("price", Number(e.target.value))}
            error={zodError.price}
            min="1"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 ">
            <div className="flex flex-col gap-2">
              <Combobox
                label="Choose a Category"
                value={formData.categoryId}
                boxOptions={categoryOptions}
                setCategory={handleSubCategory}
                onChange={(id) => setField("categoryId", id)}
              />

              <p className="text-red-400 text-sm">{zodError.categoryId}</p>
            </div>
            {subCategoryOptions.length > 0 && (
              <>
                <Combobox
                  label="Choose a SubCategory"
                  value={formData.subCategoryId || ""}
                  boxOptions={subCategoryOptions}
                  onChange={(id) => setField("subCategoryId", id)}
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Combobox
                label="Select Language"
                value={formData.language}
                boxOptions={COURSE_LANGUAGE.map((l) => ({ _id: l, label: l }))}
                onChange={(lang) => setField("language", lang)}
              />

              <p className="text-red-400 text-sm">{zodError.language}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Combobox
                label="Course Level"
                value={formData.level}
                boxOptions={COURSE_LEVEL.map((l) => ({ _id: l, label: l }))}
                onChange={(lvl) => setField("level", lvl)}
              />

              <p className="text-red-400 text-sm">{zodError.level}</p>
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-400 rounded-2xl flex flex-col items-center justify-center    hover:border-gray-500 transition cursor-pointer bg-gray-50">
            <div className="col-span-1 md:col-span-2">
              <div className=" border-gray-400 rounded-2xl flex flex-col items-center justify-center p-3   hover:border-gray-500 transition cursor-pointer bg-gray-50">
                <div className="mb-1 flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                  <FileUp className="text-gray-500 w-8 h-8" />
                </div>

                <p className="text-gray-700 font-medium mb-2">
                  Upload Thumbnail
                </p>

                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setField("thumbnail", e.target.files[0] as File);
                    }
                  }}
                  className="block w-full text-sm text-gray-600 
                          file:mr-4 file:py-2 file:px-4 
                          file:rounded-lg file:border-0 
                          file:text-sm file:font-semibold 
                          file:bg-gray-100 file:text-gray-600 
                          hover:file:bg-gray-200"
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
                  className="w-fit object-cover rounded-sm shadow"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full flex gap-2 sm:w-auto px-8 py-3 text-sm font-medium text-white bg-black hover:bg-gray-700 rounded-md shadow-sm transition-colors"
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
