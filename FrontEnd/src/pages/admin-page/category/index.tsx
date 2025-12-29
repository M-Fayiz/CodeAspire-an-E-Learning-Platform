import ManagementLayout from "@/components/layout/ManagementLayout";
import AddCategoryAccordion from "@/features/admin/category/AddCategory";
import categoryService from "@/service/admin/category.service";
// import type { ICategoryTree } from "@/types/category.types"
import { useEffect, useState } from "react";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import EditCategory from "@/features/admin/category/EditCategory";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ICategoryEdit, ICategory } from "@/types/category.types";
import { toast } from "sonner";
import { ApiError } from "@/utility/apiError.util";

const CategoryManagement = () => {
  const [fetchedData, setFetchedData] = useState<ICategory[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toFetch, setToFetch] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await categoryService.listCategory();

      setFetchedData(result);
    };
    fetchCategories();
  }, [toFetch]);

  const editCategry = async (editData: ICategoryEdit) => {
    try {
      const result = await categoryService.editCategory(editData._id, editData);
      if (result) {
        setToFetch((prv) => !prv);
        setSheetOpen(false);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  };

  const AddCategory = async (title: string, parentId: string | null) => {
    try {
      const result = await categoryService.createCategory(
        title,
        parentId as string,
      );
      if (result) {
        setToFetch((prv) => !prv);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  };

  const renderCategories = (categories: ICategory[]) => {
    return categories.map((cat) => (
      <div
        key={cat._id}
        className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm"
      >
        {/* MAIN CATEGORY */}
        <div
          onClick={() => {
            setSelectedCategory(cat);
            setSheetOpen(true);
          }}
          className="cursor-pointer px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50 flex justify-between items-center"
        >
          <span>{cat.title}</span>
          <span className="text-sm text-gray-400">Edit</span>
        </div>

        {cat.children?.length > 0 && (
          <div className="border-t bg-gray-50">
            {cat.children.map((sub) => (
              <div
                key={sub._id}
                onClick={() => {
                  setSelectedCategory(sub);
                  setSheetOpen(true);
                }}
                className="cursor-pointer px-6 py-2 text-gray-700 hover:bg-gray-100 flex justify-between"
              >
                {sub.title}
                <span className="text-xs text-gray-400">Edit</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <ManagementLayout
      title="Category Management"
      description="Manage category and edit it "
    >
      <div className="flex flex-col md:justify-start gap-4">
        <div className="bg-white rounded-sm outline-1">
          <AddCategoryAccordion
            allCategories={fetchedData}
            addCat={AddCategory}
          />
        </div>
        <div className=" gap-6">
          <div className=" bg-white p-4 rounded">
            {renderCategories(fetchedData)}
          </div>
          {selectedCategory && (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetContent className="w-[400px] sm:w-[500px]">
                <SheetHeader>
                  <SheetTitle className="text-gray-600">
                    Edit Category
                  </SheetTitle>
                  <SheetDescription>
                    You are editing <strong>{selectedCategory.title}</strong>
                  </SheetDescription>
                </SheetHeader>

                <EditCategory
                  editedData={editCategry}
                  category={selectedCategory}
                  allCategory={fetchedData}
                />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </ManagementLayout>
  );
};

export default CategoryManagement;
